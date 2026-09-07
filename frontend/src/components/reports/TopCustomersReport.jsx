// frontend/src/components/reports/TopCustomersReport.jsx
import React from "react";
import { Users, Store, Award, CheckCircle2 } from "lucide-react";

export default function TopCustomersReport({ data }) {
  if (!data) return null;

  const { customers = [] } = data;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const getTierBadgeStyle = (tier) => {
    if (tier.includes("Diamond")) return { bg: "rgba(99, 102, 241, 0.15)", color: "#818cf8" };
    if (tier.includes("Platinum")) return { bg: "rgba(168, 85, 247, 0.15)", color: "#c084fc" };
    if (tier.includes("Gold")) return { bg: "rgba(234, 179, 8, 0.15)", color: "#eab308" };
    return { bg: "rgba(148, 163, 184, 0.15)", color: "#94a3b8" };
  };

  return (
    <div className="glass-card" style={{ padding: "24px", borderRadius: "18px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <Users size={20} color="#3b82f6" />
            <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>
              Top 5 Customers by Revenue & Volume
            </h3>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
            Highest gross billing and collection volume retail partners
          </p>
        </div>

        <div style={{
          background: "rgba(59, 130, 246, 0.12)",
          color: "#3b82f6",
          padding: "6px 14px",
          borderRadius: "10px",
          fontSize: "0.8rem",
          fontWeight: "700"
        }}>
          Top 5 Outlets
        </div>
      </div>

      {/* Top Customers Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-card)", color: "var(--text-muted)" }}>
              <th style={{ padding: "10px 12px", fontWeight: "700" }}>Rank</th>
              <th style={{ padding: "10px 12px", fontWeight: "700" }}>Retailer / Outlet</th>
              <th style={{ padding: "10px 12px", fontWeight: "700" }}>Tier</th>
              <th style={{ padding: "10px 12px", fontWeight: "700" }}>Gross Sales</th>
              <th style={{ padding: "10px 12px", fontWeight: "700" }}>Total Collection</th>
              <th style={{ padding: "10px 12px", fontWeight: "700" }}>Outstanding</th>
              <th style={{ padding: "10px 12px", fontWeight: "700" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => {
              const tierStyle = getTierBadgeStyle(c.tier);
              return (
                <tr
                  key={c.rank}
                  style={{
                    borderBottom: "1px solid var(--border-card)",
                    transition: "background 0.15s ease"
                  }}
                >
                  <td style={{ padding: "14px 12px", fontWeight: "800" }}>
                    <div style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "8px",
                      background: c.rank === 1 ? "rgba(234, 179, 8, 0.2)" : "var(--bg-input)",
                      color: c.rank === 1 ? "#eab308" : "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "900"
                    }}>
                      #{c.rank}
                    </div>
                  </td>
                  <td style={{ padding: "14px 12px" }}>
                    <div style={{ fontWeight: "700", color: "var(--text-main)", fontSize: "0.9rem" }}>{c.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{c.code} • {c.ordersCount} orders</div>
                  </td>
                  <td style={{ padding: "14px 12px" }}>
                    <span style={{
                      background: tierStyle.bg,
                      color: tierStyle.color,
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "0.72rem",
                      fontWeight: "700"
                    }}>
                      {c.tier}
                    </span>
                  </td>
                  <td style={{ padding: "14px 12px", fontWeight: "900", color: "var(--text-main)" }}>
                    {formatCurrency(c.sales)}
                  </td>
                  <td style={{ padding: "14px 12px", fontWeight: "800", color: "#10b981" }}>
                    {formatCurrency(c.collection)}
                  </td>
                  <td style={{ padding: "14px 12px", fontWeight: "800", color: c.outstanding > 0 ? "#ef4444" : "#10b981" }}>
                    {formatCurrency(c.outstanding)}
                  </td>
                  <td style={{ padding: "14px 12px" }}>
                    <span style={{
                      background: "rgba(16, 185, 129, 0.12)",
                      color: "#10b981",
                      padding: "4px 10px",
                      borderRadius: "8px",
                      fontWeight: "700",
                      fontSize: "0.72rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <CheckCircle2 size={12} />
                      {c.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
