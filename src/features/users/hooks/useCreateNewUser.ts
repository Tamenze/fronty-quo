import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNewUser } from '../../../api/users';
import type { User } from "../../../types"
import type { CreateNewUserParams } from '../../../api/users';
import { setCsrfToken, getCsrf } from "../../../api/client";


export const useCreateNewUser = () => {
  const qc = useQueryClient();

  return useMutation<User, Error, CreateNewUserParams>({
    mutationFn: (payload) => createNewUser(payload), 
    onSuccess: async (user) => {
      setCsrfToken('');
      await getCsrf();
      qc.invalidateQueries({ queryKey: ['users'] });
      qc.setQueryData(['users', user.id], user);
      qc.setQueryData(['currentUser'], user); // since signup also logs user in
    }
  })
}
