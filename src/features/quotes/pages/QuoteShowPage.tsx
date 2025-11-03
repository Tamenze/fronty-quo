import { useParams } from "react-router-dom"
import QuoteCard from "../components/QuoteCard"
import { useSpecificQuote } from "../hooks/useSpecificQuote"
import { useFetchCurrentUser } from "../../users/hooks/useFetchCurrentUser";
import { usePageTitle } from "../../../shared/hooks/usePageTitle";

function QuoteShowPage(){
  const {id} = useParams<{id: string}>();
  usePageTitle('Show Quote')

  const { data: quote, isPending, isError, error} = useSpecificQuote(Number(id))
  const {data: currentUser} = useFetchCurrentUser();

    if (isPending) return <p>Loading…</p>;
    if (isError)   return <p role="alert">Error: {error?.message}</p>;
    if (!quote)  return <p>No quote found.</p>;
  

  return (
    <>
      <h2>Show Page </h2>
      <QuoteCard quote={quote} canEdit={quote.user_id === currentUser?.id}/>
    </>
  )
}

export default QuoteShowPage
