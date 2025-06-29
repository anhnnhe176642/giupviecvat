import { Navigate, Route, Routes } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import BrowseTasks from "./pages/BrowseTasks";
import ProfilePage from "./pages/ProfilePage";
import MyTasks from "./pages/MyTasks";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "./conext/AuthContext"
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import LoadingScreen from "./components/LoadingScreen";
import LoginRequired from "./components/LoginRequired";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initGA, trackPageView } from "./analytics";
import ReferFriends from "./pages/ReferFriends";
import RoleBasedRoute from "./components/RoleBasedRoute";
import Unauthorized from "./pages/Unauthorized";
import AdminLayout from "./layouts/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import TaskManagement from "./pages/admin/TaskManagement";

function App() {
  const location = useLocation();
  const { user, isLoading } = useContext(AuthContext);

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Toaster position="bottom-left" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/profile"
            element={user ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route path="/my-tasks" element={<MyTasks />} />
          <Route path="/refer-friends" element={<ReferFriends />} />
        </Route>
        <Route path="/browse-tasks" element={<BrowseTasks />} />
        <Route path="/chat" element={user ? <ChatPage /> : <LoginRequired />} />
        <Route path="/chat/conversation/:id" element={user ? <ChatPage /> : <LoginRequired />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </RoleBasedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="tasks" element={<TaskManagement />} />
        </Route>
        
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}


export default App;
