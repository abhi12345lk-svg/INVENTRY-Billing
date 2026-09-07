import React, { useState } from "react";
import { 
  Building2, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  AlertCircle,
  Crown,
  Coins,
  TrendingUp,
  Bike,
  CheckCircle2
} from "lucide-react";

export const DEMO_ROLES = [
  {
    role: "SUPER_ADMIN",
    title: "Owner",
    name: "Rajesh Sharma",
    email: "owner@distributorerp.com",
    password: "password123",
    icon: Crown,
    badgeText: "SUPER_ADMIN",
    themeColor: "#6366f1",
    themeBg: "rgba(99, 102, 241, 0.1)",
    themeBorder: "rgba(99, 102, 241, 0.3)",
    desc: "Command Center, Margins & Master Approvals"
  },
  {
    role: "FINANCE",
    title: "Finance",
    name: "Amit Verma",
    email: "finance@distributorerp.com",
    password: "password123",
    icon: Coins,
    badgeText: "FINANCE",
    themeColor: "#059669",
    themeBg: "rgba(16, 185, 129, 0.1)",
    themeBorder: "rgba(16, 185, 129, 0.3)",
    desc: "GST Invoicing, Cash Tally & UPI Bank Recon"
  },
  {
    role: "SALES_MANAGER",
    title: "Sales Manager",
    name: "Vikas Malhotra",
    email: "salesmgr@distributorerp.com",
    password: "password123",
    icon: TrendingUp,
    badgeText: "SALES_MANAGER",
    themeColor: "#0284c7",
    themeBg: "rgba(14, 165, 233, 0.1)",
    themeBorder: "rgba(14, 165, 233, 0.3)",
    desc: "Beat Planning, Salesmen Targets & Quota"
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
    themeBg: "rgba(245, 158, 11, 0.12)",
    themeBorder: "rgba(245, 158, 11, 0.3)",
    desc: "Field Beat Orders & Market Collections"
  }
];

export default function LoginScreen({ onLogin, isLoading, errorMessage }) {
  const [emailOrMobile, setEmailOrMobile] = useState("owner@distributorerp.com");
  const [password, setPassword] = useState("password123");
  const [selectedRole, setSelectedRole] = useState("SUPER_ADMIN");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ emailOrMobile, password });
  };

  const handleSelectDemoRole = (demoRole) => {
    setEmailOrMobile(demoRole.email);
    setPassword(demoRole.password);
    setSelectedRole(demoRole.role);
    // Instant 1-click login for smooth demo presentation
    onLogin({ emailOrMobile: demoRole.email, password: demoRole.password });
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
      position: "relative",
      background: "var(--bg-dark)"
    }}>
      {/* Brand Header */}
      <div style={{ textAlign: "center", marginBottom: "24px", maxWidth: "560px" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(79, 70, 229, 0.08)",
          border: "1px solid rgba(79, 70, 229, 0.2)",
          borderRadius: "30px",
          padding: "6px 16px",
          marginBottom: "12px",
          color: "var(--primary-600)",
          fontSize: "0.82rem",
          fontWeight: "700",
          letterSpacing: "0.04em"
        }}>
          <Sparkles size={15} />
          CHIRAG COMBINES FMCG
        </div>

        <h1 style={{
          fontSize: "2.2rem",
          fontWeight: "900",
          letterSpacing: "-0.03em",
          color: "var(--text-main)",
          marginBottom: "6px"
        }}>
          DISTRIBUTOR ERP
        </h1>

        <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: "1.5", margin: 0 }}>
          Authorized Distribution Management & Multi-Role Operations System
        </p>
      </div>

      {/* Main Login Card */}
      <div className="glass-card" style={{
        width: "100%",
        maxWidth: "540px",
        padding: "32px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03)"
      }}>
        {/* Quick 1-Click Demo Login Bar */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: "800", color: "var(--primary-600)", textTransform: "uppercase", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "6px" }}>
              <Sparkles size={14} />
              1-Click Demo Logins (Instant Switch)
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", fontFamily: "monospace" }}>
              Pass: password123
            </span>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "10px"
          }}>
            {DEMO_ROLES.map((d) => {
              const IconComponent = d.icon;
              const isSelected = selectedRole === d.role;

              return (
                <button
                  key={d.role}
                  type="button"
                  onClick={() => handleSelectDemoRole(d)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    textAlign: "left",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    background: isSelected ? d.themeBg : "var(--bg-surface-2)",
                    border: isSelected ? `2px solid ${d.themeColor}` : "1px solid var(--border-card)",
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                    position: "relative"
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = d.themeColor;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = "var(--border-card)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "6px",
                        background: d.themeBg,
                        color: d.themeColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <IconComponent size={14} />
                      </div>
                      <span style={{ fontWeight: "800", fontSize: "0.85rem", color: "var(--text-main)" }}>
                        {d.title}
                      </span>
                    </div>
                    <span style={{
                      fontSize: "0.62rem",
                      fontWeight: "800",
                      padding: "2px 6px",
                      borderRadius: "6px",
                      background: d.themeBg,
                      color: d.themeColor,
                      border: `1px solid ${d.themeBorder}`
                    }}>
                      {d.badgeText}
                    </span>
                  </div>

                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontFamily: "monospace", marginTop: "2px" }}>
                    {d.email}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", marginTop: "2px", lineHeight: 1.3 }}>
                    {d.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{
          position: "relative",
          textAlign: "center",
          margin: "18px 0",
          borderTop: "1px solid var(--border-card)"
        }}>
          <span style={{
            position: "relative",
            top: "-10px",
            background: "#ffffff",
            padding: "0 12px",
            fontSize: "0.72rem",
            color: "var(--text-dim)",
            fontWeight: "700",
            textTransform: "uppercase"
          }}>
            Or Enter Credentials Manually
          </span>
        </div>

        {errorMessage && (
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            padding: "12px 14px",
            borderRadius: "12px",
            fontSize: "0.85rem",
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group" style={{ marginBottom: "16px" }}>
            <label className="input-label" style={{ color: "var(--text-sub)", fontWeight: "600", fontSize: "0.82rem", marginBottom: "6px" }}>
              Email or Mobile Number
            </label>
            <div className="input-field-wrapper">
              <input
                type="text"
                className="input-control"
                placeholder="e.g. owner@distributorerp.com"
                value={emailOrMobile}
                onChange={(e) => setEmailOrMobile(e.target.value)}
                autoComplete="username"
                required
                style={{
                  background: "#f8fafc",
                  borderColor: "#e2e8f0",
                  color: "#0f172a",
                  height: "44px"
                }}
              />
              <Mail className="input-icon" size={18} color="#64748b" />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label className="input-label" style={{ marginBottom: 0, color: "var(--text-sub)", fontWeight: "600", fontSize: "0.82rem" }}>
                Password
              </label>
              <a 
                href="#forgot" 
                onClick={(e) => {
                  e.preventDefault();
                  alert("Demo password for all 4 accounts is: password123");
                }} 
                style={{ color: "var(--primary-600)", fontSize: "0.78rem", textDecoration: "none", fontWeight: "700" }}
              >
                Show Default Password
              </a>
            </div>
            <div className="input-field-wrapper">
              <input
                type="password"
                className="input-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                style={{
                  background: "#f8fafc",
                  borderColor: "#e2e8f0",
                  color: "#0f172a",
                  height: "44px"
                }}
              />
              <Lock className="input-icon" size={18} color="#64748b" />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ 
              width: "100%", 
              padding: "13px", 
              background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
              boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)",
              fontSize: "0.92rem",
              borderRadius: "12px"
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Authenticating Session...</span>
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Security Footer */}
        <div style={{
          marginTop: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          fontSize: "0.75rem",
          color: "var(--text-dim)",
          borderTop: "1px solid #f1f5f9",
          paddingTop: "14px"
        }}>
          <ShieldCheck size={16} color="#10b981" />
          <span>FMCG Distribution ERP • 4 Demo Roles Configured</span>
        </div>
      </div>
    </div>
  );
}
