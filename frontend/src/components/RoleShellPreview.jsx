import React, { useState } from "react";
import { 
  Building2, 
  LogOut, 
  ShieldCheck, 
  TrendingUp, 
  Coins, 
  Users, 
  ShoppingBag, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  ChevronRight,
  Sparkles,
  Layers,
  Search,
  Zap,
  ArrowUpRight,
  Sun,
  Moon,
  Store
} from "lucide-react";
import CustomerList from "./customers/CustomerList";
import AddCustomerModal from "./customers/AddCustomerModal";
import EditCustomerModal from "./customers/EditCustomerModal";
import StatusChangeModal from "./customers/StatusChangeModal";
import CustomerDetails from "./customers/CustomerDetails";
import ProductList from "./products/ProductList";
import AddProductModal from "./products/AddProductModal";
import EditProductModal from "./products/EditProductModal";
import ProductDetails from "./products/ProductDetails";
import ProductStatusModal from "./products/ProductStatusModal";
import SalesmanBeatDashboard from "./salesman/SalesmanBeatDashboard";
import SalesManagerPanel from "./salesmanager/SalesManagerPanel";
import { Package } from "lucide-react";

export default function RoleShellPreview({ user, onLogout, theme, onToggleTheme, token }) {
  const [viewMode, setViewMode] = useState("overview"); // "overview", "customers", or "products"
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [statusTargetCustomer, setStatusTargetCustomer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Product state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [statusTargetProduct, setStatusTargetProduct] = useState(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState("");

  const isOwner = user.role === "SUPER_ADMIN";
  const isFinance = user.role === "FINANCE";
  const isSalesMgr = user.role === "SALES_MANAGER";
  const isSalesman = user.role === "SALESMAN";

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-dark)" }}>
      {/* Top Navbar */}
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
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontWeight: "900",
            fontSize: "1.2rem",
            boxShadow: "0 8px 20px rgba(99, 102, 241, 0.4)"
          }}>
            ERP
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
                DISTRIBUTOR ERP
              </h2>
              <span style={{
                background: user.badgeBg,
                color: user.badgeColor,
                padding: "3px 10px",
                borderRadius: "20px",
                fontSize: "0.75rem",
                fontWeight: "700",
                border: `1px solid ${user.badgeColor}40`
              }}>
                {user.roleLabel}
              </span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {user.company} • Brands: Nestlé, Patanjali, GSK
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          
          {/* Navigation Mode Switcher */}
          <div style={{ display: "flex", gap: "4px", background: "var(--bg-input)", padding: "4px", borderRadius: "12px", border: "1px solid var(--border-card)" }}>
            <button
              onClick={() => { setViewMode("overview"); setSelectedCustomer(null); }}
              style={{
                background: viewMode === "overview" ? "var(--badge-brand-bg)" : "transparent",
                color: viewMode === "overview" ? "var(--primary-400)" : "var(--text-muted)",
                border: "none",
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "0.82rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Role Overview
            </button>
            <button
              onClick={() => { setViewMode("customers"); setSelectedCustomer(null); }}
              style={{
                background: viewMode === "customers" ? "var(--badge-brand-bg)" : "transparent",
                color: viewMode === "customers" ? "var(--primary-400)" : "var(--text-muted)",
                border: "none",
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "0.82rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <Store size={14} />
              <span>Customer Master</span>
            </button>
            <button
              onClick={() => { setViewMode("products"); setSelectedProduct(null); }}
              style={{
                background: viewMode === "products" ? "var(--badge-brand-bg)" : "transparent",
                color: viewMode === "products" ? "var(--primary-400)" : "var(--text-muted)",
                border: "none",
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "0.82rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <Package size={14} />
              <span>Product Master</span>
            </button>
          </div>

          {/* Theme Switcher Button */}
          <button 
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title="Switch Theme"
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
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {user.email}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            style={{
              background: "rgba(239, 68, 68, 0.12)",
              color: "#fca5a5",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              padding: "10px 18px",
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

      {/* Toast Feedback */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          background: "#10b981",
          color: "#ffffff",
          padding: "12px 24px",
          borderRadius: "14px",
          fontWeight: "700",
          fontSize: "0.9rem",
          boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)",
          zIndex: 2000
        }}>
          ✓ {toastMessage}
        </div>
      )}

      {/* Content Area */}
      <div style={{ flex: 1, padding: "36px", maxWidth: "1340px", width: "100%", margin: "0 auto" }}>
        
        {viewMode === "customers" ? (
          selectedCustomer ? (
            <CustomerDetails 
              customer={selectedCustomer} 
              onBack={() => setSelectedCustomer(null)}
              onOpenEditModal={(c) => setEditingCustomer(c)}
              onOpenStatusModal={(c) => setStatusTargetCustomer(c)}
            />
          ) : (
            <CustomerList
              token={token}
              onSelectCustomer={(c) => setSelectedCustomer(c)}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenEditModal={(c) => setEditingCustomer(c)}
              onOpenStatusModal={(c) => setStatusTargetCustomer(c)}
            />
          )
        ) : viewMode === "products" ? (
          selectedProduct ? (
            <ProductDetails
              product={selectedProduct}
              userRole={user.role}
              onBack={() => setSelectedProduct(null)}
              onOpenEditModal={(p) => setEditingProduct(p)}
              onOpenStatusModal={(p) => setStatusTargetProduct(p)}
            />
          ) : (
            <ProductList
              token={token}
              userRole={user.role}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onOpenAddModal={() => setIsAddProductModalOpen(true)}
              onOpenEditModal={(p) => setEditingProduct(p)}
              onOpenStatusModal={(p) => setStatusTargetProduct(p)}
            />
          )
        ) : isSalesman ? (
          <SalesmanBeatDashboard user={user} token={token} onNavigate={(mode) => setViewMode(mode)} />
        ) : isSalesMgr ? (
          <SalesManagerPanel user={user} token={token} />
        ) : (
          <>
            {/* Welcome Banner */}
            <div className="glass-card" style={{
              padding: "28px 36px",
              marginBottom: "32px",
              position: "relative",
              overflow: "hidden",
              background: `linear-gradient(135deg, var(--bg-card) 0%, ${user.badgeColor}15 100%)`,
              border: `1px solid ${user.badgeColor}30`
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    color: user.badgeColor,
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    marginBottom: "8px"
                  }}>
                    <Sparkles size={16} />
                    AUTHENTICATED DEMO SESSION
                  </div>
                  <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "8px" }}>
                    Welcome back, {user.name}!
                  </h1>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "700px", lineHeight: "1.6" }}>
                    {user.description}
                  </p>
                </div>

                <div style={{
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "16px",
                  padding: "16px 24px",
                  textAlign: "right"
                }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-dim)", fontWeight: "600", textTransform: "uppercase" }}>
                    Active Outlet Network
                  </div>
                  <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--text-main)" }}>
                    4,000+ Outlets
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: "600", marginTop: "2px" }}>
                    ● {isSalesman ? "Scoped to Route A Outlets" : "20 Salesmen & 11 Vehicles Active"}
                  </div>
                </div>
              </div>
            </div>

            {/* Role Features & Quick Access to Masters */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
              <button 
                onClick={() => setViewMode("customers")} 
                className="btn-primary" 
                style={{ padding: "14px 24px", display: "inline-flex", alignItems: "center", gap: "10px" }}
              >
                <Store size={20} />
                <span>Open Customer / Outlet Master</span>
              </button>

              <button 
                onClick={() => setViewMode("products")} 
                className="btn-primary" 
                style={{ padding: "14px 24px", display: "inline-flex", alignItems: "center", gap: "10px", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
              >
                <Package size={20} />
                <span>Open Product Master</span>
              </button>
            </div>
          </>
        )}

      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddCustomerModal 
          token={token}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={(msg) => showToast(msg)}
        />
      )}

      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          token={token}
          onClose={() => setEditingCustomer(null)}
          onSuccess={(msg) => showToast(msg)}
        />
      )}

      {statusTargetCustomer && (
        <StatusChangeModal
          customer={statusTargetCustomer}
          token={token}
          onClose={() => setStatusTargetCustomer(null)}
          onSuccess={(msg) => showToast(msg)}
        />
      )}

      {/* Product Modals */}
      {isAddProductModalOpen && (
        <AddProductModal 
          token={token}
          onClose={() => setIsAddProductModalOpen(false)}
          onSuccess={(msg) => showToast(msg)}
        />
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          token={token}
          onClose={() => setEditingProduct(null)}
          onSuccess={(msg) => showToast(msg)}
        />
      )}

      {statusTargetProduct && (
        <ProductStatusModal
          product={statusTargetProduct}
          token={token}
          onClose={() => setStatusTargetProduct(null)}
          onSuccess={(msg) => showToast(msg)}
        />
      )}

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "24px",
        color: "var(--text-dim)",
        fontSize: "0.85rem",
        borderTop: "1px solid var(--border-card)",
        marginTop: "auto"
      }}>
        © Distributor Management System • Chirag Combines FMCG ERP
      </footer>
    </div>
  );
}
