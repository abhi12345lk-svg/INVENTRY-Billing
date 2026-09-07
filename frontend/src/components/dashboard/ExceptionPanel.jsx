import React from "react";
import { AlertTriangle, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function ExceptionPanel({ exceptions, onSelectException }) {
  if (!exceptions) return null;

  return (
    <div className="glass-card" style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <AlertTriangle size={20} color="#ef4444" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#ef4444" }}>
              Exception Control Center (Action Required)
            </h3>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Real-time fraud, mismatch & overdue alerts requiring Owner intervention
          </p>
        </div>

        <span style={{
          background: "rgba(239, 68, 68, 0.15)",
          color: "#ef4444",
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "0.8rem",
          fontWeight: "800"
        }}>
          {exceptions.length} Active Exceptions
        </span>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "16px"
      }}>
        {exceptions.map((exc) => (
          <div
            key={exc.id}
            onClick={() => onSelectException && onSelectException(exc)}
            style={{
              background: "var(--bg-input)",
              border: `1px solid ${exc.severityColor}40`,
              borderRadius: "16px",
              padding: "18px",
              cursor: "pointer",
              transition: "all 0.25s ease",
              position: "relative",
              overflow: "hidden"
            }}
            className="exception-card"
          >
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "4px",
              height: "100%",
              background: exc.severityColor
            }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{
                background: `${exc.severityColor}20`,
                color: exc.severityColor,
                padding: "3px 10px",
                borderRadius: "8px",
                fontSize: "0.72rem",
                fontWeight: "800"
              }}>
                {exc.severity}
              </span>
              <span style={{ fontSize: "0.82rem", fontWeight: "800", color: "var(--text-main)" }}>
                {exc.amount ? `₹${exc.amount.toLocaleString("en-IN")}` : `${exc.count} Items`}
              </span>
            </div>

            <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "6px" }}>
              {exc.title}
            </h4>

            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "14px", lineHeight: "1.5" }}>
              {exc.description}
            </p>

            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "0.8rem",
              fontWeight: "600",
              color: exc.severityColor
            }}>
              <span>{exc.actionText}</span>
              <ArrowRight size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
