import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { access } = useContext(AuthContext);
  if (!access) return <Navigate to="/" replace />;
  return children;
}
