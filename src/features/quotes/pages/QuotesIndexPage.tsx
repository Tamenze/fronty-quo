import QuotesList from "../components/QuotesList"
import { QuoteCardSkeleton } from "../components/QuoteCard";
import { useAllQuotes } from '../hooks/useAllQuotes';
import { usePageTitle } from "../../../shared/hooks/usePageTitle";


export const QuotesIndexPageSkeleton = () => (
  <div aria-hidden>
    <QuoteCardSkeleton className="rounded-t-xl"/>
    <QuoteCardSkeleton />
    <QuoteCardSkeleton className="rounded-b-xl"/>
  </div>
)

function QuotesIndexPage(){

  const {data: quotes, isPending, isError, error} = useAllQuotes()
  usePageTitle('All Quotes')
  
    if (isPending) return <QuotesIndexPageSkeleton/>;
    if (isError)   return <p role="alert">Error: {error?.message}</p>;
    if (!quotes)  return <p>No quotes found.</p>;

  return(
    <QuotesList quotes={quotes} />
  )
}

export default QuotesIndexPage
