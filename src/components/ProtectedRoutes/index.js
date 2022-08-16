import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoutes = ({ component: Component, ...rest }) => {
  const jwtToken = Cookies.get("jwtToken");

  if (jwtToken === undefined) {
    return <Navigate to="/login" />;
  }

  return Component;
};

export default ProtectedRoutes;
