import { grpc } from '@improbable-eng/grpc-web'
import { EnginesService } from 'stability-sdk/gooseai/engines/engines_pb_service'
import { ListEnginesRequest, Engines, EngineInfo } from 'stability-sdk/gooseai/engines/engines_pb';
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import config from '../config';

async function main() {
    const request = new ListEnginesRequest();
    const engines = await new Promise<EngineInfo[]>((resolve, reject) => {
        const engines: EngineInfo[] = [];
        grpc.invoke(EnginesService.ListEngines, {
            request,
            host: config.imageGenerationHost,
            metadata: new grpc.Metadata({ Authorization: `Bearer ${process.env.STABILITY_API_KEY}`}),
            transport: NodeHttpTransport(),
            onEnd: (code, message, trailers) => {
                if(code === grpc.Code.OK) {
                    resolve(engines);
                } else {
                    reject(message);
                }
            },
            onMessage: (message: Engines) => {
                for(const engine of message.getEngineList()) {
                    engines.push(engine);
                }
            }
        });
    });
    for(const engine of engines) {
        console.log(`${engine.getId()}: ${engine.getName()}`);
    }
}
main();