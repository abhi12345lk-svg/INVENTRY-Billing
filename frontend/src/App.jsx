import React, { useState, useEffect } from "react";
import LoginScreen from "./components/LoginScreen";
import RoleShellPreview from "./components/RoleShellPreview";
import OwnerDashboard from "./components/dashboard/OwnerDashboard";

const API_BASE_URL = "http://localhost:5005/api/auth";

const DEFAULT_DEMO_USERS = [
  {
    id: "user-owner-01",
    name: "Rajesh Sharma",
    role: "SUPER_ADMIN",
    roleLabel: "Owner / Super Admin",
    email: "owner@distributorerp.com",
    mobile: "9876543210",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    company: "Chirag Combines FMCG",
    brands: ["Nestlé", "Patanjali", "GSK"],
    badgeColor: "#8b5cf6",
    badgeBg: "rgba(139, 92, 246, 0.15)",
    description: "Full system access, Exception Control Tower, Financial Approvals & Executive Reports"
  },
  {
    id: "user-finance-01",
    name: "Amit Verma",
    role: "FINANCE",
    roleLabel: "Admin / Finance Manager",
    email: "finance@distributorerp.com",
    mobile: "9876543211",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    company: "Chirag Combines FMCG",
    brands: ["Nestlé", "Patanjali", "GSK"],
    badgeColor: "#10b981",
    badgeBg: "rgba(16, 185, 129, 0.15)",
    description: "Billing, Cash Denominations, Smart UPI Recon, Cheque Vault & Party Ledger Ageing"
  },
  {
    id: "user-salesmgr-01",
    name: "Vikas Malhotra",
    role: "SALES_MANAGER",
    roleLabel: "Sales Manager",
    email: "salesmgr@distributorerp.com",
    mobile: "9876543212",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
    company: "Chirag Combines FMCG",
    brands: ["Nestlé", "Patanjali", "GSK"],
    badgeColor: "#3b82f6",
    badgeBg: "rgba(59, 130, 246, 0.15)",
    description: "20 Salesmen Management, Beat Routes, Target vs Achievement & Missed Visits"
  },
  {
    id: "user-salesman-01",
    name: "Rahul Kumar",
    role: "SALESMAN",
    roleLabel: "Field Salesman (Route A)",
    email: "salesman@distributorerp.com",
    mobile: "9876543213",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=250&q=80",
    company: "Chirag Combines FMCG",
    brands: ["Nestlé", "Patanjali", "GSK"],
    badgeColor: "#f59e0b",
    badgeBg: "rgba(245, 158, 11, 0.15)",
    description: "Mobile Beat Orders, 40 Outlets, Locked Bills & E-Cash Collection Sheet"
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState("");
  const [demoUsers, setDemoUsers] = useState(DEFAULT_DEMO_USERS);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/demo-users`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.users) {
          setDemoUsers(data.users);
        }
      })
      .catch(() => {
        console.log("Backend API fallback used.");
      });
  }, []);

  const handleLogin = async ({ emailOrMobile, password, role }) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrMobile, password, role })
      });

      const data = await response.json();

      if (data.success && data.user) {
        setCurrentUser(data.user);
        setToken(data.token);
      } else {
        setErrorMessage(data.message || "Invalid authentication details.");
      }
    } catch (error) {
      let matchedUser;
      if (role) {
        matchedUser = demoUsers.find((u) => u.role === role);
      } else if (emailOrMobile) {
        matchedUser = demoUsers.find(
          (u) => u.email.toLowerCase() === emailOrMobile.toLowerCase() || u.mobile === emailOrMobile
        );
      }
      if (!matchedUser) {
        matchedUser = demoUsers[0];
      }
      setCurrentUser(matchedUser);
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
      {/* Background Ambient Glowing Orbs */}
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
            theme={theme} 
            onToggleTheme={toggleTheme} 
          />
        ) : (
          <RoleShellPreview 
            user={currentUser} 
            token={token}
            onLogout={handleLogout} 
            theme={theme} 
            onToggleTheme={toggleTheme} 
          />
        )
      ) : (
        <LoginScreen
          demoUsers={demoUsers}
          onLogin={handleLogin}
          isLoading={isLoading}
          errorMessage={errorMessage}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
    </div>
  );
}
