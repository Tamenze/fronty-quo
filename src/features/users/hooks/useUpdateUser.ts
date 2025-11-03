
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from "../../../types";
import type { UpdateUserParams } from '../../../api/users'; 
import { updateUser } from "../../../api/users";

type UpdateUserVariables = {
  id: number;
} & UpdateUserParams;

export const useUpdateUser = () => {
  const qc = useQueryClient();

  return useMutation<User, Error, UpdateUserVariables>({
    mutationFn: ({id, ...payload}) => updateUser(id, payload),
    onSuccess: (user) => {
      qc.invalidateQueries({ queryKey: ['users'] });
      qc.setQueryData(['users', user.id], user);
      qc.setQueryData(['currentUser'], user);
    }
  })
}
