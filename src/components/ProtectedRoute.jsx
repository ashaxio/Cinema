import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({
  children,
  onlyOwnProfile = false,
  adminOnly = false,
}) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (onlyOwnProfile && !location.pathname.includes(`/profile`)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
