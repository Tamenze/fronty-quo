import { useQuery } from '@tanstack/react-query';
import { getQuotes} from "../../../api/quotes"
import type { Quote } from "../../../types"


export const useAllQuotes = () => {
  return useQuery<Quote[]>({
    queryKey: ['quotes', 'all'],
    queryFn: ({ signal }) => getQuotes({ signal })
  })
}
