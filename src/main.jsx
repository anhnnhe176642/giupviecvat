import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./conext/AuthProvider.jsx";
import { ChatProvider } from "./conext/ChatProvider.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ChatProvider>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </BrowserRouter>
    </ChatProvider>
  </AuthProvider>
);
