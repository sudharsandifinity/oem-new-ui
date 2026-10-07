import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicRoute({ children }) {
  const { user, token } = useSelector((state) => state.auth);

  if (user && token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}