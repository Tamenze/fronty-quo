import { useQuery } from '@tanstack/react-query';
import { getSpecificUser } from '../../../api/users';
import type { User } from "../../../types"

export const useFetchSpecificUser = (id: number) => {
  return useQuery<User>({
    queryKey: ['user', id],
    enabled: id !== undefined && id !== null,
    queryFn: ({ signal }) => getSpecificUser({id: Number(id) }, { signal })
  })
}

