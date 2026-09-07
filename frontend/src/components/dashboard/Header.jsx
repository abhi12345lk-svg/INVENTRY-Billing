import React from "react";
import { 
  Search, 
  Sun, 
  Moon, 
  LogOut, 
  ShieldCheck, 
  Building2, 
  Bell
} from "lucide-react";

export default function Header({ user, onLogout, theme, onToggleTheme, searchQuery, setSearchQuery }) {
  return (
    <header style={{
      background: "var(--header-bg)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border-card)",
      padding: "16px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 80
    }}>
      {/* Search Input & Company Branding */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px", flex: 1, maxWidth: "500px" }}>
        <div style={{ position: "relative", width: "100%" }}>
          <input
            type="text"
            className="input-control"
            placeholder="Search bills, outlets, salesmen, UTR, or cheques..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "42px", height: "42px", fontSize: "0.88rem" }}
          />
          <Search className="input-icon" size={18} style={{ left: "14px" }} />
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        
        {/* Company Tag */}
        <div style={{
          background: "var(--bg-input)",
          border: "1px solid var(--border-card)",
          borderRadius: "10px",
          padding: "6px 14px",
          fontSize: "0.8rem",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <Building2 size={16} color="var(--primary-400)" />
          <span>Company: <strong style={{ color: "var(--text-main)" }}>Chirag Combines FMCG</strong></span>
        </div>

        {/* Theme Switcher Button */}
        <button 
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title="Switch Light/Dark Theme"
        >
          {theme === "dark" ? (
            <>
              <Sun size={16} color="#f59e0b" />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon size={16} color="#6366f1" />
              <span>Dark</span>
            </>
          )}
        </button>

        {/* Owner User Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
              border: `2px solid ${user.badgeColor}`
            }}
          />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-main)" }}>
              {user.name}
            </div>
            <div style={{ fontSize: "0.75rem", color: user.badgeColor, fontWeight: "600" }}>
              {user.roleLabel}
            </div>
          </div>
        </div>

        {/* Switch Role / Logout Button */}
        <button
          onClick={onLogout}
          style={{
            background: "rgba(239, 68, 68, 0.12)",
            color: "#fca5a5",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            padding: "10px 16px",
            borderRadius: "12px",
            fontSize: "0.85rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease"
          }}
        >
          <LogOut size={16} />
          <span>Switch Role / Logout</span>
        </button>
      </div>
    </header>
  );
}
