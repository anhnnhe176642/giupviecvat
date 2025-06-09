import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl + "/api";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const connectSocket = useCallback(
    (userData) => {
      if (!userData || socket?.connected) return;

      const newSocket = io(backendUrl, {
        query: {
          userId: userData._id,
        },
      });

      newSocket.connect();
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (userIds) => {
        setOnlineUsers(userIds);
      });

      return newSocket;
    },
    [socket]
  );

  const checkAuth = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get("/auth/check-auth", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUser(response.data.user);
        connectSocket(response.data.user);
      } else {
        // If not successful but got a response, clear auth data
        handleLogout();
      }
    } catch (error) {
      console.error("Authentication error:", error);
      // On error, consider the user not authenticated
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  }, [token, connectSocket]);

  const handleLogin = useCallback(
    async (responseData) => {
      if (!responseData.success) {
        toast.error(responseData.message || "Login failed");
        return false;
      }

      setToken(responseData.token);
      localStorage.setItem("token", responseData.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${responseData.token}`;
      setUser(responseData.user);
      connectSocket(responseData.user);
      return true;
    },
    [connectSocket]
  );

  const login = async (userData) => {
    try {
      const response = await axios.post("/auth/login", userData);
      const success = await handleLogin(response.data);
      if (success) {
        toast.success("Login successful!");
        return true;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "An error occurred during login.");
    }
    return false;
  };

  const googleLogin = async (credentialResponse) => {
    try {
      const response = await axios.post("/auth/google-login", {
        token: credentialResponse.credential,
      });
      const success = await handleLogin(response.data);
      if (success) {
        toast.success("Google login successful!");
        return true;
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.response?.data?.message || "An error occurred during Google login.");
    }
    return false;
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setOnlineUsers([]);

    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const logout = () => {
    try {
      handleLogout();
      toast.success("Logout successful!");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout.");
      return false;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put("/auth/profile", profileData);
      if (response.data.success) {
        setUser(response.data.user);
        toast.success("Profile updated successfully!");
        return true;
      } else {
        toast.error(response.data.message || "Profile update failed.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "An error occurred while updating the profile.");
    }
    return false;
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, [token, checkAuth]);

  // Cleanup socket connection when component unmounts
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const value = {
    axios,
    user,
    setUser,
    onlineUsers,
    socket,
    isLoading,
    login,
    googleLogin,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
