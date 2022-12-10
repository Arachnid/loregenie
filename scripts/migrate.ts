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
            name: data.name || data.Name,
            race: data.race || data.Race,
            gender: data.gender || data.Gender || 'None',
            age: data.age || data.Age,
            profession: data.profession || data.Profession,
            alignment: data.alignment || data.Alignment,
            summary: data.summary || data.Summary,
            appearance: data['Physical Appearance'] || data['Physical appearance'],
            headshot: data.headshot || data.Headshot,
            personality: data.personality || data.Personality,
            ideals: data.ideals,
            bonds: data.bonds,
            flaws: data.flaws,
            diction: data['Speaking style'] || data['Speaking Style'],
            background: data.background || data.Background,
            image: data.image || data.Image,
        }
        await collection.doc(doc.id).set(newNpc);
    }
}

main();
