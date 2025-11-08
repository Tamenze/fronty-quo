import { useQuery } from '@tanstack/react-query';
import { getSpecificUser } from '../../../api/users';
import type { UserShowApiResponse } from "../../../types"

export const useFetchSpecificUser = (
  id: number,   
  page: number = 1,
  perPage: number = 10) => {
  return useQuery<UserShowApiResponse>({
    queryKey: ['user', id, page, perPage],
    enabled: id !== undefined && id !== null,
    queryFn: ({ signal }) => getSpecificUser({
      params: {id: Number(id) }, 
      reqOpts: { signal }, 
      page, 
      perPage
    }),
    placeholderData: (prev) => prev,
  })
}

