import React from "react";
import { History, Clock, CheckCircle2, FileText, ShoppingBag, Coins, Truck, ShieldCheck } from "lucide-react";

export default function RecentActivity({ activityList }) {
  if (!activityList) return null;

  const getIcon = (type) => {
    switch (type) {
      case "order": return <ShoppingBag size={16} color="#6366f1" />;
      case "bill": return <FileText size={16} color="#3b82f6" />;
      case "payment": return <Coins size={16} color="#10b981" />;
      case "reconcile": return <CheckCircle2 size={16} color="#10b981" />;
      case "dispatch": return <Truck size={16} color="#f59e0b" />;
      case "approval": return <ShieldCheck size={16} color="#8b5cf6" />;
      default: return <Clock size={16} color="#64748b" />;
    }
  };

  return (
    <div className="glass-card" style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <History size={20} color="var(--primary-400)" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)" }}>
              Recent Audit & Activity Log
            </h3>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Live stream of transactions, bill locks, dispatch, and owner approvals
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {activityList.map((item) => (
          <div
            key={item.id}
            style={{
              background: "var(--bg-input)",
              borderRadius: "12px",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              border: "1px solid var(--border-card)"
            }}
          >
            <div style={{
              background: "var(--bg-card)",
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--border-card)"
            }}>
              {getIcon(item.type)}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.88rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "2px" }}>
                {item.action}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                By <strong style={{ color: "var(--text-sub)" }}>{item.user}</strong>
              </div>
            </div>

            <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-dim)", background: "var(--bg-card)", padding: "4px 10px", borderRadius: "8px" }}>
              {item.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
