import React from "react";

export default function OrderStatusBadge({ status }) {
  let bg = "rgba(148, 163, 184, 0.12)";
  let color = "var(--text-muted)";
  let border = "rgba(148, 163, 184, 0.25)";
  let dot = "#94a3b8";

  if (status === "DRAFT") {
    bg = "rgba(245, 158, 11, 0.12)";
    color = "#fbbf24";
    border = "rgba(245, 158, 11, 0.3)";
    dot = "#f59e0b";
  } else if (status === "SUBMITTED") {
    bg = "rgba(16, 185, 129, 0.12)";
    color = "#34d399";
    border = "rgba(16, 185, 129, 0.3)";
    dot = "#10b981";
  } else if (status === "CANCELLED") {
    bg = "rgba(239, 68, 68, 0.12)";
    color = "#f87171";
    border = "rgba(239, 68, 68, 0.3)";
    dot = "#ef4444";
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "0.75rem",
        fontWeight: "700",
        background: bg,
        color,
        border: `1px solid ${border}`,
        letterSpacing: "0.02em"
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: dot
        }}
      />
      {status}
    </span>
  );
}
