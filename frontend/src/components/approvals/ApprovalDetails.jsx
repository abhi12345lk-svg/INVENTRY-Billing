import React, { useState } from "react";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  FileCheck2, 
  Clock, 
  User, 
  History, 
  FileText,
  TrendingDown,
  Layers
} from "lucide-react";
import { ApprovalStatusBadge, ApprovalTypeBadge } from "./ApprovalStatusBadge";
import ApprovalDecisionModal from "./ApprovalDecisionModal";

export default function ApprovalDetails({ approval, token, user, onBack, onApprovalUpdated }) {
  const [currentApproval, setCurrentApproval] = useState(approval);
  const [decisionAction, setDecisionAction] = useState(null); // "APPROVE" | "REJECT" | null

  const isOwner = user && user.role === "SUPER_ADMIN";

  const handleDecisionSuccess = (updated) => {
    setCurrentApproval(updated);
    if (onApprovalUpdated) {
      onApprovalUpdated(updated);
    }
  };

  return (
    <div>
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <button
          onClick={onBack}
          className="btn-secondary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            fontSize: "0.85rem",
            cursor: "pointer"
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Approvals</span>
        </button>

        {isOwner && currentApproval.status === "PENDING" && (
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => setDecisionAction("REJECT")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 20px",
                borderRadius: "10px",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                background: "rgba(239, 68, 68, 0.15)",
                color: "#ef4444",
                fontWeight: "700",
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              <XCircle size={16} />
              <span>Reject Request</span>
            </button>

            <button
              onClick={() => setDecisionAction("APPROVE")}
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 22px",
                fontSize: "0.85rem",
                cursor: "pointer",
                background: "#10b981"
              }}
            >
              <CheckCircle2 size={16} />
              <span>Approve Request</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Title Card */}
      <div className="glass-card" style={{ padding: "24px 32px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: "800", color: "var(--primary-400)" }}>
                {currentApproval.approvalNumber}
              </span>
              <ApprovalTypeBadge type={currentApproval.approvalType} />
              <ApprovalStatusBadge status={currentApproval.status} />
              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  background: "var(--bg-input)",
                  color: "var(--text-muted)",
                  fontWeight: "700"
                }}
              >
                Module: {currentApproval.module}
              </span>
            </div>
            <h1 style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "8px" }}>
              {currentApproval.title}
            </h1>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", maxWidth: "850px", lineHeight: "1.5" }}>
              {currentApproval.description}
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side: Before vs After Comparison */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
        {/* Baseline / Current */}
        <div className="glass-card" style={{ padding: "22px", borderLeft: "4px solid #6b7280" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: "800", textTransform: "uppercase", marginBottom: "16px" }}>
            <FileText size={16} />
            <span>Original Baseline Data</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {Object.entries(currentApproval.currentData || {}).map(([key, val]) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                  background: "var(--bg-input)",
                  borderRadius: "8px",
                  fontSize: "0.85rem"
                }}
              >
                <span style={{ color: "var(--text-muted)", textTransform: "capitalize" }}>
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <strong style={{ color: "var(--text-main)" }}>
                  {typeof val === "number" ? `₹${val.toLocaleString("en-IN")}` : String(val)}
                </strong>
              </div>
            ))}
          </div>
        </div>

        {/* Requested Changes / Proposal */}
        <div className="glass-card" style={{ padding: "22px", borderLeft: "4px solid var(--primary-400)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--primary-400)", fontSize: "0.78rem", fontWeight: "800", textTransform: "uppercase", marginBottom: "16px" }}>
            <TrendingDown size={16} />
            <span>Requested Changes & Variance</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {Object.entries(currentApproval.requestedChanges || {}).map(([key, val]) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 12px",
                  background: "var(--bg-input)",
                  borderRadius: "8px",
                  fontSize: "0.85rem"
                }}
              >
                <span style={{ color: "var(--text-muted)", textTransform: "capitalize" }}>
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <strong style={{ color: key === "difference" ? "#ef4444" : "var(--primary-400)" }}>
                  {typeof val === "number" ? (val < 0 ? `-₹${Math.abs(val).toLocaleString("en-IN")}` : `₹${val.toLocaleString("en-IN")}`) : String(val)}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Request Details & Justification Card */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px", marginBottom: "24px" }}>
        {/* Requester & Reason */}
        <div className="glass-card" style={{ padding: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: "800", textTransform: "uppercase", marginBottom: "14px" }}>
            <User size={16} />
            <span>Submission Context</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Submitted By:</span>
              <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)" }}>
                {currentApproval.requestedByName}
              </div>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Submitted At:</span>
              <div style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>
                {new Date(currentApproval.requestedAt).toLocaleString("en-IN")}
              </div>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Business Justification:</span>
              <div
                style={{
                  background: "var(--bg-input)",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-card)",
                  fontSize: "0.85rem",
                  color: "var(--text-main)",
                  marginTop: "4px",
                  lineHeight: "1.4"
                }}
              >
                "{currentApproval.reason}"
              </div>
            </div>
          </div>
        </div>

        {/* Reviewer Decision Record */}
        <div className="glass-card" style={{ padding: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: "800", textTransform: "uppercase", marginBottom: "14px" }}>
            <FileCheck2 size={16} />
            <span>Decision Record</span>
          </div>

          {currentApproval.reviewedAt ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Decision:</span>
                <div>
                  <ApprovalStatusBadge status={currentApproval.status} />
                </div>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Reviewed By:</span>
                <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-main)" }}>
                  {currentApproval.reviewerName}
                </div>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Reviewed At:</span>
                <div style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>
                  {new Date(currentApproval.reviewedAt).toLocaleString("en-IN")}
                </div>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Decision Note:</span>
                <div
                  style={{
                    background: currentApproval.status === "APPROVED" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                    border: `1px solid ${currentApproval.status === "APPROVED" ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.25)"}`,
                    color: "var(--text-main)",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    marginTop: "4px"
                  }}
                >
                  {currentApproval.decisionNote}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic", padding: "20px 0" }}>
              Awaiting review and authorization by Super Admin (Owner).
            </div>
          )}
        </div>
      </div>

      {/* Audit History Timeline */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
          <History size={18} color="var(--primary-400)" />
          <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)" }}>
            Immutable Audit History
          </h3>
        </div>

        {currentApproval.auditHistory && currentApproval.auditHistory.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {currentApproval.auditHistory.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  padding: "12px 16px",
                  background: "var(--bg-input)",
                  borderRadius: "10px",
                  border: "1px solid var(--border-card)"
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: item.action === "APPROVAL_APPROVED" ? "#10b981" : item.action === "APPROVAL_REJECTED" ? "#ef4444" : "var(--primary-400)",
                    marginTop: "6px"
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--text-main)" }}>
                      {item.action}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {new Date(item.performedAt).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    <span style={{ color: "var(--primary-400)", fontWeight: "600" }}>{item.performedBy}</span>: {item.note}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            No audit records created yet.
          </div>
        )}
      </div>

      {decisionAction && (
        <ApprovalDecisionModal
          approval={currentApproval}
          action={decisionAction}
          token={token}
          onClose={() => setDecisionAction(null)}
          onSuccess={handleDecisionSuccess}
        />
      )}
    </div>
  );
}
