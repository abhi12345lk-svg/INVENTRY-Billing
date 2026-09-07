import React, { useState, useEffect } from "react";
import { X, Truck, Calendar, User, Phone, MapPin, Package, Check, AlertCircle } from "lucide-react";

export default function CreateTripModal({ token, preselectedBills = [], onClose, onSuccess }) {
  const [vehicles, setVehicles] = useState([]);
  const [readyBills, setReadyBills] = useState([]);
  const [selectedBillIds, setSelectedBillIds] = useState(
    preselectedBills.map((b) => b.id || b.billNumber)
  );

  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverMobile, setDriverMobile] = useState("");
  const [routeId, setRouteId] = useState("");
  const [routeName, setRouteName] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load available vehicles and ready bills if not preselected
  useEffect(() => {
    const loadLookups = async () => {
      setLoading(true);
      setError("");
      try {
        const [vehRes, billsRes] = await Promise.all([
          fetch("http://localhost:5005/api/vehicles?status=AVAILABLE", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          preselectedBills.length === 0
            ? fetch("http://localhost:5005/api/delivery/ready-bills", {
                headers: { Authorization: `Bearer ${token}` }
              })
            : Promise.resolve(null)
        ]);

        const vehData = await vehRes.json();
        if (vehData.success && vehData.data) {
          setVehicles(vehData.data);
          if (vehData.data.length > 0) {
            const firstVeh = vehData.data[0];
            setSelectedVehicleId(firstVeh.id);
            setDriverName(firstVeh.driverName || "");
            setDriverMobile(firstVeh.driverMobile || "");
          }
        }

        if (billsRes) {
          const billsData = await billsRes.json();
          if (billsData.success && billsData.data) {
            setReadyBills(billsData.data);
            if (billsData.data.length > 0 && selectedBillIds.length === 0) {
              // Select first 3 by default if available
              setSelectedBillIds(billsData.data.slice(0, 3).map((b) => b.id || b.billNumber));
            }
          }
        } else {
          setReadyBills(preselectedBills);
        }

        // Auto-detect route from first bill
        const firstBill = preselectedBills[0];
        if (firstBill && firstBill.customer?.routeId) {
          setRouteId(firstBill.customer.routeId);
          setRouteName(firstBill.customer.routeName || "");
        }
      } catch (err) {
        console.error("Lookups load error:", err);
        setError("Failed to load available fleet vehicles or bills.");
      } finally {
        setLoading(false);
      }
    };

    loadLookups();
  }, [token, preselectedBills]);

  // Handle vehicle change to auto-fill driver
  const handleVehicleChange = (e) => {
    const vId = e.target.value;
    setSelectedVehicleId(vId);
    const found = vehicles.find((v) => v.id === vId);
    if (found) {
      setDriverName(found.driverName || "");
      setDriverMobile(found.driverMobile || "");
    }
  };

  // Toggle bill selection
  const toggleBill = (billId) => {
    setSelectedBillIds((prev) =>
      prev.includes(billId) ? prev.filter((id) => id !== billId) : [...prev, billId]
    );
  };

  // Compute selected bills amount
  const selectedBills = readyBills.filter((b) => selectedBillIds.includes(b.id || b.billNumber));
  const totalAmount = selectedBills.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicleId) {
      setError("Please select an available delivery vehicle.");
      return;
    }
    if (selectedBillIds.length === 0) {
      setError("Please select at least one customer bill to include in this delivery trip.");
      return;
    }
    if (!driverName.trim()) {
      setError("Driver name is required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        vehicleId: selectedVehicleId,
        driverName: driverName.trim(),
        driverMobile: driverMobile.trim(),
        routeId: routeId || "ROUTE-000001",
        routeName: routeName || "Sadar Bazaar & Central Market",
        billIds: selectedBillIds,
        notes: notes.trim()
      };

      const res = await fetch("http://localhost:5005/api/delivery/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (res.ok && json.success) {
        onSuccess(`Delivery trip ${json.data.tripNumber} planned successfully! (${selectedBillIds.length} bills)`);
        onClose();
      } else {
        setError(json.message || "Failed to create delivery trip.");
      }
    } catch (err) {
      console.error("Create trip submit error:", err);
      setError("Network error connecting to delivery trip service.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0, 0, 0, 0.8)",
      backdropFilter: "blur(6px)",
      zIndex: 1100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px"
    }}>
      <div className="glass-card" style={{
        width: "100%",
        maxWidth: "680px",
        maxHeight: "92vh",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        borderRadius: "18px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
      }}>
        {/* Modal Header */}
        <div style={{
          padding: "18px 24px",
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
              background: "var(--primary-600)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Truck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>
                Plan Delivery Trip
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                Assign vehicle, driver, and batch ready invoices for dispatch
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
              padding: "6px"
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "18px" }}>
          {error && (
            <div style={{
              padding: "12px 16px",
              borderRadius: "10px",
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#f87171",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Vehicle Selection */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "var(--text-muted)", marginBottom: "6px" }}>
                Select Available Vehicle *
              </label>
              <select
                value={selectedVehicleId}
                onChange={handleVehicleChange}
                disabled={vehicles.length === 0}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-main)",
                  fontSize: "0.85rem",
                  outline: "none"
                }}
              >
                {vehicles.length === 0 ? (
                  <option value="">No available vehicles</option>
                ) : (
                  vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.vehicleNumber} — {v.vehicleType} ({v.capacity})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "var(--text-muted)", marginBottom: "6px" }}>
                Route / Beat Name
              </label>
              <input
                type="text"
                value={routeName || "Route A - Sadar Bazaar"}
                onChange={(e) => setRouteName(e.target.value)}
                placeholder="e.g. Route A - Sadar Bazaar"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-main)",
                  fontSize: "0.85rem",
                  outline: "none"
                }}
              />
            </div>
          </div>

          {/* Driver Info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "var(--text-muted)", marginBottom: "6px" }}>
                Driver Name *
              </label>
              <div style={{ position: "relative" }}>
                <User size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="e.g. Suresh Kumar"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 34px",
                    borderRadius: "10px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-main)",
                    fontSize: "0.85rem",
                    outline: "none"
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "var(--text-muted)", marginBottom: "6px" }}>
                Driver Mobile *
              </label>
              <div style={{ position: "relative" }}>
                <Phone size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={driverMobile}
                  onChange={(e) => setDriverMobile(e.target.value)}
                  placeholder="e.g. 9826101122"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 34px",
                    borderRadius: "10px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-main)",
                    fontSize: "0.85rem",
                    outline: "none"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bills to Include in Trip */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-muted)" }}>
                Assigned Invoices ({selectedBillIds.length} Selected)
              </label>
              <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--primary-400)" }}>
                Total: ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div style={{
              maxHeight: "180px",
              overflowY: "auto",
              borderRadius: "10px",
              border: "1px solid var(--border-color)",
              background: "var(--bg-secondary)"
            }}>
              {loading ? (
                <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Loading ready bills...
                </div>
              ) : readyBills.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  No bills currently marked ready for dispatch.
                </div>
              ) : (
                readyBills.map((b) => {
                  const bId = b.id || b.billNumber;
                  const isChecked = selectedBillIds.includes(bId);
                  return (
                    <div
                      key={bId}
                      onClick={() => toggleBill(bId)}
                      style={{
                        padding: "10px 14px",
                        borderBottom: "1px solid var(--border-color)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        background: isChecked ? "rgba(99, 102, 241, 0.08)" : "transparent"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "4px",
                          border: `1px solid ${isChecked ? "var(--primary-500)" : "var(--border-color)"}`,
                          background: isChecked ? "var(--primary-600)" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ffffff"
                        }}>
                          {isChecked && <Check size={13} />}
                        </div>
                        <div>
                          <div style={{ fontWeight: "700", fontSize: "0.85rem", color: "var(--text-main)" }}>
                            {b.billNumber} — {b.customer?.customerName || "Customer"}
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                            {b.customer?.address || b.customer?.routeName}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontWeight: "700", color: "#34d399", fontSize: "0.85rem" }}>
                        ₹{Number(b.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "var(--text-muted)", marginBottom: "6px" }}>
              Trip Instructions / Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Deliver Sharma General Store before 12 PM. Collect cash from Patel Kirana."
              rows={2}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-main)",
                fontSize: "0.85rem",
                outline: "none",
                resize: "none"
              }}
            />
          </div>

          {/* Modal Actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: "10px 18px", fontSize: "0.85rem" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || selectedBillIds.length === 0}
              className="btn-primary"
              style={{
                padding: "10px 22px",
                fontSize: "0.85rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                opacity: submitting || selectedBillIds.length === 0 ? 0.6 : 1
              }}
            >
              <Truck size={16} />
              <span>{submitting ? "Planning Trip..." : "Create & Plan Trip"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
