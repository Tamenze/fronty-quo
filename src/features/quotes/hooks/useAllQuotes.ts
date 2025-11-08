import { useQuery } from '@tanstack/react-query';
import { getQuotes} from "../../../api/quotes"
import type { QuotesIndexApiResponse } from "../../../types"

export const useAllQuotes = (
  page: number = 1,
  perPage: number = 10
) => {
  return useQuery<QuotesIndexApiResponse>({
    queryKey: ['quotes', 'all', page, perPage],
    queryFn: ({ signal }) => getQuotes({ reqOpts: {signal}, page, perPage }),
    // smooth-ish page transitions:
    placeholderData: (prev) => prev,
  })
}

