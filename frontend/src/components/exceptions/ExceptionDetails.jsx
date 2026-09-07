import React, { useState } from "react";
import { 
  ArrowLeft, 
  ShieldAlert, 
  Calendar, 
  User, 
  Store, 
  Coins, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  History,
  Tag
} from "lucide-react";
import { ExceptionSeverityBadge, ExceptionStatusBadge } from "./ExceptionStatusBadge";
import ResolveExceptionModal from "./ResolveExceptionModal";

export default function ExceptionDetails({ exception, token, user, onBack, onExceptionUpdated }) {
  const [currentException, setCurrentException] = useState(exception);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  const canResolve = user && (user.role === "SUPER_ADMIN" || user.role === "FINANCE" || user.role === "ADMIN");

  const handleUpdateSuccess = (updated) => {
    setCurrentException(updated);
    if (onExceptionUpdated) {
      onExceptionUpdated(updated);
    }
  };

  return (
    <div>
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <button
          onClick={onBack}
          className="btn-secondary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            fontSize: "0.85rem",
            cursor: "pointer"
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Exceptions</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {canResolve && currentException.status !== "RESOLVED" && (
            <button
              onClick={() => setIsResolveModalOpen(true)}
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 20px",
                fontSize: "0.85rem",
                cursor: "pointer",
                background: "#10b981"
              }}
            >
              <CheckCircle2 size={16} />
              <span>Update / Resolve Issue</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Title Card */}
      <div
        className="glass-card"
        style={{
          padding: "24px 32px",
          marginBottom: "24px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: "800", color: "var(--primary-400)" }}>
                {currentException.exceptionNumber}
              </span>
              <ExceptionSeverityBadge severity={currentException.severity} />
              <ExceptionStatusBadge status={currentException.status} />
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  background: "var(--bg-input)",
                  color: "var(--text-muted)",
                  fontWeight: "700"
                }}
              >
                Module: {currentException.module}
              </span>
            </div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "8px" }}>
              {currentException.title}
            </h1>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", maxWidth: "850px", lineHeight: "1.5" }}>
              {currentException.description}
            </p>
          </div>

          {currentException.amount > 0 && (
            <div
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-card)",
                borderRadius: "14px",
                padding: "14px 20px",
                textAlign: "right",
                minWidth: "160px"
              }}
            >
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
                Financial Exposure
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#ef4444" }}>
                ₹{currentException.amount.toLocaleString("en-IN")}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Context Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        {/* Detection & Timing */}
        <div className="glass-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: "700", textTransform: "uppercase", marginBottom: "14px" }}>
            <Clock size={16} />
            <span>Timeline Metrics</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Detected At:</span>
              <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-main)" }}>
                {new Date(currentException.detectedAt).toLocaleString("en-IN")}
              </div>
            </div>
            {currentException.resolvedAt && (
              <div>
                <span style={{ fontSize: "0.75rem", color: "#10b981" }}>Resolved At:</span>
                <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "#10b981" }}>
                  {new Date(currentException.resolvedAt).toLocaleString("en-IN")}
                </div>
              </div>
            )}
            {currentException.resolvedBy && (
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Resolved By:</span>
                <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-main)" }}>
                  {currentException.resolvedBy}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* References & Outlet */}
        <div className="glass-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: "700", textTransform: "uppercase", marginBottom: "14px" }}>
            <Tag size={16} />
            <span>Business Entities</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {currentException.referenceNumber && (
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Reference Code:</span>
                <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--primary-400)" }}>
                  {currentException.referenceType}: {currentException.referenceNumber}
                </div>
              </div>
            )}
            {currentException.customerName && (
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Retail Customer:</span>
                <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-main)" }}>
                  {currentException.customerName}
                </div>
              </div>
            )}
            {currentException.salesmanName && (
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Assigned Salesman:</span>
                <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-main)" }}>
                  {currentException.salesmanName}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resolution State */}
        <div className="glass-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: "700", textTransform: "uppercase", marginBottom: "14px" }}>
            <CheckCircle2 size={16} />
            <span>Resolution Status</span>
          </div>
          {currentException.resolutionNote ? (
            <div
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                borderRadius: "10px",
                padding: "12px",
                color: "var(--text-main)",
                fontSize: "0.85rem",
                lineHeight: "1.4"
              }}
            >
              <strong>Note:</strong> {currentException.resolutionNote}
            </div>
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic" }}>
              Pending investigation and resolution notes.
            </div>
          )}
        </div>
      </div>

      {/* Audit History Timeline */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
          <History size={18} color="var(--primary-400)" />
          <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)" }}>
            Audit History Trail
          </h3>
        </div>

        {currentException.auditHistory && currentException.auditHistory.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {currentException.auditHistory.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  padding: "12px 16px",
                  background: "var(--bg-input)",
                  borderRadius: "10px",
                  border: "1px solid var(--border-card)"
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background:
                      item.action === "EXCEPTION_RESOLVED"
                        ? "#10b981"
                        : item.action === "EXCEPTION_REVIEWED"
                        ? "var(--primary-400)"
                        : "#ef4444",
                    marginTop: "6px"
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--text-main)" }}>
                      {item.action}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {new Date(item.performedAt).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    <span style={{ color: "var(--primary-400)", fontWeight: "600" }}>{item.performedBy}</span>: {item.note}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            No audit events recorded yet.
          </div>
        )}
      </div>

      {isResolveModalOpen && (
        <ResolveExceptionModal
          exception={currentException}
          token={token}
          onClose={() => setIsResolveModalOpen(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}
