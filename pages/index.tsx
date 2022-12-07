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
  "Enchanted talking tree",
  "Mischievous imp disguised as a child",
  "Ghostly pirate captain seeking redemption",
  "Shape-shifting werewolf noble",
  "Cursed mermaid seeking revenge",
  "Haunted puppet master with deadly puppets",
  "Vengeful banshee trapped in mirror",
  "Powerful genie bound to a cursed lamp",
  "Ancient dragon disguised as a human",
  "Time-traveling wizard seeking lost artifacts",
  "Wealthy merchant with hidden motives",
  "Skilled blacksmith with a troubled past",
  "Street-smart orphan turned pickpocket",
  "Arrogant noble with a secret addiction",
  "Street performer with a hidden talent",
  "Sly tavern owner with a hidden stash",
  "Mysterious beggar with magical abilities",
  "Charismatic con artist with a heart of gold",
  "Gruff town guard with a soft spot for animals",
  "Kind-hearted healer with a tragic past",
  "Wandering bard with a tragic past",
  "Tired traveling merchant with exotic wares",
  "Weary adventurer seeking treasure",
  "Wild-eyed prophet with cryptic messages",
  "Gruff mercenary seeking new recruits",
  "Suspicious wanderer with a hidden stash",
  "Robust farmer with a bounty of fresh produce",
  "Disgraced knight seeking redemption",
  "Eccentric hermit with ancient knowledge",
  "Fearsome bounty hunter with a wanted poster",
  "Bewitched forest spirit seeking freedom",
  "Cursed princess seeking a true love's kiss",
  "Enchanted talking animal seeking its true form",
  "Long-lost relative seeking help reclaiming their inheritance",
  "Powerful wizard seeking a powerful artifact",
  "Ghostly captain seeking a lost treasure",
  "Ancient dragon seeking a worthy successor",
  "Haunted mansion seeking a hero to banish its ghosts",
  "Cursed village seeking a hero to lift its curse",
  "Beautiful mermaid seeking a human to break her curse",
  "Wise old hermit who is actually a powerful wizard",
  "Bumbling town guard who is secretly a master swordsman",
  "Wealthy merchant who is actually a notorious thief",
  "Street performer who is actually a powerful sorcerer",
  "Gruff old farmer who is actually a wise seer",
  "Arrogant noble who is actually a kind-hearted orphan",
  "Disgraced knight who is actually a skilled healer",
  "Fearsome mercenary who is secretly a soft-hearted poet",
  "Skilled blacksmith who is secretly a master alchemist",
  "Eccentric hermit who is actually a former king in hiding",
];

function randomSample() {
  return samples[Math.floor(Math.random() * adjectives.length)];
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
