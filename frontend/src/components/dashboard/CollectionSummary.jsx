import React from "react";
import { Coins, QrCode, Wallet, FileCheck2, AlertCircle } from "lucide-react";

export default function CollectionSummary({ collections }) {
  if (!collections) return null;

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
            <Coins size={20} color="#10b981" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)" }}>
              Today's Collection Breakdown
            </h3>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Total Collected: <strong style={{ color: "#10b981" }}>{formatCurrency(collections.total)}</strong> across 3 payment channels
          </p>
        </div>
      </div>

      {/* Breakdown Meter */}
      <div style={{
        height: "12px",
        borderRadius: "6px",
        overflow: "hidden",
        display: "flex",
        marginBottom: "20px",
        background: "var(--bg-input)"
      }}>
        {collections.breakdown.map((item, idx) => (
          <div
            key={idx}
            style={{
              width: `${item.percentage}%`,
              background: item.color,
              height: "100%",
              transition: "width 0.3s ease"
            }}
            title={`${item.mode}: ${item.percentage}%`}
          />
        ))}
      </div>

      {/* 3 Channel Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        
        {/* UPI */}
        <div style={{
          background: "var(--bg-input)",
          border: "1px solid var(--border-card)",
          borderRadius: "14px",
          padding: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <QrCode size={18} color="#6366f1" />
              <span style={{ fontSize: "0.88rem", fontWeight: "700", color: "var(--text-main)" }}>UPI / E-Pay</span>
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#6366f1" }}>{collections.upi.percentage}%</span>
          </div>
          <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "4px" }}>
            {formatCurrency(collections.upi.amount)}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#f59e0b", display: "flex", alignItems: "center", gap: "4px" }}>
            <AlertCircle size={14} />
            <span>₹{(collections.upi.suspense / 1000).toFixed(0)}k in Suspense Bucket</span>
          </div>
        </div>

        {/* Cash */}
        <div style={{
          background: "var(--bg-input)",
          border: "1px solid var(--border-card)",
          borderRadius: "14px",
          padding: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Wallet size={18} color="#10b981" />
              <span style={{ fontSize: "0.88rem", fontWeight: "700", color: "var(--text-main)" }}>Cash Collection</span>
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#10b981" }}>{collections.cash.percentage}%</span>
          </div>
          <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "4px" }}>
            {formatCurrency(collections.cash.amount)}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#eab308", display: "flex", alignItems: "center", gap: "4px" }}>
            <AlertCircle size={14} />
            <span>-₹100 Office Count Discrepancy</span>
          </div>
        </div>

        {/* Cheques */}
        <div style={{
          background: "var(--bg-input)",
          border: "1px solid var(--border-card)",
          borderRadius: "14px",
          padding: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FileCheck2 size={18} color="#f59e0b" />
              <span style={{ fontSize: "0.88rem", fontWeight: "700", color: "var(--text-main)" }}>Cheques</span>
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#f59e0b" }}>{collections.cheque.percentage}%</span>
          </div>
          <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "4px" }}>
            {formatCurrency(collections.cheque.amount)}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "4px" }}>
            <span>₹{(collections.cheque.pending / 1000).toFixed(0)}k Pending In-Hand Bag</span>
          </div>
        </div>

      </div>
    </div>
  );
}
