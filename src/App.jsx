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
import { AuthContext } from "./conext/AuthConext"

function App() {
  const {user, isLoading} = useContext(AuthContext);
  if (isLoading) {
    return null;
  }
  return (
      <>
      <Toaster position="bottom-left" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/my-tasks" element={<MyTasks />} />
        </Route>
        <Route path="/browse-tasks" element={<BrowseTasks />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/conversation/:id" element={<ChatPage />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      </Routes>
      </>
  );
}

export default App;
