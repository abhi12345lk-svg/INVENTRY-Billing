import React, { useState } from "react";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Store, 
  Package, 
  Coins, 
  Wallet, 
  QrCode, 
  FileCheck2, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronDown, 
  ChevronRight,
  Sparkles,
  LogOut,
  X
} from "lucide-react";

export default function Sidebar({ 
  activeTab, 
  onTabSelect, 
  exceptionCount = 10, 
  approvalCount = 4, 
  onLogout,
  isOpen = false,
  onClose
}) {
  const [salesExpanded, setSalesExpanded] = useState(true);
  const [collectionsExpanded, setCollectionsExpanded] = useState(true);

  const isTabActive = (tabId) => activeTab === tabId;

  const handleTabClick = (tabId) => {
    onTabSelect(tabId);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside 
        className={`sidebar-responsive-aside ${isOpen ? "open" : ""}`}
        style={{
          width: "260px",
          minWidth: "260px",
          background: "var(--bg-card)",
          borderRight: "1px solid var(--border-card)",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "sticky",
          top: 0,
          zIndex: 90,
          userSelect: "none"
        }}
      >
        {/* Sidebar Header Brand */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border-card)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          position: "relative"
        }}>
          <div style={{
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontWeight: "900",
            fontSize: "1.1rem",
            boxShadow: "0 6px 16px rgba(99, 102, 241, 0.35)",
            flexShrink: 0
          }}>
            ERP
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "1.05rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              DISTRIBUTOR ERP
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "600" }}>
              Owner Control Tower
            </div>
          </div>

          {/* Close button for Mobile Drawer */}
          {onClose && (
            <button
              onClick={onClose}
              className="mobile-nav-toggle-btn"
              style={{
                width: "32px",
                height: "32px",
                padding: 0
              }}
              title="Close navigation"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "4px"
        }}>

          {/* Overview */}
          <button
            onClick={() => handleTabClick("overview")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              width: "100%",
              padding: "10px 14px",
              borderRadius: "12px",
              border: "none",
              background: isTabActive("overview") ? "var(--badge-brand-bg)" : "transparent",
              color: isTabActive("overview") ? "var(--primary-400)" : "var(--text-muted)",
              fontWeight: isTabActive("overview") ? "700" : "500",
              fontSize: "0.88rem",
              cursor: "pointer",
              textAlign: "left"
            }}
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </button>

          {/* Sales Group */}
          <div>
            <button
              onClick={() => setSalesExpanded(!salesExpanded)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "10px 14px",
                borderRadius: "12px",
                border: "none",
                background: "transparent",
                color: "var(--text-muted)",
                fontWeight: "600",
                fontSize: "0.88rem",
                cursor: "pointer"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <TrendingUp size={18} />
                <span>Sales</span>
              </div>
              {salesExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {salesExpanded && (
              <div style={{ paddingLeft: "32px", display: "flex", flexDirection: "column", gap: "2px", marginTop: "2px" }}>
                {[
                  { id: "sales-orders", label: "Sales Orders" },
                  { id: "sales-bills", label: "Invoices & Billing" },
                  { id: "sales-schemes", label: "Scheme Master" },
                  { id: "sales-customers", label: "Customers Master" },
                  { id: "sales-products", label: "Product Catalog" },
                  { id: "sales-areas", label: "Areas Master" },
                  { id: "sales-routes", label: "Routes Master" },
                  { id: "sales-salesmen", label: "Salesmen Master" },
                  { id: "sales-assignments", label: "Customer Assignments" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    style={{
                      padding: "7px 12px",
                      borderRadius: "8px",
                      border: "none",
                      background: isTabActive(item.id) ? "var(--badge-brand-bg)" : "transparent",
                      color: isTabActive(item.id) ? "var(--primary-400)" : "var(--text-dim)",
                      fontWeight: isTabActive(item.id) ? "600" : "400",
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Collections Group */}
          <div>
            <button
              onClick={() => setCollectionsExpanded(!collectionsExpanded)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "10px 14px",
                borderRadius: "12px",
                border: "none",
                background: "transparent",
                color: "var(--text-muted)",
                fontWeight: "600",
                fontSize: "0.88rem",
                cursor: "pointer"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Coins size={18} />
                <span>Collections</span>
              </div>
              {collectionsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {collectionsExpanded && (
              <div style={{ paddingLeft: "32px", display: "flex", flexDirection: "column", gap: "2px", marginTop: "2px" }}>
                {[
                  { id: "col-payments", label: "Payment Collections" },
                  { id: "col-unmatched", label: "UPI Suspense Queue" },
                  { id: "col-cash", label: "Cash Tally" },
                  { id: "col-upi", label: "UPI & Direct" },
                  { id: "col-cheques", label: "Cheques Vault" },
                  { id: "col-recon", label: "Reconciliation" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    style={{
                      padding: "7px 12px",
                      borderRadius: "8px",
                      border: "none",
                      background: isTabActive(item.id) ? "var(--badge-brand-bg)" : "transparent",
                      color: isTabActive(item.id) ? "var(--primary-400)" : "var(--text-dim)",
                      fontWeight: isTabActive(item.id) ? "600" : "400",
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Exceptions Control Center */}
          <button
            onClick={() => handleTabClick("exceptions")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "10px 14px",
              borderRadius: "12px",
              border: "none",
              background: isTabActive("exceptions") ? "rgba(239, 68, 68, 0.15)" : "transparent",
              color: isTabActive("exceptions") ? "#ef4444" : "var(--text-muted)",
              fontWeight: "700",
              fontSize: "0.88rem",
              cursor: "pointer",
              textAlign: "left"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <AlertTriangle size={18} color="#ef4444" />
              <span style={{ color: "#ef4444" }}>Exceptions</span>
            </div>
            {exceptionCount > 0 && (
              <span style={{
                background: "#ef4444",
                color: "#ffffff",
                fontSize: "0.72rem",
                fontWeight: "800",
                padding: "2px 7px",
                borderRadius: "10px"
              }}>
                {exceptionCount}
              </span>
            )}
          </button>

          {/* Approvals */}
          <button
            onClick={() => handleTabClick("approvals")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "10px 14px",
              borderRadius: "12px",
              border: "none",
              background: isTabActive("approvals") ? "var(--badge-brand-bg)" : "transparent",
              color: isTabActive("approvals") ? "var(--primary-400)" : "var(--text-muted)",
              fontWeight: isTabActive("approvals") ? "700" : "500",
              fontSize: "0.88rem",
              cursor: "pointer",
              textAlign: "left"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <ShieldCheck size={18} />
              <span>Approvals Queue</span>
            </div>
            {approvalCount > 0 && (
              <span style={{
                background: "var(--primary-400)",
                color: "#ffffff",
                fontSize: "0.72rem",
                fontWeight: "800",
                padding: "2px 7px",
                borderRadius: "10px"
              }}>
                {approvalCount}
              </span>
            )}
          </button>



        </div>

        {/* Sidebar Footer */}
        <div style={{
          padding: "14px 16px",
          borderTop: "1px solid var(--border-card)",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          {onLogout && (
            <button
              onClick={onLogout}
              className="btn-logout"
              style={{ width: "100%", justifyContent: "center", padding: "9px 14px" }}
              title="Logout from system"
            >
              <LogOut size={16} />
              <span>Logout System</span>
            </button>
          )}
          <div style={{
            fontSize: "0.75rem",
            color: "var(--text-dim)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <span>Network Status</span>
            <span style={{ color: "#10b981", fontWeight: "700" }}>● 100% Online</span>
          </div>
        </div>
      </aside>
    </>
  );
}
