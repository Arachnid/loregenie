import { NPC } from '../../components/NPCComponent';
import config from '../../config';
import { Storage } from '@google-cloud/storage';
import nodeFetch from "node-fetch";

const storage = new Storage({credentials: JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '')})
const bucket = storage.bucket(config.gcsBucket);

export async function createHeadshot(id: string, npc: NPC): Promise<string|undefined> {
    const apiRequest = {
        key: process.env.SDAPI_API_KEY,
        prompt: `${config.imagePromptPrefix}, ${npc['Headshot']}, ${config.imagePromptSuffix}`,
        negative_prompt: config.negativeImagePrompt,
        width: "512",
        height: "512",
        samples: "1",
        num_inference_steps: "30",
        seed: null,
        guidance_scale: 7.5,
        webhook: null,
        track_id: null,
    };

    const imageQuery = await fetch(
        "https://stablediffusionapi.com/api/v3/text2img",
        {
            method: 'POST',
            body: JSON.stringify(apiRequest),
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
    const imageResult = await imageQuery.json();
    if(!imageResult?.output?.[0]) {
        return undefined;
    }
    const file = bucket.file(`${id}.png`);
    
    const imageUrl = imageResult.output[0];
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
