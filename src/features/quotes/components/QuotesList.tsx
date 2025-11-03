import QuoteCard from "../components/QuoteCard"
import type { Quote } from '../../../types';
import { useFetchCurrentUser } from "../../users/hooks/useFetchCurrentUser";


type QuoteListProps = {
  quotes: Quote[]
}


function QuotesList({quotes}: QuoteListProps){
  const {data: currentUser} = useFetchCurrentUser();

  return (
     <ul>
      {/* variant: "compact" */}
      {quotes.map((q, index) => <QuoteCard key={`quote-${index}`} quote={q} canEdit={currentUser?.id === q.user_id}/>)}
    </ul>
  )
}

export default QuotesList

//quote index
//latest quotes on site, paginated, 10 limit 
//includes tags, user name


//click on quote takes you to quote show page
//click on tag takes you to tag show page 
//click on username takes you to user show page 




///comp used in different pages:

//tag show (all quotes that have X tag)
//user show (all quotes by X user)
