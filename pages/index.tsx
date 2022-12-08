import React, { useEffect, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import config from '../config';
import NPCComponent, { NPC } from '../components/NPCComponent';
import FooterComponent from '../components/FooterComponent';

interface QueryResponse {
  error?: string;
  id: string;
  data?: NPC;
  image: string|null;
}

function randomSample() {
  return config.samples[Math.floor(Math.random() * config.samples.length)];
}

const QueryPage: React.FC = () => {
  // State to store the user's query, the response from the OpenAI model, and any errors
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sample, setSample] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");

  useEffect(() => setSample(randomSample()), []);
  useInterval(() => setLoadingMessage(config.loadingMessages[Math.floor(Math.random() * config.loadingMessages.length)]), 5000);

  // State to keep track of whether the form is being submitted
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to handle the form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Set the isSubmitting state to true to show the loading indicator
    setIsSubmitting(true);

    // Send the user's query to the OpenAI model
    try {
      const res = await fetch("/api/npc/create", {
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
      console.log(result.data);
      setError(null);
    } catch (err) {
      // Update the state with the error
      setError((err as object).toString());
    }

    setSample(randomSample());
    // Set the isSubmitting state to false to hide the loading indicator
    setIsSubmitting(false);
  };

  return (
    <>
      <Head>
        <title>Lore Genie</title>
      </Head>

      <main className={styles.main}>
        
        <div className={styles.start}>
          <p>
            Enter a short character concept below to generate a unique NPC.
            <br />
            For example, try creating {sample}.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label htmlFor="query-input" hidden>Enter your idea</label>
            <input
              id="query-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isSubmitting}
            />

            {isSubmitting ?
              <div className={styles.loading}>
                <p>{loadingMessage}</p>
              </div>
            :
              <button type="submit" disabled={query.length == 0}>Roll</button>
            }
          </form>
        </div>
        
        {isSubmitting || response?.data && <NPCComponent npc={response.data} id={response.id} />}
  
        {error && <p>Error: {error}</p>}
      </main>
    </>
  );
};

export default QueryPage;
