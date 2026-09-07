import React, { useState } from "react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  Store, 
  Package, 
  Coins, 
  Wallet, 
  QrCode, 
  FileCheck2, 
  Boxes, 
  Truck, 
  RotateCcw, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  FileSpreadsheet, 
  History, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  Sparkles
} from "lucide-react";

export default function Sidebar({ activeTab, onTabSelect, exceptionCount = 6 }) {
  const [salesExpanded, setSalesExpanded] = useState(true);
  const [collectionsExpanded, setCollectionsExpanded] = useState(true);
  const [inventoryExpanded, setInventoryExpanded] = useState(false);
  const [receivablesExpanded, setReceivablesExpanded] = useState(false);

  const isTabActive = (tabId) => activeTab === tabId;

  return (
    <aside style={{
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
    }}>
      {/* Sidebar Header Brand */}
      <div style={{
        padding: "20px 24px",
        borderBottom: "1px solid var(--border-card)",
        display: "flex",
        alignItems: "center",
        gap: "12px"
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
          boxShadow: "0 6px 16px rgba(99, 102, 241, 0.35)"
        }}>
          ERP
        </div>
        <div>
          <div style={{ fontSize: "1.05rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
            DISTRIBUTOR ERP
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "600" }}>
            Owner Control Tower
          </div>
        </div>
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
          onClick={() => onTabSelect("overview")}
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
                { id: "sales-customers", label: "Customers" },
                { id: "sales-products", label: "Products" },
                { id: "sales-orders", label: "Orders" },
                { id: "sales-bills", label: "Bills & Invoices" },
                { id: "sales-routes", label: "Routes & Beats" },
                { id: "sales-areas", label: "Territory Areas" },
                { id: "sales-assignments", label: "Beat Assignments" },
                { id: "sales-salesmen", label: "Sales Force & DSR" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabSelect(item.id)}
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
                { id: "col-cash", label: "Cash Tally" },
                { id: "col-upi", label: "UPI & Suspense" },
                { id: "col-cheques", label: "Cheques Vault" },
                { id: "col-recon", label: "Reconciliation" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabSelect(item.id)}
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

        {/* Inventory Group */}
        <div>
          <button
            onClick={() => setInventoryExpanded(!inventoryExpanded)}
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
              <Boxes size={18} />
              <span>Inventory</span>
            </div>
            {inventoryExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {inventoryExpanded && (
            <div style={{ paddingLeft: "32px", display: "flex", flexDirection: "column", gap: "2px", marginTop: "2px" }}>
              {[
                { id: "inv-stock", label: "Current Stock" },
                { id: "inv-dispatch", label: "Dispatch Sheets" },
                { id: "inv-returns", label: "Returns & Damage" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabSelect(item.id)}
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

        {/* Delivery */}
        <button
          onClick={() => onTabSelect("delivery")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            padding: "10px 14px",
            borderRadius: "12px",
            border: "none",
            background: isTabActive("delivery") ? "var(--badge-brand-bg)" : "transparent",
            color: isTabActive("delivery") ? "var(--primary-400)" : "var(--text-muted)",
            fontWeight: isTabActive("delivery") ? "700" : "500",
            fontSize: "0.88rem",
            cursor: "pointer",
            textAlign: "left"
          }}
        >
          <Truck size={18} />
          <span>Delivery & Trips</span>
        </button>

        {/* Receivables Group */}
        <div>
          <button
            onClick={() => setReceivablesExpanded(!receivablesExpanded)}
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
              <Clock size={18} />
              <span>Receivables</span>
            </div>
            {receivablesExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {receivablesExpanded && (
            <div style={{ paddingLeft: "32px", display: "flex", flexDirection: "column", gap: "2px", marginTop: "2px" }}>
              {[
                { id: "rec-outstanding", label: "Total Outstanding" },
                { id: "rec-ageing", label: "Ageing Buckets" },
                { id: "rec-overdue", label: "Overdue 60+ Days" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabSelect(item.id)}
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
          onClick={() => onTabSelect("exceptions")}
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
          onClick={() => onTabSelect("approvals")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
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
          <ShieldCheck size={18} />
          <span>Approvals & Overrides</span>
        </button>

        {/* Reports */}
        <button
          onClick={() => onTabSelect("reports")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            padding: "10px 14px",
            borderRadius: "12px",
            border: "none",
            background: isTabActive("reports") ? "var(--badge-brand-bg)" : "transparent",
            color: isTabActive("reports") ? "var(--primary-400)" : "var(--text-muted)",
            fontWeight: isTabActive("reports") ? "700" : "500",
            fontSize: "0.88rem",
            cursor: "pointer",
            textAlign: "left"
          }}
        >
          <FileSpreadsheet size={18} />
          <span>Reports & Analytics</span>
        </button>

        {/* Audit & Activity */}
        <button
          onClick={() => onTabSelect("audit")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            padding: "10px 14px",
            borderRadius: "12px",
            border: "none",
            background: isTabActive("audit") ? "var(--badge-brand-bg)" : "transparent",
            color: isTabActive("audit") ? "var(--primary-400)" : "var(--text-muted)",
            fontWeight: isTabActive("audit") ? "700" : "500",
            fontSize: "0.88rem",
            cursor: "pointer",
            textAlign: "left"
          }}
        >
          <History size={18} />
          <span>Audit & Activity Log</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => onTabSelect("settings")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            padding: "10px 14px",
            borderRadius: "12px",
            border: "none",
            background: isTabActive("settings") ? "var(--badge-brand-bg)" : "transparent",
            color: isTabActive("settings") ? "var(--primary-400)" : "var(--text-muted)",
            fontWeight: isTabActive("settings") ? "700" : "500",
            fontSize: "0.88rem",
            cursor: "pointer",
            textAlign: "left"
          }}
        >
          <Settings size={18} />
          <span>System Settings</span>
        </button>

      </div>

      {/* Sidebar Footer */}
      <div style={{
        padding: "16px 20px",
        borderTop: "1px solid var(--border-card)",
        fontSize: "0.75rem",
        color: "var(--text-dim)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <span>Network Status</span>
        <span style={{ color: "#10b981", fontWeight: "700" }}>● 100% Online</span>
      </div>
    </aside>
  );
}
