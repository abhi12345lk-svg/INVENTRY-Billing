import React, { useState, useEffect } from "react";
import { X, ArrowRightLeft, CheckCircle2, AlertCircle, Store, Route as RouteIcon, UserCheck, MapPin } from "lucide-react";

export default function AssignCustomerModal({ token, customer, onClose, onSuccess }) {
  const [routes, setRoutes] = useState([]);
  const [salesmen, setSalesmen] = useState([]);
  
  const [formData, setFormData] = useState({
    routeId: customer?.routeId || "",
    salesmanId: customer?.salesmanId || "",
    reason: "Beat schedule optimization & workload rebalancing"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [routesRes, salesmenRes] = await Promise.all([
          fetch("http://localhost:5005/api/routes?status=ACTIVE&limit=100", { headers: { "Authorization": `Bearer ${token}` } }),
          fetch("http://localhost:5005/api/salesmen?status=ACTIVE&limit=100", { headers: { "Authorization": `Bearer ${token}` } })
        ]);

        const [routesJson, salesmenJson] = await Promise.all([
          routesRes.json(),
          salesmenRes.json()
        ]);

        if (routesJson.success && routesJson.data) {
          setRoutes(routesJson.data);
        }
        if (salesmenJson.success && salesmenJson.data) {
          setSalesmen(salesmenJson.data);
        }
      } catch (err) {
        console.error("Fetch lookups error:", err);
      }
    };

    fetchLookups();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.routeId) {
      setError("Please select a Beat / Route");
      return;
    }
    if (!formData.salesmanId) {
      setError("Please select a Sales Representative");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:5005/api/assignments/customer/${customer.id}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const json = await response.json();

      if (response.ok && json.success) {
        onSuccess(json.message || "Customer reassigned successfully");
        onClose();
      } else {
        setError(json.message || "Failed to reassign customer.");
      }
    } catch (err) {
      console.error("Reassign customer error:", err);
      setError("Server connection failed.");
    } finally {
      setLoading(false);
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
        maxWidth: "540px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        display: "flex",
        flexDirection: "column"
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
              <ArrowRightLeft size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)", margin: 0 }}>
                Reassign Beat & Salesman
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                Update operational pipeline for this customer outlet
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
          <div style={{ textAlign: "right", fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Current: <strong style={{ color: "var(--text-main)" }}>{customer?.salesmanName || "None"}</strong>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
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

          {/* Beat selection */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
              Target Beat / Route *
            </label>
            <select
              name="routeId"
              value={formData.routeId}
              onChange={handleChange}
              required
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
              <option value="">-- Select Route / Beat --</option>
              {routes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.routeName} ({r.routeCode}) — {r.areaName}
                </option>
              ))}
            </select>
          </div>

          {/* Salesman selection */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
              Assigned Field Representative *
            </label>
            <select
              name="salesmanId"
              value={formData.salesmanId}
              onChange={handleChange}
              required
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
              <option value="">-- Select Sales Representative --</option>
              {salesmen.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.salesmanCode} / Emp: {s.employeeCode})
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
              Reassignment Reason / Audit Trail Note
            </label>
            <input 
              type="text" 
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="e.g. Territory split, new salesman onboarding..."
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-main)",
                fontSize: "0.9rem",
                outline: "none"
              }}
            />
          </div>

          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
            * Reassignment automatically archives the previous assignment record with an expiration timestamp and marks the new assignment as active.
          </p>

          {/* Actions */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "8px",
            paddingTop: "16px",
            borderTop: "1px solid var(--border-color)"
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: "9px 18px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "transparent",
                color: "var(--text-main)",
                fontSize: "0.875rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "9px 22px",
                borderRadius: "8px",
                border: "none",
                background: "var(--primary-600)",
                color: "#ffffff",
                fontSize: "0.875rem",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              {loading ? "Reassigning..." : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Confirm Assignment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
