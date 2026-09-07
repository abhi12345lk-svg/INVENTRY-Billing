import React, { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Coins, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Sparkles,
  Layers,
  FileCheck2
} from "lucide-react";
import ExceptionList from "./ExceptionList";

export default function ExceptionDashboard({ token, user, onSelectException, onNavigateToApprovals }) {
  const [summary, setSummary] = useState(null);
  const [approvalSummary, setApprovalSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const fetchSummaries = async () => {
    setLoading(true);
    try {
      const [excRes, aprRes] = await Promise.all([
        fetch("http://localhost:5005/api/exceptions/summary", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch("http://localhost:5005/api/approvals/summary", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const [excJson, aprJson] = await Promise.all([excRes.json(), aprRes.json()]);
      if (excJson.success) setSummary(excJson.data);
      if (aprJson.success) setApprovalSummary(aprJson.data);
    } catch (err) {
      console.error("Failed to load dashboard summaries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, [token]);

  const handleRefresh = async () => {
    setResetting(true);
    try {
      await fetchSummaries();
      setToastMessage("Surveillance metrics refreshed");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "#10b981",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "14px",
            fontWeight: "700",
            fontSize: "0.9rem",
            boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)",
            zIndex: 2000
          }}
        >
          ✓ {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: "24px 32px",
          background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(239, 68, 68, 0.1) 100%)",
          border: "1px solid rgba(239, 68, 68, 0.25)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}
      >
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#ef4444", fontSize: "0.82rem", fontWeight: "800", marginBottom: "6px" }}>
            <ShieldAlert size={16} />
            EXECUTIVE RISK & EXCEPTION TOWER
          </div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "4px" }}>
            Owner Exception & Control Center
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Unified real-time surveillance over cash tally, unmapped UPI, stockouts, overdue accounts & deliveries.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={handleRefresh}
            disabled={resetting}
            className="btn-secondary"
            style={{
              padding: "8px 16px",
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}
            title="Refresh exception metrics"
          >
            <RotateCcw size={14} />
            <span>{resetting ? "Refreshing..." : "Refresh"}</span>
          </button>

          {onNavigateToApprovals && (
            <button
              onClick={onNavigateToApprovals}
              className="btn-primary"
              style={{
                padding: "8px 18px",
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
              }}
            >
              <FileCheck2 size={16} />
              <span>Go to Approvals Queue ({approvalSummary?.pending || 0})</span>
            </button>
          )}
        </div>
      </div>

      {/* Top 5 KPI Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px"
        }}
      >
        {/* Open Exceptions */}
        <div
          className="glass-card"
          style={{
            padding: "20px",
            borderLeft: "4px solid #ef4444"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Total Open Issues
            </span>
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--text-main)" }}>
            {summary?.totalOpen ?? "—"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Active distributor alerts
          </div>
        </div>

        {/* Critical */}
        <div
          className="glass-card"
          style={{
            padding: "20px",
            borderLeft: "4px solid #ef4444"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#ef4444", textTransform: "uppercase" }}>
              Critical
            </span>
            <ShieldAlert size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#ef4444" }}>
            {summary?.critical ?? "—"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Immediate operational stop
          </div>
        </div>

        {/* High Priority */}
        <div
          className="glass-card"
          style={{
            padding: "20px",
            borderLeft: "4px solid #f97316"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#f97316", textTransform: "uppercase" }}>
              High Priority
            </span>
            <AlertTriangle size={18} color="#f97316" />
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#f97316" }}>
            {summary?.high ?? "—"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Action required today
          </div>
        </div>

        {/* Warnings */}
        <div
          className="glass-card"
          style={{
            padding: "20px",
            borderLeft: "4px solid #eab308"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#eab308", textTransform: "uppercase" }}>
              Warnings
            </span>
            <Clock size={18} color="#eab308" />
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#eab308" }}>
            {summary?.warning ?? "—"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Monitor & tally
          </div>
        </div>

        {/* Pending Approvals */}
        <div
          className="glass-card"
          onClick={onNavigateToApprovals}
          style={{
            padding: "20px",
            borderLeft: "4px solid var(--primary-400)",
            cursor: "pointer"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--primary-400)", textTransform: "uppercase" }}>
              Pending Approvals
            </span>
            <FileCheck2 size={18} color="var(--primary-400)" />
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--primary-400)" }}>
            {approvalSummary?.pending ?? "—"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Awaiting Owner signoff →
          </div>
        </div>
      </div>

      {/* Critical Highlight Section */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldAlert size={20} color="#ef4444" />
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#ef4444" }}>
              CRITICAL BUSINESS ISSUES (IMMEDIATE ACTION)
            </h3>
          </div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            Auto-surfaced by System Surveillance Engine
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "16px" }}>
          {/* Out of Stock Card */}
          <div
            style={{
              background: "var(--bg-input)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "14px",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", padding: "2px 8px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: "800" }}>
                  INVENTORY
                </span>
                <span style={{ fontSize: "0.75rem", color: "#ef4444", fontWeight: "700" }}>Available: 0</span>
              </div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
                Patanjali Pure Honey 500g Out Of Stock
              </h4>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "14px" }}>
                Stock exhausted in central warehouse. 8 pending salesman orders waiting.
              </p>
            </div>
            <button
              onClick={() => onSelectException({ id: "exc-01", exceptionNumber: "EXC-2026-00001" })}
              className="btn-secondary"
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "0.78rem",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                cursor: "pointer"
              }}
            >
              <span>Review Stock Issue</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Overdue Customer Card */}
          <div
            style={{
              background: "var(--bg-input)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "14px",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", padding: "2px 8px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: "800" }}>
                  RECEIVABLES
                </span>
                <span style={{ fontSize: "0.75rem", color: "#ef4444", fontWeight: "700" }}>Overdue: 62 Days</span>
              </div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
                Sharma General Store — ₹90,000 Overdue
              </h4>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "14px" }}>
                Account balance exceeded credit lock grace limit. Dispatch locked.
              </p>
            </div>
            <button
              onClick={() => onSelectException({ id: "exc-02", exceptionNumber: "EXC-2026-00002" })}
              className="btn-secondary"
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "0.78rem",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                cursor: "pointer"
              }}
            >
              <span>Review Credit Lock</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Cash Difference Card */}
          <div
            style={{
              background: "var(--bg-input)",
              border: "1px solid rgba(249, 115, 22, 0.4)",
              borderRadius: "14px",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ background: "rgba(249, 115, 22, 0.15)", color: "#f97316", padding: "2px 8px", borderRadius: "6px", fontSize: "0.72rem", fontWeight: "800" }}>
                  PAYMENTS
                </span>
                <span style={{ fontSize: "0.75rem", color: "#f97316", fontWeight: "700" }}>Shortage: -₹100</span>
              </div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
                E-Cash Collection Discrepancy (Rahul Kumar)
              </h4>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "14px" }}>
                Handed over ₹28,400 vs Expected collection ₹28,500.
              </p>
            </div>
            <button
              onClick={() => onSelectException({ id: "exc-03", exceptionNumber: "EXC-2026-00003" })}
              className="btn-secondary"
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "0.78rem",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                cursor: "pointer"
              }}
            >
              <span>Review Cash Tally</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Exception Register Table */}
      <ExceptionList
        token={token}
        onSelectException={onSelectException}
      />
    </div>
  );
}
