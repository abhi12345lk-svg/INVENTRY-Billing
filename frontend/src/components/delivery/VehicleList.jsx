import React, { useState, useEffect } from "react";
import { 
  Truck, 
  Search, 
  Plus, 
  RefreshCw, 
  User, 
  Phone, 
  Edit, 
  AlertCircle,
  Filter,
  CheckCircle2,
  Wrench
} from "lucide-react";
import { VehicleStatusBadge } from "./DeliveryStatusBadge";
import VehicleModal from "./VehicleModal";

export default function VehicleList({ token, user }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const fetchVehicles = async () => {
    setLoading(true);
    setError("");
    try {
      const qParams = new URLSearchParams({ limit: "50" });
      if (statusFilter !== "ALL") qParams.append("status", statusFilter);
      if (search.trim()) qParams.append("search", search.trim());

      const res = await fetch(`http://localhost:5005/api/vehicles?${qParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setVehicles(json.data || []);
      } else {
        setError(json.message || "Failed to load vehicles.");
      }
    } catch (err) {
      console.error("fetchVehicles error:", err);
      setError("Unable to connect to vehicle service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [statusFilter, token]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchVehicles();
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const canManageVehicles = ["SUPER_ADMIN", "ADMIN", "FINANCE"].includes(user?.role);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Toast */}
      {toastMessage && (
        <div style={{
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
        }}>
          ✓ {toastMessage}
        </div>
      )}

      {/* Top Banner */}
      <div className="glass-card" style={{
        padding: "20px 28px",
        background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(99, 102, 241, 0.08) 100%)",
        border: "1px solid rgba(99, 102, 241, 0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "rgba(99, 102, 241, 0.15)",
            color: "var(--primary-400)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(99, 102, 241, 0.3)"
          }}>
            <Truck size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>
              Distribution Transport Fleet
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
              Active FMCG delivery vans, mini trucks, assigned primary drivers, and capacity tracking
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={fetchVehicles}
            className="btn-secondary"
            style={{ padding: "10px 16px", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          {canManageVehicles && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary"
              style={{ padding: "10px 20px", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              <Plus size={16} />
              <span>Register Vehicle</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: "16px 20px", display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        {/* Status Filter Tabs */}
        <div style={{ display: "flex", gap: "6px", background: "var(--bg-secondary)", padding: "4px", borderRadius: "10px" }}>
          {[
            { id: "ALL", label: "All Fleet" },
            { id: "AVAILABLE", label: "Available" },
            { id: "ON_TRIP", label: "On Trip" },
            { id: "MAINTENANCE", label: "Maintenance" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                background: statusFilter === tab.id ? "var(--badge-brand-bg)" : "transparent",
                color: statusFilter === tab.id ? "var(--primary-400)" : "var(--text-muted)",
                border: "none",
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "0.82rem",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} style={{ minWidth: "280px", position: "relative" }}>
          <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by vehicle #, driver, type..."
            style={{
              width: "100%",
              padding: "9px 12px 9px 34px",
              borderRadius: "10px",
              border: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
              color: "var(--text-main)",
              fontSize: "0.85rem",
              outline: "none"
            }}
          />
        </form>
      </div>

      {/* Vehicles Table */}
      <div className="glass-card" style={{ overflow: "hidden", borderRadius: "14px", border: "1px solid var(--border-color)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ background: "var(--table-header-bg)", borderBottom: "1px solid var(--border-color)" }}>
              <th style={{ padding: "14px 16px", fontWeight: "700", color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase" }}>
                Vehicle Number
              </th>
              <th style={{ padding: "14px 16px", fontWeight: "700", color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase" }}>
                Type & Capacity
              </th>
              <th style={{ padding: "14px 16px", fontWeight: "700", color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase" }}>
                Primary Driver
              </th>
              <th style={{ padding: "14px 16px", fontWeight: "700", color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase" }}>
                Contact Number
              </th>
              <th style={{ padding: "14px 16px", fontWeight: "700", color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase", textAlign: "center" }}>
                Fleet Status
              </th>
              <th style={{ padding: "14px 16px", fontWeight: "700", color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase" }}>
                Active Route / Notes
              </th>
              {canManageVehicles && (
                <th style={{ padding: "14px 16px", fontWeight: "700", color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase", textAlign: "right" }}>
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: "50px", textAlign: "center", color: "var(--text-muted)" }}>
                  <div style={{ width: "32px", height: "32px", border: "3px solid rgba(99, 102, 241, 0.2)", borderTopColor: "var(--primary-400)", borderRadius: "50%", margin: "0 auto 12px", animation: "spin 1s linear infinite" }} />
                  <p>Loading fleet vehicles...</p>
                </td>
              </tr>
            ) : vehicles.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "50px", textAlign: "center", color: "var(--text-muted)" }}>
                  No vehicles found matching the criteria.
                </td>
              </tr>
            ) : (
              vehicles.map((v) => (
                <tr key={v.id || v.vehicleNumber} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: "800", color: "var(--text-main)", fontFamily: "monospace", fontSize: "0.92rem" }}>
                      {v.vehicleNumber}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      {v.vehicleCode}
                    </div>
                  </td>

                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: "700", color: "var(--text-main)" }}>
                      {v.vehicleType}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      Capacity: <strong>{v.capacity}</strong>
                    </div>
                  </td>

                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: "700", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <User size={13} color="var(--primary-400)" />
                      <span>{v.driverName}</span>
                    </div>
                  </td>

                  <td style={{ padding: "14px 16px", color: "var(--text-muted)" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Phone size={12} />
                      {v.driverMobile}
                    </span>
                  </td>

                  <td style={{ padding: "14px 16px", textAlign: "center" }}>
                    <VehicleStatusBadge status={v.status} />
                  </td>

                  <td style={{ padding: "14px 16px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {v.status === "ON_TRIP" ? (
                      <span style={{ color: "var(--primary-400)", fontWeight: "700" }}>
                        🚚 En route on trip
                      </span>
                    ) : v.notes ? (
                      v.notes
                    ) : (
                      "Available at depot"
                    )}
                  </td>

                  {canManageVehicles && (
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <button
                        onClick={() => setEditingVehicle(v)}
                        className="btn-secondary"
                        style={{
                          padding: "6px 12px",
                          fontSize: "0.75rem",
                          fontWeight: "700",
                          borderRadius: "8px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <Edit size={12} />
                        <span>Edit</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Register/Edit Vehicle Modal */}
      {(isAddModalOpen || editingVehicle) && (
        <VehicleModal
          vehicle={editingVehicle}
          token={token}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingVehicle(null);
          }}
          onSuccess={(msg) => {
            showToast(msg);
            fetchVehicles();
          }}
        />
      )}
    </div>
  );
}
