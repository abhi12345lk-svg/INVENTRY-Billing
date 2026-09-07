// frontend/src/components/reports/ReportKpiCard.jsx
import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function ReportKpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "#6366f1",
  trend,
  isPositive = true,
  onClick
}) {
  return (
    <div
      onClick={onClick}
      className="glass-card"
      style={{
        padding: "20px",
        borderRadius: "16px",
        position: "relative",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease"
      }}
    >
      {/* Top Accent Line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: color
        }}
      />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
        <div>
          <span style={{ fontSize: "0.78rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
            {title}
          </span>
          <div style={{ fontSize: "1.65rem", fontWeight: "900", color: "var(--text-main)", letterSpacing: "-0.02em", marginTop: "4px" }}>
            {value}
          </div>
        </div>

        {Icon && (
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: `${color}18`,
              border: `1px solid ${color}35`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: color
            }}
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid var(--border-card)" }}>
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: "500" }}>
          {subtitle}
        </span>

        {trend && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.75rem",
              fontWeight: "700",
              color: isPositive ? "#10b981" : "#ef4444",
              background: isPositive ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
              padding: "2px 8px",
              borderRadius: "6px"
            }}
          >
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}
