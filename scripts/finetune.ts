import {Configuration, OpenAIApi} from 'openai';
import { NPC } from "../utils/NPC";
import db from '../utils/db';
import { writeFile } from 'fs/promises';
import config from '../config';

const VALIDATION_PERCENT = 0.01;

const openaiConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openaiConfig);
  
function normalisePrompt(s: string) {
    return s.toLowerCase().trim();
}

function normaliseSentence(s: string) {
    return s.endsWith('.') ? s.trim() + '.' : s.trim();
}

function toJSONL(lines: object[]) {
    return lines.map((line) => JSON.stringify(line)).join('\n');
}

const npcFields = [
    'name',
    'race',
    'gender',
    'age',
    'profession',
    'alignment',
];
const npcSentenceFields = [
    'summary',
    'appearance',
    'headshot',
    'personality',
    'ideals',
    'bonds',
    'flaws',
    'diction',
    'background',
];
const allFields = Array.prototype.concat(npcFields, npcSentenceFields);

async function main() {
    const collection = db.collection('npcs');
    const snapshot = await collection.where('created', '!=', null).get();
    const promptsSeen = new Set<string>();
    const completions: {prompt: string, completion: string}[] = [];
    for(const doc of snapshot.docs) {
        const npc = doc.data() as NPC;
        const title = `https://loregenie.com/npc/${doc.id} "${npc.prompt}"`;
        const normalisedPrompt = normalisePrompt(npc.prompt);
        if(promptsSeen.has(normalisedPrompt)) {
            continue;
        }
        promptsSeen.add(normalisedPrompt);
        const missingFields = allFields.filter((field) => (npc as any)[field] == undefined);
        if(missingFields.length > 0) {
            console.log(`Skipping ${title}: missing ${missingFields}`);
            continue;
        }
        const completion = {
            prompt: npc.prompt.trim() + '\n',
            completion: Array.prototype.concat(
                npcFields.map((field) => `${field}: ${(npc as any)[field]}`),
                npcSentenceFields.map((field) => `${field}: ${normaliseSentence((npc as any)[field])}`),
            ).join('\n') + '\n\n',
        };
        completions.push(completion);
        console.log(`Adding ${title}`);
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
