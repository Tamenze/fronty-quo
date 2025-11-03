import type { Tag } from "../../../types";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNewTag, type  CreateNewTagParams } from "../../../api/tags";

export const useCreateNewTag = () => {
  const qc = useQueryClient();

  return useMutation<Tag, Error, CreateNewTagParams>({
    mutationFn: (payload) => createNewTag(payload),
    onSuccess: (tag) => {
      qc.invalidateQueries({ queryKey: ['tags']});
      qc.setQueryData(['tag', tag.id], tag);
    }
  })

}
