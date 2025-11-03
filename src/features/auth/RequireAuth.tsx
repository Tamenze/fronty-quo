import { Navigate, useLocation } from "react-router-dom";
import { useFetchCurrentUser } from "../users/hooks/useFetchCurrentUser";

type RequireAuthProps = {
  children: React.ReactNode;
};

function RequireAuth({ children }: RequireAuthProps){

  const { data: currentUser, isPending } = useFetchCurrentUser();
  const location = useLocation();

  if (isPending) {
    return <p>Loading…</p>;
  }

  if (!currentUser) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;

}

export default RequireAuth
