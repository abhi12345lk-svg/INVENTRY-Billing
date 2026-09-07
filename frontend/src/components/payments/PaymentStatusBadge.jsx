import React from "react";
import { CheckCircle2, Clock, AlertTriangle, XCircle, Banknote, QrCode, CreditCard } from "lucide-react";

export function PaymentStatusBadge({ status }) {
  switch (status) {
    case "MAPPED":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "4px 10px",
          borderRadius: "20px",
          background: "rgba(16, 185, 129, 0.15)",
          color: "#10b981",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          fontSize: "0.75rem",
          fontWeight: "700"
        }}>
          <CheckCircle2 size={12} />
          <span>MAPPED</span>
        </span>
      );

    case "PARTIALLY_MAPPED":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "4px 10px",
          borderRadius: "20px",
          background: "rgba(245, 158, 11, 0.15)",
          color: "#f59e0b",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          fontSize: "0.75rem",
          fontWeight: "700"
        }}>
          <Clock size={12} />
          <span>PARTIALLY MAPPED</span>
        </span>
      );

    case "UNMATCHED":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "4px 10px",
          borderRadius: "20px",
          background: "rgba(239, 68, 68, 0.15)",
          color: "#ef4444",
          border: "1px solid rgba(239, 68, 68, 0.35)",
          fontSize: "0.75rem",
          fontWeight: "800",
          boxShadow: "0 0 10px rgba(239, 68, 68, 0.2)"
        }}>
          <AlertTriangle size={12} />
          <span>UNMATCHED (SUSPENSE)</span>
        </span>
      );

    case "CANCELLED":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "4px 10px",
          borderRadius: "20px",
          background: "rgba(107, 114, 128, 0.2)",
          color: "#9ca3af",
          border: "1px solid rgba(107, 114, 128, 0.3)",
          fontSize: "0.75rem",
          fontWeight: "600"
        }}>
          <XCircle size={12} />
          <span>CANCELLED</span>
        </span>
      );

    case "RECORDED":
    default:
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "4px 10px",
          borderRadius: "20px",
          background: "rgba(59, 130, 246, 0.15)",
          color: "#3b82f6",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          fontSize: "0.75rem",
          fontWeight: "700"
        }}>
          <Clock size={12} />
          <span>RECORDED</span>
        </span>
      );
  }
}

export function PaymentModeBadge({ mode }) {
  switch (mode) {
    case "CASH":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "3px 8px",
          borderRadius: "8px",
          background: "rgba(16, 185, 129, 0.12)",
          color: "#10b981",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          fontSize: "0.75rem",
          fontWeight: "700"
        }}>
          <Banknote size={13} />
          <span>Cash</span>
        </span>
      );

    case "UPI":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "3px 8px",
          borderRadius: "8px",
          background: "rgba(99, 102, 241, 0.12)",
          color: "var(--primary-400)",
          border: "1px solid rgba(99, 102, 241, 0.25)",
          fontSize: "0.75rem",
          fontWeight: "700"
        }}>
          <QrCode size={13} />
          <span>UPI</span>
        </span>
      );

    case "CHEQUE":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "3px 8px",
          borderRadius: "8px",
          background: "rgba(245, 158, 11, 0.12)",
          color: "#f59e0b",
          border: "1px solid rgba(245, 158, 11, 0.25)",
          fontSize: "0.75rem",
          fontWeight: "700"
        }}>
          <CreditCard size={13} />
          <span>Cheque</span>
        </span>
      );

    default:
      return <span>{mode}</span>;
  }
}
