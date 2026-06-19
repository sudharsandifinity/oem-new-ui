import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (
    user?.is_com_admin &&
    location.pathname === "/"
  ) {
    return <Navigate to="/CustomerAdmin" replace />;
  }

  return children;
}