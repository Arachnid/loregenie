import {Configuration, OpenAIApi} from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../utils/db';
import config from '../../../config';
import { createHeadshot } from '../../../utils/images';
import { NPC } from "../../../utils/NPC";

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openaiConfig);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Get the user's query from the request
    const query = config.prompt + req.body.query + "\n";
    // Send the query to the OpenAI model
    const result = await openai.createCompletion(
      {
        prompt: query,
        model: config.model,
        max_tokens: 512,
        temperature: 0.7,
      }
    );
    const text = result.data.choices[0].text;
    if(!text) {
      res.json({error: 'No data returned'});
      return;
    }
    const npc = Object.fromEntries(text.trim().split('\n').map((line) => {
      const idx = line.indexOf(':');
      return [line.slice(0, idx).toLowerCase(), line.slice(idx + 1).trim()];
    }).filter(([k, v]) => k.length > 0 && v.length > 0)) as unknown as NPC;

    npc.created = new Date().toISOString();

    const doc = await db.collection('npcs').add({
      prompt: req.body.query,
      model: config.model,
      ...npc
    });

    npc.image = `/api/npc/${doc.id}/image.png`;

    // Return the model's response
    res.json({id: doc.id, data: npc});
    res.end();

    if(npc.headshot) {
      const image = await createHeadshot(doc.id, npc);
      if(image) {
        await doc.update({Image: image});
      }
    }
  } catch(e: any) {
    console.log(e.toString());
    if(!res.headersSent) {
      if(e instanceof Error) {
        res.status(500).json({error: e.message});
      } else {
        res.status(500).json({error: e.toString()});
      }
    }
  }
};

export default handler;
