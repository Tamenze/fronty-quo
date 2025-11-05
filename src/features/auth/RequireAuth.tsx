import { Navigate, useLocation } from "react-router-dom";
import { useFetchCurrentUser } from "../users/hooks/useFetchCurrentUser";

type RequireAuthProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

function RequireAuth({ children, fallback }: RequireAuthProps){

  const { data: currentUser, isPending } = useFetchCurrentUser();
  const location = useLocation();

  if (isPending) {
    return <>{fallback || null}</>
  }

  if (!currentUser) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;

}

export default RequireAuth
