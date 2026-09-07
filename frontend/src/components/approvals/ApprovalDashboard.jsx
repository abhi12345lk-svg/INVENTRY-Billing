import React, { useState, useEffect } from "react";
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  FileText,
  AlertTriangle
} from "lucide-react";
import { ApprovalStatusBadge, ApprovalTypeBadge } from "./ApprovalStatusBadge";
import ApprovalList from "./ApprovalList";
import ApprovalDecisionModal from "./ApprovalDecisionModal";

export default function ApprovalDashboard({ token, user, onSelectApproval }) {
  const [summary, setSummary] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDecision, setActiveDecision] = useState(null); // { approval, action }

  const isOwner = user && user.role === "SUPER_ADMIN";

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [sumRes, listRes] = await Promise.all([
        fetch("http://localhost:5005/api/approvals/summary", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch("http://localhost:5005/api/approvals?status=PENDING&limit=3", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const [sumJson, listJson] = await Promise.all([sumRes.json(), listRes.json()]);
      if (sumJson.success) setSummary(sumJson.data);
      if (listJson.success) setPendingRequests(listJson.data.approvals || []);
    } catch (err) {
      console.error("Failed to load approvals dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: "24px 32px",
          background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(99, 102, 241, 0.1) 100%)",
          border: "1px solid rgba(99, 102, 241, 0.25)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}
      >
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--primary-400)", fontSize: "0.82rem", fontWeight: "800", marginBottom: "6px" }}>
            <ShieldCheck size={16} />
            EXECUTIVE SIGN-OFF DESK
          </div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "4px" }}>
            Owner Approval Queue
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Review, authorize or reject field bill amendments, duplicate payment cancellations, and stock write-offs.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border-card)",
              borderRadius: "10px",
              padding: "8px 16px",
              fontSize: "0.8rem",
              fontWeight: "700",
              color: "var(--primary-400)"
            }}
          >
            Owner Role: {user?.role || "SUPER_ADMIN"}
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
        {/* Pending Approvals */}
        <div className="glass-card" style={{ padding: "20px", borderLeft: "4px solid var(--primary-400)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--primary-400)", textTransform: "uppercase" }}>
              Pending Owner Decision
            </span>
            <Clock size={18} color="var(--primary-400)" />
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--primary-400)" }}>
            {summary?.pending ?? "—"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Requires immediate executive review
          </div>
        </div>

        {/* Approved Decisions */}
        <div className="glass-card" style={{ padding: "20px", borderLeft: "4px solid #10b981" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#10b981", textTransform: "uppercase" }}>
              Approved Today
            </span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#10b981" }}>
            {summary?.approvedToday ?? "—"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Applied with permanent audit trail
          </div>
        </div>

        {/* Rejected Decisions */}
        <div className="glass-card" style={{ padding: "20px", borderLeft: "4px solid #ef4444" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#ef4444", textTransform: "uppercase" }}>
              Rejected Requests
            </span>
            <XCircle size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#ef4444" }}>
            {summary?.rejectedToday ?? "—"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Locked against unauthorized adjustments
          </div>
        </div>
      </div>

      {/* Pending Action Items Section */}
      {pendingRequests.length > 0 && (
        <div className="glass-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FileCheck2 size={18} color="var(--primary-400)" />
              <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--text-main)" }}>
                Pending Sign-Off Requests
              </h3>
            </div>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Direct action cards
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
            {pendingRequests.map((apr) => (
              <div
                key={apr.id || apr._id}
                style={{
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "14px",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <ApprovalTypeBadge type={apr.approvalType} />
                    <span style={{ fontSize: "0.75rem", color: "var(--primary-400)", fontWeight: "700" }}>
                      {apr.approvalNumber}
                    </span>
                  </div>

                  <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
                    {apr.title}
                  </h4>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "8px" }}>
                    By: <strong style={{ color: "var(--text-main)" }}>{apr.requestedByName}</strong>
                  </div>

                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "14px", lineHeight: "1.4" }}>
                    Reason: <em>"{apr.reason}"</em>
                  </p>
                </div>

                {isOwner ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <button
                      onClick={() => setActiveDecision({ approval: apr, action: "REJECT" })}
                      style={{
                        padding: "7px 12px",
                        borderRadius: "8px",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        background: "rgba(239, 68, 68, 0.1)",
                        color: "#ef4444",
                        fontSize: "0.78rem",
                        fontWeight: "700",
                        cursor: "pointer"
                      }}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => setActiveDecision({ approval: apr, action: "APPROVE" })}
                      className="btn-primary"
                      style={{
                        padding: "7px 12px",
                        fontSize: "0.78rem",
                        fontWeight: "700",
                        cursor: "pointer",
                        background: "#10b981"
                      }}
                    >
                      Approve
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onSelectApproval(apr)}
                    className="btn-secondary"
                    style={{ width: "100%", padding: "7px", fontSize: "0.78rem", cursor: "pointer" }}
                  >
                    View Details
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Approval Register Table */}
      <ApprovalList
        token={token}
        onSelectApproval={onSelectApproval}
      />

      {/* Decision Modal */}
      {activeDecision && (
        <ApprovalDecisionModal
          approval={activeDecision.approval}
          action={activeDecision.action}
          token={token}
          onClose={() => setActiveDecision(null)}
          onSuccess={() => {
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
}
