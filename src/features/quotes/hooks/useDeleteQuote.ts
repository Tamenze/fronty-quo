
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQuote } from '../../../api/quotes';

export const useDeleteQuote = () => {
    const qc = useQueryClient();

    return useMutation<void, Error, number>({
      mutationFn: (id) => deleteQuote(id),
      onSuccess: (_, id) => {
        qc.invalidateQueries({ queryKey: ["quotes"] });
        qc.removeQueries({ queryKey: ["quote", id] });
      }
    })

};
