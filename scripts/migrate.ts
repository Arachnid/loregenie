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
        const data = doc.data() as any;
        const newNpc = {
            name: data.name || data.Name || null,
            race: data.race || data.Race || null,
            gender: data.gender || data.Gender || 'None',
            age: data.age || data.Age || null,
            profession: data.profession || data.Profession || null,
            alignment: data.alignment || data.Alignment || null,
            summary: data.summary || data.Summary || null,
            appearance: data.appearance || data['Physical Appearance'] || data['Physical appearance'] || null,
            headshot: data.headshot || data.Headshot || null,
            personality: data.personality || data.Personality || null,
            ideals: data.ideals?.replace(/^[\W"]+|[\W"]+$/g, '') || null,
            bonds: data.bonds?.replace(/^[\W"]+|[\W"]+$/g, '') || null,
            flaws: data.flaws?.replace(/^[\W"]+|[\W"]+$/g, '') || null,
            diction: data.diction || data['Speaking style'] || data['Speaking Style'] || null,
            background: data.background || data.Background || null,
            image: data.image || data.Image || null,
        }
        await collection.doc(doc.id).set(newNpc);
        console.log(doc.id);
    }
}

main();
