import React from "react";
import { 
  Search, 
  LogOut, 
  ShieldCheck, 
  Building2, 
  Bell
} from "lucide-react";

export default function Header({ user, onLogout, searchQuery, setSearchQuery }) {
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
            placeholder="Universal Search (Ctrl + K) - Outlets, Bills, Products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "44px", height: "44px" }}
          />
          <Search 
            className="input-icon" 
            size={18} 
            style={{ left: "16px", top: "50%", transform: "translateY(-50%)" }} 
          />
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

        {/* Notifications Icon */}
        <button
          style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border-card)",
            color: "var(--text-muted)",
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            position: "relative"
          }}
          title="Notifications"
        >
          <Bell size={18} />
          <span style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "8px",
            height: "8px",
            background: "#ef4444",
            borderRadius: "50%"
          }}></span>
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
          className="btn-logout"
          title="Logout and switch account"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
