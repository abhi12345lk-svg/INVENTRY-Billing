import React, { useState } from "react";
import { X, CheckCircle2, AlertCircle, AlertTriangle, RotateCcw } from "lucide-react";

export default function DeliveryStatusModal({ tripId, deliveryItem, token, onClose, onSuccess }) {
  const [status, setStatus] = useState("DELIVERED");
  const [remarks, setRemarks] = useState(
    deliveryItem?.remarks || "Delivered to shop owner in full quantity."
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:5005/api/delivery/trips/${tripId}/delivery/${deliveryItem.billId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            status,
            remarks: remarks.trim()
          })
        }
      );

      const json = await res.json();
      if (res.ok && json.success) {
        onSuccess(
          `Delivery for bill ${deliveryItem.billNumber} marked as ${status}!`,
          json.data
        );
        onClose();
      } else {
        setError(json.message || "Failed to update delivery status.");
      }
    } catch (err) {
      console.error("Delivery update error:", err);
      setError("Network error updating delivery item.");
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
      background: "rgba(0, 0, 0, 0.8)",
      backdropFilter: "blur(6px)",
      zIndex: 1200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px"
    }}>
      <div className="glass-card" style={{
        width: "100%",
        maxWidth: "480px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.7)"
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--table-header-bg)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "34px",
              height: "34px",
              borderRadius: "8px",
              background: "rgba(16, 185, 129, 0.15)",
              color: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>
                Update Delivery Status
              </h4>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                Invoice: <strong>{deliveryItem.billNumber}</strong> • {deliveryItem.customerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "4px"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {error && (
            <div style={{
              padding: "10px 14px",
              borderRadius: "8px",
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#f87171",
              fontSize: "0.82rem",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Customer Summary Box */}
          <div style={{
            padding: "12px 14px",
            borderRadius: "10px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            fontSize: "0.82rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ color: "var(--text-muted)" }}>Retail Outlet:</span>
              <strong style={{ color: "var(--text-main)" }}>{deliveryItem.customerName}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ color: "var(--text-muted)" }}>Invoice Total:</span>
              <strong style={{ color: "#34d399" }}>
                ₹{Number(deliveryItem.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </strong>
            </div>
            {deliveryItem.address && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Address:</span>
                <span style={{ color: "var(--text-main)", textAlign: "right", maxWidth: "250px" }}>{deliveryItem.address}</span>
              </div>
            )}
          </div>

          {/* Status Selection */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "var(--text-muted)", marginBottom: "8px" }}>
              Delivery Outcome *
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <button
                type="button"
                onClick={() => {
                  setStatus("DELIVERED");
                  setRemarks("Delivered to shop owner in full quantity.");
                }}
                style={{
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: `1px solid ${status === "DELIVERED" ? "#10b981" : "var(--border-color)"}`,
                  background: status === "DELIVERED" ? "rgba(16, 185, 129, 0.15)" : "var(--bg-secondary)",
                  color: status === "DELIVERED" ? "#10b981" : "var(--text-main)",
                  fontWeight: "700",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <CheckCircle2 size={16} />
                <span>Delivered</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatus("FAILED");
                  setRemarks("Outlet shop closed / owner unavailable.");
                }}
                style={{
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: `1px solid ${status === "FAILED" ? "#ef4444" : "var(--border-color)"}`,
                  background: status === "FAILED" ? "rgba(239, 68, 68, 0.15)" : "var(--bg-secondary)",
                  color: status === "FAILED" ? "#ef4444" : "var(--text-main)",
                  fontWeight: "700",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <AlertTriangle size={16} />
                <span>Delivery Failed</span>
              </button>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "var(--text-muted)", marginBottom: "6px" }}>
              Delivery Remarks / Signature Note
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Received by store keeper. Payment collected by UPI."
              rows={3}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-main)",
                fontSize: "0.85rem",
                outline: "none",
                resize: "none"
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: "8px 16px", fontSize: "0.82rem" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{
                padding: "8px 20px",
                fontSize: "0.82rem",
                background: status === "DELIVERED" ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
              }}
            >
              {submitting ? "Updating..." : `Confirm ${status}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
