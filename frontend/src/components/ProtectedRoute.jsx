import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/api';

const ProtectedRoute = ({ children, role }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const authData = await authService.checkAuth();
        setIsAuthenticated(true);
        setUserRole(authData.role);
      } catch (error) {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    };

    checkAuthentication();
  }, []);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login/${role}`} />;
  }

  if (userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;