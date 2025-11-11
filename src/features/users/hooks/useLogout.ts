import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logOut } from '../../../api/users';
import { useNavigate } from 'react-router-dom';
import { setCsrfToken, getCsrf } from "../../../api/client";

export const useLogout = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();


  return useMutation({
    mutationFn: logOut,
    onSuccess: async () => {
      setCsrfToken('');
      await getCsrf();

      qc.setQueryData(["currentUser"], null);
      navigate('/')
    }
  })
}
