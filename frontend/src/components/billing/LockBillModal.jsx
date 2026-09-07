import React from "react";
import { Lock, X, AlertTriangle } from "lucide-react";

export default function LockBillModal({ bill, onClose, onConfirm, loading }) {
  if (!bill) return null;

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
              background: "rgba(16, 185, 129, 0.15)",
              color: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Lock size={20} />
            </div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>
              Lock Invoice
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
          Are you sure you want to permanently lock invoice <strong style={{ color: "var(--primary-400)", fontFamily: "monospace" }}>{bill.billNumber}</strong> for <strong>{bill.customer?.customerName}</strong>?
        </p>

        <div style={{
          padding: "12px 16px",
          background: "rgba(245, 158, 11, 0.1)",
          border: "1px solid rgba(245, 158, 11, 0.25)",
          borderRadius: "10px",
          color: "#f59e0b",
          fontSize: "0.82rem",
          display: "flex",
          gap: "10px",
          alignItems: "flex-start",
          marginBottom: "20px"
        }}>
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
          <span>
            <strong>Important Control:</strong> Once locked, product quantities, rates, and total amount (<strong>₹{Number(bill.totalAmount || 0).toLocaleString("en-IN")}</strong>) cannot be altered by salesmen or staff.
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
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
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: "9px 20px",
              borderRadius: "8px",
              border: "none",
              background: "#10b981",
              color: "#ffffff",
              fontSize: "0.85rem",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)"
            }}
          >
            <Lock size={15} />
            <span>{loading ? "Locking..." : "Lock Bill 🔒"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
