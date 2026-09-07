import React, { useState } from "react";
import { 
  Users, 
  MapPin, 
  Route as RouteIcon, 
  ArrowRightLeft, 
  UserCheck, 
  Layers, 
  TrendingUp,
  Store,
  ShieldCheck,
  ShoppingCart,
  LogOut
} from "lucide-react";

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

export default function SalesManagerPanel({ user, token, onLogout }) {
  const [activeTab, setActiveTab] = useState("assignments"); // 'assignments' | 'salesmen' | 'routes' | 'areas'
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Modals state
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);

  const [showRouteModal, setShowRouteModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const [showSalesmanModal, setShowSalesmanModal] = useState(false);
  const [selectedSalesman, setSelectedSalesman] = useState(null);
  const [showRouteAssignModal, setShowRouteAssignModal] = useState(false);

  const [showAssignCustomerModal, setShowAssignCustomerModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Step 6: Orders state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);

  const showNotification = (msg) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(""), 4000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Sales Manager Control Header */}
      <div className="glass-card" style={{
        padding: "24px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.1) 100%)",
        border: "1px solid rgba(99, 102, 241, 0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "20px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "var(--primary-600)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 20px rgba(99, 102, 241, 0.4)"
          }}>
            <ShieldCheck size={30} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>
                {user.name} — Sales Operations Command
              </h2>
              <span style={{
                fontSize: "0.75rem",
                fontWeight: "700",
                background: "rgba(99, 102, 241, 0.15)",
                color: "var(--primary-300)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                padding: "3px 10px",
                borderRadius: "20px"
              }}>
                Sales Manager Panel
              </span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: "4px 0 0 0" }}>
              Comprehensive Territory, Beat, Field Sales Force & Customer Mapping Operations
            </p>
          </div>
        </div>

        {/* Tab Navigation Pill */}
        <div style={{
          display: "flex",
          background: "var(--bg-secondary)",
          padding: "4px",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
          gap: "4px",
          flexWrap: "wrap"
        }}>
          <button
            onClick={() => setActiveTab("assignments")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              fontSize: "0.85rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: activeTab === "assignments" ? "var(--primary-600)" : "transparent",
              color: activeTab === "assignments" ? "#ffffff" : "var(--text-muted)",
              transition: "all 0.15s ease"
            }}
          >
            <ArrowRightLeft size={15} />
            <span>Outlet Mapping</span>
          </button>

          <button
            onClick={() => setActiveTab("salesmen")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              fontSize: "0.85rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: activeTab === "salesmen" ? "var(--primary-600)" : "transparent",
              color: activeTab === "salesmen" ? "#ffffff" : "var(--text-muted)",
              transition: "all 0.15s ease"
            }}
          >
            <UserCheck size={15} />
            <span>Sales Force</span>
          </button>

          <button
            onClick={() => setActiveTab("routes")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              fontSize: "0.85rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: activeTab === "routes" ? "var(--primary-600)" : "transparent",
              color: activeTab === "routes" ? "#ffffff" : "var(--text-muted)",
              transition: "all 0.15s ease"
            }}
          >
            <RouteIcon size={15} />
            <span>Beats / Routes</span>
          </button>

          <button
            onClick={() => setActiveTab("areas")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              fontSize: "0.85rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: activeTab === "areas" ? "var(--primary-600)" : "transparent",
              color: activeTab === "areas" ? "#ffffff" : "var(--text-muted)",
              transition: "all 0.15s ease"
            }}
          >
            <MapPin size={15} />
            <span>Territories</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("orders");
              setSelectedOrder(null);
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              fontSize: "0.85rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: activeTab === "orders" ? "var(--primary-600)" : "transparent",
              color: activeTab === "orders" ? "#ffffff" : "var(--text-muted)",
              transition: "all 0.15s ease"
            }}
          >
            <ShoppingCart size={15} />
            <span>Sales Orders</span>
          </button>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="btn-logout"
            title="Logout from sales manager session"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        )}
      </div>

      {/* Success Notification */}
      {feedbackMessage && (
        <div style={{
          padding: "12px 18px",
          borderRadius: "10px",
          background: "rgba(16, 185, 129, 0.12)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          color: "#34d399",
          fontSize: "0.875rem",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Active Tab View */}
      {activeTab === "assignments" && (
        <CustomerAssignmentManager
          token={token}
          userRole="SALES_MANAGER"
          onOpenAssignModal={(cus) => {
            setSelectedCustomer(cus);
            setShowAssignCustomerModal(true);
          }}
          onOpenHistoryModal={(cus) => {
            setSelectedCustomer(cus);
            setShowHistoryModal(true);
          }}
        />
      )}

      {activeTab === "salesmen" && (
        <SalesmanList
          token={token}
          userRole="SALES_MANAGER"
          onOpenAddModal={() => {
            setSelectedSalesman(null);
            setShowSalesmanModal(true);
          }}
          onOpenEditModal={(sm) => {
            setSelectedSalesman(sm);
            setShowSalesmanModal(true);
          }}
          onOpenRouteAssignModal={(sm) => {
            setSelectedSalesman(sm);
            setShowRouteAssignModal(true);
          }}
          onToggleStatus={async (sm) => {
            const newStatus = sm.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
            try {
              const res = await fetch(`http://localhost:5005/api/salesmen/${sm.id}/status`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
              });
              const json = await res.json();
              if (json.success) {
                showNotification(json.message);
                setActiveTab("salesmen"); // trigger reload
              }
            } catch (err) {
              console.error(err);
            }
          }}
        />
      )}

      {activeTab === "routes" && (
        <RouteList
          token={token}
          userRole="SALES_MANAGER"
          onOpenAddModal={() => {
            setSelectedRoute(null);
            setShowRouteModal(true);
          }}
          onOpenEditModal={(rt) => {
            setSelectedRoute(rt);
            setShowRouteModal(true);
          }}
          onToggleStatus={async (rt) => {
            const newStatus = rt.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
            try {
              const res = await fetch(`http://localhost:5005/api/routes/${rt.id}/status`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
              });
              const json = await res.json();
              if (json.success) {
                showNotification(json.message);
                setActiveTab("routes");
              }
            } catch (err) {
              console.error(err);
            }
          }}
        />
      )}

      {activeTab === "areas" && (
        <AreaList
          token={token}
          userRole="SALES_MANAGER"
          onOpenAddModal={() => {
            setSelectedArea(null);
            setShowAreaModal(true);
          }}
          onOpenEditModal={(ar) => {
            setSelectedArea(ar);
            setShowAreaModal(true);
          }}
          onToggleStatus={async (ar) => {
            const newStatus = ar.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
            try {
              const res = await fetch(`http://localhost:5005/api/areas/${ar.id}/status`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
              });
              const json = await res.json();
              if (json.success) {
                showNotification(json.message);
                setActiveTab("areas");
              }
            } catch (err) {
              console.error(err);
            }
          }}
        />
      )}

      {activeTab === "orders" && (
        selectedOrder ? (
          <OrderDetails
            orderId={selectedOrder.id || selectedOrder._id}
            token={token}
            userRole="SALES_MANAGER"
            onBack={() => setSelectedOrder(null)}
            onStatusUpdated={() => {
              showNotification("Order status successfully updated");
            }}
          />
        ) : (
          <OrderList
            token={token}
            userRole="SALES_MANAGER"
            onSelectOrder={(ord) => setSelectedOrder(ord)}
            onOpenCreate={() => setShowCreateOrderModal(true)}
          />
        )
      )}

      {/* Modals */}
      {showAreaModal && (
        <AreaModal
          token={token}
          area={selectedArea}
          onClose={() => setShowAreaModal(false)}
          onSuccess={(msg) => {
            showNotification(msg);
            setActiveTab("areas");
          }}
        />
      )}

      {showRouteModal && (
        <RouteModal
          token={token}
          route={selectedRoute}
          onClose={() => setShowRouteModal(false)}
          onSuccess={(msg) => {
            showNotification(msg);
            setActiveTab("routes");
          }}
        />
      )}

      {showSalesmanModal && (
        <SalesmanModal
          token={token}
          salesman={selectedSalesman}
          onClose={() => setShowSalesmanModal(false)}
          onSuccess={(msg) => {
            showNotification(msg);
            setActiveTab("salesmen");
          }}
        />
      )}

      {showRouteAssignModal && selectedSalesman && (
        <SalesmanRouteAssignModal
          token={token}
          salesman={selectedSalesman}
          onClose={() => setShowRouteAssignModal(false)}
          onSuccess={(msg) => {
            showNotification(msg);
          }}
        />
      )}

      {showAssignCustomerModal && selectedCustomer && (
        <AssignCustomerModal
          token={token}
          customer={selectedCustomer}
          onClose={() => setShowAssignCustomerModal(false)}
          onSuccess={(msg) => {
            showNotification(msg);
          }}
        />
      )}

      {showHistoryModal && selectedCustomer && (
        <AssignmentHistoryModal
          token={token}
          customer={selectedCustomer}
          onClose={() => setShowHistoryModal(false)}
        />
      )}

      {/* Step 6: Create Order Modal */}
      {showCreateOrderModal && (
        <CreateOrder
          token={token}
          user={user}
          onClose={() => setShowCreateOrderModal(false)}
          onSuccess={(msg) => {
            showNotification(msg);
            setShowCreateOrderModal(false);
          }}
        />
      )}
    </div>
  );
}
