// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { getCsrf } from './api/client';
import { useState, useEffect } from 'react';

import { getQuotes, type Quote } from './api/quotes';
import QuoteCard from './components/QuoteCard';
import NavBar from './components/NavBar';


function App() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    getCsrf().catch(console.error);
  }, []);

    useEffect(() => {
    const ac = new AbortController(); // good hygiene for rapid navigations
    setLoading(true);
    setError(null);

    getQuotes()
      .then(data => {
        console.log(data);
        if (!ac.signal.aborted) setQuotes(data);
      })
      .catch(err => {
        if (!ac.signal.aborted) setError(err.message || 'Failed to load quotes');
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false);
      });

    return () => ac.abort();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p role="alert">Error: {error}</p>;


  return (
    <>
    <NavBar logged_in={false} />
      {quotes.map((q) => (
        <QuoteCard
          key={q.id}
          quote={q}
        />
      ))}
    </>
  )
}

export default App
