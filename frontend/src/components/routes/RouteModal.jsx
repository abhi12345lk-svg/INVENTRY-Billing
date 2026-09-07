import React, { useState, useEffect } from "react";
import { X, Route as RouteIcon, CheckCircle2, AlertCircle, MapPin, Calendar } from "lucide-react";

const ALL_DAYS = [
  { code: "MON", label: "Monday" },
  { code: "TUE", label: "Tuesday" },
  { code: "WED", label: "Wednesday" },
  { code: "THU", label: "Thursday" },
  { code: "FRI", label: "Friday" },
  { code: "SAT", label: "Saturday" },
  { code: "SUN", label: "Sunday" }
];

export default function RouteModal({ token, route = null, onClose, onSuccess }) {
  const isEdit = Boolean(route && route.id);

  const [formData, setFormData] = useState({
    routeName: "",
    areaId: "",
    visitDays: ["MON", "WED", "FRI"],
    sequence: 1,
    status: "ACTIVE"
  });

  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load area options
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch("http://localhost:5005/api/areas?status=ACTIVE&limit=100", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success && json.data) {
          setAreas(json.data);
          if (!route && json.data.length > 0) {
            setFormData(prev => ({ ...prev, areaId: json.data[0].id }));
          }
        }
      } catch (e) {
        console.error("Error loading areas for route modal:", e);
      }
    };
    fetchAreas();
  }, [token, route]);

  useEffect(() => {
    if (route) {
      setFormData({
        routeName: route.routeName || "",
        areaId: route.areaId || "",
        visitDays: Array.isArray(route.visitDays) ? route.visitDays : ["MON"],
        sequence: route.sequence || 1,
        status: route.status || "ACTIVE"
      });
    }
  }, [route]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDay = (dayCode) => {
    setFormData(prev => {
      const exists = prev.visitDays.includes(dayCode);
      const updated = exists 
        ? prev.visitDays.filter(d => d !== dayCode)
        : [...prev.visitDays, dayCode];
      return { ...prev, visitDays: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.routeName.trim()) {
      setError("Route / Beat Name is required");
      return;
    }
    if (!formData.areaId) {
      setError("Territory / Area selection is required");
      return;
    }
    if (formData.visitDays.length === 0) {
      setError("Please select at least one visit day for this beat");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url = isEdit 
        ? `http://localhost:5005/api/routes/${route.id}`
        : "http://localhost:5005/api/routes";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          sequence: Number(formData.sequence) || 1
        })
      });

      const json = await response.json();

      if (response.ok && json.success) {
        onSuccess(json.message || (isEdit ? "Route updated successfully" : "Route created successfully"));
        onClose();
      } else {
        setError(json.message || "Failed to save route.");
      }
    } catch (err) {
      console.error("Save route error:", err);
      setError("Unable to connect to server API.");
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
              <RouteIcon size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)", margin: 0 }}>
                {isEdit ? "Edit Route / Beat" : "Add New Route / Beat"}
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                {isEdit ? `Modifying: ${route?.routeCode}` : "Configure beat schedule, visit frequency and area"}
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

          {isEdit && (
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)", marginBottom: "6px" }}>
                Route Code (Immutable)
              </label>
              <input 
                type="text" 
                value={route.routeCode} 
                disabled 
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  fontFamily: "monospace"
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
              Route / Beat Name *
            </label>
            <input 
              type="text" 
              name="routeName"
              value={formData.routeName}
              onChange={handleChange}
              placeholder="e.g. Route A - Sadar Bazaar Wholesale"
              required
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

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
              Allocated Territory / Area *
            </label>
            <select
              name="areaId"
              value={formData.areaId}
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
              <option value="">-- Select Area --</option>
              {areas.map(a => (
                <option key={a.id} value={a.id}>{a.areaName} ({a.areaCode})</option>
              ))}
            </select>
          </div>

          {/* Visit Days Selection */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "8px" }}>
              Weekly Beat Visit Days *
            </label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {ALL_DAYS.map(day => {
                const isSelected = formData.visitDays.includes(day.code);
                return (
                  <button
                    key={day.code}
                    type="button"
                    onClick={() => toggleDay(day.code)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: isSelected ? "var(--primary-600)" : "var(--bg-secondary)",
                      color: isSelected ? "#ffffff" : "var(--text-muted)",
                      border: isSelected ? "1px solid var(--primary-600)" : "1px solid var(--border-color)",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <span>{day.code}</span>
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "6px" }}>
              Selected: {formData.visitDays.join(", ") || "None"}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
                Sequence Order
              </label>
              <input 
                type="number" 
                name="sequence"
                value={formData.sequence}
                onChange={handleChange}
                min="1"
                max="999"
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

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "6px" }}>
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
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
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "12px",
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
              {loading ? "Saving..." : (
                <>
                  <CheckCircle2 size={16} />
                  <span>{isEdit ? "Update Route" : "Save Route"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
