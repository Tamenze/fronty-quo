import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logOut } from '../../../api/users';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();


  return useMutation({
    mutationFn: logOut,
    onSuccess: () => {
      qc.setQueryData(["currentUser"], null);
      navigate('/')
    }
  })
}
