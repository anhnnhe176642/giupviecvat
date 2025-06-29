import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../conext/AuthContext';
import LoginRequired from './LoginRequired';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <LoginRequired />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleBasedRoute;
