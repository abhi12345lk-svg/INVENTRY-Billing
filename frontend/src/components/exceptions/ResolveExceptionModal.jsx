import React, { useState } from "react";
import { X, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from "lucide-react";
import { ExceptionSeverityBadge, ExceptionStatusBadge } from "./ExceptionStatusBadge";

export default function ResolveExceptionModal({ exception, token, onClose, onSuccess }) {
  const [status, setStatus] = useState(exception.status === "OPEN" ? "UNDER_REVIEW" : "RESOLVED");
  const [resolutionNote, setResolutionNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (status === "RESOLVED" && !resolutionNote.trim()) {
      setError("A detailed resolution note is required when resolving an exception.");
      return;
    }

    setLoading(true);
    try {
      const excId = exception.id || exception._id;
      const res = await fetch(`http://localhost:5005/api/exceptions/${excId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          resolutionNote: resolutionNote.trim()
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        onSuccess(json.data);
        onClose();
      } else {
        setError(json.message || "Failed to update exception status");
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
          maxWidth: "540px",
          padding: "28px",
          borderRadius: "20px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-card)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--primary-400)", fontWeight: "800" }}>
                {exception.exceptionNumber}
              </span>
              <ExceptionSeverityBadge severity={exception.severity} />
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-main)" }}>
              Update Exception Status
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

        {/* Issue Overview */}
        <div
          style={{
            background: "var(--bg-input)",
            border: "1px solid var(--border-card)",
            borderRadius: "12px",
            padding: "14px",
            marginBottom: "20px"
          }}
        >
          <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
            {exception.title}
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: "1.4" }}>
            {exception.description}
          </p>
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
          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "var(--text-muted)", marginBottom: "8px" }}>
              Action / New Status
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setStatus("UNDER_REVIEW")}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  border: status === "UNDER_REVIEW" ? "2px solid var(--primary-400)" : "1px solid var(--border-card)",
                  background: status === "UNDER_REVIEW" ? "rgba(99, 102, 241, 0.15)" : "var(--bg-input)",
                  color: status === "UNDER_REVIEW" ? "var(--primary-400)" : "var(--text-muted)",
                  fontWeight: "700",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <Clock size={16} />
                <span>Under Review</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus("RESOLVED")}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  border: status === "RESOLVED" ? "2px solid #10b981" : "1px solid var(--border-card)",
                  background: status === "RESOLVED" ? "rgba(16, 185, 129, 0.15)" : "var(--bg-input)",
                  color: status === "RESOLVED" ? "#10b981" : "var(--text-muted)",
                  fontWeight: "700",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <CheckCircle2 size={16} />
                <span>Mark Resolved</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus("DISMISSED")}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  border: status === "DISMISSED" ? "2px solid #6b7280" : "1px solid var(--border-card)",
                  background: status === "DISMISSED" ? "rgba(107, 114, 128, 0.15)" : "var(--bg-input)",
                  color: status === "DISMISSED" ? "var(--text-main)" : "var(--text-muted)",
                  fontWeight: "700",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <X size={16} />
                <span>Dismiss</span>
              </button>
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "var(--text-muted)", marginBottom: "6px" }}>
              Resolution / Action Note {status === "RESOLVED" && <span style={{ color: "#ef4444" }}>*</span>}
            </label>
            <textarea
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder={
                status === "RESOLVED"
                  ? "Describe root cause, action taken, and how the issue was verified..."
                  : "Add notes regarding ongoing investigation..."
              }
              rows={4}
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
                background: status === "RESOLVED" ? "#10b981" : "var(--primary-400)"
              }}
            >
              {loading ? "Recording..." : status === "RESOLVED" ? "Confirm Resolution" : "Update Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
