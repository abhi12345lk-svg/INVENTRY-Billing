import React from "react";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShoppingCart, 
  Package, 
  RefreshCw 
} from "lucide-react";

export function InventoryStatusBadge({ status }) {
  const normStatus = String(status || "").toUpperCase();

  switch (normStatus) {
    case "IN_STOCK":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 10px",
          borderRadius: "20px",
          background: "rgba(16, 185, 129, 0.12)",
          color: "#059669",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          fontSize: "0.75rem",
          fontWeight: "700"
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
          <span>IN STOCK</span>
        </span>
      );

    case "LOW_STOCK":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 10px",
          borderRadius: "20px",
          background: "rgba(245, 158, 11, 0.12)",
          color: "#d97706",
          border: "1px solid rgba(245, 158, 11, 0.25)",
          fontSize: "0.75rem",
          fontWeight: "700"
        }}>
          <AlertTriangle size={13} />
          <span>LOW STOCK</span>
        </span>
      );

    case "OUT_OF_STOCK":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 10px",
          borderRadius: "20px",
          background: "rgba(239, 68, 68, 0.12)",
          color: "#dc2626",
          border: "1px solid rgba(239, 68, 68, 0.25)",
          fontSize: "0.75rem",
          fontWeight: "700"
        }}>
          <XCircle size={13} />
          <span>OUT OF STOCK</span>
        </span>
      );

    default:
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 10px",
          borderRadius: "20px",
          background: "rgba(100, 116, 139, 0.12)",
          color: "#475569",
          border: "1px solid rgba(100, 116, 139, 0.25)",
          fontSize: "0.75rem",
          fontWeight: "600"
        }}>
          <span>{status || "UNKNOWN"}</span>
        </span>
      );
  }
}

export function MovementTypeBadge({ type }) {
  const normType = String(type || "").toUpperCase();

  switch (normType) {
    case "BILL_SALE":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "3px 8px",
          borderRadius: "6px",
          background: "rgba(239, 68, 68, 0.1)",
          color: "#dc2626",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          fontSize: "0.72rem",
          fontWeight: "700"
        }}>
          <ShoppingCart size={12} />
          <span>BILL SALE</span>
        </span>
      );

    case "ADJUSTMENT_IN":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "3px 8px",
          borderRadius: "6px",
          background: "rgba(16, 185, 129, 0.1)",
          color: "#059669",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          fontSize: "0.72rem",
          fontWeight: "700"
        }}>
          <ArrowDownLeft size={12} />
          <span>STOCK IN</span>
        </span>
      );

    case "ADJUSTMENT_OUT":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "3px 8px",
          borderRadius: "6px",
          background: "rgba(245, 158, 11, 0.1)",
          color: "#d97706",
          border: "1px solid rgba(245, 158, 11, 0.2)",
          fontSize: "0.72rem",
          fontWeight: "700"
        }}>
          <ArrowUpRight size={12} />
          <span>STOCK OUT</span>
        </span>
      );

    case "OPENING_STOCK":
    case "DEMO_SEED":
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "3px 8px",
          borderRadius: "6px",
          background: "rgba(79, 70, 229, 0.1)",
          color: "#4f46e5",
          border: "1px solid rgba(79, 70, 229, 0.2)",
          fontSize: "0.72rem",
          fontWeight: "700"
        }}>
          <Package size={12} />
          <span>OPENING STOCK</span>
        </span>
      );

    default:
      return (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "3px 8px",
          borderRadius: "6px",
          background: "rgba(100, 116, 139, 0.1)",
          color: "#475569",
          border: "1px solid rgba(100, 116, 139, 0.2)",
          fontSize: "0.72rem",
          fontWeight: "600"
        }}>
          <RefreshCw size={12} />
          <span>{type}</span>
        </span>
      );
  }
}
