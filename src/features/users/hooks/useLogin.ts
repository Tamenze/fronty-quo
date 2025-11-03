import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logIn } from '../../../api/users';
import type { User } from "../../../types"
import type { LoginParams } from '../../../api/users';

export const useLogin = () => {
  const qc = useQueryClient();

  return useMutation<User, Error, LoginParams>({
    mutationFn: (payload) => logIn(payload), 
    onSuccess: (user) => {
      qc.setQueryData(["currentUser"], user);
    }
  })
}
