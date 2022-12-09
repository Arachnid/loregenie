import { NPC } from "../utils/NPC";
import { Storage } from '@google-cloud/storage';
import db from '../utils/db';
import config from '../config';
import { createHeadshot, uploadToGCS } from '../utils/images';

const storage = new Storage({credentials: JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '')})
const bucket = storage.bucket(config.gcsBucket);

async function main() {
    const collection = db.collection('npcs');
    const snapshot = await collection.get();
    for(const doc of snapshot.docs) {
        const data = doc.data() as NPC;
        let image = data.Image || (data as any).image;
        if(!image) {
            console.log(`Generating headshot for ${doc.id}...`);
            try {
                image = await createHeadshot(doc.id, data);
            } catch(e: any) {
                console.log(`Error creating headshot for ${doc.id}: ${e.toString()}`);
                continue;
            }
        } else if(!image.startsWith('https://static.loregenie.com/')) {
            console.log(`Uploading ${doc.id} to GCS...`);
            image = await uploadToGCS(doc.id, image);
        } else if(data.Image) {
            continue;
        }
        await collection.doc(doc.id).update({Image: image});
    }
}

main();
