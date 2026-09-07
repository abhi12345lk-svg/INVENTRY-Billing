import React, { useState, useEffect } from "react";
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Plus,
  Play,
  CheckCheck,
  Calendar
} from "lucide-react";
import { TripStatusBadge } from "./TripStatusBadge";

export default function DeliveryDashboard({ token, user, onNavigate, onSelectTrip }) {
  const [summary, setSummary] = useState(null);
  const [activeTrips, setActiveTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [sumRes, tripsRes] = await Promise.all([
        fetch("http://localhost:5005/api/delivery/summary/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch("http://localhost:5005/api/delivery/trips?limit=6", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const sumJson = await sumRes.json();
      const tripsJson = await tripsRes.json();

      if (sumRes.ok && sumJson.success) {
        setSummary(sumJson.data);
      } else {
        setError(sumJson.message || "Failed to load delivery summary.");
      }

      if (tripsRes.ok && tripsJson.success) {
        setActiveTrips(tripsJson.data || []);
      }
    } catch (err) {
      console.error("fetchDashboardData error:", err);
      setError("Unable to connect to delivery service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  if (loading) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center", color: "var(--text-muted)" }}>
        <div style={{ width: "36px", height: "36px", border: "3px solid rgba(99, 102, 241, 0.2)", borderTopColor: "var(--primary-400)", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 1s linear infinite" }} />
        <p>Connecting to delivery & dispatch service...</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="glass-card" style={{ padding: "40px", textAlign: "center", maxWidth: "500px", margin: "40px auto" }}>
        <AlertCircle size={40} color="#ef4444" style={{ marginBottom: "12px" }} />
        <h3 style={{ color: "#f87171" }}>Failed to Load Delivery Dashboard</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{error}</p>
        <button onClick={fetchDashboardData} className="btn-primary" style={{ marginTop: "16px" }}>
          Retry
        </button>
      </div>
    );
  }

  const {
    vehiclesTotal = 6,
    vehiclesAvailable = 4,
    vehiclesOnTrip = 1,
    activeTripsCount = 1,
    readyTripsCount = 1,
    billsReadyForDispatchCount = 5,
    outForDelivery = 2,
    deliveredToday = 9,
    exceptions = []
  } = summary;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Banner */}
      <div className="glass-card" style={{
        padding: "24px 32px",
        background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(99, 102, 241, 0.1) 100%)",
        border: "1px solid rgba(99, 102, 241, 0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--primary-400)",
            fontSize: "0.82rem",
            fontWeight: "700",
            marginBottom: "6px"
          }}>
            <Truck size={16} />
            DISPATCH & LOGISTICS ENGINE
          </div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--text-main)", margin: 0 }}>
            Dispatch & Delivery Operations
          </h1>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
            Real-time fleet tracking, vehicle trip dispatching, and customer invoice delivery reconciliation
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={fetchDashboardData}
            className="btn-secondary"
            style={{ padding: "10px 16px", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => onNavigate("delivery-ready")}
            className="btn-primary"
            style={{ padding: "10px 20px", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            <Plus size={16} />
            <span>+ Plan Delivery Trip</span>
          </button>
        </div>
      </div>

      {/* 6 Core KPI Grid Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px"
      }}>
        {/* KPI 1: Vehicles Available */}
        <div
          onClick={() => onNavigate("delivery-vehicles")}
          className="glass-card"
          style={{ padding: "18px 20px", cursor: "pointer", transition: "transform 0.15s ease", border: "1px solid var(--border-color)" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Vehicles Available
            </span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Truck size={16} />
            </div>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--text-main)" }}>
            {vehiclesAvailable} <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: "600" }}>/ {vehiclesTotal}</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
            {vehiclesOnTrip} on delivery beat
          </div>
        </div>

        {/* KPI 2: Active Trips */}
        <div
          onClick={() => onNavigate("delivery-trips")}
          className="glass-card"
          style={{ padding: "18px 20px", cursor: "pointer", border: "1px solid var(--border-color)" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Active Trips
            </span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(99, 102, 241, 0.15)", color: "var(--primary-400)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Play size={15} fill="var(--primary-400)" />
            </div>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "var(--primary-400)" }}>
            {activeTripsCount}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
            {readyTripsCount} staged & ready to depart
          </div>
        </div>

        {/* KPI 3: Bills Ready for Dispatch */}
        <div
          onClick={() => onNavigate("delivery-ready")}
          className="glass-card"
          style={{ padding: "18px 20px", cursor: "pointer", border: "1px solid rgba(245, 158, 11, 0.3)" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#f59e0b", textTransform: "uppercase" }}>
              Ready for Dispatch
            </span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Clock size={16} />
            </div>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#f59e0b" }}>
            {billsReadyForDispatchCount}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Locked invoices to assign
          </div>
        </div>

        {/* KPI 4: Out for Delivery */}
        <div
          onClick={() => onNavigate("delivery-trips")}
          className="glass-card"
          style={{ padding: "18px 20px", cursor: "pointer", border: "1px solid var(--border-color)" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Out for Delivery
            </span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(14, 165, 233, 0.15)", color: "#0ea5e9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Package size={16} />
            </div>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#0ea5e9" }}>
            {outForDelivery}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Customer drops in transit
          </div>
        </div>

        {/* KPI 5: Delivered Today */}
        <div
          className="glass-card"
          style={{ padding: "18px 20px", border: "1px solid var(--border-color)" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Delivered
            </span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#10b981" }}>
            {deliveredToday}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Successfully fulfilled
          </div>
        </div>

        {/* KPI 6: Exceptions */}
        <div
          onClick={() => onNavigate("delivery-ready")}
          className="glass-card"
          style={{ padding: "18px 20px", cursor: "pointer", border: "1px solid var(--border-color)" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Exceptions
            </span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: "900", color: exceptions.length > 0 ? "#f59e0b" : "var(--text-main)" }}>
            {exceptions.length}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Operational dispatch alerts
          </div>
        </div>
      </div>

      {/* Exception Alerts Banner */}
      {exceptions.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {exceptions.map((exc) => (
            <div
              key={exc.id}
              onClick={() => onNavigate(exc.targetTab || "delivery-ready")}
              className="glass-card"
              style={{
                padding: "14px 20px",
                borderRadius: "12px",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                background: "rgba(245, 158, 11, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <AlertTriangle size={18} color="#f59e0b" />
                <div>
                  <div style={{ fontWeight: "700", fontSize: "0.88rem", color: "var(--text-main)" }}>
                    {exc.title}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    {exc.message}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f59e0b", fontSize: "0.8rem", fontWeight: "700" }}>
                <span>Resolve</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Trips Quick Overview Section */}
      <div className="glass-card" style={{ padding: "24px", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>
              Recent Delivery Trips
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
              Active dispatch runs & delivery progress across beats
            </p>
          </div>
          <button
            onClick={() => onNavigate("delivery-trips")}
            className="btn-secondary"
            style={{ padding: "8px 16px", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <span>View All Trips</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
          {activeTrips.slice(0, 3).map((trip) => {
            const total = trip.totalBills || trip.deliveries?.length || 0;
            const delivered = trip.deliveredBills || trip.deliveries?.filter((d) => d.status === "DELIVERED").length || 0;
            const percent = total > 0 ? Math.round((delivered / total) * 100) : 0;

            return (
              <div
                key={trip.id || trip.tripNumber}
                onClick={() => onSelectTrip(trip)}
                style={{
                  padding: "18px",
                  borderRadius: "14px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: "800", color: "var(--primary-400)", fontFamily: "monospace" }}>
                    {trip.tripNumber}
                  </div>
                  <TripStatusBadge status={trip.status} />
                </div>

                <div>
                  <div style={{ fontWeight: "700", color: "var(--text-main)", fontSize: "0.92rem" }}>
                    {trip.vehicleNumber} • {trip.driverName}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Route: {trip.routeName || "Route Beat"}
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "4px" }}>
                    <span style={{ color: "var(--text-muted)" }}>Drop Progress</span>
                    <span style={{ fontWeight: "700", color: "var(--text-main)" }}>{delivered} / {total} Delivered</span>
                  </div>
                  <div style={{ width: "100%", height: "6px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${percent}%`, height: "100%", background: percent === 100 ? "#10b981" : "var(--primary-500)" }} />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "6px", borderTop: "1px solid var(--border-color)", fontSize: "0.78rem" }}>
                  <span style={{ color: "#34d399", fontWeight: "700" }}>
                    ₹{Number(trip.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <span style={{ color: "var(--primary-400)", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "2px" }}>
                    Manage Drop →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
