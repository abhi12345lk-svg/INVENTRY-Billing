import React from "react";
import { Clock, ShieldAlert } from "lucide-react";

export default function ReceivableAgeing({ receivables }) {
  if (!receivables || !receivables.ageing) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="glass-card" style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Clock size={20} color="#ef4444" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)" }}>
              Receivable Ageing Analysis
            </h3>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Total Outstanding: <strong style={{ color: "#ef4444" }}>{formatCurrency(receivables.totalOutstanding)}</strong> categorized by overdue period
          </p>
        </div>

        <div style={{
          background: "rgba(239, 68, 68, 0.12)",
          color: "#ef4444",
          padding: "6px 14px",
          borderRadius: "10px",
          fontSize: "0.8rem",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}>
          <ShieldAlert size={16} />
          <span>Configurable Credit Lock Active</span>
        </div>
      </div>

      {/* Ageing Spectrum Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" }}>
        {receivables.ageing.map((bucket, idx) => (
          <div
            key={idx}
            style={{
              background: "var(--bg-input)",
              border: `1px solid ${bucket.color}40`,
              borderRadius: "14px",
              padding: "14px",
              borderTop: `4px solid ${bucket.color}`
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--text-main)" }}>
                {bucket.range}
              </span>
              <span style={{
                background: `${bucket.color}20`,
                color: bucket.color,
                padding: "2px 6px",
                borderRadius: "6px",
                fontSize: "0.68rem",
                fontWeight: "700"
              }}>
                {bucket.status}
              </span>
            </div>

            <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "4px" }}>
              ₹{(bucket.amount / 100000).toFixed(2)}L
            </div>

            <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
              {bucket.percentage}% of total dues
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
