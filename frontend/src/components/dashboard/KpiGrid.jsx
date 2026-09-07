import React from "react";
import { 
  TrendingUp, 
  Coins, 
  Clock, 
  FileText, 
  Store, 
  Boxes, 
  ArrowUpRight, 
  ArrowDownRight 
} from "lucide-react";

export default function KpiGrid({ summary }) {
  if (!summary) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const kpiItems = [
    {
      title: "Today's Sales",
      value: formatCurrency(summary.todaysSales),
      trend: summary.todaysSalesTrend,
      trendUp: true,
      subText: "vs Yesterday (684 Bills)",
      icon: TrendingUp,
      color: "#6366f1",
      bgColor: "rgba(99, 102, 241, 0.12)"
    },
    {
      title: "Today's Collection",
      value: formatCurrency(summary.todaysCollection),
      trend: summary.todaysCollectionTrend,
      trendUp: true,
      subText: "Cash, UPI & Cheques",
      icon: Coins,
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.12)"
    },
    {
      title: "Total Outstanding",
      value: formatCurrency(summary.totalOutstanding),
      trend: summary.totalOutstandingTrend,
      trendUp: false,
      subText: "Across 4,120 Outlets",
      icon: Clock,
      color: "#ef4444",
      bgColor: "rgba(239, 68, 68, 0.12)"
    },
    {
      title: "Today's Bills",
      value: `${summary.todaysBillsCount} Bills`,
      trend: "Peak Capacity",
      trendUp: true,
      subText: `Max Capacity ~${summary.todaysBillsCapacity}/day`,
      icon: FileText,
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.12)"
    },
    {
      title: "Total Customers",
      value: `${summary.totalCustomers} Outlets`,
      trend: `${summary.activeCustomers} Active`,
      trendUp: true,
      subText: "Covered by 20 Salesmen",
      icon: Store,
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.12)"
    },
    {
      title: "Stock Value",
      value: formatCurrency(summary.stockValue),
      trend: "Optimal",
      trendUp: true,
      subText: "Nestlé, Patanjali, GSK",
      icon: Boxes,
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.12)"
    }
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "20px",
      marginBottom: "28px"
    }}>
      {kpiItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div key={index} className="glass-card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <div style={{
                background: item.bgColor,
                color: item.color,
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <IconComponent size={22} />
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.78rem",
                fontWeight: "700",
                color: item.trendUp ? "#10b981" : "#ef4444",
                background: item.trendUp ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
                padding: "3px 8px",
                borderRadius: "8px"
              }}>
                {item.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span>{item.trend}</span>
              </div>
            </div>

            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "4px" }}>
              {item.title}
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "6px" }}>
              {item.value}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
              {item.subText}
            </div>
          </div>
        );
      })}
    </div>
  );
}
