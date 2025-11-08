import { useQuery } from '@tanstack/react-query';
import { getSpecificTag } from "../../../api/tags"
import type { TagShowApiResponse } from "../../../types"

export const useGetTag = (
  id: number,   
  page: number = 1,
  perPage: number = 10
) => {
  return useQuery<TagShowApiResponse>({
    queryKey: ['tag', 'byId', id, page, perPage],
    enabled: id !== undefined && id !== null,
    queryFn: ({ signal }) => getSpecificTag({
      params: {id: Number(id) }, 
      reqOpts: { signal }, 
      page, 
      perPage
    }),
  })
}
