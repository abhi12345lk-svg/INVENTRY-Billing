// frontend/src/components/reports/ExceptionSummaryReport.jsx
import React from "react";
import { AlertTriangle, ShieldAlert, ArrowRight, DollarSign, QrCode, Wallet, Clock, FileEdit, Boxes } from "lucide-react";

export default function ExceptionSummaryReport({ data, onNavigateExceptions }) {
  if (!data) return null;

  const {
    criticalCount = 0,
    highCount = 0,
    warningCount = 0,
    totalCount = 0,
    exceptionCategories = []
  } = data;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const getCategoryIcon = (type) => {
    switch (type) {
      case "CASH_MISMATCH":
        return DollarSign;
      case "UNMATCHED_PAYMENT":
        return QrCode;
      case "CHEQUE_UNSUBMITTED":
        return Wallet;
      case "CREDIT_OVERDUE":
        return Clock;
      case "BILL_AMENDMENT":
        return FileEdit;
      case "STOCKOUT_ALERT":
        return Boxes;
      default:
        return AlertTriangle;
    }
  };

  const getSeverityStyle = (sev) => {
    switch (sev) {
      case "CRITICAL":
        return { border: "#ef4444", bg: "rgba(239, 68, 68, 0.12)", text: "#ef4444" };
      case "HIGH":
        return { border: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)", text: "#f59e0b" };
      default:
        return { border: "#eab308", bg: "rgba(234, 179, 8, 0.12)", text: "#eab308" };
    }
  };

  return (
    <div className="glass-card" style={{ padding: "24px", borderRadius: "18px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <AlertTriangle size={20} color="#ef4444" />
            <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>
              Exception Summary & Risk Exposure
            </h3>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
            Surveillance issues surfaced by Step 11 Exception Control Center
          </p>
        </div>

        {/* Severity Count Chips */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            background: "rgba(239, 68, 68, 0.15)",
            color: "#ef4444",
            padding: "5px 12px",
            borderRadius: "8px",
            fontSize: "0.78rem",
            fontWeight: "800"
          }}>
            CRITICAL: {criticalCount}
          </div>
          <div style={{
            background: "rgba(245, 158, 11, 0.15)",
            color: "#f59e0b",
            padding: "5px 12px",
            borderRadius: "8px",
            fontSize: "0.78rem",
            fontWeight: "800"
          }}>
            HIGH: {highCount}
          </div>
          <div style={{
            background: "rgba(234, 179, 8, 0.15)",
            color: "#eab308",
            padding: "5px 12px",
            borderRadius: "8px",
            fontSize: "0.78rem",
            fontWeight: "800"
          }}>
            WARNING: {warningCount}
          </div>
        </div>
      </div>

      {/* 6 Category Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
        {exceptionCategories.map((cat) => {
          const Icon = getCategoryIcon(cat.type);
          const sevStyle = getSeverityStyle(cat.severity);

          return (
            <div
              key={cat.id}
              style={{
                background: "var(--bg-input)",
                border: `1px solid var(--border-card)`,
                borderLeft: `4px solid ${sevStyle.border}`,
                borderRadius: "14px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "12px"
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: sevStyle.bg,
                      color: sevStyle.text,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <Icon size={16} />
                    </div>
                    <span style={{ fontSize: "0.88rem", fontWeight: "700", color: "var(--text-main)" }}>
                      {cat.name}
                    </span>
                  </div>

                  <span style={{
                    background: sevStyle.bg,
                    color: sevStyle.text,
                    padding: "2px 8px",
                    borderRadius: "6px",
                    fontSize: "0.72rem",
                    fontWeight: "800"
                  }}>
                    {cat.severity}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "1.2rem", fontWeight: "900", color: "var(--text-main)" }}>
                    {formatCurrency(cat.amount)}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>
                    ({cat.count} {cat.count === 1 ? "case" : "cases"})
                  </span>
                </div>

                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.4 }}>
                  {cat.description}
                </p>
              </div>

              <button
                onClick={onNavigateExceptions}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: `1px solid ${sevStyle.border}40`,
                  background: sevStyle.bg,
                  color: sevStyle.text,
                  fontWeight: "700",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <span>VIEW EXCEPTIONS</span>
                <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
