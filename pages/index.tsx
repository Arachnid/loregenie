import React, { useEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

interface QueryResponse {
  error?: string;
  data?: {
    Name: string;
    Gender: string;
    Race: string;
    Alignment: string;
    Age: string;
    Profession: string;
    Personality: string;
    Background: string;
    "Physical description": string;
    "Speaking style": string;
  }
  image: string|null;
}

const adjectives: Array<string> = [
  'fierce',
  'wise',
  'strong',
  'clever',
  'mischievous',
  'vengeful',
  'charming',
  'brave',
  'greedy',
  'wise',
  'strong',
  'charismatic',
  'powerful',
  'mischievous',
  'strong',
  'wise',
  'powerful',
  'lazy',
  'greedy',
  'grumpy',
];

const professions: Array<string> = [
    'fighter',
    'wizard',
    'barbarian',
    'rogue',
    'bard',
    'warlock',
    'diplomat',
    'paladin',
    'merchant',
    'scholar',
    'soldier',
    'leader',
    'sorcerer',
    'prankster',
    'bodyguard',
    'monk',
    'mage',
    'scamp',
    'layabout',
    'innkeeper',
    'villager',
    'smith',
];

function randomSample() {
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${professions[Math.floor(Math.random() * professions.length)]}`;
}

const loading = [
  "Simulating life story...",
  "Generating backstory...",
  "Crafting personality traits...",
  "Determining motivations...",
  "Calculating daily routine...",
  "Programming interactions...",
  "Simulating emotions...",
  "Generating goals and aspirations...",
  "Crafting appearance...",
  "Loading catchphrases...",
  "Simulating first love...",
  "Generating an epic battle...",
  "Crafting the perfect heist...",
  "Determining the outcome of a high-stakes game of chance...",
  "Calculating reaction to the discovery of a long-lost relative...",
  "Programming response to a major betrayal...",
  "Simulating a life-changing decision...",
  "Generating a triumphant moment...",
  "Crafting a heartwarming reunion...",
  "Loading a devastating loss...",
];

const QueryPage: React.FC = () => {
  // State to store the user's query, the response from the OpenAI model, and any errors
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sample, setSample] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");

  useEffect(() => setSample(randomSample()), []);
  useInterval(() => setLoadingMessage(loading[Math.floor(Math.random() * loading.length)]), 5000);

  // State to keep track of whether the form is being submitted
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to handle the form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Set the isSubmitting state to true to show the loading indicator
    setIsSubmitting(true);

    // Send the user's query to the OpenAI model
    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const result = await res.json() as QueryResponse;
      if(result.error) {
        setError(result.error);
      }
      // Update the state with the model's response
      setResponse(result);
      setSample(randomSample());
    } catch (err) {
      // Update the state with the error
      setError((err as object).toString());
    }

    // Set the isSubmitting state to false to hide the loading indicator
    setIsSubmitting(false);
  };

  return (
    <>
      <Head>
        <title>Lore Genie</title>
      </Head>
      <main className={styles.main}>

      <div className={styles.form}>
          <h1>Lore Genie</h1>
          <p>
            Enter a short character concept below to generate a unique NPC.
            <br />
            For example, try creating a {sample}.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="query-input" hidden>Enter your idea</label>
            <input
              id="query-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isSubmitting}
            />

            {!isSubmitting ?
              <button type="submit" disabled={query.length == 0}>Roll</button>
            :
              <div className={styles.loading}>
               <h2>{loadingMessage}</h2>
              </div>
            }

          </form>
        </div>
        
        <div className={styles.response}>
          {isSubmitting || response?.image && response?.data && <Image src={response.image} className={styles.avatar} alt={response.data['Physical description']} width="256" height="256" />}
          {isSubmitting || response?.data && <div className={styles.container}>
            <h1 className={styles.name}>{response.data['Name']}</h1>
            <p>{response.data['Gender']} {response.data['Race']}, {response.data['Alignment']}</p>
            <p>{response.data['Age']} year old {response.data['Profession']}</p>
            <p>{response.data['Personality']}</p>
            <hr className={styles.divider} />
            <p>{response.data['Background']}</p>
            <p>{response.data['Physical description']}</p>
            <p>{response.data['Speaking style']}</p>
          </div>}
        </div>
  
        {error && <p>Error: {error}</p>}
      </main>
    </>
  );
};

export default QueryPage;
