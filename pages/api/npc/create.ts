import {Configuration, OpenAIApi} from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../utils/db';
import config from '../../../config';

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
      return [line.slice(0, idx), line.slice(idx + 1).trim()];
    }));

    const doc = await db.collection('npcs').add({
      prompt: req.body.query,
      model: config.model,
      ...npc
    });

    // Return the model's response
    res.json({id: doc.id, data: {Image: `/api/npc/${doc.id}/image.png`, ...npc}});
    res.end();

    if(npc['Headshot']) {
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
      const image = imageResult.output[0] as string;

      await doc.update({image});
    }
  } catch(e: any) {
    if(!res.closed) {
      if(e instanceof Error) {
        res.status(500).json({error: e.message});
      } else {
        res.status(500).json({error: e.toString()});
      }
    }
  }
};

export default handler;
