import React, { useState, useEffect } from "react";
import { X, Route as RouteIcon, CheckCircle2, AlertCircle, Trash2, Plus, Calendar, MapPin } from "lucide-react";

export default function SalesmanRouteAssignModal({ token, salesman, onClose, onSuccess }) {
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [assignedRoutes, setAssignedRoutes] = useState(salesman?.assignedRoutes || []);
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [reason, setReason] = useState("Regular scheduled beat assignment");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch all active routes
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await fetch("http://localhost:5005/api/routes?status=ACTIVE&limit=100", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success && json.data) {
          setAvailableRoutes(json.data);
          if (json.data.length > 0) {
            setSelectedRouteId(json.data[0].id);
          }
        }
      } catch (err) {
        console.error("Fetch routes error:", err);
      }
    };
    fetchRoutes();
  }, [token]);

  // Refresh salesman details to sync assigned routes
  const refreshAssignedRoutes = async () => {
    try {
      const res = await fetch(`http://localhost:5005/api/salesmen/${salesman.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAssignedRoutes(json.data.assignedRoutes || []);
      }
    } catch (err) {
      console.error("Refresh salesman routes error:", err);
    }
  };

  const handleAssignRoute = async (e) => {
    e.preventDefault();
    if (!selectedRouteId) {
      setError("Please select a route to assign");
      return;
    }

    setActionLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:5005/api/salesmen/${salesman.id}/routes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          routeId: selectedRouteId,
          reason
        })
      });

      const json = await response.json();

      if (response.ok && json.success) {
        await refreshAssignedRoutes();
        onSuccess(json.message || "Route assigned successfully");
      } else {
        setError(json.message || "Failed to assign route.");
      }
    } catch (err) {
      console.error("Assign route error:", err);
      setError("Server connection failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveRoute = async (routeId) => {
    if (!window.confirm("Are you sure you want to unassign this route from this salesman?")) {
      return;
    }

    setActionLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:5005/api/salesmen/${salesman.id}/routes/${routeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const json = await response.json();

      if (response.ok && json.success) {
        await refreshAssignedRoutes();
        onSuccess(json.message || "Route unassigned successfully");
      } else {
        setError(json.message || "Failed to unassign route.");
      }
    } catch (err) {
      console.error("Unassign route error:", err);
      setError("Server connection failed.");
    } finally {
      setActionLoading(false);
    }
  };

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
        maxWidth: "600px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        display: "flex",
        flexDirection: "column",
        maxHeight: "90vh"
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
              <RouteIcon size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)", margin: 0 }}>
                Manage Beat Allocations
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                Salesman: <strong style={{ color: "var(--text-main)" }}>{salesman.name}</strong> ({salesman.salesmanCode})
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

        {/* Content */}
        <div style={{ padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>
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

          {/* Current Active Routes Section */}
          <div>
            <h4 style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "12px" }}>
              Currently Assigned Beats ({assignedRoutes.length})
            </h4>
            
            {assignedRoutes.length === 0 ? (
              <div style={{
                padding: "20px",
                borderRadius: "10px",
                border: "1px dashed var(--border-color)",
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: "0.85rem"
              }}>
                No beats currently assigned to this representative.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {assignedRoutes.map((rt) => (
                  <div
                    key={rt.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      borderRadius: "10px",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-color)"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "0.75rem", fontWeight: "700", color: "var(--primary-400)" }}>
                          {rt.routeCode}
                        </span>
                        <span style={{ fontWeight: "700", color: "var(--text-main)", fontSize: "0.9rem" }}>
                          {rt.routeName}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <MapPin size={12} />
                          {rt.areaName || "Territory"}
                        </span>
                        <span>Visit: {Array.isArray(rt.visitDays) ? rt.visitDays.join(", ") : "N/A"}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveRoute(rt.id)}
                      disabled={actionLoading}
                      title="Deallocate Beat"
                      style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        background: "rgba(239, 68, 68, 0.1)",
                        color: "#f87171",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        cursor: actionLoading ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Unassign</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Allocate New Beat Section */}
          <div style={{
            padding: "16px",
            borderRadius: "12px",
            background: "rgba(99, 102, 241, 0.05)",
            border: "1px solid rgba(99, 102, 241, 0.2)"
          }}>
            <h4 style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Plus size={16} style={{ color: "var(--primary-400)" }} />
              Assign Additional Beat
            </h4>

            <form onSubmit={handleAssignRoute} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
                  Select Beat to Allocate *
                </label>
                <select
                  value={selectedRouteId}
                  onChange={(e) => setSelectedRouteId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-main)",
                    fontSize: "0.9rem",
                    outline: "none",
                    cursor: "pointer"
                  }}
                >
                  {availableRoutes.map((rt) => {
                    const alreadyAssigned = assignedRoutes.some(ar => ar.id === rt.id);
                    return (
                      <option key={rt.id} value={rt.id} disabled={alreadyAssigned}>
                        {rt.routeName} ({rt.routeCode}) {alreadyAssigned ? "— [Already Assigned]" : `— ${rt.areaName || ""}`}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
                  Assignment Reason / Notes
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Beat reassignment, temporary relief..."
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-main)",
                    fontSize: "0.85rem",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px" }}>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{
                    padding: "9px 18px",
                    borderRadius: "8px",
                    border: "none",
                    background: "var(--primary-600)",
                    color: "#ffffff",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: actionLoading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <Plus size={16} />
                  <span>{actionLoading ? "Assigning..." : "Assign Beat"}</span>
                </button>
              </div>
            </form>
          </div>
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
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
