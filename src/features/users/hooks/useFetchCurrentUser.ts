import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../../../api/users";
import type { User } from "../../../types/index"


export const useFetchCurrentUser = () => {
  return useQuery<User | null>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await fetchCurrentUser();
      if (!res.logged_in) {
        return null;
      }
      return res.user!;
    },
    // don't keep retrying if logged out
    retry: false,
  });
};
