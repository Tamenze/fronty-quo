import { useQuery } from '@tanstack/react-query';
import { getSpecificTag } from "../../../api/tags"

export const useGetTag = (id: number) => {
  return useQuery({
    queryKey: ['tag', 'byId', id],
    enabled: id !== undefined && id !== null,
    queryFn:  ({ signal }) => getSpecificTag({id: Number(id) }, { signal })
  })
}
