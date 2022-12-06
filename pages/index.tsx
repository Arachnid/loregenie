import React, { useState } from 'react';
import Head from 'next/head';

interface QueryResponse {
  error?: string;
  data?: Array<[string, string]>;
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
      setResponse(result);
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
        <title>NPC Forge</title>
      </Head>
      <main>
        <h1>NPC Forge</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="query-input">Concept:</label>
          <input
            id="query-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
        {response?.data && <table>
          {response.data.map(([k, v]) => <tr key={k}><th>{k}</th><td>{v}</td></tr>)}
        </table>}
        {response?.image && <img src={response.image}/>}
        {error && <p>Error: {error}</p>}
      </main>
    </>
  );
};

export default QueryPage;
