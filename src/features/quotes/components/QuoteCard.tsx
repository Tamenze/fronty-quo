import type { Quote } from '../../../types';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDeleteQuote } from '../hooks/useDeleteQuote';


type QuoteCardProps = {
  quote: Quote,
  canEdit: boolean,
}

function QuoteCard({ quote, canEdit } : QuoteCardProps) {
    const navigate = useNavigate();
    const { mutate: deleteQuote, isPending: isDeletingQuote } = useDeleteQuote();
    const [mutationError, setMutationError] = useState('');
    


    useEffect(() => console.log(quote), [quote]);

    const handleDelete = () => {
      deleteQuote(quote.id, {
        onSuccess: () => navigate('/quotes'),
        onError: (err) => setMutationError(err.message)
      })
    }

  return(
    <div>
      <p>{quote.body}</p> 
      <p> <Link to={`/quotes/${quote.id}`}> {'>'} </Link> </p> 
      {/* future: the above should only show on index page  */}
      <p>Attribution: {quote.attribution}</p>
      <p> 
        <>Quoter:
          {quote.user ? (
             <Link to={`/users/${quote.user.id}`}> {quote.user.username} </Link>
          ) : (
            <span> User unknown </span>
            // future: else link to page showing all user unknowns 
          )}
        </>
      </p>
      <p>Created at: {quote.created_at}</p>
      {quote.tags?.map((t) => (
        <span key={t.id}>
          <Link to={`/tags/${t.id}`}> {t.name}</Link>
          </span>
      ))}

      {canEdit && (
        <>
          <button onClick={() => navigate(`/quotes/${quote.id}/edit`)}> edit quote </button>
          <button onClick={() => handleDelete()} disabled={isDeletingQuote}> {isDeletingQuote ? "deleting…" : "delete quote"} </button>
        </>
      )}
      {mutationError && <p role="alert">{mutationError}</p>}


      <hr/>
    </div>
  )
}

export default QuoteCard
