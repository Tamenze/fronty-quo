import QuoteCard from "../components/QuoteCard"
import type { Quote } from '../../../types';
import { useFetchCurrentUser } from "../../users/hooks/useFetchCurrentUser";


type QuoteListProps = {
  quotes: Quote[]
}


function QuotesList({quotes}: QuoteListProps){
  const {data: currentUser} = useFetchCurrentUser();

  return (
     <div>
      {quotes.map((q, index) => 
        <QuoteCard 
          key={`quote-${index}`} 
          className="rounded-none first-of-type:rounded-t-xl last-of-type:rounded-b-xl" 
          isWithinList 
          quote={q} 
          canEdit={currentUser?.id === q.user_id}
        />
      )}
    </div>
  )
}

export default QuotesList
