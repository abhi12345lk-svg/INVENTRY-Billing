import React from "react";
import { CheckCircle2, Clock, AlertTriangle, XCircle, Truck, Package, RotateCcw } from "lucide-react";

export function DeliveryStatusBadge({ status }) {
  switch (status) {
    case "DELIVERED":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "3px 10px",
          borderRadius: "20px",
          background: "rgba(16, 185, 129, 0.15)",
          color: "#10b981",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          fontSize: "0.72rem",
          fontWeight: "700"
        }}>
          <CheckCircle2 size={12} />
          <span>DELIVERED</span>
        </span>
      );

    case "OUT_FOR_DELIVERY":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "3px 10px",
          borderRadius: "20px",
          background: "rgba(99, 102, 241, 0.15)",
          color: "var(--primary-400)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          fontSize: "0.72rem",
          fontWeight: "700"
        }}>
          <Truck size={12} />
          <span>OUT FOR DELIVERY</span>
        </span>
      );

    case "DISPATCHED":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "3px 10px",
          borderRadius: "20px",
          background: "rgba(14, 165, 233, 0.15)",
          color: "#0ea5e9",
          border: "1px solid rgba(14, 165, 233, 0.3)",
          fontSize: "0.72rem",
          fontWeight: "700"
        }}>
          <Package size={12} />
          <span>DISPATCHED</span>
        </span>
      );

    case "READY_FOR_DISPATCH":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "3px 10px",
          borderRadius: "20px",
          background: "rgba(245, 158, 11, 0.15)",
          color: "#f59e0b",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          fontSize: "0.72rem",
          fontWeight: "700"
        }}>
          <Clock size={12} />
          <span>READY FOR DISPATCH</span>
        </span>
      );

    case "FAILED":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "3px 10px",
          borderRadius: "20px",
          background: "rgba(239, 68, 68, 0.15)",
          color: "#ef4444",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          fontSize: "0.72rem",
          fontWeight: "700"
        }}>
          <XCircle size={12} />
          <span>DELIVERY FAILED</span>
        </span>
      );

    case "RETURN_PENDING":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "3px 10px",
          borderRadius: "20px",
          background: "rgba(168, 85, 247, 0.15)",
          color: "#a855f7",
          border: "1px solid rgba(168, 85, 247, 0.3)",
          fontSize: "0.72rem",
          fontWeight: "700"
        }}>
          <RotateCcw size={12} />
          <span>RETURN PENDING</span>
        </span>
      );

    default:
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "3px 10px",
          borderRadius: "20px",
          background: "rgba(148, 163, 184, 0.15)",
          color: "#94a3b8",
          border: "1px solid rgba(148, 163, 184, 0.3)",
          fontSize: "0.72rem",
          fontWeight: "600"
        }}>
          <Clock size={12} />
          <span>{status || "PENDING"}</span>
        </span>
      );
  }
}

export function VehicleStatusBadge({ status }) {
  switch (status) {
    case "AVAILABLE":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "2px 8px",
          borderRadius: "14px",
          background: "rgba(16, 185, 129, 0.12)",
          color: "#10b981",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          fontSize: "0.72rem",
          fontWeight: "700"
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
          AVAILABLE
        </span>
      );

    case "ON_TRIP":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "2px 8px",
          borderRadius: "14px",
          background: "rgba(99, 102, 241, 0.12)",
          color: "var(--primary-400)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          fontSize: "0.72rem",
          fontWeight: "700"
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6366f1" }} />
          ON TRIP
        </span>
      );

    case "MAINTENANCE":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "2px 8px",
          borderRadius: "14px",
          background: "rgba(245, 158, 11, 0.12)",
          color: "#f59e0b",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          fontSize: "0.72rem",
          fontWeight: "700"
        }}>
          <AlertTriangle size={11} />
          MAINTENANCE
        </span>
      );

    default:
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "2px 8px",
          borderRadius: "14px",
          background: "rgba(148, 163, 184, 0.12)",
          color: "#94a3b8",
          fontSize: "0.72rem",
          fontWeight: "600"
        }}>
          {status}
        </span>
      );
  }
}
