import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import store from "./store";
import ChatPage from "./pages/ChatPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import BrowseTasks from "./pages/BrowseTasks";
import ProfilePage from "./pages/ProfilePage";
import MyTasks from "./pages/MyTasks";

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/browse-tasks" element={<BrowseTasks />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-tasks" element={<MyTasks />} />
          <Route path="/chat" element={<ChatPage />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Provider>
  );
}

export default App;
