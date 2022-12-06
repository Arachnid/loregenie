import openai from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';

// Set the OpenAI API key
openai.api_key = "YOUR_API_KEY";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Get the user's query from the request
  const { query } = req.body;
  // Send the query to the OpenAI model
  const result = await openai.completions.create(
    {
      prompt: query,
      model: "YOUR_MODEL_NAME",
      max_tokens: 2048,
      temperature: 0.5,
    }
  );
  // Return the model's response
  res.json(result.data.choices[0].text);
};
