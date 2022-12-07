import React, { useState } from 'react';
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

const QueryPage: React.FC = () => {
  // State to store the user's query, the response from the OpenAI model, and any errors
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      console.log(result);
      setResponse(result);
    } catch (err) {
      // Update the state with the error
      setError((err as object).toString());
    }

    // Set the isSubmitting state to false to hide the loading indicator
    setIsSubmitting(false);
  };

  const samples: Array<string> = [
    'fierce fighter',
    'wise wizard',
    'strong barbarian',
    'clever rogue',
    'mischievous bard',
    'vengeful warlock',
    'charming diplomat',
    'brave paladin',
    'greedy merchant',
    'wise scholar',
    'strong soldier',
    'charismatic leader',
    'powerful sorcerer',
    'mischievous prankster',
    'strong bodyguard',
    'wise monk',
    'powerful mage'
  ]

  const loading: Array<string> = [
    'Attaching arms, rolling for strength...',
    'Adding legs, rolling for speed...',
    'Installing heart, hold on a sec...',
    'Attaching ears, rolling for perception...',
    'Installing brain, please wait...',
    'Adding mouth, rolling for charm...',
    'Attaching eyes, rolling for insight...'
  ]

  return (
    <>
      <Head>
        <title>Lore Genie</title>
      </Head>
      <main className={styles.main}>

      <div className={styles.form}>
          <h1>Lore Genie</h1>
          <p>Enter a short character concept below to generate a unique NPC.<br />For example, try creating a {samples[Math.floor(Math.random() * samples.length)]}.</p>
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
              <button type="submit" disabled={isSubmitting}>Roll</button>
            :
              <div className={styles.loading}>
               <h2>{loading[Math.floor(Math.random() * loading.length)]}</h2>
              </div>
            }

          </form>
        </div>
        
        <div className={styles.response}>
          {isSubmitting || response?.image && response?.data && <Image src={response.image} className={styles.avatar} alt={response.data['Physical description']}/>}
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
