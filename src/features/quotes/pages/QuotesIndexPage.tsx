import QuotesList from "../components/QuotesList"
import { useAllQuotes } from '../hooks/useAllQuotes';
import { usePageTitle } from "../../../shared/hooks/usePageTitle";


function QuotesIndexPage(){

  const {data: quotes, isPending, isError, error} = useAllQuotes()
  usePageTitle('Quotes')
  
    if (isPending) return <p>Loading…</p>;
    if (isError)   return <p role="alert">Error: {error?.message}</p>;
    if (!quotes)  return <p>No quotes found.</p>;
  
  

  return(
    <QuotesList quotes={quotes} />
  )
}

export default QuotesIndexPage
