import React, { useState } from "react";
import { 
  Building2, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  TrendingUp, 
  Coins, 
  Users, 
  ShoppingBag,
  CheckCircle2,
  Sun,
  Moon
} from "lucide-react";

export default function LoginScreen({ demoUsers, onLogin, isLoading, errorMessage, theme, onToggleTheme }) {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoleUser, setSelectedRoleUser] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRoleUser) {
      onLogin({ role: selectedRoleUser.role });
    } else {
      onLogin({ emailOrMobile, password });
    }
  };

  const handleSelectRole = (user) => {
    setSelectedRoleUser(user);
    setEmailOrMobile(user.email);
    setPassword("••••••••");
  };

  return (
    <div className="login-page-wrapper" style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      minHeight: "100vh",
      width: "100%",
      position: "relative"
    }}>
      {/* Top Header Controls (Theme Switcher) */}
      <div style={{
        position: "absolute",
        top: "24px",
        right: "32px",
        zIndex: 10
      }}>
        <button 
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title="Switch Theme"
        >
          {theme === "dark" ? (
            <>
              <Sun size={16} color="#f59e0b" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={16} color="#6366f1" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Brand Header */}
      <div style={{ textAlign: "center", marginBottom: "32px", maxWidth: "600px" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          background: "var(--badge-brand-bg)",
          border: "1px solid var(--badge-brand-border)",
          borderRadius: "30px",
          padding: "6px 18px",
          marginBottom: "16px",
          color: "var(--primary-400)",
          fontSize: "0.85rem",
          fontWeight: "600",
          letterSpacing: "0.05em"
        }}>
          <Sparkles size={16} />
          FMCG DISTRIBUTION NETWORK
        </div>

        <h1 style={{
          fontSize: "2.75rem",
          fontWeight: "900",
          letterSpacing: "-0.03em",
          color: "var(--text-main)",
          marginBottom: "10px"
        }}>
          DISTRIBUTOR ERP
        </h1>

        <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: "1.6" }}>
          Authorized Distribution System for <strong style={{ color: "var(--text-main)" }}>Nestlé</strong>, <strong style={{ color: "var(--text-main)" }}>Patanjali</strong> & <strong style={{ color: "var(--text-main)" }}>GSK</strong>
        </p>
      </div>

      {/* Main Glass Card */}
      <div className="glass-card" style={{
        width: "100%",
        maxWidth: "960px",
        padding: "36px",
        display: "grid",
        gridTemplateColumns: "1fr 1.1fr",
        gap: "40px"
      }}>

        {/* Left Side: Standard Login Form */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "6px" }}>
              System Sign In
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--text-dim)" }}>
              Enter credentials or select a demo role profile on the right.
            </p>
          </div>

          {errorMessage && (
            <div style={{
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#fca5a5",
              padding: "12px 16px",
              borderRadius: "12px",
              fontSize: "0.875rem",
              marginBottom: "20px"
            }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email or Mobile Number</label>
              <div className="input-field-wrapper">
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. owner@distributorerp.com or 9876543210"
                  value={emailOrMobile}
                  onChange={(e) => {
                    setEmailOrMobile(e.target.value);
                    setSelectedRoleUser(null);
                  }}
                  required
                />
                <Mail className="input-icon" size={18} />
              </div>
            </div>

            <div className="input-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label className="input-label" style={{ marginBottom: 0 }}>Password</label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} style={{ color: "var(--primary-400)", fontSize: "0.8rem", textDecoration: "none" }}>
                  Forgot Password?
                </a>
              </div>
              <div className="input-field-wrapper">
                <input
                  type="password"
                  className="input-control"
                  placeholder="Enter secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock className="input-icon" size={18} />
              </div>
            </div>

            {selectedRoleUser && (
              <div style={{
                background: "var(--badge-brand-bg)",
                border: "1px solid var(--border-active)",
                borderRadius: "12px",
                padding: "10px 14px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <CheckCircle2 size={18} color={selectedRoleUser.badgeColor} />
                <span style={{ fontSize: "0.85rem", color: "var(--text-sub)" }}>
                  Selected Demo Role: <strong style={{ color: selectedRoleUser.badgeColor }}>{selectedRoleUser.roleLabel}</strong>
                </span>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", padding: "14px", marginTop: "8px" }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Authenticating Session...</span>
              ) : (
                <>
                  <span>Login to ERP Portal</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Infrastructure Security Badge */}
          <div style={{
            marginTop: "32px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "0.78rem",
            color: "var(--text-dim)",
            borderTop: "1px solid var(--border-card)",
            paddingTop: "16px"
          }}>
            <ShieldCheck size={16} color="#10b981" />
            <span>256-bit Encrypted Session • MongoDB Atlas Transaction Engine</span>
          </div>
        </div>

        {/* Right Side: Interactive Quick Demo Users Selection */}
        <div style={{
          borderLeft: "1px solid var(--border-card)",
          paddingLeft: "32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)" }}>
                Select Demo Role Profile
              </h3>
              <span style={{
                background: "var(--badge-brand-bg)",
                color: "var(--text-muted)",
                padding: "2px 10px",
                borderRadius: "12px",
                fontSize: "0.75rem"
              }}>
                1-Click Testing
              </span>
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-dim)", marginBottom: "20px" }}>
              Test different panels (Owner, Finance, Sales Manager, Salesman) to experience role-based controls:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {demoUsers && demoUsers.map((user) => {
                const isSelected = selectedRoleUser?.id === user.id;
                return (
                  <div
                    key={user.id}
                    onClick={() => handleSelectRole(user)}
                    style={{
                      background: isSelected ? "var(--badge-brand-bg)" : "var(--bg-input)",
                      border: isSelected ? `1.5px solid ${user.badgeColor}` : "1px solid var(--border-card)",
                      borderRadius: "16px",
                      padding: "12px 16px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px"
                    }}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        objectFit: "cover",
                        border: `2px solid ${user.badgeColor}`
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                        <span style={{ fontSize: "0.92rem", fontWeight: "700", color: "var(--text-main)" }}>
                          {user.name}
                        </span>
                        <span style={{
                          background: user.badgeBg,
                          color: user.badgeColor,
                          padding: "2px 8px",
                          borderRadius: "8px",
                          fontSize: "0.7rem",
                          fontWeight: "700"
                        }}>
                          {user.role}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: "500" }}>
                        {user.roleLabel}
                      </div>
                    </div>

                    <button
                      type="button"
                      style={{
                        background: isSelected ? user.badgeColor : "var(--border-card)",
                        color: isSelected ? "#ffffff" : "var(--text-muted)",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "10px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      {isSelected ? "Active" : "Select"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{
            background: "var(--bg-input)",
            borderRadius: "14px",
            padding: "12px 16px",
            marginTop: "20px",
            fontSize: "0.78rem",
            color: "var(--text-dim)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <span>Connected Brands:</span>
            <span style={{ color: "var(--text-main)", fontWeight: "600" }}>Nestlé • Patanjali • GSK</span>
          </div>
        </div>

      </div>

      {/* Professional Footer */}
      <div style={{
        marginTop: "36px",
        textAlign: "center",
        color: "var(--text-dim)",
        fontSize: "0.85rem",
        display: "flex",
        flexDirection: "column",
        gap: "6px"
      }}>
        <p style={{ fontWeight: "500" }}>© Distributor Management System</p>
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Chirag Combines FMCG ERP • Modular Architecture v1.0 Demo</p>
      </div>
    </div>
  );
}
