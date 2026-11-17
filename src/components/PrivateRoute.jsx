import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("token"); // or whatever you store

  return isLoggedIn ? children : <Navigate to="/" />;
};

export default PrivateRoute;