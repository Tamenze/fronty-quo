import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logIn } from '../../../api/users';
import type { User } from "../../../types"
import type { LoginParams } from '../../../api/users';
import { setCsrfToken, getCsrf } from "../../../api/client";


export const useLogin = () => {
  const qc = useQueryClient();

  return useMutation<User, Error, LoginParams>({
    mutationFn: (payload) => logIn(payload), 
    onSuccess: async (user) => {
      setCsrfToken('');
      await getCsrf();
      qc.setQueryData(["currentUser"], user);
    }
  })
}
