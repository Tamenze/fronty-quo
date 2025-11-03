import {useQuery} from '@tanstack/react-query';
import {getAllTags} from "../../../api/tags";
import type {Tag} from "../../../types"

export const useAllTags = () => {
  return useQuery<Tag[]>({
    queryKey: ['tags', 'all'],
    queryFn: ({ signal }) => getAllTags({ signal })
  })
}
