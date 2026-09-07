import React, { useState, useEffect } from "react";
import LoginScreen from "./components/LoginScreen";
import RoleShellPreview from "./components/RoleShellPreview";
import OwnerDashboard from "./components/dashboard/OwnerDashboard";

const API_BASE_URL = "http://localhost:5005/api/auth";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async ({ emailOrMobile, password }) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrMobile, password })
      });

      const data = await response.json();

      if (data.success && data.user) {
        setCurrentUser(data.user);
        setToken(data.token);
      } else {
        setErrorMessage(data.message || "Invalid authentication credentials.");
      }
    } catch (error) {
      setErrorMessage("Unable to reach authentication server. Please check backend status.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken("");
  };

  return (
    <div className="app-container">
      {/* Background Ambient Lighting */}
      <div className="ambient-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {currentUser ? (
        currentUser.role === "SUPER_ADMIN" ? (
          <OwnerDashboard 
            user={currentUser} 
            token={token} 
            onLogout={handleLogout} 
          />
        ) : (
          <RoleShellPreview 
            user={currentUser} 
            token={token} 
            onLogout={handleLogout} 
          />
        )
      ) : (
        <LoginScreen
          onLogin={handleLogin}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
}
