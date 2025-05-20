import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("access");
  const userData = JSON.parse(localStorage.getItem("user"));

  if (!token) {
    return <Navigate to="/login" />;
  }

  // If user is admin and trying to access dashboard, redirect them to admin_dashboard
  if (userData?.admin_user && window.location.pathname === "/dashboard") {
    return <Navigate to="/admin_dashboard" />;
  }

  return children;
}

export default PrivateRoute;
