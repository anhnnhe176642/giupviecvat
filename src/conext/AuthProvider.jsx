import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthConext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl + "/api";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    if (!token) {
      setIsLoading(false);
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
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Authentication error:", error);
      setIsLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      const response = await axios.post("/auth/login", userData);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
        setUser(response.data.user);
        connectSocket(response.data.user);
        toast.success("Login successful!");
      } else {
        toast.error(response.data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login.");
    }
    window.location.reload();
  };

  const googleLogin = async (credentialResponse) => {
    try {
      const response = await axios.post("/auth/google-login", {
        token: credentialResponse.credential,
      });
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
        setUser(response.data.user);
        connectSocket(response.data.user);
        toast.success("Google login successful!");
      } else {
        toast.error(response.data.message || "Google login failed.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("An error occurred during Google login.");
    }
    window.location.reload();
  };

  const logout = async () => {
    try {
      setToken(null);
      localStorage.removeItem("token");
      axios.defaults.headers.common["Authorization"] = "";
      setUser(null);
      setOnlineUsers([]);
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      toast.success("Logout successful!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout.");
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put("/auth/profile", profileData);
      if (response.data.success) {
        setUser(response.data.user);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.data.message || "Profile update failed.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("An error occurred while updating the profile.");
    }
  };

  const connectSocket = (userData) => {
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
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, []);

  const value = {
    axios,
    user,
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
