import React, { useState } from "react";
import { TrendingUp, Calendar, FileText } from "lucide-react";

export default function SalesChart({ salesData }) {
  if (!salesData || !salesData.weeklyTrend) return null;

  const [hoveredDay, setHoveredDay] = useState(null);
  const trend = salesData.weeklyTrend;
  const maxSales = Math.max(...trend.map((t) => t.sales));

  const formatLakhs = (val) => {
    return `₹${(val / 100000).toFixed(2)} Lakh`;
  };

  return (
    <div className="glass-card" style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <TrendingUp size={20} color="var(--primary-400)" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)" }}>
              Weekly Sales Overview (7-Day Trend)
            </h3>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Daily revenue & bill volumes across Nestlé, Patanjali & GSK routes
          </p>
        </div>

        <div style={{
          background: "var(--badge-brand-bg)",
          color: "var(--primary-400)",
          padding: "6px 14px",
          borderRadius: "10px",
          fontSize: "0.8rem",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}>
          <Calendar size={16} />
          <span>Current Week (01 Sep - 07 Sep)</span>
        </div>
      </div>

      {/* SVG Interactive Bar Chart */}
      <div style={{ height: "220px", display: "flex", alignItems: "flex-end", gap: "16px", padding: "20px 10px 10px 10px", position: "relative" }}>
        {trend.map((item, index) => {
          const heightPercent = Math.round((item.sales / maxSales) * 100);
          const isHovered = hoveredDay?.day === item.day;
          const isToday = item.day === "Fri";

          return (
            <div
              key={index}
              onMouseEnter={() => setHoveredDay(item)}
              onMouseLeave={() => setHoveredDay(null)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                justifyContent: "flex-end",
                cursor: "pointer",
                position: "relative"
              }}
            >
              {/* Tooltip on hover */}
              {isHovered && (
                <div style={{
                  position: "absolute",
                  top: "-45px",
                  background: "#0f172a",
                  border: "1px solid var(--border-active)",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  fontSize: "0.75rem",
                  color: "#ffffff",
                  whiteSpace: "nowrap",
                  zIndex: 20,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
                  textAlign: "center"
                }}>
                  <div style={{ fontWeight: "700", color: "#818cf8" }}>{formatLakhs(item.sales)}</div>
                  <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{item.bills} Bills</div>
                </div>
              )}

              {/* Bar */}
              <div style={{
                width: "100%",
                maxWidth: "36px",
                height: `${heightPercent}%`,
                background: isToday
                  ? "linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)"
                  : isHovered
                  ? "linear-gradient(180deg, #818cf8 0%, #6366f1 100%)"
                  : "var(--bg-input)",
                border: isToday ? "1.5px solid #818cf8" : "1px solid var(--border-card)",
                borderRadius: "8px 8px 4px 4px",
                transition: "all 0.25s ease",
                boxShadow: isToday ? "0 6px 16px rgba(99, 102, 241, 0.4)" : "none"
              }} />

              {/* Day Label */}
              <div style={{ marginTop: "10px", textAlign: "center" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: isToday ? "700" : "500", color: isToday ? "var(--primary-400)" : "var(--text-muted)" }}>
                  {item.day}
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
                  {item.date}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Salesmen Performance Summary */}
      <div style={{
        marginTop: "20px",
        paddingTop: "16px",
        borderTop: "1px solid var(--border-card)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "12px"
      }}>
        {salesData.topSalesmen.map((salesman, idx) => (
          <div key={idx} style={{
            background: "var(--bg-input)",
            borderRadius: "12px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)" }}>
                {salesman.name}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                {salesman.route}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: "800", color: "#10b981" }}>
                ₹{(salesman.sales / 1000).toFixed(0)}k
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--primary-400)", fontWeight: "600" }}>
                {salesman.targetAchieved}% Target
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
