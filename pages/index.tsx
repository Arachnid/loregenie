import React, { useState } from 'react';
import Head from 'next/head';

const QueryPage: React.FC = () => {
  // State to store the user's query, the response from the OpenAI model, and any errors
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Function to handle the form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Send the user's query to the OpenAI model
    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const result = await res.json();
      // Update the state with the model's response
      setResponse(result);
    } catch (err) {
      // Update the state with the error
      setError(err);
    }
  };

  return (
    <>
      <Head>
        <title>Query OpenAI Model</title>
      </Head>
      <main>
        <h1>Query OpenAI Model</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="query-input">Query:</label>
          <input
            id="query-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
        {response && <p>Response: {response}</p>}
        {error && <p>Error: {error.message}</p>}
      </main>
    </>
  );
};

export default QueryPage;
