import React, { useState } from "react";
import { X, CheckCircle2, XCircle, ShieldAlert, AlertTriangle } from "lucide-react";
import { ApprovalTypeBadge } from "./ApprovalStatusBadge";

export default function ApprovalDecisionModal({ approval, action, token, onClose, onSuccess }) {
  const [decisionNote, setDecisionNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isApprove = action === "APPROVE";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!decisionNote.trim()) {
      setError("Please provide a decision note to record in the permanent audit trail.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const aprId = approval.id || approval._id;
      const endpoint = isApprove ? `/api/approvals/${aprId}/approve` : `/api/approvals/${aprId}/reject`;

      const res = await fetch(`http://localhost:5005${endpoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ decisionNote: decisionNote.trim() })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        onSuccess(json.data);
        onClose();
      } else {
        setError(json.message || "Failed to record approval decision");
      }
    } catch (err) {
      console.error(err);
      setError("Network error connecting to Express API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        padding: "20px"
      }}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "520px",
          padding: "28px",
          borderRadius: "20px",
          background: "var(--bg-card)",
          border: `1px solid ${isApprove ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)"}`,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--primary-400)", fontWeight: "800" }}>
                {approval.approvalNumber}
              </span>
              <ApprovalTypeBadge type={approval.approvalType} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: isApprove ? "#10b981" : "#ef4444" }}>
              {isApprove ? "Approve Request" : "Reject Request"}
            </h3>
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
            <X size={20} />
          </button>
        </div>

        {/* Request Subject Card */}
        <div
          style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border-card)",
            borderRadius: "12px",
            padding: "14px",
            marginBottom: "18px"
          }}
        >
          <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
            {approval.title}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Requested by: <strong style={{ color: "var(--text-main)" }}>{approval.requestedByName}</strong>
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Reason: <em>"{approval.reason}"</em>
          </div>
        </div>

        {/* Audit Warning Notice */}
        <div
          style={{
            background: isApprove ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
            border: `1px solid ${isApprove ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.25)"}`,
            color: isApprove ? "#10b981" : "#ef4444",
            padding: "12px 14px",
            borderRadius: "10px",
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "18px"
          }}
        >
          <ShieldAlert size={18} />
          <span>
            This decision will be permanently recorded in the immutable audit history under your Owner account.
          </span>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
              padding: "10px 14px",
              borderRadius: "10px",
              fontSize: "0.82rem",
              marginBottom: "16px"
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "var(--text-muted)", marginBottom: "6px" }}>
              Owner Decision Note <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              placeholder={
                isApprove
                  ? "State reason for approval (e.g. Verified customer unloading damage slip)..."
                  : "State reason for rejection (e.g. Original invoice pricing is accurate per contract)..."
              }
              rows={3}
              style={{
                width: "100%",
                background: "var(--bg-input)",
                border: "1px solid var(--border-card)",
                borderRadius: "10px",
                color: "var(--text-main)",
                padding: "10px 14px",
                fontSize: "0.85rem",
                fontFamily: "inherit",
                resize: "vertical"
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
              style={{ padding: "8px 18px", fontSize: "0.85rem", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                padding: "8px 22px",
                fontSize: "0.85rem",
                cursor: "pointer",
                background: isApprove ? "#10b981" : "#ef4444"
              }}
            >
              {loading ? "Recording..." : isApprove ? "Confirm Approval" : "Confirm Rejection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
