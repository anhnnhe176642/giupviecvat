import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../conext/AuthContext';
import LoadingScreen from './LoadingScreen';

const AdminRoute = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default AdminRoute;
