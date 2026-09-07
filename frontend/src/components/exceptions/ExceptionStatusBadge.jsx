import React from "react";
import { AlertCircle, AlertTriangle, Info, Clock, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";

export function ExceptionSeverityBadge({ severity }) {
  switch (severity) {
    case "CRITICAL":
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
            borderRadius: "12px",
            fontSize: "0.72rem",
            fontWeight: "800",
            letterSpacing: "0.02em"
          }}
        >
          <ShieldAlert size={13} />
          CRITICAL
        </span>
      );
    case "HIGH":
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "rgba(249, 115, 22, 0.15)",
            color: "#f97316",
            border: "1px solid rgba(249, 115, 22, 0.3)",
            padding: "3px 9px",
            borderRadius: "12px",
            fontSize: "0.72rem",
            fontWeight: "800",
            letterSpacing: "0.02em"
          }}
        >
          <AlertTriangle size={13} />
          HIGH
        </span>
      );
    case "WARNING":
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
            borderRadius: "12px",
            fontSize: "0.72rem",
            fontWeight: "700"
          }}
        >
          <AlertCircle size={13} />
          WARNING
        </span>
      );
    case "INFO":
    default:
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "rgba(59, 130, 246, 0.15)",
            color: "#3b82f6",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            padding: "3px 9px",
            borderRadius: "12px",
            fontSize: "0.72rem",
            fontWeight: "700"
          }}
        >
          <Info size={13} />
          INFO
        </span>
      );
  }
}

export function ExceptionStatusBadge({ status }) {
  switch (status) {
    case "OPEN":
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "rgba(239, 68, 68, 0.12)",
            color: "#ef4444",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            padding: "3px 8px",
            borderRadius: "8px",
            fontSize: "0.72rem",
            fontWeight: "700"
          }}
        >
          <AlertCircle size={12} />
          OPEN
        </span>
      );
    case "UNDER_REVIEW":
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "rgba(99, 102, 241, 0.15)",
            color: "var(--primary-400)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            padding: "3px 8px",
            borderRadius: "8px",
            fontSize: "0.72rem",
            fontWeight: "700"
          }}
        >
          <Clock size={12} />
          UNDER REVIEW
        </span>
      );
    case "RESOLVED":
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "rgba(16, 185, 129, 0.15)",
            color: "#10b981",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            padding: "3px 8px",
            borderRadius: "8px",
            fontSize: "0.72rem",
            fontWeight: "700"
          }}
        >
          <CheckCircle2 size={12} />
          RESOLVED
        </span>
      );
    case "DISMISSED":
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "rgba(107, 114, 128, 0.15)",
            color: "var(--text-muted)",
            border: "1px solid rgba(107, 114, 128, 0.3)",
            padding: "3px 8px",
            borderRadius: "8px",
            fontSize: "0.72rem",
            fontWeight: "600"
          }}
        >
          <XCircle size={12} />
          DISMISSED
        </span>
      );
    default:
      return <span>{status}</span>;
  }
}
