import React, { useState } from "react";
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  AlertCircle,
  Crown,
  TrendingUp,
  Bike,
  Check,
  Eye,
  EyeOff,
  Zap,
  Building2
} from "lucide-react";
import "./LoginScreen.css";

const DEMO_ROLES = [
  {
    role: "SUPER_ADMIN",
    title: "Admin (Owner)",
    name: "Rajesh Sharma",
    email: "owner@distributorerp.com",
    password: "password123",
    icon: Crown,
    badgeText: "ADMIN",
    themeColor: "#4f46e5",
    themeBg: "rgba(79, 70, 229, 0.1)",
    themeBorder: "#6366f1",
    tagline: "Full Owner & Super Admin",
    desc: "Billing & Invoices, Schemes, Ledgers, Pricing & Approvals"
  },
  {
    role: "SALES_MANAGER",
    title: "Sales Manager",
    name: "Vikas Malhotra",
    email: "salesmgr@distributorerp.com",
    password: "password123",
    icon: TrendingUp,
    badgeText: "MANAGER",
    themeColor: "#0284c7",
    themeBg: "rgba(2, 132, 199, 0.1)",
    themeBorder: "#38bdf8",
    tagline: "Area Sales Manager",
    desc: "Beat Planning, Route Allocations & Salesmen Performance"
  },
  {
    role: "SALESMAN",
    title: "Salesman",
    name: "Rahul Kumar",
    email: "salesman@distributorerp.com",
    password: "password123",
    icon: Bike,
    badgeText: "SALESMAN",
    themeColor: "#d97706",
    themeBg: "rgba(217, 119, 6, 0.12)",
    themeBorder: "#f59e0b",
    tagline: "Field Sales (Beat Route A)",
    desc: "Retailer Visits, Instant Order Booking & Market Collections"
  }
];

export default function LoginScreen({ onLogin, isLoading, errorMessage }) {
  const [selectedRole, setSelectedRole] = useState("SUPER_ADMIN");
  const [emailOrMobile, setEmailOrMobile] = useState("owner@distributorerp.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);

  const activeRoleConfig = DEMO_ROLES.find(r => r.role === selectedRole) || DEMO_ROLES[0];

  const handleSelectRole = (roleItem) => {
    setSelectedRole(roleItem.role);
    setEmailOrMobile(roleItem.email);
    setPassword(roleItem.password);
  };

  const handleInstantLogin = (roleItem, e) => {
    if (e) e.stopPropagation();
    handleSelectRole(roleItem);
    onLogin({ emailOrMobile: roleItem.email, password: roleItem.password, role: roleItem.role });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ emailOrMobile, password, role: selectedRole });
  };

  return (
    <div className="login-page-container">
      <div className="login-layout-grid">
        
        {/* Left Column: Brand Hero & 3 Roles Blueprint */}
        <div className="login-hero-panel">
          <div>
            <div className="hero-brand-badge">
              <Sparkles size={14} />
              <span>Chirag Combines FMCG</span>
            </div>

            <h1 className="hero-brand-title" style={{ marginTop: "14px" }}>
              Smart Distribution &amp; <span>Billing Portal</span>
            </h1>

            <p className="hero-brand-desc" style={{ marginTop: "12px" }}>
              High-velocity FMCG billing, retailer order booking, and beat management engineered for 3 core operating roles.
            </p>
          </div>

          {/* 3 Dedicated Role Visual Showcase */}
          <div className="hero-roles-overview">
            {DEMO_ROLES.map((d) => {
              const RoleIcon = d.icon;
              const isCurrent = selectedRole === d.role;
              return (
                <div 
                  key={d.role} 
                  className="hero-role-pill"
                  style={{
                    borderColor: isCurrent ? d.themeBorder : "rgba(226, 232, 240, 0.9)",
                    background: isCurrent ? "#ffffff" : "rgba(255, 255, 255, 0.8)"
                  }}
                >
                  <div 
                    className="hero-role-icon-box"
                    style={{ background: d.themeBg, color: d.themeColor }}
                  >
                    <RoleIcon size={20} />
                  </div>
                  <div className="hero-role-info">
                    <div className="hero-role-title">
                      <span>{d.title}</span>
                      <span style={{
                        fontSize: "0.65rem",
                        fontWeight: "800",
                        padding: "1px 6px",
                        borderRadius: "4px",
                        background: d.themeBg,
                        color: d.themeColor
                      }}>
                        {d.badgeText}
                      </span>
                    </div>
                    <div className="hero-role-subtitle">
                      {d.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Badges */}
          <div className="hero-trust-badges">
            <div className="hero-trust-item">
              <ShieldCheck size={16} color="#10b981" />
              <span>3 Verified Roles</span>
            </div>
            <div className="hero-trust-item">
              <Zap size={16} color="#f59e0b" />
              <span>1-Click Instant Switching</span>
            </div>
            <div className="hero-trust-item">
              <Building2 size={16} color="#6366f1" />
              <span>Direct Billing Engine</span>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Interactive Login Card */}
        <div className="login-auth-card">
          <div className="card-header-section">
            <h2 className="card-main-title">Sign In to Portal</h2>
            <p className="card-sub-title">
              Select your profile for instant access or enter credentials below.
            </p>
          </div>

          {/* Role Picker */}
          <div className="role-picker-section">
            <div className="role-picker-label">
              <span className="role-picker-label-text">
                <Sparkles size={13} />
                Select Role to Sign In
              </span>
              <span className="role-picker-pass-hint">
                Pass: password123
              </span>
            </div>

            <div className="role-picker-list">
              {DEMO_ROLES.map((d) => {
                const RoleIcon = d.icon;
                const isSelected = selectedRole === d.role;

                return (
                  <div
                    key={d.role}
                    className={`role-picker-item ${isSelected ? "active" : ""}`}
                    onClick={() => handleSelectRole(d)}
                    style={{
                      borderColor: isSelected ? d.themeBorder : "#e2e8f0",
                      background: isSelected ? d.themeBg : "#ffffff"
                    }}
                  >
                    <div className="role-picker-left">
                      <div 
                        className="role-picker-icon-wrapper"
                        style={{ background: isSelected ? "#ffffff" : d.themeBg, color: d.themeColor }}
                      >
                        <RoleIcon size={18} />
                      </div>
                      <div className="role-picker-texts">
                        <div className="role-picker-name-row">
                          <span className="role-picker-title">{d.title}</span>
                          <span className="role-picker-person-name">• {d.name}</span>
                        </div>
                        <span className="role-picker-email">{d.email}</span>
                      </div>
                    </div>

                    <div className="role-picker-action">
                      <button
                        type="button"
                        className="quick-signin-btn"
                        onClick={(e) => handleInstantLogin(d, e)}
                        style={{
                          background: d.themeColor,
                          color: "#ffffff"
                        }}
                        title={`Instantly sign in as ${d.title}`}
                      >
                        <Zap size={13} />
                        <span>1-Click Sign In</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="login-divider">
            <span className="login-divider-text">Or Sign In with Credentials</span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              padding: "11px 14px",
              borderRadius: "12px",
              fontSize: "0.84rem",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <AlertCircle size={17} color="#ef4444" style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="login-input-row">
              <label className="login-input-label">Email or Mobile</label>
              <div className="login-input-box">
                <Mail className="login-input-leading-icon" size={17} />
                <input
                  type="text"
                  className="login-input-field"
                  placeholder="e.g. owner@distributorerp.com"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="login-input-row">
              <div className="login-input-label-row">
                <label className="login-input-label">Password</label>
                <button
                  type="button"
                  onClick={() => setPassword("password123")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#4f46e5",
                    fontSize: "0.76rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    padding: 0
                  }}
                >
                  Autofill Default Password
                </button>
              </div>
              <div className="login-input-box">
                <Lock className="login-input-leading-icon" size={17} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="login-input-field"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login-password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={isLoading}
              style={{
                background: `linear-gradient(135deg, ${activeRoleConfig.themeColor} 0%, #312e81 100%)`
              }}
            >
              {isLoading ? (
                <span>Authenticating Session...</span>
              ) : (
                <>
                  <span>Sign In as {activeRoleConfig.title}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Security Footer */}
          <div className="card-security-footer">
            <ShieldCheck size={15} color="#10b981" />
            <span>Authorized FMCG Distribution ERP • 3 Active Roles</span>
          </div>
        </div>

      </div>
    </div>
  );
}
