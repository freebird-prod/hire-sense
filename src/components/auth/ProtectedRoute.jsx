import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const userRole = localStorage.getItem('userRole');

  if (userRole && allowedRoles.includes(userRole)) {
    return <Outlet />;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
