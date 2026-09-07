import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Edit3, 
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Route as RouteIcon
} from "lucide-react";

export default function AreaList({ 
  token, 
  userRole = "SUPER_ADMIN", 
  onOpenAddModal, 
  onOpenEditModal, 
  onToggleStatus 
}) {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const canModify = ["SUPER_ADMIN", "ADMIN", "SALES_MANAGER"].includes(userRole);

  const fetchAreas = async () => {
    setLoading(true);
    setError("");

    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        search: search.trim(),
        status: statusFilter
      });

      const response = await fetch(`http://localhost:5005/api/areas?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setAreas(json.data);
        setTotalPages(json.totalPages);
        setTotalRecords(json.total);
      } else {
        setError(json.message || "Failed to load areas.");
      }
    } catch (err) {
      console.error("Fetch areas error:", err);
      setError("Unable to connect to Area Master API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchAreas();
    }, 300);

    return () => clearTimeout(handler);
  }, [search, statusFilter, page]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
              Area Master
            </h2>
            <span style={{
              background: "var(--badge-brand-bg)",
              color: "var(--primary-400)",
              fontSize: "0.75rem",
              fontWeight: "700",
              padding: "3px 10px",
              borderRadius: "20px",
              border: "1px solid rgba(99, 102, 241, 0.3)"
            }}>
              {totalRecords} Territories
            </span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Distribution zones, wholesale sectors, and market boundaries in Raipur
          </p>
        </div>

        {canModify && (
          <button
            onClick={onOpenAddModal}
            className="glow-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              color: "#ffffff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(99, 102, 241, 0.35)"
            }}
          >
            <Plus size={18} />
            <span>Add Area</span>
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="glass-card" style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px"
      }}>
        <div style={{ position: "relative", flex: "1 1 280px", minWidth: "240px" }}>
          <Search size={18} color="var(--text-dim)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Search area name or code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{
              width: "100%",
              background: "var(--bg-input)",
              border: "1px solid var(--border-card)",
              color: "var(--text-main)",
              borderRadius: "12px",
              padding: "10px 16px 10px 42px",
              fontSize: "0.88rem",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: "600" }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border-card)",
              color: "var(--text-main)",
              borderRadius: "10px",
              padding: "8px 12px",
              fontSize: "0.85rem",
              outline: "none"
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
        {loading && (
          <div style={{ padding: "60px", textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{
              width: "36px",
              height: "36px",
              border: "3px solid rgba(99, 102, 241, 0.2)",
              borderTopColor: "var(--primary-400)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px auto"
            }} />
            <span>Loading Areas...</span>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {!loading && error && (
          <div style={{ padding: "40px", textAlign: "center", color: "#fca5a5" }}>
            <AlertCircle size={32} style={{ marginBottom: "12px" }} />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && areas.length === 0 && (
          <div style={{ padding: "60px", textAlign: "center", color: "var(--text-muted)" }}>
            <MapPin size={40} color="var(--text-dim)" style={{ marginBottom: "12px" }} />
            <h4 style={{ color: "var(--text-main)", marginBottom: "4px" }}>No Areas Found</h4>
            <p style={{ fontSize: "0.85rem" }}>Try adjusting your search or filters.</p>
          </div>
        )}

        {!loading && !error && areas.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{
                  borderBottom: "1px solid var(--border-card)",
                  background: "var(--table-header-bg)",
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  <th style={{ padding: "14px 20px" }}>Area Code</th>
                  <th style={{ padding: "14px 20px" }}>Area Name</th>
                  <th style={{ padding: "14px 20px" }}>Description</th>
                  <th style={{ padding: "14px 20px", textAlign: "center" }}>Status</th>
                  <th style={{ padding: "14px 20px", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {areas.map((a) => {
                  const isActive = a.status === "ACTIVE";
                  return (
                    <tr key={a.id} className="table-row-hover" style={{ borderBottom: "1px solid var(--border-card)" }}>
                      <td style={{ padding: "14px 20px", fontWeight: "700", color: "var(--primary-400)" }}>
                        <span style={{
                          background: "var(--badge-brand-bg)",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "0.78rem",
                          fontFamily: "monospace"
                        }}>
                          {a.areaCode}
                        </span>
                      </td>

                      <td style={{ padding: "14px 20px", fontWeight: "700", color: "var(--text-main)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <MapPin size={16} color="var(--primary-400)" />
                          <span>{a.areaName}</span>
                        </div>
                      </td>

                      <td style={{ padding: "14px 20px", color: "var(--text-muted)", maxWidth: "360px" }}>
                        {a.description || "—"}
                      </td>

                      <td style={{ padding: "14px 20px", textAlign: "center" }}>
                        <span style={{
                          background: isActive ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                          color: isActive ? "#34d399" : "#f87171",
                          border: `1px solid ${isActive ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "0.75rem",
                          fontWeight: "700",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px"
                        }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: isActive ? "#10b981" : "#ef4444" }} />
                          {a.status}
                        </span>
                      </td>

                      <td style={{ padding: "14px 20px", textAlign: "center" }}>
                        {canModify && (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                            <button
                              onClick={() => onOpenEditModal(a)}
                              title="Edit Area"
                              style={{
                                background: "var(--bg-input)",
                                border: "1px solid var(--border-card)",
                                color: "var(--text-muted)",
                                padding: "6px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center"
                              }}
                            >
                              <Edit3 size={15} />
                            </button>

                            <button
                              onClick={() => onToggleStatus(a)}
                              title={isActive ? "Deactivate Area" : "Activate Area"}
                              style={{
                                background: "var(--bg-input)",
                                border: "1px solid var(--border-card)",
                                color: isActive ? "#f87171" : "#34d399",
                                padding: "6px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center"
                              }}
                            >
                              {isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && areas.length > 0 && (
          <div style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border-card)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            background: "var(--table-header-bg)"
          }}>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Showing <span style={{ color: "var(--text-main)", fontWeight: "700" }}>{areas.length}</span> of <span style={{ color: "var(--text-main)", fontWeight: "700" }}>{totalRecords}</span> territories
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-card)",
                  color: page <= 1 ? "var(--text-dim)" : "var(--text-main)",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  cursor: page <= 1 ? "not-allowed" : "pointer"
                }}
              >
                <ChevronLeft size={15} />
              </button>
              <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)" }}>
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-card)",
                  color: page >= totalPages ? "var(--text-dim)" : "var(--text-main)",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  cursor: page >= totalPages ? "not-allowed" : "pointer"
                }}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
