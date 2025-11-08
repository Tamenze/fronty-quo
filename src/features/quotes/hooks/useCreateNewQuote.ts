import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNewQuote } from '../../../api/quotes';
import type { Quote } from "../../../types"
import type { CreateNewQuoteParams } from '../../../api/quotes';

export const useCreateNewQuote = () => {
  const qc = useQueryClient();

  return useMutation<Quote, Error, CreateNewQuoteParams>({
    mutationFn: (payload) => createNewQuote(payload),
    onSuccess: (quote) => {
      //invalidate user info so we refetch the freshest of the quote creator's user (helpful for rendering user.quotes)
      const userId = quote.user_id;
      qc.invalidateQueries({ queryKey: ['user', userId] });

      qc.invalidateQueries({ queryKey: ['quotes'] });
      qc.setQueryData(['quote', quote.id], quote);
    },
  })
}
