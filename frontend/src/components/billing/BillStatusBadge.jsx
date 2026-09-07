import React from "react";
import { Lock, FileCheck, XCircle, AlertCircle, CheckCircle } from "lucide-react";

export function BillStatusBadge({ status }) {
  const s = (status || "").toUpperCase();

  switch (s) {
    case "LOCKED":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          background: "rgba(16, 185, 129, 0.12)",
          color: "#10b981",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          fontSize: "0.74rem",
          fontWeight: "700",
          padding: "3px 9px",
          borderRadius: "14px",
          letterSpacing: "0.03em"
        }}>
          <Lock size={12} />
          <span>LOCKED</span>
        </span>
      );

    case "GENERATED":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          background: "rgba(59, 130, 246, 0.12)",
          color: "#60a5fa",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          fontSize: "0.74rem",
          fontWeight: "700",
          padding: "3px 9px",
          borderRadius: "14px",
          letterSpacing: "0.03em"
        }}>
          <FileCheck size={12} />
          <span>GENERATED</span>
        </span>
      );

    case "CANCELLED":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          background: "rgba(239, 68, 68, 0.12)",
          color: "#f87171",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          fontSize: "0.74rem",
          fontWeight: "700",
          padding: "3px 9px",
          borderRadius: "14px",
          letterSpacing: "0.03em"
        }}>
          <XCircle size={12} />
          <span>CANCELLED</span>
        </span>
      );

    case "DRAFT":
    default:
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          background: "rgba(245, 158, 11, 0.12)",
          color: "#fbbf24",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          fontSize: "0.74rem",
          fontWeight: "700",
          padding: "3px 9px",
          borderRadius: "14px",
          letterSpacing: "0.03em"
        }}>
          <AlertCircle size={12} />
          <span>{s || "DRAFT"}</span>
        </span>
      );
  }
}

export function PaymentStatusBadge({ status }) {
  const s = (status || "").toUpperCase();

  switch (s) {
    case "PAID":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          background: "rgba(16, 185, 129, 0.12)",
          color: "#34d399",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          fontSize: "0.72rem",
          fontWeight: "700",
          padding: "2px 8px",
          borderRadius: "6px"
        }}>
          <CheckCircle size={11} />
          <span>PAID</span>
        </span>
      );

    case "PARTIAL":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          background: "rgba(245, 158, 11, 0.12)",
          color: "#f59e0b",
          border: "1px solid rgba(245, 158, 11, 0.25)",
          fontSize: "0.72rem",
          fontWeight: "700",
          padding: "2px 8px",
          borderRadius: "6px"
        }}>
          <span>PARTIAL</span>
        </span>
      );

    case "UNPAID":
    default:
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          background: "rgba(239, 68, 68, 0.1)",
          color: "#f87171",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          fontSize: "0.72rem",
          fontWeight: "700",
          padding: "2px 8px",
          borderRadius: "6px"
        }}>
          <span>UNPAID</span>
        </span>
      );
  }
}
