import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicRoute({ children }) {
  const { user, token } = useSelector((state) => state.auth);

  if (user && token) {
    const isCompAdmin = Boolean(user?.is_com_admin);
    const isSuperUser=Boolean(user?.is_super_user);

    return (
      <Navigate
        to={isCompAdmin ? "/CustomerAdmin" :(isSuperUser?"/admin": "/dashboard")}
        replace
      />
    );
  }

  return children;
}