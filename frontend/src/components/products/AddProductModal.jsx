import React, { useState } from "react";
import { X, Package, AlertCircle, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export default function AddProductModal({ token, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    productName: "",
    sku: "",
    companyId: "COMP-NESTLE",
    category: "Noodles",
    subcategory: "",
    unit: "PACK",
    packSize: "",
    mrp: "",
    purchaseRate: "",
    saleRate: "",
    taxRate: "5",
    discount: "0",
    minimumStock: "10",
    batchTracking: true,
    expiryTracking: true,
    description: "",
    status: "ACTIVE"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic frontend checks
    if (!formData.productName.trim()) {
      setError("Product Name is required.");
      return;
    }
    if (!formData.sku.trim()) {
      setError("SKU is required.");
      return;
    }
    if (!formData.mrp || parseFloat(formData.mrp) < 0) {
      setError("MRP must be a valid non-negative number.");
      return;
    }
    if (!formData.saleRate || parseFloat(formData.saleRate) < 0) {
      setError("Sale Rate must be a valid non-negative number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5005/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const json = await response.json();

      if (response.ok && json.success) {
        onSuccess(`Product '${json.product.productName}' (${json.product.productCode}) added successfully!`);
        onClose();
      } else {
        setError(json.message || "Failed to create product.");
      }
    } catch (err) {
      console.error("Create product error:", err);
      setError("Network error connecting to Product Master API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px"
    }}>
      <div 
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "760px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "32px",
          borderRadius: "20px",
          position: "relative",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            background: "var(--bg-input)",
            border: "1px solid var(--border-card)",
            color: "var(--text-muted)",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff"
          }}>
            <Package size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-main)" }}>
              Add New Product
            </h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Register a new FMCG SKU into the Chirag Combines Catalog
            </p>
          </div>
        </div>

        {/* Error Feedback */}
        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#f87171",
            padding: "12px 16px",
            borderRadius: "12px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "0.85rem"
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Section 1: Basic Information */}
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--primary-400)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
              1. Basic Information
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px", fontWeight: "600" }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  placeholder="e.g. Maggi 2-Minute Noodles 70g"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-card)",
                    color: "var(--text-main)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "0.88rem",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px", fontWeight: "600" }}>
                  SKU (Stock Keeping Unit) *
                </label>
                <input
                  type="text"
                  name="sku"
                  placeholder="e.g. SKU-MAGGI-70"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-card)",
                    color: "var(--text-main)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "0.88rem",
                    outline: "none",
                    textTransform: "uppercase",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Company & Categorization */}
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--primary-400)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
              2. Company & Brand Hierarchy
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px", fontWeight: "600" }}>
                  Company / Brand *
                </label>
                <select
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-card)",
                    color: "var(--text-main)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "0.88rem",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="COMP-NESTLE">Nestlé</option>
                  <option value="COMP-PATANJALI">Patanjali</option>
                  <option value="COMP-GSK">GSK / Health</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px", fontWeight: "600" }}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-card)",
                    color: "var(--text-main)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "0.88rem",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="Noodles">Noodles</option>
                  <option value="Confectionery">Confectionery</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Honey">Honey</option>
                  <option value="Oral Care">Oral Care</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Staples">Staples</option>
                  <option value="Health Drinks">Health Drinks</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px", fontWeight: "600" }}>
                  Subcategory
                </label>
                <input
                  type="text"
                  name="subcategory"
                  placeholder="e.g. Instant Noodles"
                  value={formData.subcategory}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-card)",
                    color: "var(--text-main)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "0.88rem",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Unit & Pack Size */}
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--primary-400)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
              3. Packaging & Unit Specification
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px", fontWeight: "600" }}>
                  Unit of Measure *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-card)",
                    color: "var(--text-main)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "0.88rem",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="PCS">PCS (Pieces)</option>
                  <option value="PACK">PACK (Pouch / Packet)</option>
                  <option value="BOX">BOX</option>
                  <option value="CASE">CASE</option>
                  <option value="KG">KG (Kilograms)</option>
                  <option value="GRAM">GRAM</option>
                  <option value="LTR">LTR (Litres)</option>
                  <option value="ML">ML (Millilitres)</option>
                  <option value="DOZEN">DOZEN</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px", fontWeight: "600" }}>
                  Pack Size Specification
                </label>
                <input
                  type="text"
                  name="packSize"
                  placeholder="e.g. 70g, 500g Jar, 1L Carton"
                  value={formData.packSize}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-card)",
                    color: "var(--text-main)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "0.88rem",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Pricing & Taxes */}
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--primary-400)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
              4. Commercial Pricing & Tax Rates
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px", fontWeight: "600" }}>
                  MRP (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="mrp"
                  placeholder="0.00"
                  value={formData.mrp}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-card)",
                    color: "var(--text-main)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "0.88rem",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px", fontWeight: "600" }}>
                  Purchase Rate (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="purchaseRate"
                  placeholder="0.00"
                  value={formData.purchaseRate}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-card)",
                    color: "var(--text-main)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "0.88rem",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px", fontWeight: "600" }}>
                  Sale Rate (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="saleRate"
                  placeholder="0.00"
                  value={formData.saleRate}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-card)",
                    color: "var(--text-main)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "0.88rem",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px", fontWeight: "600" }}>
                  Tax Rate (%)
                </label>
                <select
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-card)",
                    color: "var(--text-main)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "0.88rem",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                >
                  <option value="0">0% (Nil)</option>
                  <option value="5">5% (Standard FMCG)</option>
                  <option value="12">12% (Packaged Foods)</option>
                  <option value="18">18% (Personal Care)</option>
                  <option value="28">28% (Luxury)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 5: Inventory Rules & Tracking Flags */}
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--primary-400)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
              5. Inventory Rules & Future Tracking Flags
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", alignItems: "center" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px", fontWeight: "600" }}>
                  Minimum Reorder Stock
                </label>
                <input
                  type="number"
                  min="0"
                  name="minimumStock"
                  value={formData.minimumStock}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-card)",
                    color: "var(--text-main)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "0.88rem",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "20px" }}>
                <input
                  type="checkbox"
                  id="batchTracking"
                  name="batchTracking"
                  checked={formData.batchTracking}
                  onChange={handleChange}
                  style={{ width: "18px", height: "18px", accentColor: "var(--primary-400)", cursor: "pointer" }}
                />
                <label htmlFor="batchTracking" style={{ fontSize: "0.85rem", color: "var(--text-main)", cursor: "pointer", fontWeight: "600" }}>
                  Batch Tracking
                </label>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "20px" }}>
                <input
                  type="checkbox"
                  id="expiryTracking"
                  name="expiryTracking"
                  checked={formData.expiryTracking}
                  onChange={handleChange}
                  style={{ width: "18px", height: "18px", accentColor: "var(--primary-400)", cursor: "pointer" }}
                />
                <label htmlFor="expiryTracking" style={{ fontSize: "0.85rem", color: "var(--text-main)", cursor: "pointer", fontWeight: "600" }}>
                  Expiry Tracking
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px", fontWeight: "600" }}>
              Description / Notes
            </label>
            <textarea
              name="description"
              rows={2}
              placeholder="Product details, packaging specs or distributor notes..."
              value={formData.description}
              onChange={handleChange}
              style={{
                width: "100%",
                background: "var(--bg-input)",
                border: "1px solid var(--border-card)",
                color: "var(--text-main)",
                borderRadius: "10px",
                padding: "10px 14px",
                fontSize: "0.88rem",
                outline: "none",
                resize: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-card)",
                color: "var(--text-muted)",
                padding: "10px 20px",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "0.9rem",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="glow-btn"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                color: "#ffffff",
                border: "none",
                padding: "10px 24px",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "0.9rem",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 6px 20px rgba(99, 102, 241, 0.4)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              {loading ? (
                <span>Saving Product...</span>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Save Product</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
