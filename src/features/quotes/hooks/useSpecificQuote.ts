import { useQuery } from '@tanstack/react-query';
import { getSpecificQuote } from "../../../api/quotes"
import type { Quote } from "../../../types"


export const useSpecificQuote = (id: number) => {
  return useQuery<Quote>({
    queryKey: ['quote', id],
    enabled: id !== undefined && id !== null,
    queryFn: ({ signal }) => getSpecificQuote( {id: Number(id) }, { signal })
  })
}
