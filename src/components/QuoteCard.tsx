import type { Quote } from '../api/quotes';

type QuoteCardProps = {
  quote: Quote
}

function QuoteCard({quote}: QuoteCardProps) {
  return(
    <div>
      <p>{quote.body}</p>
      <p>{quote.attribution}</p>
      <p>{quote.user_id || "User unknown"}</p>
      <p>{quote.created_at}</p>
      <p>{quote.updated_at} </p>
      {quote.tags.map((t) => (
        <span key={t.id}>{t.name}</span>
      ))}
      <hr/>
    </div>
  )
}

export default QuoteCard
