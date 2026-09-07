import React, { useState } from "react";
import { X, Edit3, AlertCircle } from "lucide-react";

export default function EditCustomerModal({ customer, token, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    shopName: customer.shopName || "",
    ownerName: customer.ownerName || "",
    mobile: customer.mobile || "",
    alternateMobile: customer.alternateMobile || "",
    email: customer.email || "",
    address: customer.address || "",
    routeId: customer.routeId || "ROUTE-A",
    routeName: customer.routeName || "Route A - Sadar Bazaar",
    salesmanId: customer.salesmanId || "user-salesman-01",
    creditLimit: customer.creditLimit || 0,
    openingBalance: customer.openingBalance || 0,
    paymentTerms: customer.paymentTerms || "Net 15 Days",
    notes: customer.notes || ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:5005/api/customers/${customer.id}`, {
        method: "PATCH",
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
        setError(json.message || "Failed to update customer.");
      }
    } catch (err) {
      console.error("Edit customer error:", err);
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
            <Edit3 size={22} color="var(--primary-400)" />
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-main)" }}>
                Edit Outlet: {customer.shopName}
              </h2>
              <div style={{ fontSize: "0.78rem", color: "var(--primary-400)", fontWeight: "700" }}>
                Code: {customer.customerCode}
              </div>
            </div>
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
                value={formData.ownerName}
                onChange={handleChange}
                style={{ paddingLeft: "16px" }}
              />
            </div>
          </div>

          {/* Row 2: Mobile & Alternate Mobile */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Mobile Number *</label>
              <input
                type="text"
                name="mobile"
                className="input-control"
                value={formData.mobile}
                onChange={handleChange}
                required
                maxLength={10}
                style={{ paddingLeft: "16px" }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Alternate Mobile</label>
              <input
                type="text"
                name="alternateMobile"
                className="input-control"
                value={formData.alternateMobile}
                onChange={handleChange}
                style={{ paddingLeft: "16px" }}
              />
            </div>
          </div>

          {/* Row 3: Address */}
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Full Address *</label>
            <input
              type="text"
              name="address"
              className="input-control"
              value={formData.address}
              onChange={handleChange}
              required
              style={{ paddingLeft: "16px" }}
            />
          </div>

          {/* Row 4: Credit Limit & Payment Terms */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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

          {/* Row 5: Notes */}
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Notes / Remarks</label>
            <textarea
              name="notes"
              className="input-control"
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
              {loading ? "Updating..." : "Update Customer Record"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
