import { useParams } from "react-router-dom"
import TagCard from "../components/TagCard"
import { useGetTag } from "../hooks/useGetTag"
import { usePageTitle } from "../../../shared/hooks/usePageTitle";
import QuoteCard from "../../quotes/components/QuoteCard";

function TagShowPage(){
   const { id } = useParams<{id: string}>();
   usePageTitle('Show Tag')

   const { data: tag, isPending, isError, error } = useGetTag(Number(id));

    if (isPending) return <p> Loading…</p>;
    if (isError)   return <p role="alert">Error: {error?.message}</p>;
    if (!tag)  return <p>No tag found.</p>;
  

   return (
    <> 
     <h2> Tag Show Page </h2>
      <TagCard tag={tag} />
      {tag.quotes.length > 0 ? (
         <>
            <hr/>
            <h2> Quotes with this Tag:</h2>
            {tag.quotes.map((q) => <QuoteCard quote={q} canEdit={false}/>)}
         </>
      ) : (
         <h2> No associated quotes (yet)</h2>
      )}
      {/* quotes with this tag  */}
    </>
   )
}

export default TagShowPage
