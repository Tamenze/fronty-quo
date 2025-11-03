import { useRandomQuote } from '../hooks/useRandomQuote';
import { usePageTitle } from '../../../shared/hooks/usePageTitle';

import QuoteCard from '../components/QuoteCard';

function RandomQuotePage(){
  const {data: quote, isPending, isError, error } = useRandomQuote();
  usePageTitle();

  if (isPending) return <p>Loading…</p>;
  if (isError)   return <p role="alert">Error: {error.message} </p>;
  if (!quote)  return <p>No quote found.</p>;


  return(
    <QuoteCard quote={quote} canEdit={false}/>
  )
}

export default RandomQuotePage
