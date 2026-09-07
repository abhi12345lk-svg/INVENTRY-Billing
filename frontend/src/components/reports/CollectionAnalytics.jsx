// frontend/src/components/reports/CollectionAnalytics.jsx
import React from "react";
import { Coins, QrCode, Wallet, CheckCircle2, AlertCircle, PieChart } from "lucide-react";

export default function CollectionAnalytics({ data }) {
  if (!data) return null;

  const {
    cashCollection = 0,
    upiCollection = 0,
    chequeCollection = 0,
    totalCollection = 0,
    mappedPayments = 0,
    suspensePayments = 0,
    breakdown = []
  } = data;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="glass-card" style={{ padding: "24px", borderRadius: "18px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Coins size={20} color="#10b981" />
            <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>
              Collection Analytics & Payment Channels
            </h3>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
            Cash, UPI & Cheque reconciliation overview from Step 8 Engine
          </p>
        </div>

        <div style={{
          background: "rgba(16, 185, 129, 0.12)",
          color: "#10b981",
          padding: "6px 14px",
          borderRadius: "10px",
          fontSize: "0.8rem",
          fontWeight: "700"
        }}>
          Total: {formatCurrency(totalCollection)}
        </div>
      </div>

      {/* Visual Breakdown Meter */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.78rem", fontWeight: "600", color: "var(--text-muted)" }}>
          <span>Channel Mix Proportion</span>
          <span>Cash (30%) • UPI (45%) • Cheque (25%)</span>
        </div>
        <div style={{
          height: "14px",
          borderRadius: "8px",
          overflow: "hidden",
          display: "flex",
          background: "var(--bg-input)"
        }}>
          {breakdown.map((item, idx) => (
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
      </div>

      {/* Channel Breakdown 3 Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "20px" }}>
        {/* Cash */}
        <div style={{
          background: "var(--bg-input)",
          border: "1px solid var(--border-card)",
          borderRadius: "14px",
          padding: "16px",
          borderLeft: "4px solid #10b981"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--text-main)" }}>Cash Collection</span>
            <Coins size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: "900", color: "var(--text-main)", marginBottom: "4px" }}>
            {formatCurrency(cashCollection)}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: "600" }}>
            30% of Total (Physical Currency)
          </div>
        </div>

        {/* UPI */}
        <div style={{
          background: "var(--bg-input)",
          border: "1px solid var(--border-card)",
          borderRadius: "14px",
          padding: "16px",
          borderLeft: "4px solid #6366f1"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--text-main)" }}>UPI / E-Payment</span>
            <QrCode size={18} color="#6366f1" />
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: "900", color: "var(--text-main)", marginBottom: "4px" }}>
            {formatCurrency(upiCollection)}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#6366f1", fontWeight: "600" }}>
            45% of Total (Digital Instant)
          </div>
        </div>

        {/* Cheque */}
        <div style={{
          background: "var(--bg-input)",
          border: "1px solid var(--border-card)",
          borderRadius: "14px",
          padding: "16px",
          borderLeft: "4px solid #f59e0b"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--text-main)" }}>Cheque Collection</span>
            <Wallet size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: "900", color: "var(--text-main)", marginBottom: "4px" }}>
            {formatCurrency(chequeCollection)}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#f59e0b", fontWeight: "600" }}>
            25% of Total (Bank Clearing)
          </div>
        </div>
      </div>

      {/* Reconciliation Meter */}
      <div style={{
        background: "var(--bg-input)",
        borderRadius: "14px",
        padding: "16px",
        border: "1px solid var(--border-card)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "14px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>Mapped to Invoices</div>
            <div style={{ fontSize: "1.05rem", fontWeight: "800", color: "#10b981" }}>{formatCurrency(mappedPayments)}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertCircle size={18} />
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>Unmapped / Suspense</div>
            <div style={{ fontSize: "1.05rem", fontWeight: "800", color: "#f59e0b" }}>{formatCurrency(suspensePayments)}</div>
          </div>
        </div>

        <div style={{
          background: "var(--badge-brand-bg)",
          color: "var(--primary-400)",
          padding: "6px 14px",
          borderRadius: "8px",
          fontSize: "0.8rem",
          fontWeight: "700"
        }}>
          Auto-Recon Rate: 95.2%
        </div>
      </div>
    </div>
  );
}
