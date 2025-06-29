import { useContext } from 'react';
import { AuthContext } from '../conext/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export const useRole = () => {
  const { user } = useAuth();
  
  const isAdmin = () => user?.role === 'admin';
  const isUser = () => user?.role === 'user';
  const hasRole = (role) => user?.role === role;
  
  return {
    user,
    isAdmin,
    isUser,
    hasRole,
    role: user?.role
  };
};
