import React, { useState } from "react";
import { X, Store, CheckCircle2, AlertCircle } from "lucide-react";

export default function AddCustomerModal({ token, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    mobile: "",
    alternateMobile: "",
    email: "",
    address: "",
    areaId: "AREA-01",
    areaName: "Raipur Central",
    routeId: "ROUTE-A",
    routeName: "Route A - Sadar Bazaar",
    salesmanId: "user-salesman-01",
    salesmanName: "Rahul Kumar",
    creditLimit: 50000,
    openingBalance: 0,
    paymentTerms: "Net 15 Days",
    notes: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRouteSelect = (e) => {
    const val = e.target.value;
    if (val === "ROUTE-A") {
      setFormData((prev) => ({ ...prev, routeId: "ROUTE-A", routeName: "Route A - Sadar Bazaar", areaId: "AREA-01", areaName: "Raipur Central" }));
    } else if (val === "ROUTE-B") {
      setFormData((prev) => ({ ...prev, routeId: "ROUTE-B", routeName: "Route B - Model Town", areaId: "AREA-02", areaName: "Raipur North" }));
    } else if (val === "ROUTE-C") {
      setFormData((prev) => ({ ...prev, routeId: "ROUTE-C", routeName: "Route C - G.T. Road", areaId: "AREA-03", areaName: "Raipur East" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5005/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const json = await response.json();

      if (response.ok && json.success) {
        onSuccess(json.message);
        onClose();
      } else {
        setError(json.message || "Failed to create customer.");
      }
    } catch (err) {
      console.error("Create customer error:", err);
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
        maxWidth: "680px",
        maxHeight: "90vh",
        overflowY: "auto",
        padding: "32px",
        position: "relative"
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", borderBottom: "1px solid var(--border-card)", paddingBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Store size={22} color="var(--primary-400)" />
            <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-main)" }}>
              Add New FMCG Retail Outlet
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border-card)",
              color: "var(--text-muted)",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#fca5a5",
            padding: "12px 16px",
            borderRadius: "12px",
            fontSize: "0.85rem",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          
          {/* Row 1: Shop Name & Owner Name */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Shop / Outlet Name *</label>
              <input
                type="text"
                name="shopName"
                className="input-control"
                placeholder="e.g. Sharma General Store"
                value={formData.shopName}
                onChange={handleChange}
                required
                style={{ paddingLeft: "16px" }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Owner Name</label>
              <input
                type="text"
                name="ownerName"
                className="input-control"
                placeholder="e.g. Rajesh Sharma"
                value={formData.ownerName}
                onChange={handleChange}
                style={{ paddingLeft: "16px" }}
              />
            </div>
          </div>

          {/* Row 2: Mobile & Alternate Mobile */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Mobile Number * (10 Digits)</label>
              <input
                type="text"
                name="mobile"
                className="input-control"
                placeholder="e.g. 9876543210"
                value={formData.mobile}
                onChange={handleChange}
                required
                maxLength={10}
                style={{ paddingLeft: "16px" }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Alternate Mobile / WhatsApp</label>
              <input
                type="text"
                name="alternateMobile"
                className="input-control"
                placeholder="Optional"
                value={formData.alternateMobile}
                onChange={handleChange}
                style={{ paddingLeft: "16px" }}
              />
            </div>
          </div>

          {/* Row 3: Address & Email */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Full Address *</label>
              <input
                type="text"
                name="address"
                className="input-control"
                placeholder="Shop number, Street, Area"
                value={formData.address}
                onChange={handleChange}
                required
                style={{ paddingLeft: "16px" }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Email ID</label>
              <input
                type="email"
                name="email"
                className="input-control"
                placeholder="Optional email"
                value={formData.email}
                onChange={handleChange}
                style={{ paddingLeft: "16px" }}
              />
            </div>
          </div>

          {/* Row 4: Route & Salesman Assignment */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Route / Beat</label>
              <select
                className="input-control"
                value={formData.routeId}
                onChange={handleRouteSelect}
                style={{ paddingLeft: "16px" }}
              >
                <option value="ROUTE-A">Route A - Sadar Bazaar (Raipur Central)</option>
                <option value="ROUTE-B">Route B - Model Town (Raipur North)</option>
                <option value="ROUTE-C">Route C - G.T. Road (Raipur East)</option>
              </select>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Assigned Salesman</label>
              <select
                name="salesmanId"
                className="input-control"
                value={formData.salesmanId}
                onChange={(e) => {
                  const val = e.target.value;
                  const name = val === "user-salesman-01" ? "Rahul Kumar" : "Vikas Malhotra";
                  setFormData((prev) => ({ ...prev, salesmanId: val, salesmanName: name }));
                }}
                style={{ paddingLeft: "16px" }}
              >
                <option value="user-salesman-01">Rahul Kumar (Route A)</option>
                <option value="user-salesmgr-01">Vikas Malhotra (Sales Manager)</option>
              </select>
            </div>
          </div>

          {/* Row 5: Credit Limit & Opening Balance */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Credit Limit (₹)</label>
              <input
                type="number"
                name="creditLimit"
                className="input-control"
                value={formData.creditLimit}
                onChange={handleChange}
                min={0}
                style={{ paddingLeft: "16px" }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Opening Balance (₹)</label>
              <input
                type="number"
                name="openingBalance"
                className="input-control"
                value={formData.openingBalance}
                onChange={handleChange}
                style={{ paddingLeft: "16px" }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Payment Terms</label>
              <select
                name="paymentTerms"
                className="input-control"
                value={formData.paymentTerms}
                onChange={handleChange}
                style={{ paddingLeft: "16px" }}
              >
                <option value="Net 15 Days">Net 15 Days</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Net 7 Days">Net 7 Days</option>
                <option value="Net 30 Days">Net 30 Days</option>
              </select>
            </div>
          </div>

          {/* Row 6: Notes */}
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Notes / Remarks</label>
            <textarea
              name="notes"
              className="input-control"
              placeholder="e.g. Special discounts, preferred delivery time"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              style={{ paddingLeft: "16px", resize: "none" }}
            />
          </div>

          {/* Footer Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-card)",
                color: "var(--text-muted)",
                padding: "10px 20px",
                borderRadius: "12px",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ padding: "10px 24px" }}
            >
              {loading ? "Saving Customer..." : "Save Customer Record"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
