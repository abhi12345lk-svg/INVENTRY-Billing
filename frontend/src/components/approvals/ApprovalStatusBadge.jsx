import React from "react";
import { Clock, CheckCircle2, XCircle, Ban } from "lucide-react";

export function ApprovalStatusBadge({ status }) {
  switch (status) {
    case "PENDING":
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "rgba(234, 179, 8, 0.15)",
            color: "#eab308",
            border: "1px solid rgba(234, 179, 8, 0.3)",
            padding: "3px 9px",
            borderRadius: "10px",
            fontSize: "0.72rem",
            fontWeight: "700"
          }}
        >
          <Clock size={12} />
          PENDING
        </span>
      );
    case "APPROVED":
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "rgba(16, 185, 129, 0.15)",
            color: "#10b981",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            padding: "3px 9px",
            borderRadius: "10px",
            fontSize: "0.72rem",
            fontWeight: "700"
          }}
        >
          <CheckCircle2 size={12} />
          APPROVED
        </span>
      );
    case "REJECTED":
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "rgba(239, 68, 68, 0.15)",
            color: "#ef4444",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            padding: "3px 9px",
            borderRadius: "10px",
            fontSize: "0.72rem",
            fontWeight: "700"
          }}
        >
          <XCircle size={12} />
          REJECTED
        </span>
      );
    case "CANCELLED":
    default:
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "rgba(107, 114, 128, 0.15)",
            color: "var(--text-muted)",
            border: "1px solid rgba(107, 114, 128, 0.3)",
            padding: "3px 9px",
            borderRadius: "10px",
            fontSize: "0.72rem",
            fontWeight: "600"
          }}
        >
          <Ban size={12} />
          {status}
        </span>
      );
  }
}

export function ApprovalTypeBadge({ type }) {
  const formatType = (t) => {
    switch (t) {
      case "BILL_AMENDMENT":
        return { label: "Bill Amendment", color: "var(--primary-400)", bg: "var(--badge-brand-bg)" };
      case "PAYMENT_CANCELLATION":
        return { label: "Payment Cancel", color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)" };
      case "STOCK_ADJUSTMENT":
        return { label: "Stock Adjustment", color: "#f97316", bg: "rgba(249, 115, 22, 0.15)" };
      case "CUSTOMER_CREDIT_OVERRIDE":
        return { label: "Credit Override", color: "#a855f7", bg: "rgba(168, 85, 247, 0.15)" };
      default:
        return { label: t, color: "var(--text-muted)", bg: "var(--bg-input)" };
    }
  };

  const badge = formatType(type);

  return (
    <span
      style={{
        padding: "3px 8px",
        borderRadius: "6px",
        fontSize: "0.72rem",
        fontWeight: "700",
        background: badge.bg,
        color: badge.color
      }}
    >
      {badge.label}
    </span>
  );
}
