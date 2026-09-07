import React, { useState } from "react";
import { XCircle, X, AlertCircle } from "lucide-react";

export default function CancelBillModal({ bill, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!bill) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a cancellation justification reason.");
      return;
    }
    onConfirm(reason.trim());
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
        maxWidth: "480px",
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
              background: "rgba(239, 68, 68, 0.15)",
              color: "#f87171",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <XCircle size={20} />
            </div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>
              Cancel Invoice
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: "1.5", margin: "0 0 16px 0" }}>
          Are you sure you want to cancel invoice <strong style={{ color: "var(--primary-400)", fontFamily: "monospace" }}>{bill.billNumber}</strong> for <strong>{bill.customer?.customerName}</strong>?
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-main)", display: "block", marginBottom: "6px" }}>
              Cancellation Reason (Mandatory Audit Requirement) *
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Retailer refused delivery due to expired stock or billing amendment..."
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-main)",
                fontSize: "0.85rem",
                outline: "none",
                resize: "vertical"
              }}
            />
            {error && (
              <span style={{ fontSize: "0.75rem", color: "#f87171", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                <AlertCircle size={12} />
                {error}
              </span>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
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
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "9px 20px",
                borderRadius: "8px",
                border: "none",
                background: "#ef4444",
                color: "#ffffff",
                fontSize: "0.85rem",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 14px rgba(239, 68, 68, 0.35)"
              }}
            >
              <XCircle size={15} />
              <span>{loading ? "Cancelling..." : "Confirm Cancellation"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
