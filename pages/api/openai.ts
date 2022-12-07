import {Configuration, OpenAIApi} from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../utils/db';
import config from '../../config';

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openaiConfig);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Get the user's query from the request
  const query = config.prompt + req.body.query + "\n";
  // Send the query to the OpenAI model
  const result = await openai.createCompletion(
    {
      prompt: query,
      model: "text-davinci-003",
      max_tokens: 2048,
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
    return [line.slice(0, idx), line.slice(idx + 1)];
  }));
  let image: string|null = null;
  if(npc['Physical description']) {
    const apiRequest = {
      key: process.env.SDAPI_API_KEY,
      model_id: config.imageModel,
      prompt: config.imagePromptPrefix + ' ' + npc['Physical description'],
      negative_prompt: config.negativePrompt,
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
      "https://stablediffusionapi.com/api/v3/dreambooth",
      {
        method: 'POST',
        body: JSON.stringify(apiRequest),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const imageResult = await imageQuery.json();
    image = imageResult.output[0] as string;
  }

  await db.collection('npcs').add({
    prompt: req.body.query,
    created: new Date().toISOString(),
    image,
    ...npc
  });

  // Return the model's response
  res.json({data: npc, image});
};

export default handler;
