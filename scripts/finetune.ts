import {Configuration, OpenAIApi} from 'openai';
import { NPC } from "../utils/NPC";
import db from '../utils/db';
import { writeFile } from 'fs/promises';
import { fstat } from 'fs';

const VALIDATION_PERCENT = 0.01;

const openaiConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openaiConfig);
  
function normalise(s: string) {
    return s.toLowerCase().trim();
}

const npcFields = [
    'name',
    'race',
    'gender',
    'age',
    'profession',
    'alignment',
    'summary',
    'appearance',
    'headshot',
    'personality',
    'ideals',
    'bonds',
    'flaws',
    'diction',
    'background'
];

const deleteCategories = [
    'hate/threatening',
    'sexual/minors',
    'violence/graphic',
]

function toJSONL(lines: object[]) {
    return lines.map((line) => JSON.stringify(line)).join('\n');
}

async function main() {
    const collection = db.collection('npcs');
    const snapshot = await collection.where('created', '!=', null).get();
    const promptsSeen = new Set<string>();
    const completions: {prompt: string, completion: string}[] = [];
    for(const doc of snapshot.docs) {
        const npc = doc.data() as NPC;
        const normalisedPrompt = normalise(npc.prompt);
        if(promptsSeen.has(normalisedPrompt)) {
            continue;
        }
        promptsSeen.add(normalisedPrompt);
        const completion = {
            prompt: npc.prompt.trim() + '\n',
            completion: npcFields.map((field) => `${field}: ${(npc as any)[field]}`).join('\n') + '\n\n',
        };
        const moderation = await openai.createModeration({
            input: completion.completion
        });
        const fails = deleteCategories.filter((category) => (moderation.data.results[0].categories as any)[category]);
        if(fails.length > 0) {
            console.log(`!!! Deleting https://loregenie.com/npc/${doc.id} "${npc.prompt}" for violation of ${fails}`);
            await collection.doc(doc.id).delete();
            continue;
        }
        completions.push(completion);
        console.log(`Adding https://loregenie.com/npc/${doc.id} "${npc.prompt}"`);
    }

    const trainingCompletions = completions.slice(0, completions.length * (1 - VALIDATION_PERCENT));
    const validationCompletions = completions.slice(trainingCompletions.length);

    const trainingBlob = Buffer.from(toJSONL(trainingCompletions), 'utf-8');
    await writeFile('training.jsonl', trainingBlob);
    
    const validationBlob = Buffer.from(toJSONL(validationCompletions), 'utf-8');    
    await writeFile('validation.jsonl', validationBlob);

    console.log('Wrote training data to training.jsonl and validation data to validation.jsonl');
}

main();
