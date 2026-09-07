import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Store, 
  UserCheck, 
  MapPin, 
  Route as RouteIcon, 
  Send, 
  XCircle, 
  Calendar, 
  Clock, 
  FileText,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Receipt
} from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderItemTable from "./OrderItemTable";
import OrderSummary from "./OrderSummary";
import CancelOrderModal from "./CancelOrderModal";

export default function OrderDetails({ 
  order, 
  orderId,
  token, 
  user, 
  userRole,
  onBack, 
  onOrderUpdated,
  onViewBill 
}) {
  const [currentOrder, setCurrentOrder] = useState(order);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  const activeRole = user?.role || userRole;
  const orderTargetId = currentOrder?.id || currentOrder?._id || orderId;

  const fetchOrderById = async (id) => {
    try {
      const res = await fetch(`http://localhost:5005/api/orders/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success && json.data) {
        setCurrentOrder(json.data);
      }
    } catch (err) {
      console.error("Failed to load order:", err);
    }
  };

  useEffect(() => {
    if (!currentOrder && orderId) {
      fetchOrderById(orderId);
    }
  }, [orderId]);

  const canSubmit = currentOrder?.status === "DRAFT";
  const canCancel = currentOrder?.status && currentOrder.status !== "CANCELLED";
  const canGenerateBill = (currentOrder?.status === "SUBMITTED" || currentOrder?.status === "CONFIRMED") && 
    ["SUPER_ADMIN", "ADMIN", "FINANCE", "SALES_MANAGER"].includes(activeRole);

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleRefreshOrder = async () => {
    if (!orderTargetId) return;
    try {
      const res = await fetch(`http://localhost:5005/api/orders/${orderTargetId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success && json.data) {
        setCurrentOrder(json.data);
        if (onOrderUpdated) onOrderUpdated(json.data);
      }
    } catch (err) {
      console.error("Refresh order error:", err);
    }
  };

  const handleGenerateBill = async () => {
    setLoadingAction(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:5005/api/bills/generate/${orderTargetId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const json = await response.json();

      if (response.ok && json.success) {
        showNotification(`Invoice ${json.data.billNumber} generated successfully.`);
        if (onViewBill) {
          onViewBill(json.data);
        } else {
          await handleRefreshOrder();
        }
      } else {
        setError(json.message || "Failed to generate bill.");
      }
    } catch (err) {
      console.error("Generate bill error:", err);
      setError("Unable to connect to Billing API.");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSubmitDraft = async () => {
    if (!window.confirm(`Are you sure you want to finalize and submit ${currentOrder?.orderNumber}?`)) {
      return;
    }

    setLoadingAction(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:5005/api/orders/${orderTargetId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const json = await response.json();

      if (response.ok && json.success) {
        showNotification(json.message);
        await handleRefreshOrder();
      } else {
        setError(json.message || "Failed to submit order.");
      }
    } catch (err) {
      console.error("Submit order error:", err);
      setError("Unable to connect to Order API.");
    } finally {
      setLoadingAction(false);
    }
  };

  if (!currentOrder) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
        Loading order details...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Top Action Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "transparent",
            border: "1px solid var(--border-color)",
            color: "var(--text-main)",
            padding: "8px 16px",
            borderRadius: "10px",
            fontSize: "0.85rem",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Orders</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {canGenerateBill && (
            <button
              onClick={handleGenerateBill}
              disabled={loadingAction}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#ffffff",
                border: "none",
                padding: "8px 18px",
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: "700",
                cursor: loadingAction ? "not-allowed" : "pointer",
                boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)"
              }}
            >
              <Receipt size={15} />
              <span>{loadingAction ? "Generating..." : "Generate Bill 🧾"}</span>
            </button>
          )}

          {canSubmit && (
            <button
              onClick={handleSubmitDraft}
              disabled={loadingAction}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "var(--primary-600)",
                color: "#ffffff",
                border: "none",
                padding: "8px 18px",
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: "700",
                cursor: loadingAction ? "not-allowed" : "pointer"
              }}
            >
              <Send size={15} />
              <span>{loadingAction ? "Submitting..." : "Submit Order"}</span>
            </button>
          )}

          {canCancel && (
            <button
              onClick={() => setShowCancelModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(239, 68, 68, 0.1)",
                color: "#f87171",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              <XCircle size={15} />
              <span>Cancel Order</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
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
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div style={{
          padding: "12px 18px",
          borderRadius: "10px",
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          color: "#f87171",
          fontSize: "0.875rem",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-card" style={{
        padding: "24px 28px",
        borderRadius: "16px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "20px"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--primary-400)", fontFamily: "monospace", margin: 0 }}>
              {currentOrder.orderNumber}
            </h2>
            <OrderStatusBadge status={currentOrder.status} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Calendar size={14} />
              <span>Booked: {new Date(currentOrder.orderDate || currentOrder.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span>
            </div>
            {currentOrder.submittedAt && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#34d399" }}>
                <Clock size={14} />
                <span>Submitted by: {currentOrder.submittedBy}</span>
              </div>
            )}
            {currentOrder.status === "CANCELLED" && (
              <div style={{ color: "#f87171" }}>
                Cancelled: "{currentOrder.cancellationReason}" by {currentOrder.cancelledBy}
              </div>
            )}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
            Grand Total
          </span>
          <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--text-main)", marginTop: "2px" }}>
            ₹{Number(currentOrder.pricingSummary?.grandTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Snapshotted Context Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        
        {/* Customer Snapshot */}
        <div className="glass-card" style={{
          padding: "18px 20px",
          borderRadius: "14px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--primary-400)" }}>
            <Store size={18} />
            <span style={{ fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase" }}>Customer Snapshot</span>
          </div>
          <div>
            <div style={{ fontWeight: "700", color: "var(--text-main)", fontSize: "1rem" }}>
              {currentOrder.customer?.shopName}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Code: {currentOrder.customer?.customerCode} • Owner: {currentOrder.customer?.ownerName}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
              Phone: {currentOrder.customer?.mobile}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "2px" }}>
              {currentOrder.customer?.address}
            </div>
          </div>
        </div>

        {/* Beat & Territory Snapshot */}
        <div className="glass-card" style={{
          padding: "18px 20px",
          borderRadius: "14px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--primary-400)" }}>
            <RouteIcon size={18} />
            <span style={{ fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase" }}>Delivery Beat & Area</span>
          </div>
          <div>
            <div style={{ fontWeight: "700", color: "var(--text-main)", fontSize: "0.95rem" }}>
              {currentOrder.route?.routeName || currentOrder.customer?.routeName || "Assigned Beat"}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
              <MapPin size={13} />
              <span>{currentOrder.area?.areaName || currentOrder.customer?.areaName || "Territory"}</span>
            </div>
          </div>
        </div>

        {/* Salesman Snapshot */}
        <div className="glass-card" style={{
          padding: "18px 20px",
          borderRadius: "14px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--primary-400)" }}>
            <UserCheck size={18} />
            <span style={{ fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase" }}>Sales Representative</span>
          </div>
          <div>
            <div style={{ fontWeight: "700", color: "var(--text-main)", fontSize: "0.95rem" }}>
              {currentOrder.salesman?.salesmanName}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Code: {currentOrder.salesman?.salesmanCode}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "4px" }}>
              Created By: {currentOrder.createdBy || "system"}
            </div>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="glass-card" style={{
        padding: "20px",
        borderRadius: "16px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        display: "flex",
        flexDirection: "column",
        gap: "14px"
      }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--text-main)", margin: 0 }}>
          Order Line Items ({currentOrder.items?.length || 0})
        </h3>
        <OrderItemTable items={currentOrder.items || []} editable={false} />
      </div>

      {/* Bottom Row: Notes & Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px" }}>
        {/* Notes & Audit History */}
        <div className="glass-card" style={{
          padding: "20px",
          borderRadius: "14px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          <div>
            <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-main)", margin: "0 0 6px 0" }}>
              Order Notes / Delivery Instructions
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0, fontStyle: currentOrder.notes ? "normal" : "italic" }}>
              {currentOrder.notes || "No special instructions provided."}
            </p>
          </div>

          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "14px" }}>
            <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-main)", margin: "0 0 10px 0" }}>
              Audit Trail
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {(currentOrder.auditLog || []).map((audit, idx) => (
                <div key={idx} style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
                  <span>● <strong>{audit.action}</strong> by {audit.actor}</span>
                  <span>{new Date(audit.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <OrderSummary pricingSummary={currentOrder.pricingSummary} />
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <CancelOrderModal
          token={token}
          order={currentOrder}
          onClose={() => setShowCancelModal(false)}
          onSuccess={(msg) => {
            showNotification(msg);
            handleRefreshOrder();
          }}
        />
      )}
    </div>
  );
}
