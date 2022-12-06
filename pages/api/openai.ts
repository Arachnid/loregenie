import {Configuration, OpenAIApi} from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';
import config from '../../config';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
  const rows: Array<[string, string]> = text.trim().split('\n').map((line) => {
    const idx = line.indexOf(':');
    return [line.slice(0, idx), line.slice(idx + 1)];
  });
  const description = rows.find(([k, v]) => k == 'Physical description')?.[1];
  let image: string|null = null;
  if(description) {
    const apiRequest = {
      key: process.env.SDAPI_API_KEY,
      model_id: config.imageModel,
      prompt: config.imagePromptPrefix + ' ' + description,
      negative_prompt: config.negativePrompt,
      width: "256",
      height: "256",
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
    image = imageResult.output[0] as string;
  }
  // Return the model's response
  res.json({data: rows, image});
};

export default handler;
