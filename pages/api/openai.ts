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
  const rows = text.trim().split('\n').map((line) => {
    const idx = line.indexOf(':');
    return [line.slice(0, idx), line.slice(idx + 1)];
  });
  // Return the model's response
  res.json({data: rows});
};

export default handler;
