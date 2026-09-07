import React, { useState } from "react";
import { X, ShieldAlert, AlertCircle, CheckCircle2 } from "lucide-react";

export default function StatusChangeModal({ customer, token, onClose, onSuccess }) {
  const [status, setStatus] = useState(customer.status || "ACTIVE");
  const [reason, setReason] = useState(customer.statusReason || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:5005/api/customers/${customer.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status, reason })
      });

      const json = await response.json();

      if (response.ok && json.success) {
        onSuccess(json.message);
        onClose();
      } else {
        setError(json.message || "Failed to update status.");
      }
    } catch (err) {
      console.error("Status change error:", err);
      setError("Unable to connect to server API.");
    } finally {
      setLoading(false);
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
      backdropFilter: "blur(8px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div className="glass-card" style={{
        width: "100%",
        maxWidth: "480px",
        padding: "28px",
        position: "relative"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShieldAlert size={22} color="#f59e0b" />
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-main)" }}>
              Change Status: {customer.customerCode}
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border-card)",
              color: "var(--text-muted)",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "16px" }}>
          Target Outlet: <strong style={{ color: "var(--text-main)" }}>{customer.shopName}</strong>
        </p>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#fca5a5",
            padding: "10px 14px",
            borderRadius: "10px",
            fontSize: "0.82rem",
            marginBottom: "16px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Select Target Status</label>
            <select
              className="input-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ paddingLeft: "16px" }}
            >
              <option value="ACTIVE">ACTIVE (Normal Billing Allowed)</option>
              <option value="BLOCKED">BLOCKED (Hard Credit/Overdue Block)</option>
              <option value="ON_HOLD">ON HOLD (Pending Approval Review)</option>
              <option value="INACTIVE">INACTIVE (Shop Closed/Suspended)</option>
            </select>
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Reason / Audit Remarks</label>
            <textarea
              className="input-control"
              placeholder="e.g. Overdue payment > 60 days, Cheque bounce"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              style={{ paddingLeft: "16px", resize: "none" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-card)",
                color: "var(--text-muted)",
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ padding: "8px 20px" }}
            >
              {loading ? "Updating Status..." : "Confirm Status Change"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
