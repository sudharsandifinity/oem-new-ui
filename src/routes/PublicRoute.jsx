import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicRoute({ children }) {
  const { user, token } = useSelector((state) => state.auth);

  if (user && token) {
    const isCompAdmin = Boolean(user?.is_com_admin);

    return (
      <Navigate
        to={isCompAdmin ? "/CustomerAdmin" : "/dashboard"}
        replace
      />
    );
  }

  return children;
}