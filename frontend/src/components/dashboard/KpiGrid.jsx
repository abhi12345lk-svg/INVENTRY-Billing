import React from "react";
import { 
  TrendingUp, 
  Coins, 
  FileText, 
  Store, 
  Package, 
  MapPin, 
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
      trend: summary.todaysSalesTrend || "+12.4%",
      trendUp: true,
      subText: "vs Yesterday (684 Bills)",
      icon: TrendingUp,
      color: "#6366f1",
      bgColor: "rgba(99, 102, 241, 0.12)"
    },
    {
      title: "Today's Collection",
      value: formatCurrency(summary.todaysCollection),
      trend: summary.todaysCollectionTrend || "+8.2%",
      trendUp: true,
      subText: "Cash, UPI & Cheques",
      icon: Coins,
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.12)"
    },
    {
      title: "Generated Bills",
      value: `${summary.todaysBillsCount || 0} Bills`,
      trend: "Peak Capacity",
      trendUp: true,
      subText: `Max Capacity ~${summary.todaysBillsCapacity || 700}/day`,
      icon: FileText,
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.12)"
    },
    {
      title: "Retail Outlets",
      value: `${summary.totalCustomers || 0} Outlets`,
      trend: `${summary.activeCustomers || 0} Active`,
      trendUp: true,
      subText: "Covered by 20 Salesmen",
      icon: Store,
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.12)"
    },
    {
      title: "Routes & Beats",
      value: `${summary.activeRoutes || 24} Active Beats`,
      trend: "100% Scheduled",
      trendUp: true,
      subText: "Territory Sales Coverage",
      icon: MapPin,
      color: "#0ea5e9",
      bgColor: "rgba(14, 165, 233, 0.12)"
    },
    {
      title: "FMCG Catalog",
      value: `${summary.totalProducts || 240} Products`,
      trend: "Active SKUs",
      trendUp: true,
      subText: "Nestlé, Patanjali, GSK",
      icon: Package,
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.12)"
    }
  ];

  return (
    <div className="responsive-kpi-grid">
      {kpiItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div key={index} className="glass-card responsive-kpi-card" style={{ padding: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{
                background: item.bgColor,
                color: item.color,
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <IconComponent size={20} />
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.74rem",
                fontWeight: "700",
                color: item.trendUp ? "#10b981" : "#ef4444",
                background: item.trendUp ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
                padding: "2px 7px",
                borderRadius: "6px"
              }}>
                {item.trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                <span>{item.trend}</span>
              </div>
            </div>

            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "3px" }}>
              {item.title}
            </div>
            <div className="responsive-kpi-val" style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "4px" }}>
              {item.value}
            </div>
            <div className="responsive-kpi-sub" style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
              {item.subText}
            </div>
          </div>
        );
      })}
    </div>
  );
}
