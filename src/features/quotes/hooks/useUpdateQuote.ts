import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateQuote } from '../../../api/quotes';
import type { Quote } from "../../../types"
import type { UpdateQuoteParams } from '../../../api/quotes';


type UpdateQuoteVariables = {
  id: number;
} & UpdateQuoteParams;


export const useUpdateQuote = () => {
  const qc = useQueryClient();

  return useMutation<Quote, Error, UpdateQuoteVariables>({
    mutationFn: ({id, ...payload}) => updateQuote(id, payload),
    onSuccess: (quote) => {
      qc.invalidateQueries({ queryKey: ['quotes'] });
      qc.setQueryData(['quote', quote.id], quote);
    }
  })
}
