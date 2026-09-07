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
  Layers,
  Search,
  Zap,
  ArrowUpRight,
  Store,
  LayoutDashboard,
  Sparkles
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
import OrderList from "./orders/OrderList";
import OrderDetails from "./orders/OrderDetails";
import BillList from "./billing/BillList";
import BillDetails from "./billing/BillDetails";
import PaymentList from "./payments/PaymentList";
import PaymentDetails from "./payments/PaymentDetails";
import UnmatchedQueue from "./payments/UnmatchedQueue";
import InventoryDashboard from "./inventory/InventoryDashboard";
import InventoryList from "./inventory/InventoryList";
import InventoryDetails from "./inventory/InventoryDetails";
import StockMovementHistory from "./inventory/StockMovementHistory";
import DeliveryDashboard from "./delivery/DeliveryDashboard";
import ReadyForDispatch from "./delivery/ReadyForDispatch";
import DeliveryTripList from "./delivery/DeliveryTripList";
import DeliveryTripDetails from "./delivery/DeliveryTripDetails";
import VehicleList from "./delivery/VehicleList";
import ExceptionDashboard from "./exceptions/ExceptionDashboard";
import ExceptionDetails from "./exceptions/ExceptionDetails";
import ApprovalDashboard from "./approvals/ApprovalDashboard";
import ApprovalDetails from "./approvals/ApprovalDetails";
import ExecutiveReports from "./reports/ExecutiveReports";
import { Package, FileText, Receipt, Boxes, Truck, FileSpreadsheet } from "lucide-react";

export default function RoleShellPreview({ user, onLogout, token }) {
  const [viewMode, setViewMode] = useState("overview"); // "overview", "customers", "products", "orders", or "bills"
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [statusTargetCustomer, setStatusTargetCustomer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Product state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [statusTargetProduct, setStatusTargetProduct] = useState(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Order & Billing & Payment state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Inventory state
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [inventorySubTab, setInventorySubTab] = useState("overview"); // "overview", "stock", "movements"

  // Delivery state
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [deliverySubTab, setDeliverySubTab] = useState("dashboard"); // "dashboard", "ready", "trips", "fleet"

  // Step 11: Exception & Approval state
  const [selectedException, setSelectedException] = useState(null);
  const [selectedApproval, setSelectedApproval] = useState(null);

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
        padding: "12px 28px",
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
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontWeight: "900",
            fontSize: "1.15rem",
            boxShadow: "0 8px 20px rgba(99, 102, 241, 0.4)"
          }}>
            ERP
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em", margin: 0 }}>
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
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
              {user.company} • Brands: Nestlé, Patanjali, GSK
            </p>
          </div>
        </div>

        {/* User Info & High-Visibility Red Logout Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src={user.avatar}
              alt={user.name}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                objectFit: "cover",
                border: `2px solid ${user.badgeColor}`
              }}
            />
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.88rem", fontWeight: "700", color: "var(--text-main)" }}>
                {user.name}
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                {user.email}
              </div>
            </div>
          </div>

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

      {/* Module Navigation Sub-Bar */}
      <nav style={{
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border-card)",
        padding: "8px 24px",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        overflowX: "auto",
        position: "sticky",
        top: "65px",
        zIndex: 90,
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        whiteSpace: "nowrap"
      }}>
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
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <LayoutDashboard size={14} />
          <span>Role Overview</span>
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
        <button
          onClick={() => { setViewMode("orders"); setSelectedOrder(null); }}
          style={{
            background: viewMode === "orders" ? "var(--badge-brand-bg)" : "transparent",
            color: viewMode === "orders" ? "var(--primary-400)" : "var(--text-muted)",
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
          <ShoppingBag size={14} />
          <span>Orders</span>
        </button>
        <button
          onClick={() => { setViewMode("bills"); setSelectedBill(null); }}
          style={{
            background: viewMode === "bills" ? "var(--badge-brand-bg)" : "transparent",
            color: viewMode === "bills" ? "var(--primary-400)" : "var(--text-muted)",
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
          <Receipt size={14} />
          <span>Bills & Invoices</span>
        </button>
        <button
          onClick={() => { setViewMode("payments"); setSelectedPayment(null); }}
          style={{
            background: viewMode === "payments" ? "var(--badge-brand-bg)" : "transparent",
            color: viewMode === "payments" ? "var(--primary-400)" : "var(--text-muted)",
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
          <Coins size={14} />
          <span>Collections & Recon</span>
        </button>
        <button
          onClick={() => { setViewMode("inventory"); setSelectedInventory(null); setInventorySubTab("overview"); }}
          style={{
            background: viewMode === "inventory" ? "var(--badge-brand-bg)" : "transparent",
            color: viewMode === "inventory" ? "var(--primary-400)" : "var(--text-muted)",
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
          <Boxes size={14} />
          <span>Inventory & Stock</span>
        </button>
        <button
          onClick={() => { setViewMode("delivery"); setSelectedTrip(null); setDeliverySubTab("dashboard"); }}
          style={{
            background: viewMode === "delivery" ? "var(--badge-brand-bg)" : "transparent",
            color: viewMode === "delivery" ? "var(--primary-400)" : "var(--text-muted)",
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
          <Truck size={14} />
          <span>Delivery & Trips</span>
        </button>
        <button
          onClick={() => { setViewMode("exceptions"); setSelectedException(null); }}
          style={{
            background: viewMode === "exceptions" ? "rgba(239, 68, 68, 0.15)" : "transparent",
            color: viewMode === "exceptions" ? "#ef4444" : "var(--text-muted)",
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
          <AlertTriangle size={14} color="#ef4444" />
          <span>Exceptions</span>
        </button>
        <button
          onClick={() => { setViewMode("approvals"); setSelectedApproval(null); }}
          style={{
            background: viewMode === "approvals" ? "var(--badge-brand-bg)" : "transparent",
            color: viewMode === "approvals" ? "var(--primary-400)" : "var(--text-muted)",
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
          <ShieldCheck size={14} />
          <span>Approvals</span>
        </button>
        <button
          onClick={() => { setViewMode("reports"); }}
          style={{
            background: viewMode === "reports" ? "var(--badge-brand-bg)" : "transparent",
            color: viewMode === "reports" ? "var(--primary-400)" : "var(--text-muted)",
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
          <FileSpreadsheet size={14} />
          <span>Reports</span>
        </button>
      </nav>

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
        ) : viewMode === "orders" ? (
          selectedOrder ? (
            <OrderDetails
              order={selectedOrder}
              orderId={selectedOrder.id || selectedOrder._id}
              token={token}
              user={user}
              userRole={user.role}
              onBack={() => setSelectedOrder(null)}
              onViewBill={(b) => {
                setSelectedBill(b);
                setViewMode("bills");
                showToast(`Viewing invoice ${b.billNumber}`);
              }}
            />
          ) : (
            <OrderList
              token={token}
              user={user}
              userRole={user.role}
              onSelectOrder={(ord) => setSelectedOrder(ord)}
              onViewBill={(b) => {
                setSelectedBill(b);
                setViewMode("bills");
                showToast(`Viewing invoice ${b.billNumber}`);
              }}
            />
          )
        ) : viewMode === "bills" ? (
          selectedBill ? (
            <BillDetails
              bill={selectedBill}
              token={token}
              user={user}
              onBack={() => setSelectedBill(null)}
              onBillUpdated={(updated) => {
                setSelectedBill(updated);
                showToast("Invoice updated successfully");
              }}
            />
          ) : (
            <BillList
              token={token}
              user={user}
              onSelectBill={(b) => setSelectedBill(b)}
              onOpenGenerate={() => {
                setViewMode("orders");
                showToast("Select a confirmed order to generate bill");
              }}
            />
          )
        ) : viewMode === "payments" ? (
          selectedPayment ? (
            <PaymentDetails
              payment={selectedPayment}
              token={token}
              user={user}
              onBack={() => setSelectedPayment(null)}
              onPaymentUpdated={(updated) => {
                setSelectedPayment(updated);
                showToast("Payment voucher updated");
              }}
              onNavigateToBills={() => {
                setViewMode("bills");
                showToast("Navigated to Invoices Master");
              }}
            />
          ) : (
            <PaymentList
              token={token}
              user={user}
              onSelectPayment={(p) => setSelectedPayment(p)}
            />
          )
        ) : viewMode === "inventory" ? (
          selectedInventory ? (
            <InventoryDetails
              inventoryId={selectedInventory.id || selectedInventory._id}
              initialInventory={selectedInventory}
              token={token}
              user={user}
              onBack={() => setSelectedInventory(null)}
              onInventoryUpdated={(up) => {
                setSelectedInventory(up);
                showToast("Stock level updated successfully");
              }}
            />
          ) : inventorySubTab === "stock" ? (
            <div>
              <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setInventorySubTab("overview")}
                  className="btn-secondary"
                  style={{ padding: "6px 14px", fontSize: "0.8rem", cursor: "pointer" }}
                >
                  ← Back to Inventory Overview
                </button>
              </div>
              <InventoryList
                token={token}
                user={user}
                onSelectInventory={(item) => setSelectedInventory(item)}
              />
            </div>
          ) : inventorySubTab === "movements" ? (
            <div>
              <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setInventorySubTab("overview")}
                  className="btn-secondary"
                  style={{ padding: "6px 14px", fontSize: "0.8rem", cursor: "pointer" }}
                >
                  ← Back to Inventory Overview
                </button>
              </div>
              <StockMovementHistory
                token={token}
                user={user}
              />
            </div>
          ) : (
            <InventoryDashboard
              token={token}
              user={user}
              onSelectProduct={(p) => setSelectedInventory(p)}
              onViewAllStock={() => setInventorySubTab("stock")}
              onViewMovements={() => setInventorySubTab("movements")}
            />
          )
        ) : viewMode === "delivery" ? (
          selectedTrip ? (
            <DeliveryTripDetails
              tripId={selectedTrip.id || selectedTrip._id}
              initialTrip={selectedTrip}
              token={token}
              user={user}
              onBack={() => setSelectedTrip(null)}
              onTripUpdated={(up) => {
                setSelectedTrip(up);
                showToast("Delivery trip updated");
              }}
            />
          ) : deliverySubTab === "ready" ? (
            <div>
              <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setDeliverySubTab("dashboard")}
                  className="btn-secondary"
                  style={{ padding: "6px 14px", fontSize: "0.8rem", cursor: "pointer" }}
                >
                  ← Back to Delivery Dashboard
                </button>
              </div>
              <ReadyForDispatch
                token={token}
                user={user}
                onCreateTripSuccess={() => {
                  setDeliverySubTab("trips");
                  showToast("Delivery trip dispatched successfully");
                }}
              />
            </div>
          ) : deliverySubTab === "trips" ? (
            <div>
              <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setDeliverySubTab("dashboard")}
                  className="btn-secondary"
                  style={{ padding: "6px 14px", fontSize: "0.8rem", cursor: "pointer" }}
                >
                  ← Back to Delivery Dashboard
                </button>
              </div>
              <DeliveryTripList
                token={token}
                user={user}
                onSelectTrip={(t) => setSelectedTrip(t)}
                onCreateTripClick={() => setDeliverySubTab("ready")}
              />
            </div>
          ) : deliverySubTab === "fleet" ? (
            <div>
              <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setDeliverySubTab("dashboard")}
                  className="btn-secondary"
                  style={{ padding: "6px 14px", fontSize: "0.8rem", cursor: "pointer" }}
                >
                  ← Back to Delivery Dashboard
                </button>
              </div>
              <VehicleList
                token={token}
                user={user}
              />
            </div>
          ) : (
            <DeliveryDashboard
              token={token}
              user={user}
              onSelectTrip={(t) => setSelectedTrip(t)}
              onViewReadyDispatch={() => setDeliverySubTab("ready")}
              onViewAllTrips={() => setDeliverySubTab("trips")}
              onViewFleet={() => setDeliverySubTab("fleet")}
            />
          )
        ) : viewMode === "exceptions" ? (
          selectedException ? (
            <ExceptionDetails
              exception={selectedException}
              token={token}
              user={user}
              onBack={() => setSelectedException(null)}
              onExceptionUpdated={(up) => {
                setSelectedException(up);
                showToast("Exception updated successfully");
              }}
            />
          ) : (
            <ExceptionDashboard
              token={token}
              user={user}
              onSelectException={(exc) => setSelectedException(exc)}
              onNavigateToApprovals={() => setViewMode("approvals")}
            />
          )
        ) : viewMode === "approvals" ? (
          selectedApproval ? (
            <ApprovalDetails
              approval={selectedApproval}
              token={token}
              user={user}
              onBack={() => setSelectedApproval(null)}
              onApprovalUpdated={(up) => {
                setSelectedApproval(up);
                showToast("Approval request updated");
              }}
            />
          ) : (
            <ApprovalDashboard
              token={token}
              user={user}
              onSelectApproval={(apr) => setSelectedApproval(apr)}
            />
          )
        ) : viewMode === "reports" ? (
          <ExecutiveReports
            token={token}
            user={user}
            onNavigateTab={(tab) => setViewMode(tab)}
          />
        ) : isSalesman ? (
          <SalesmanBeatDashboard user={user} token={token} onNavigate={(mode) => setViewMode(mode)} onLogout={onLogout} />
        ) : isSalesMgr ? (
          <SalesManagerPanel user={user} token={token} onLogout={onLogout} />
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
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
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

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
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
                      ● 20 Salesmen & 11 Vehicles Active
                    </div>
                  </div>

                  <button
                    onClick={onLogout}
                    className="btn-logout"
                    style={{ padding: "8px 18px" }}
                    title="Logout from Finance session"
                  >
                    <LogOut size={16} />
                    <span>Logout Session</span>
                  </button>
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

              <button 
                onClick={() => { setViewMode("inventory"); setSelectedInventory(null); setInventorySubTab("overview"); }} 
                className="btn-primary" 
                style={{ padding: "14px 24px", display: "inline-flex", alignItems: "center", gap: "10px", background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)" }}
              >
                <Boxes size={20} />
                <span>Open Inventory & Stock</span>
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
