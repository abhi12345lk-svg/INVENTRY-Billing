import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import KpiGrid from "./KpiGrid";
import SalesChart from "./SalesChart";
import CollectionSummary from "./CollectionSummary";
import ReceivableAgeing from "./ReceivableAgeing";
import ExceptionPanel from "./ExceptionPanel";
import RecentActivity from "./RecentActivity";
import CustomerList from "../customers/CustomerList";
import AddCustomerModal from "../customers/AddCustomerModal";
import EditCustomerModal from "../customers/EditCustomerModal";
import StatusChangeModal from "../customers/StatusChangeModal";
import CustomerDetails from "../customers/CustomerDetails";
import ProductList from "../products/ProductList";
import AddProductModal from "../products/AddProductModal";
import EditProductModal from "../products/EditProductModal";
import ProductDetails from "../products/ProductDetails";
import ProductStatusModal from "../products/ProductStatusModal";
import AreaList from "../areas/AreaList";
import AreaModal from "../areas/AreaModal";
import RouteList from "../routes/RouteList";
import RouteModal from "../routes/RouteModal";
import SalesmanList from "../salesmen/SalesmanList";
import SalesmanModal from "../salesmen/SalesmanModal";
import SalesmanRouteAssignModal from "../salesmen/SalesmanRouteAssignModal";
import CustomerAssignmentManager from "../assignments/CustomerAssignmentManager";
import AssignCustomerModal from "../assignments/AssignCustomerModal";
import AssignmentHistoryModal from "../assignments/AssignmentHistoryModal";
import OrderList from "../orders/OrderList";
import OrderDetails from "../orders/OrderDetails";
import CreateOrder from "../orders/CreateOrder";
import { AlertCircle, RefreshCw, Sparkles, Layers } from "lucide-react";

export default function OwnerDashboard({ user, onLogout, theme, onToggleTheme, token }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals & Customer details state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [statusTargetCustomer, setStatusTargetCustomer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Modals & Product details state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [statusTargetProduct, setStatusTargetProduct] = useState(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Step 5: Area Modals
  const [isAddAreaModalOpen, setIsAddAreaModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState(null);

  // Step 5: Route Modals
  const [isAddRouteModalOpen, setIsAddRouteModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);

  // Step 5: Salesman Modals
  const [isAddSalesmanModalOpen, setIsAddSalesmanModalOpen] = useState(false);
  const [editingSalesman, setEditingSalesman] = useState(null);
  const [routeAssignSalesman, setRouteAssignSalesman] = useState(null);

  // Step 5: Assignment Modals
  const [assigningCustomer, setAssigningCustomer] = useState(null);
  const [historyCustomer, setHistoryCustomer] = useState(null);

  // Step 6: Orders state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState("");

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5005/api/dashboard/owner", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setDashboardData(json.data);
      } else {
        setError(json.message || "Failed to load Owner Dashboard data.");
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Unable to connect to Express backend API server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-dark)" }}>
      {/* Unified Owner Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onTabSelect={(tab) => {
          setActiveTab(tab);
          setSelectedCustomer(null);
          setSelectedOrder(null);
        }} 
        exceptionCount={dashboardData?.exceptions?.length || 6}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        
        {/* Owner Header */}
        <Header 
          user={user} 
          onLogout={onLogout} 
          theme={theme} 
          onToggleTheme={onToggleTheme}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Toast Feedback Banner */}
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

        {/* Dashboard Body */}
        <main style={{ flex: 1, padding: "32px", maxWidth: "1400px", width: "100%", margin: "0 auto" }}>
          
          {/* CUSTOMER MASTER VIEW */}
          {activeTab === "sales-customers" ? (
            selectedCustomer ? (
              <CustomerDetails 
                customer={selectedCustomer} 
                token={token}
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
          ) : activeTab === "sales-products" ? (
            /* PRODUCT MASTER VIEW */
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
          ) : activeTab === "sales-areas" ? (
            /* AREA MASTER VIEW */
            <AreaList
              token={token}
              userRole={user.role}
              onOpenAddModal={() => {
                setEditingArea(null);
                setIsAddAreaModalOpen(true);
              }}
              onOpenEditModal={(ar) => {
                setEditingArea(ar);
                setIsAddAreaModalOpen(true);
              }}
              onToggleStatus={async (ar) => {
                const newStatus = ar.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
                try {
                  const res = await fetch(`http://localhost:5005/api/areas/${ar.id}/status`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify({ status: newStatus })
                  });
                  const json = await res.json();
                  if (json.success) showToast(json.message);
                } catch (e) { console.error(e); }
              }}
            />
          ) : activeTab === "sales-routes" ? (
            /* ROUTE / BEAT MASTER VIEW */
            <RouteList
              token={token}
              userRole={user.role}
              onOpenAddModal={() => {
                setEditingRoute(null);
                setIsAddRouteModalOpen(true);
              }}
              onOpenEditModal={(rt) => {
                setEditingRoute(rt);
                setIsAddRouteModalOpen(true);
              }}
              onToggleStatus={async (rt) => {
                const newStatus = rt.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
                try {
                  const res = await fetch(`http://localhost:5005/api/routes/${rt.id}/status`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify({ status: newStatus })
                  });
                  const json = await res.json();
                  if (json.success) showToast(json.message);
                } catch (e) { console.error(e); }
              }}
            />
          ) : activeTab === "sales-salesmen" ? (
            /* SALESMAN & DSR MASTER VIEW */
            <SalesmanList
              token={token}
              userRole={user.role}
              onOpenAddModal={() => {
                setEditingSalesman(null);
                setIsAddSalesmanModalOpen(true);
              }}
              onOpenEditModal={(sm) => {
                setEditingSalesman(sm);
                setIsAddSalesmanModalOpen(true);
              }}
              onOpenRouteAssignModal={(sm) => {
                setRouteAssignSalesman(sm);
              }}
              onToggleStatus={async (sm) => {
                const newStatus = sm.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
                try {
                  const res = await fetch(`http://localhost:5005/api/salesmen/${sm.id}/status`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify({ status: newStatus })
                  });
                  const json = await res.json();
                  if (json.success) showToast(json.message);
                } catch (e) { console.error(e); }
              }}
            />
          ) : activeTab === "sales-assignments" ? (
            /* CUSTOMER BEAT & SALESMAN ASSIGNMENT VIEW */
            <CustomerAssignmentManager
              token={token}
              userRole={user.role}
              onOpenAssignModal={(cus) => setAssigningCustomer(cus)}
              onOpenHistoryModal={(cus) => setHistoryCustomer(cus)}
            />
          ) : activeTab === "sales-orders" ? (
            /* SALES ORDERS MANAGEMENT VIEW */
            selectedOrder ? (
              <OrderDetails
                orderId={selectedOrder.id || selectedOrder._id}
                token={token}
                userRole={user.role}
                onBack={() => setSelectedOrder(null)}
                onStatusUpdated={() => {
                  showToast("Order status successfully updated");
                }}
              />
            ) : (
              <OrderList
                token={token}
                userRole={user.role}
                onSelectOrder={(ord) => setSelectedOrder(ord)}
                onOpenCreate={() => setIsCreateOrderOpen(true)}
              />
            )
          ) : (
            /* OVERVIEW / DASHBOARD VIEW */
            <>
              {loading && (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "100px 20px"
                }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    border: "4px solid rgba(99, 102, 241, 0.2)",
                    borderTopColor: "var(--primary-400)",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    marginBottom: "20px"
                  }} />
                  <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                    Connecting to MongoDB Atlas & Loading Owner Command Center...
                  </p>
                  <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
              )}

              {!loading && error && (
                <div className="glass-card" style={{
                  padding: "40px",
                  textAlign: "center",
                  maxWidth: "600px",
                  margin: "60px auto",
                  border: "1px solid rgba(239, 68, 68, 0.3)"
                }}>
                  <AlertCircle size={48} color="#ef4444" style={{ marginBottom: "16px" }} />
                  <h3 style={{ fontSize: "1.3rem", color: "#fca5a5", marginBottom: "8px" }}>
                    Authentication / Authorization Error
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "24px" }}>
                    {error}
                  </p>
                  <button className="btn-primary" onClick={fetchDashboardData}>
                    <RefreshCw size={16} />
                    <span>Retry Connection</span>
                  </button>
                </div>
              )}

              {!loading && !error && dashboardData && (
                <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                  
                  {/* Top Welcome & Network Overview Banner */}
                  <div className="glass-card" style={{
                    padding: "24px 32px",
                    background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(99, 102, 241, 0.1) 100%)",
                    border: "1px solid rgba(99, 102, 241, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <div>
                      <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "var(--primary-400)",
                        fontSize: "0.82rem",
                        fontWeight: "700",
                        marginBottom: "6px"
                      }}>
                        <Sparkles size={16} />
                        EXECUTIVE CONTROL TOWER
                      </div>
                      <h1 style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "4px" }}>
                        Owner Command Center
                      </h1>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                        Real-time operational & financial control center for <strong style={{ color: "var(--text-main)" }}>Chirag Combines FMCG</strong>
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "16px" }}>
                      <div style={{
                        background: "var(--bg-input)",
                        border: "1px solid var(--border-card)",
                        borderRadius: "14px",
                        padding: "12px 20px",
                        textAlign: "center"
                      }}>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: "700" }}>Outlets</div>
                        <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-main)" }}>{dashboardData.network.totalOutlets}</div>
                      </div>

                      <div style={{
                        background: "var(--bg-input)",
                        border: "1px solid var(--border-card)",
                        borderRadius: "14px",
                        padding: "12px 20px",
                        textAlign: "center"
                      }}>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: "700" }}>Salesmen</div>
                        <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--primary-400)" }}>{dashboardData.network.activeSalesmen}</div>
                      </div>

                      <div style={{
                        background: "var(--bg-input)",
                        border: "1px solid var(--border-card)",
                        borderRadius: "14px",
                        padding: "12px 20px",
                        textAlign: "center"
                      }}>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: "700" }}>Vehicles</div>
                        <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "#10b981" }}>{dashboardData.network.deliveryVehicles}</div>
                      </div>
                    </div>
                  </div>

                  {/* 6 Core KPI Grid Cards */}
                  <KpiGrid summary={dashboardData.summary} />

                  {/* Actionable Exception Control Center */}
                  <ExceptionPanel 
                    exceptions={dashboardData.exceptions} 
                    onSelectException={(exc) => {
                      console.log("Selected exception:", exc);
                    }}
                  />

                  {/* Sales Chart & Collection Breakdown Grid */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1.4fr 1fr",
                    gap: "24px"
                  }}>
                    <SalesChart salesData={dashboardData.sales} />
                    <CollectionSummary collections={dashboardData.collections} />
                  </div>

                  {/* Receivable Ageing & Recent Activity Feed Grid */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1.3fr 1fr",
                    gap: "24px"
                  }}>
                    <ReceivableAgeing receivables={dashboardData.receivables} />
                    <RecentActivity activityList={dashboardData.recentActivity} />
                  </div>

                </div>
              )}
            </>
          )}

        </main>
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

      {/* Step 5: Area Modals */}
      {(isAddAreaModalOpen || editingArea) && (
        <AreaModal
          token={token}
          area={editingArea}
          onClose={() => {
            setIsAddAreaModalOpen(false);
            setEditingArea(null);
          }}
          onSuccess={(msg) => showToast(msg)}
        />
      )}

      {/* Step 5: Route Modals */}
      {(isAddRouteModalOpen || editingRoute) && (
        <RouteModal
          token={token}
          route={editingRoute}
          onClose={() => {
            setIsAddRouteModalOpen(false);
            setEditingRoute(null);
          }}
          onSuccess={(msg) => showToast(msg)}
        />
      )}

      {/* Step 5: Salesman Modals */}
      {(isAddSalesmanModalOpen || editingSalesman) && (
        <SalesmanModal
          token={token}
          salesman={editingSalesman}
          onClose={() => {
            setIsAddSalesmanModalOpen(false);
            setEditingSalesman(null);
          }}
          onSuccess={(msg) => showToast(msg)}
        />
      )}

      {routeAssignSalesman && (
        <SalesmanRouteAssignModal
          token={token}
          salesman={routeAssignSalesman}
          onClose={() => setRouteAssignSalesman(null)}
          onSuccess={(msg) => showToast(msg)}
        />
      )}

      {/* Step 5: Customer Assignment Modals */}
      {assigningCustomer && (
        <AssignCustomerModal
          token={token}
          customer={assigningCustomer}
          onClose={() => setAssigningCustomer(null)}
          onSuccess={(msg) => showToast(msg)}
        />
      )}

      {historyCustomer && (
        <AssignmentHistoryModal
          token={token}
          customer={historyCustomer}
          onClose={() => setHistoryCustomer(null)}
        />
      )}

      {/* Step 6: Create Order Modal */}
      {isCreateOrderOpen && (
        <CreateOrder
          token={token}
          user={user}
          onClose={() => setIsCreateOrderOpen(false)}
          onSuccess={(msg) => {
            showToast(msg);
            setIsCreateOrderOpen(false);
          }}
        />
      )}

    </div>
  );
}
