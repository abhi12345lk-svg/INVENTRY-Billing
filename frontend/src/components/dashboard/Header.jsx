import React from "react";
import { 
  Search, 
  LogOut, 
  ShieldCheck, 
  Building2, 
  Bell,
  Menu
} from "lucide-react";

export default function Header({ user, onLogout, searchQuery, setSearchQuery, onToggleSidebar }) {
  return (
    <header style={{
      background: "var(--header-bg)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border-card)",
      padding: "12px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      position: "sticky",
      top: 0,
      zIndex: 80
    }}>
      {/* Left Group: Mobile Menu Button & Search Input */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0, maxWidth: "560px" }}>
        
        {/* Mobile Hamburger Menu Toggle */}
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="mobile-nav-toggle-btn"
            aria-label="Toggle navigation menu"
            title="Toggle Menu"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Universal Search */}
        <div style={{ position: "relative", width: "100%" }}>
          <input
            type="text"
            className="input-control"
            placeholder="Search Outlets, Bills, Items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              paddingLeft: "38px", 
              paddingRight: "12px",
              height: "40px", 
              fontSize: "0.85rem",
              borderRadius: "10px"
            }}
          />
          <Search 
            className="input-icon" 
            size={16} 
            style={{ left: "12px", top: "50%", transform: "translateY(-50%)" }} 
          />
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
        
        {/* Company Tag (Hidden on mobile < 900px via CSS class) */}
        <div className="header-company-badge" style={{
          background: "var(--bg-input)",
          border: "1px solid var(--border-card)",
          borderRadius: "10px",
          padding: "6px 12px",
          fontSize: "0.78rem",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}>
          <Building2 size={15} color="var(--primary-400)" />
          <span><strong style={{ color: "var(--text-main)" }}>Chirag Combines</strong></span>
        </div>

        {/* Notifications Icon */}
        <button
          style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border-card)",
            color: "var(--text-muted)",
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            position: "relative",
            flexShrink: 0
          }}
          title="Notifications"
        >
          <Bell size={17} />
          <span style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "7px",
            height: "7px",
            background: "#ef4444",
            borderRadius: "50%"
          }}></span>
        </button>

        {/* User Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              objectFit: "cover",
              border: `2px solid ${user.badgeColor}`,
              flexShrink: 0
            }}
          />
          <div className="header-user-text" style={{ textAlign: "left" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)", lineHeight: 1.2 }}>
              {user.name.split(" ")[0]}
            </div>
            <div style={{ fontSize: "0.7rem", color: user.badgeColor, fontWeight: "600" }}>
              {user.roleLabel}
            </div>
          </div>
        </div>

        {/* Switch Role / Logout Button */}
        <button
          onClick={onLogout}
          className="btn-logout"
          title="Logout"
          style={{ padding: "7px 12px", fontSize: "0.8rem", borderRadius: "10px" }}
        >
          <LogOut size={15} />
          <span className="logout-btn-label">Logout</span>
        </button>
      </div>
    </header>
  );
}
