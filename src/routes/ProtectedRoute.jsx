import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuth } = useAuth();
  const location = useLocation();

  if (!isAuth) {
    // remember where they wanted to go
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
