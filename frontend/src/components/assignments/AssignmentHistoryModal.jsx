import React, { useState, useEffect } from "react";
import { X, History, Store, UserCheck, Route as RouteIcon, Calendar, Clock, AlertCircle } from "lucide-react";

export default function AssignmentHistoryModal({ token, customer, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`http://localhost:5005/api/assignments/history/${customer.id}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        const json = await response.json();

        if (response.ok && json.success) {
          setHistory(json.data || []);
        } else {
          setError(json.message || "Failed to load assignment history.");
        }
      } catch (err) {
        console.error("Fetch history error:", err);
        setError("Unable to connect to Assignment Audit API.");
      } finally {
        setLoading(false);
      }
    };

    if (customer?.id) {
      fetchHistory();
    }
  }, [token, customer]);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(8px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div className="glass-card" style={{
        width: "100%",
        maxWidth: "680px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        display: "flex",
        flexDirection: "column",
        maxHeight: "85vh"
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--table-header-bg)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "rgba(99, 102, 241, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--primary-400)"
            }}>
              <History size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)", margin: 0 }}>
                Assignment Audit Trail & History
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                Complete chronological history of beat & representative changes
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Customer Context Summary Banner */}
        <div style={{
          padding: "14px 24px",
          background: "rgba(99, 102, 241, 0.05)",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Store size={18} style={{ color: "var(--primary-400)" }} />
            <div>
              <div style={{ fontWeight: "700", color: "var(--text-main)", fontSize: "0.9rem" }}>
                {customer?.shopName}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Code: {customer?.customerCode} • Owner: {customer?.ownerName}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
          {error && (
            <div style={{
              padding: "12px 16px",
              borderRadius: "8px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#f87171",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              Loading audit logs...
            </div>
          ) : history.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "40px",
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              border: "1px dashed var(--border-color)",
              borderRadius: "10px"
            }}>
              No historical assignment records found for this customer.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {history.map((rec, index) => (
                <div 
                  key={rec.id || index}
                  style={{
                    borderRadius: "12px",
                    border: rec.status === "ACTIVE" ? "1px solid rgba(16, 185, 129, 0.35)" : "1px solid var(--border-color)",
                    background: rec.status === "ACTIVE" ? "rgba(16, 185, 129, 0.04)" : "var(--bg-secondary)",
                    padding: "16px 20px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      background: rec.status === "ACTIVE" ? "rgba(16, 185, 129, 0.12)" : "rgba(148, 163, 184, 0.15)",
                      color: rec.status === "ACTIVE" ? "#34d399" : "var(--text-muted)",
                      border: `1px solid ${rec.status === "ACTIVE" ? "rgba(16, 185, 129, 0.3)" : "rgba(148, 163, 184, 0.25)"}`
                    }}>
                      <span style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: rec.status === "ACTIVE" ? "#10b981" : "#94a3b8"
                      }} />
                      {rec.status === "ACTIVE" ? "CURRENT ACTIVE ALLOCATION" : "HISTORICAL ARCHIVE"}
                    </span>

                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Assigned by: <strong style={{ color: "var(--text-main)" }}>{rec.assignedBy || "System Admin"}</strong>
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.85rem", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <UserCheck size={16} style={{ color: "var(--primary-400)" }} />
                      <div>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block" }}>Sales Representative:</span>
                        <strong style={{ color: "var(--text-main)" }}>{rec.salesmanName || rec.salesmanId}</strong>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <RouteIcon size={16} style={{ color: "var(--primary-400)" }} />
                      <div>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "block" }}>Beat / Route:</span>
                        <strong style={{ color: "var(--text-main)" }}>{rec.routeName || rec.routeId}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", fontSize: "0.75rem", color: "var(--text-muted)", borderTop: "1px solid var(--border-color)", paddingTop: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Calendar size={13} />
                      <span>From: {rec.effectiveFrom ? new Date(rec.effectiveFrom).toLocaleDateString() : "N/A"}</span>
                      {rec.effectiveTo && (
                        <span>→ To: {new Date(rec.effectiveTo).toLocaleDateString()}</span>
                      )}
                    </div>
                    {rec.reason && (
                      <div style={{ fontStyle: "italic", color: "var(--text-muted)" }}>
                        Reason: "{rec.reason}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 24px",
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "flex-end",
          background: "var(--table-header-bg)"
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
              color: "var(--text-main)",
              fontSize: "0.875rem",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
