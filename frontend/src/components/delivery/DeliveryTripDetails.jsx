import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Truck,
  User,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Package,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  CheckCheck
} from "lucide-react";
import { TripStatusBadge } from "./TripStatusBadge";
import { DeliveryStatusBadge } from "./DeliveryStatusBadge";
import DeliveryStatusModal from "./DeliveryStatusModal";

export default function DeliveryTripDetails({ trip: initialTrip, tripId, token, user, onBack, onTripUpdated }) {
  const [trip, setTrip] = useState(initialTrip || null);
  const [loading, setLoading] = useState(!initialTrip);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedDeliveryItem, setSelectedDeliveryItem] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const id = tripId || initialTrip?.id || initialTrip?.tripNumber;

  const fetchTripDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5005/api/delivery/trips/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setTrip(json.data);
      } else {
        setError(json.message || "Failed to load trip details.");
      }
    } catch (err) {
      console.error("fetchTripDetails error:", err);
      setError("Unable to connect to delivery trip service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialTrip) {
      fetchTripDetails();
    }
  }, [id]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Action handlers
  const handleDispatchTrip = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`http://localhost:5005/api/delivery/trips/${trip.id}/dispatch`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setTrip(json.data);
        showToast(`Trip ${json.data.tripNumber} DISPATCHED! Vehicle set to ON_TRIP.`);
        if (onTripUpdated) onTripUpdated(json.data);
      } else {
        setError(json.message || "Failed to dispatch trip.");
      }
    } catch (err) {
      setError("Network error dispatching trip.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartTrip = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`http://localhost:5005/api/delivery/trips/${trip.id}/start`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setTrip(json.data);
        showToast(`Trip ${json.data.tripNumber} started! Invoices are now OUT FOR DELIVERY.`);
        if (onTripUpdated) onTripUpdated(json.data);
      } else {
        setError(json.message || "Failed to start delivery trip.");
      }
    } catch (err) {
      setError("Network error starting delivery trip.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteTrip = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`http://localhost:5005/api/delivery/trips/${trip.id}/complete`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setTrip(json.data);
        showToast(`Trip ${json.data.tripNumber} COMPLETED! Vehicle released back to available fleet.`);
        if (onTripUpdated) onTripUpdated(json.data);
      } else {
        setError(json.message || "Failed to complete delivery trip.");
      }
    } catch (err) {
      setError("Network error completing delivery trip.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center", color: "var(--text-muted)" }}>
        <div style={{ width: "36px", height: "36px", border: "3px solid rgba(99, 102, 241, 0.2)", borderTopColor: "var(--primary-400)", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 1s linear infinite" }} />
        <p>Loading delivery trip record...</p>
      </div>
    );
  }

  if (error && !trip) {
    return (
      <div className="glass-card" style={{ padding: "40px", textAlign: "center", maxWidth: "500px", margin: "40px auto" }}>
        <AlertCircle size={40} color="#ef4444" style={{ marginBottom: "12px" }} />
        <h3 style={{ color: "#f87171" }}>Failed to Load Trip</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{error}</p>
        <button onClick={onBack} className="btn-secondary" style={{ marginTop: "16px" }}>
          ← Back to Trips
        </button>
      </div>
    );
  }

  const deliveries = trip.deliveries || [];
  const totalDeliveries = deliveries.length;
  const deliveredCount = deliveries.filter((d) => d.status === "DELIVERED").length;
  const failedCount = deliveries.filter((d) => d.status === "FAILED" || d.status === "RETURN_PENDING").length;
  const progressPercent = totalDeliveries > 0 ? Math.round((deliveredCount / totalDeliveries) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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

      {/* Top Navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          onClick={onBack}
          className="btn-secondary"
          style={{ padding: "8px 16px", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <ArrowLeft size={16} />
          <span>Back to Trips</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {trip.status === "READY" && (
            <button
              onClick={handleDispatchTrip}
              disabled={actionLoading}
              className="btn-primary"
              style={{
                padding: "8px 18px",
                fontSize: "0.82rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
              }}
            >
              <Truck size={14} />
              <span>{actionLoading ? "Dispatching..." : "Dispatch Trip"}</span>
            </button>
          )}

          {trip.status === "DISPATCHED" && (
            <button
              onClick={handleStartTrip}
              disabled={actionLoading}
              className="btn-primary"
              style={{
                padding: "8px 18px",
                fontSize: "0.82rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
              }}
            >
              <Play size={14} fill="#ffffff" />
              <span>{actionLoading ? "Starting..." : "Start Deliveries"}</span>
            </button>
          )}

          {trip.status === "IN_PROGRESS" && (
            <button
              onClick={handleCompleteTrip}
              disabled={actionLoading}
              className="btn-primary"
              style={{
                padding: "8px 18px",
                fontSize: "0.82rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
              }}
            >
              <CheckCheck size={14} />
              <span>{actionLoading ? "Completing..." : "Complete Trip"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Trip Card */}
      <div className="glass-card" style={{
        padding: "24px 32px",
        background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(99, 102, 241, 0.05) 100%)",
        border: "1px solid var(--border-color)",
        borderRadius: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        {/* Header Row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
              <h2 style={{ fontSize: "1.6rem", fontWeight: "900", color: "var(--text-main)", margin: 0, fontFamily: "monospace" }}>
                {trip.tripNumber}
              </h2>
              <TripStatusBadge status={trip.status} />
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
              Route: <strong>{trip.routeName || "Route Beat"}</strong> • Trip Date: {new Date(trip.tripDate).toLocaleDateString("en-IN")}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700" }}>
              Total Invoice Cargo Value
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: "900", color: "#34d399" }}>
              ₹{Number(trip.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
          <div style={{ padding: "14px", borderRadius: "12px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "700", marginBottom: "4px" }}>
              <Truck size={14} color="var(--primary-400)" />
              <span>VEHICLE</span>
            </div>
            <div style={{ fontWeight: "800", fontSize: "1rem", color: "var(--text-main)" }}>
              {trip.vehicleNumber}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              Assigned Distribution Van
            </div>
          </div>

          <div style={{ padding: "14px", borderRadius: "12px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "700", marginBottom: "4px" }}>
              <User size={14} color="#10b981" />
              <span>DRIVER</span>
            </div>
            <div style={{ fontWeight: "800", fontSize: "1rem", color: "var(--text-main)" }}>
              {trip.driverName}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              📞 {trip.driverMobile}
            </div>
          </div>

          <div style={{ padding: "14px", borderRadius: "12px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "700", marginBottom: "4px" }}>
              <Clock size={14} color="#0ea5e9" />
              <span>DISPATCH TIME</span>
            </div>
            <div style={{ fontWeight: "800", fontSize: "0.92rem", color: "var(--text-main)" }}>
              {trip.dispatchTime ? new Date(trip.dispatchTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "Awaiting Departure"}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {trip.dispatchTime ? new Date(trip.dispatchTime).toLocaleDateString("en-IN") : "Depot Staged"}
            </div>
          </div>

          <div style={{ padding: "14px", borderRadius: "12px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "700", marginBottom: "4px" }}>
              <CheckCircle2 size={14} color="#34d399" />
              <span>RETURN TIME</span>
            </div>
            <div style={{ fontWeight: "800", fontSize: "0.92rem", color: "var(--text-main)" }}>
              {trip.returnTime ? new Date(trip.returnTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "Pending Return"}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {trip.returnTime ? "Vehicle Released" : "Out on Route"}
            </div>
          </div>
        </div>

        {/* Delivery Progress Bar */}
        <div style={{
          padding: "16px 20px",
          borderRadius: "14px",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)" }}>
              Delivery Progress ({deliveredCount} of {totalDeliveries} Completed)
            </span>
            <span style={{ fontSize: "0.85rem", fontWeight: "800", color: progressPercent === 100 ? "#10b981" : "var(--primary-400)" }}>
              {progressPercent}%
            </span>
          </div>

          <div style={{ width: "100%", height: "10px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "6px", overflow: "hidden" }}>
            <div style={{
              width: `${progressPercent}%`,
              height: "100%",
              background: progressPercent === 100 ? "linear-gradient(90deg, #10b981 0%, #34d399 100%)" : "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
              transition: "width 0.4s ease"
            }} />
          </div>

          <div style={{ display: "flex", gap: "16px", marginTop: "8px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
            <span>✓ {deliveredCount} Delivered</span>
            <span>•</span>
            <span>🚚 {totalDeliveries - deliveredCount - failedCount} Pending / Out</span>
            {failedCount > 0 && (
              <>
                <span>•</span>
                <span style={{ color: "#f87171" }}>⚠ {failedCount} Failed</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="glass-card" style={{ overflow: "hidden", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--table-header-bg)"
        }}>
          <h4 style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>
            Customer Delivery Drops ({deliveries.length} Invoices)
          </h4>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Click "Update Delivery" to mark status as drops occur
          </span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)", background: "var(--table-header-bg)" }}>
              <th style={{ padding: "12px 16px", fontWeight: "700", color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase" }}>
                Bill Number
              </th>
              <th style={{ padding: "12px 16px", fontWeight: "700", color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase" }}>
                Customer / Retail Store
              </th>
              <th style={{ padding: "12px 16px", fontWeight: "700", color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase" }}>
                Destination Address
              </th>
              <th style={{ padding: "12px 16px", fontWeight: "700", color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase", textAlign: "right" }}>
                Invoice Amount
              </th>
              <th style={{ padding: "12px 16px", fontWeight: "700", color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase", textAlign: "center" }}>
                Delivery Status
              </th>
              <th style={{ padding: "12px 16px", fontWeight: "700", color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase" }}>
                Delivery Time / Remarks
              </th>
              <th style={{ padding: "12px 16px", fontWeight: "700", color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase", textAlign: "right" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {deliveries.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                  No customer deliveries attached to this trip.
                </td>
              </tr>
            ) : (
              deliveries.map((item, idx) => (
                <tr key={item.billId || idx} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: "700", color: "var(--primary-400)", fontFamily: "monospace" }}>
                      {item.billNumber}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: "700", color: "var(--text-main)" }}>
                      {item.customerName}
                    </div>
                    {item.mobile && (
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                        📞 {item.mobile}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "14px 16px", color: "var(--text-muted)", fontSize: "0.8rem", maxWidth: "240px" }}>
                    {item.address || "Main Market"}
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: "800", color: "#34d399" }}>
                    ₹{Number(item.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "center" }}>
                    <DeliveryStatusBadge status={item.status} />
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "0.78rem" }}>
                    {item.deliveryTime ? (
                      <div style={{ color: "#10b981", fontWeight: "600" }}>
                        ✓ {new Date(item.deliveryTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>Pending Drop</span>
                    )}
                    {item.remarks && (
                      <div style={{ color: "var(--text-muted)", fontStyle: "italic", marginTop: "2px" }}>
                        "{item.remarks}"
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right" }}>
                    {item.status !== "DELIVERED" ? (
                      <button
                        onClick={() => setSelectedDeliveryItem(item)}
                        className="btn-primary"
                        style={{
                          padding: "6px 12px",
                          fontSize: "0.75rem",
                          borderRadius: "8px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <CheckCircle2 size={13} />
                        <span>Update Delivery</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedDeliveryItem(item)}
                        className="btn-secondary"
                        style={{
                          padding: "4px 10px",
                          fontSize: "0.72rem",
                          borderRadius: "8px"
                        }}
                      >
                        Edit Note
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delivery Status Update Modal */}
      {selectedDeliveryItem && (
        <DeliveryStatusModal
          tripId={trip.id}
          deliveryItem={selectedDeliveryItem}
          token={token}
          onClose={() => setSelectedDeliveryItem(null)}
          onSuccess={(msg, updatedTrip) => {
            showToast(msg);
            setTrip(updatedTrip);
            if (onTripUpdated) onTripUpdated(updatedTrip);
          }}
        />
      )}
    </div>
  );
}
