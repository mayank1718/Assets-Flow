import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../auth/context/auth.context";

const DashboardRedirect = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;

    case "assetManager":
      return <Navigate to="/asset-manager/dashboard" replace />;

    case "employee":
      return <Navigate to="/employee/dashboard" replace />;

    default:
      return <Navigate to="/login" replace />;
  }
};

export default DashboardRedirect;
