import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import BrowseTasks from '../pages/BrowseTasks';
import ChatPage from '../pages/ChatPage';
import MyTasks from '../pages/MyTasks';

// Protected route component
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { 
        path: 'dashboard', 
        element: <ProtectedRoute element={<Dashboard />} /> 
      },
      { path: 'browse-tasks', element: <BrowseTasks /> },
      { 
        path: 'chat', element:  <ChatPage />
      },
      { 
        path: 'my-tasks', element:  <MyTasks />
      },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export default router;
