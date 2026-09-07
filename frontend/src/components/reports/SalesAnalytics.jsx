// frontend/src/components/reports/SalesAnalytics.jsx
import React, { useState } from "react";
import { TrendingUp, FileText, ShoppingBag, Receipt, Calendar } from "lucide-react";

export default function SalesAnalytics({ data, dateRange = "today" }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data) return null;

  const { salesTrend = [], grossSales = 0, totalBills = 0, averageBillValue = 0 } = data;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const maxSales = salesTrend.length > 0 ? Math.max(...salesTrend.map((t) => t.sales || 1)) : 1;

  return (
    <div className="glass-card" style={{ padding: "24px", borderRadius: "18px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <TrendingUp size={20} color="#6366f1" />
            <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>
              Sales Analytics & Revenue Trend
            </h3>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
            Revenue momentum across FMCG routes (Nestlé, Patanjali & GSK)
          </p>
        </div>

        <div style={{
          background: "rgba(99, 102, 241, 0.12)",
          color: "#818cf8",
          padding: "6px 14px",
          borderRadius: "10px",
          fontSize: "0.8rem",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}>
          <Calendar size={15} />
          <span style={{ textTransform: "capitalize" }}>Period: {dateRange}</span>
        </div>
      </div>

      {/* Summary Mini Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "24px" }}>
        <div style={{
          background: "var(--bg-input)",
          border: "1px solid var(--border-card)",
          borderRadius: "14px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "14px"
        }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(99, 102, 241, 0.15)", color: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShoppingBag size={20} />
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Gross Sales</div>
            <div style={{ fontSize: "1.35rem", fontWeight: "900", color: "var(--text-main)" }}>{formatCurrency(grossSales)}</div>
          </div>
        </div>

        <div style={{
          background: "var(--bg-input)",
          border: "1px solid var(--border-card)",
          borderRadius: "14px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "14px"
        }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Receipt size={20} />
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Total Bills</div>
            <div style={{ fontSize: "1.35rem", fontWeight: "900", color: "var(--text-main)" }}>{totalBills.toLocaleString("en-IN")}</div>
          </div>
        </div>

        <div style={{
          background: "var(--bg-input)",
          border: "1px solid var(--border-card)",
          borderRadius: "14px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "14px"
        }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={20} />
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Average Bill Value</div>
            <div style={{ fontSize: "1.35rem", fontWeight: "900", color: "var(--text-main)" }}>{formatCurrency(averageBillValue)}</div>
          </div>
        </div>
      </div>

      {/* Interactive Trend Chart */}
      <div style={{
        background: "var(--bg-input)",
        borderRadius: "16px",
        padding: "20px",
        border: "1px solid var(--border-card)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)" }}>
            Daily Revenue & Bill Velocity
          </span>
          {hoveredPoint && (
            <div style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-card)",
              padding: "4px 12px",
              borderRadius: "8px",
              fontSize: "0.8rem",
              fontWeight: "600",
              color: "var(--text-main)"
            }}>
              {hoveredPoint.day} ({hoveredPoint.date}): <strong style={{ color: "#6366f1" }}>{formatCurrency(hoveredPoint.sales)}</strong> | {hoveredPoint.bills} bills
            </div>
          )}
        </div>

        {/* Visual Bar Columns */}
        <div style={{ height: "180px", display: "flex", alignItems: "flex-end", gap: "12px", padding: "10px 4px" }}>
          {salesTrend.map((item, idx) => {
            const heightPercent = Math.max(15, Math.round((item.sales / maxSales) * 100));
            const isHovered = hoveredPoint?.day === item.day;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredPoint(item)}
                onMouseLeave={() => setHoveredPoint(null)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                  justifyContent: "flex-end",
                  cursor: "pointer"
                }}
              >
                <div style={{
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  color: isHovered ? "#6366f1" : "var(--text-muted)",
                  marginBottom: "6px",
                  transition: "color 0.2s"
                }}>
                  ₹{(item.sales / 100000).toFixed(1)}L
                </div>

                <div
                  style={{
                    width: "100%",
                    height: `${heightPercent}%`,
                    borderRadius: "8px 8px 3px 3px",
                    background: isHovered
                      ? "linear-gradient(180deg, #818cf8 0%, #4f46e5 100%)"
                      : "linear-gradient(180deg, rgba(99, 102, 241, 0.7) 0%, rgba(79, 70, 229, 0.5) 100%)",
                    transition: "all 0.25s ease",
                    boxShadow: isHovered ? "0 4px 14px rgba(99, 102, 241, 0.4)" : "none"
                  }}
                />

                <div style={{ marginTop: "10px", textAlign: "center" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: "700", color: isHovered ? "var(--text-main)" : "var(--text-muted)" }}>
                    {item.day}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                    {item.date}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
