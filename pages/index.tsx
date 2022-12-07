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

const samples = [
  "an enchanted talking tree",
  "a mischievous imp disguised as a child",
  "a ghostly pirate captain seeking redemption",
  "a shape-shifting werewolf noble",
  "a cursed mermaid seeking revenge",
  "a haunted puppet master with deadly puppets",
  "a vengeful banshee trapped in mirror",
  "a powerful genie bound to a cursed lamp",
  "an ancient dragon disguised as a human",
  "a time-traveling wizard seeking lost artifacts",
  "a wealthy merchant with hidden motives",
  "a skilled blacksmith with a troubled past",
  "a street-smart orphan turned pickpocket",
  "an arrogant noble with a secret addiction",
  "a street performer with a hidden talent",
  "a sly tavern owner with a hidden stash",
  "a mysterious beggar with magical abilities",
  "a charismatic con artist with a heart of gold",
  "a gruff town guard with a soft spot for animals",
  "a kind-hearted healer with a tragic past",
  "a wandering bard with a tragic past",
  "a tired traveling merchant with exotic wares",
  "a weary adventurer seeking treasure",
  "a wild-eyed prophet with cryptic messages",
  "a gruff mercenary seeking new recruits",
  "a suspicious wanderer with a hidden stash",
  "a robust farmer with a bounty of fresh produce",
  "a disgraced knight seeking redemption",
  "an eccentric hermit with ancient knowledge",
  "a fearsome bounty hunter with a wanted poster",
  "a bewitched forest spirit seeking freedom",
  "a cursed princess seeking a true love's kiss",
  "an enchanted talking animal seeking its true form",
  "a long-lost relative seeking help reclaiming their inheritance",
  "a powerful wizard seeking a powerful artifact",
  "a ghostly captain seeking a lost treasure",
  "an ancient dragon seeking a worthy successor",
  "a haunted mansion seeking a hero to banish its ghosts",
  "a cursed village seeking a hero to lift its curse",
  "a beautiful mermaid seeking a human to break her curse",
  "a wise old hermit who is actually a powerful wizard",
  "a bumbling town guard who is secretly a master swordsman",
  "a wealthy merchant who is actually a notorious thief",
  "a street performer who is actually a powerful sorcerer",
  "a gruff old farmer who is actually a wise seer",
  "an arrogant noble who is actually a kind-hearted orphan",
  "a disgraced knight who is actually a skilled healer",
  "a fearsome mercenary who is secretly a soft-hearted poet",
  "a skilled blacksmith who is secretly a master alchemist",
  "an eccentric hermit who is actually a former king in hiding",
];

function randomSample() {
  return samples[Math.floor(Math.random() * samples.length)];
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
            For example, try creating {sample}.</p>
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
