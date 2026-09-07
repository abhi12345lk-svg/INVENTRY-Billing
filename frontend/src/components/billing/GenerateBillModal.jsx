import React, { useState, useEffect } from "react";
import { FilePlus, X, CheckCircle2, AlertCircle, ShoppingBag, Store, UserCheck } from "lucide-react";

export default function GenerateBillModal({
  order = null,
  token,
  user,
  onClose,
  onSuccess
}) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(order);
  const [loadingOrders, setLoadingOrders] = useState(!order);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (order) {
      setSelectedOrder(order);
      return;
    }

    const fetchConfirmedOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await fetch("http://localhost:5005/api/orders?status=SUBMITTED&limit=50", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success && json.data) {
          setOrders(json.data);
          if (json.data.length > 0) {
            setSelectedOrder(json.data[0]);
          }
        }
      } catch (err) {
        console.error("Fetch submitted orders error:", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchConfirmedOrders();
  }, [order, token]);

  const handleGenerate = async () => {
    if (!selectedOrder) {
      setError("Please select a submitted order to bill.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const orderId = selectedOrder.id || selectedOrder._id;
      const res = await fetch(`http://localhost:5005/api/bills/generate/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const json = await res.json();
      if (res.ok && json.success) {
        onSuccess(json.data, json.message);
        onClose();
      } else {
        setError(json.message || "Failed to generate bill.");
      }
    } catch (err) {
      console.error("Generate bill error:", err);
      setError("Unable to connect to Billing API.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(4px)",
      zIndex: 1100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px"
    }}>
      <div className="glass-card" style={{
        width: "100%",
        maxWidth: "520px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(99, 102, 241, 0.15)",
              color: "var(--primary-400)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <FilePlus size={20} />
            </div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>
              Convert Order to Invoice
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            padding: "10px 14px",
            borderRadius: "8px",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#f87171",
            fontSize: "0.82rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px"
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {!order && (
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-main)", display: "block", marginBottom: "6px" }}>
              Select Confirmed Order *
            </label>
            {loadingOrders ? (
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Loading submitted orders...</div>
            ) : orders.length === 0 ? (
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", padding: "12px", background: "var(--bg-secondary)", borderRadius: "8px" }}>
                No pending submitted orders found to bill.
              </div>
            ) : (
              <select
                value={selectedOrder?.id || selectedOrder?._id || ""}
                onChange={(e) => {
                  const ord = orders.find(o => (o.id || o._id) === e.target.value);
                  setSelectedOrder(ord);
                }}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-main)",
                  fontSize: "0.85rem",
                  outline: "none"
                }}
              >
                {orders.map(o => (
                  <option key={o.id || o._id} value={o.id || o._id}>
                    {o.orderNumber} — {o.customer?.shopName || o.customer?.customerName} (₹{Number(o.pricingSummary?.grandTotal || 0).toLocaleString("en-IN")})
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {selectedOrder && (
          <div style={{
            background: "var(--bg-secondary)",
            borderRadius: "12px",
            border: "1px solid var(--border-color)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            fontSize: "0.85rem",
            marginBottom: "20px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Order Reference</span>
              <strong style={{ fontFamily: "monospace", color: "var(--primary-400)" }}>{selectedOrder.orderNumber}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Customer Outlet</span>
              <strong style={{ color: "var(--text-main)" }}>{selectedOrder.customer?.shopName || selectedOrder.customer?.customerName}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Sales Representative</span>
              <span style={{ color: "var(--text-main)" }}>{selectedOrder.salesman?.salesmanName}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Order Lines</span>
              <span>{selectedOrder.pricingSummary?.totalItems || selectedOrder.items?.length || 0} Products</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-color)", paddingTop: "8px" }}>
              <span style={{ fontWeight: "700", color: "var(--text-main)" }}>Invoice Value</span>
              <strong style={{ fontSize: "1.1rem", color: "#10b981" }}>
                ₹{Number(selectedOrder.pricingSummary?.grandTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </strong>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            style={{
              padding: "9px 18px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
              color: "var(--text-main)",
              fontSize: "0.85rem",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={submitting || !selectedOrder}
            style={{
              padding: "9px 20px",
              borderRadius: "8px",
              border: "none",
              background: "var(--primary-600)",
              color: "#ffffff",
              fontSize: "0.85rem",
              fontWeight: "700",
              cursor: (submitting || !selectedOrder) ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)"
            }}
          >
            <FilePlus size={15} />
            <span>{submitting ? "Generating Bill..." : "Generate Bill"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
