import React, { useState } from "react";
import { X, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

export default function ProductStatusModal({ product, token, onClose, onSuccess }) {
  const isCurrentlyActive = product.status === "ACTIVE";
  const targetStatus = isCurrentlyActive ? "INACTIVE" : "ACTIVE";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStatusChange = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:5005/api/products/${product.id || product.productCode}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: targetStatus })
      });

      const json = await response.json();

      if (response.ok && json.success) {
        onSuccess(`Product ${json.product.productCode} status updated to ${targetStatus}!`);
        onClose();
      } else {
        setError(json.message || "Failed to update product status.");
      }
    } catch (err) {
      console.error("Change product status error:", err);
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
      zIndex: 1100,
      padding: "20px"
    }}>
      <div 
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "32px",
          borderRadius: "20px",
          position: "relative",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          textAlign: "center"
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "var(--bg-input)",
            border: "1px solid var(--border-card)",
            color: "var(--text-muted)",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: isCurrentlyActive ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
          border: `1px solid ${isCurrentlyActive ? "rgba(239, 68, 68, 0.3)" : "rgba(16, 185, 129, 0.3)"}`,
          color: isCurrentlyActive ? "#f87171" : "#34d399",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px auto"
        }}>
          {isCurrentlyActive ? <AlertTriangle size={30} /> : <CheckCircle2 size={30} />}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "8px" }}>
          {isCurrentlyActive ? "Deactivate Product?" : "Activate Product?"}
        </h3>

        {/* Product Details */}
        <div style={{
          background: "var(--bg-input)",
          padding: "12px",
          borderRadius: "12px",
          border: "1px solid var(--border-card)",
          marginBottom: "16px",
          fontSize: "0.85rem",
          color: "var(--text-main)"
        }}>
          <strong>{product.productName}</strong>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace", marginTop: "2px" }}>
            {product.productCode} • {product.sku}
          </div>
        </div>

        {/* Informative Note */}
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "24px" }}>
          {isCurrentlyActive ? (
            "Deactivating this product will hide it from future salesman order booking screens. Historical invoices, reports, and ledger line items will remain 100% intact."
          ) : (
            "Activating this product will make it immediately available for field salesman order taking and catalog distribution."
          )}
        </p>

        {/* Error Feedback */}
        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#f87171",
            padding: "10px",
            borderRadius: "10px",
            marginBottom: "16px",
            fontSize: "0.82rem"
          }}>
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              background: "var(--bg-input)",
              border: "1px solid var(--border-card)",
              color: "var(--text-muted)",
              padding: "10px",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "0.88rem",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStatusChange}
            disabled={loading}
            style={{
              flex: 1,
              background: isCurrentlyActive ? "#ef4444" : "#10b981",
              color: "#ffffff",
              border: "none",
              padding: "10px",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "0.88rem",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: isCurrentlyActive ? "0 6px 20px rgba(239, 68, 68, 0.35)" : "0 6px 20px rgba(16, 185, 129, 0.35)"
            }}
          >
            {loading ? "Processing..." : (isCurrentlyActive ? "Yes, Deactivate" : "Yes, Activate")}
          </button>
        </div>

      </div>
    </div>
  );
}
