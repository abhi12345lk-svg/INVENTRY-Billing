// frontend/src/components/reports/TopProductsReport.jsx
import React from "react";
import { Package, TrendingUp, Sparkles } from "lucide-react";

export default function TopProductsReport({ data }) {
  if (!data) return null;

  const { products = [] } = data;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const maxUnits = products.length > 0 ? Math.max(...products.map((p) => p.unitsSold || 1)) : 1;

  return (
    <div className="glass-card" style={{ padding: "24px", borderRadius: "18px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Package size={20} color="#f59e0b" />
            <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>
              Top 5 Selling FMCG Products
            </h3>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
            Ranked by units moved and gross revenue generated
          </p>
        </div>

        <div style={{
          background: "rgba(245, 158, 11, 0.12)",
          color: "#f59e0b",
          padding: "6px 14px",
          borderRadius: "10px",
          fontSize: "0.8rem",
          fontWeight: "700"
        }}>
          Fast-Moving SKUs
        </div>
      </div>

      {/* Products List with Horizontal Bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {products.map((p) => {
          const widthPercent = Math.max(10, Math.round((p.unitsSold / maxUnits) * 100));

          return (
            <div
              key={p.rank}
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-card)",
                borderRadius: "14px",
                padding: "14px 18px",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "6px",
                    background: p.rank === 1 ? "rgba(245, 158, 11, 0.2)" : "var(--badge-brand-bg)",
                    color: p.rank === 1 ? "#f59e0b" : "var(--primary-400)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "900",
                    fontSize: "0.8rem"
                  }}>
                    #{p.rank}
                  </span>
                  <div>
                    <span style={{ fontWeight: "700", color: "var(--text-main)", fontSize: "0.88rem" }}>
                      {p.name}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "8px" }}>
                      ({p.company})
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: "900", color: "var(--text-main)" }}>
                      {formatCurrency(p.salesAmount)}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {p.unitsSold.toLocaleString("en-IN")} units sold
                    </div>
                  </div>

                  <span style={{
                    background: "rgba(16, 185, 129, 0.12)",
                    color: "#10b981",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    fontSize: "0.72rem",
                    fontWeight: "700"
                  }}>
                    {p.growthPct}
                  </span>
                </div>
              </div>

              {/* Visual Volume Bar */}
              <div style={{
                height: "6px",
                background: "var(--border-card)",
                borderRadius: "4px",
                overflow: "hidden"
              }}>
                <div style={{
                  height: "100%",
                  width: `${widthPercent}%`,
                  background: p.rank === 1
                    ? "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)"
                    : "linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)",
                  borderRadius: "4px",
                  transition: "width 0.3s ease"
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
