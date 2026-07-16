import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const loggedIn =
    localStorage.getItem("adminLoggedIn") === "true";

  if (!loggedIn) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}