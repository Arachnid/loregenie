import { grpc } from '@improbable-eng/grpc-web'
import { GenerationService } from 'stability-sdk/gooseai/generation/generation_pb_service'
import {
  Request,
  Prompt,
  PromptParameters,
  ImageParameters,
  SamplerParameters,
  DiffusionSampler,
  TransformType,
  StepParameter,
  Answer,
  ArtifactType,
  FinishReason
} from 'stability-sdk/gooseai/generation/generation_pb'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter';
import { Storage } from '@google-cloud/storage';
import nodeFetch from 'node-fetch';
import uuid4 from 'uuid4';
import { NPC } from "../NPC";
import config from '../../config';
import { ImageError } from 'next/dist/server/image-optimizer';

const storage = new Storage({credentials: JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '')})
const bucket = storage.bucket(config.gcsBucket);

interface ImageData {
    buffer: Buffer;
    filePath: string
}
interface ResponseData {
  isOk: boolean
  status: keyof grpc.Code
  code: grpc.Code
  message: string
  trailers: grpc.Metadata
}

async function generateImage(imageGenerationHost: string, apiKey: string, request: Request): Promise<Buffer> {
    let image: {data: Buffer, finishReason: number} | undefined;
    for(let i = 0; i < config.imageRetries; i++) {
        const images = await new Promise<{data:Buffer, finishReason: number}[]>((resolve, reject) => {
            const images: {data: Buffer, finishReason: number}[] = [];
            grpc.invoke(GenerationService.Generate, {
                request,
                host: imageGenerationHost,
                metadata: new grpc.Metadata({ Authorization: `Bearer ${apiKey}`}),
                transport: NodeHttpTransport(),
                onEnd: (code, message, trailers) => {
                    if(code === grpc.Code.OK) {
                        resolve(images);
                    } else {
                        reject(message);
                    }
                },
                onMessage: (message: Answer) => {
                    const answer = message.toObject();
                    if(!answer.artifactsList) {
                        return;
                    }
                    answer.artifactsList.forEach(({ type, binary, finishReason }) => {
                        if(type === ArtifactType.ARTIFACT_IMAGE) {
                            images.push({data: Buffer.from(binary as string, 'base64'), finishReason});
                        }
                    });
                }
            });
        });
        image = images[0];
        if(image.finishReason != FinishReason.FILTER) {
            break;
        }
        console.log(`Image was filtered on attempt ${i+2}`);
    }
    return image?.data as Buffer;
}

export async function createHeadshot(id: string, npc: NPC): Promise<string> {
    const api = new EventEmitter() as TypedEmitter<{image: (data: ImageData) => void, end: (data: ResponseData) => void}>;

    const request = new Request();
    request.setEngineId(config.imageModel);
    request.setRequestId(uuid4());
    
    const prompt = new Prompt();
    prompt.setText(`${config.imagePromptPrefix}, ${npc.headshot}, ${config.imagePromptSuffix}`);
    const params = new PromptParameters();
    params.setWeight(1.0);
    prompt.setParameters(params);
    request.addPrompt(prompt);

    const negativePrompt = new Prompt();
    negativePrompt.setText(config.negativeImagePrompt);
    const negativeParams = new PromptParameters();
    negativeParams.setWeight(-0.5);
    negativePrompt.setParameters(negativeParams);
    request.addPrompt(negativePrompt);

    const image = new ImageParameters();
    image.setWidth(config.imageSize);
    image.setHeight(config.imageSize);
    image.setSeedList([Math.floor(Math.random() * 4294967295)]);
    image.setSteps(config.imageSteps);
    image.setSamples(1);

    const transform = new TransformType();
    transform.setDiffusion(DiffusionSampler.SAMPLER_K_DPMPP_2M);
    image.setTransform(transform);

    const step = new StepParameter();
    step.setScaledStep(0);

    const sampler = new SamplerParameters();
    sampler.setCfgScale(config.imageCfgScale);
    step.setSampler(sampler);
    image.addParameters(step);

    request.setImage(image);

    const imageData = await generateImage(config.imageGenerationHost, process.env.STABILITY_API_KEY as string, request);
    await bucket.file(`${id}.png`).save(imageData);
    return `https://${config.gcsBucket}/${id}.png`;
}

export async function uploadToGCS(id: string, imageUrl: string) {
    const file = bucket.file(`${id}.png`);
    const response = await nodeFetch(imageUrl);
    if(!response.body) {
        throw new Error(`Error fetching image: ${response.statusText}`);
    }
    const stream = response.body.pipe(file.createWriteStream())
    return new Promise<string>((resolve, reject) => {
        stream.on('error', reject);
        stream.on('finish', () => resolve(`https://${config.gcsBucket}/${id}.png`));
    })
}