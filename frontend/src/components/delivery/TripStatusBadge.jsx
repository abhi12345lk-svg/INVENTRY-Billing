import React from "react";
import { CheckCircle2, Clock, Play, AlertCircle, XCircle, PackageCheck } from "lucide-react";

export function TripStatusBadge({ status }) {
  switch (status) {
    case "COMPLETED":
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
          <span>COMPLETED</span>
        </span>
      );

    case "IN_PROGRESS":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "4px 10px",
          borderRadius: "20px",
          background: "rgba(99, 102, 241, 0.15)",
          color: "var(--primary-400)",
          border: "1px solid rgba(99, 102, 241, 0.35)",
          fontSize: "0.75rem",
          fontWeight: "800"
        }}>
          <span style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "#6366f1",
            boxShadow: "0 0 6px #6366f1"
          }} />
          <span>IN PROGRESS</span>
        </span>
      );

    case "DISPATCHED":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "4px 10px",
          borderRadius: "20px",
          background: "rgba(14, 165, 233, 0.15)",
          color: "#0ea5e9",
          border: "1px solid rgba(14, 165, 233, 0.3)",
          fontSize: "0.75rem",
          fontWeight: "700"
        }}>
          <Play size={11} fill="#0ea5e9" />
          <span>DISPATCHED</span>
        </span>
      );

    case "READY":
    case "PLANNED":
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
          <span>READY TO DISPATCH</span>
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
          background: "rgba(239, 68, 68, 0.15)",
          color: "#ef4444",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          fontSize: "0.75rem",
          fontWeight: "700"
        }}>
          <XCircle size={12} />
          <span>CANCELLED</span>
        </span>
      );

    default:
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "4px 10px",
          borderRadius: "20px",
          background: "rgba(148, 163, 184, 0.15)",
          color: "#94a3b8",
          fontSize: "0.75rem",
          fontWeight: "600"
        }}>
          {status}
        </span>
      );
  }
}
