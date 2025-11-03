import { useQuery } from '@tanstack/react-query';
import { getRandomQuote } from "../../../api/quotes"
import type { Quote } from "../../../types"

export const useRandomQuote = () => {
  return useQuery<Quote>({
    queryKey: ['quotes', 'random'],
    queryFn: ({ signal }) => getRandomQuote({ signal }),
  })
}
