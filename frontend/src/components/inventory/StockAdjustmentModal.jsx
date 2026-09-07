import React, { useState } from "react";
import { 
  X, 
  ArrowDownLeft, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle,
  Package,
  Layers
} from "lucide-react";

export default function StockAdjustmentModal({
  isOpen = true,
  onClose,
  inventory,
  token,
  user,
  onSuccess
}) {
  if (!isOpen || !inventory) return null;

  const [adjustmentType, setAdjustmentType] = useState("ADJUSTMENT_IN");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentStock = Number(inventory.currentStock) || 0;
  const parsedQty = parseInt(quantity, 10) || 0;

  let calculatedNewStock = currentStock;
  if (adjustmentType === "ADJUSTMENT_IN") {
    calculatedNewStock = currentStock + parsedQty;
  } else if (adjustmentType === "ADJUSTMENT_OUT") {
    calculatedNewStock = Math.max(0, currentStock - parsedQty);
  }

  const isExcessiveDeduction = adjustmentType === "ADJUSTMENT_OUT" && parsedQty > currentStock;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (parsedQty <= 0) {
      setError("Please enter a valid quantity greater than 0.");
      return;
    }

    if (!reason.trim()) {
      setError("Please provide a reason for this stock adjustment to ensure audit compliance.");
      return;
    }

    if (isExcessiveDeduction) {
      setError(`Cannot deduct ${parsedQty} units. Current available stock is only ${currentStock} units.`);
      return;
    }

    setLoading(true);

    try {
      const invId = inventory.id || inventory._id;
      const response = await fetch(`http://localhost:5005/api/inventory/${invId}/adjust`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          adjustmentType,
          quantity: parsedQty,
          reason: reason.trim()
        })
      });

      const json = await response.json();

      if (response.ok && json.success) {
        if (onSuccess) onSuccess(json.data);
        if (onClose) onClose();
      } else {
        setError(json.message || "Failed to adjust inventory stock.");
      }
    } catch (err) {
      console.error("Stock adjustment error:", err);
      setError("Unable to connect to Inventory API server.");
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
      background: "var(--modal-overlay)",
      backdropFilter: "blur(4px)",
      zIndex: 1200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px"
    }}>
      <div className="glass-card" style={{
        width: "100%",
        maxWidth: "500px",
        background: "var(--bg-modal)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "var(--shadow-modal)",
        display: "flex",
        flexDirection: "column",
        gap: "18px"
      }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(99, 102, 241, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--primary-600)"
            }}>
              <Package size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-main)", margin: 0, letterSpacing: "-0.01em" }}>
                Manual Stock Adjustment
              </h2>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "3px 0 0 0" }}>
                {inventory.productName} ({inventory.productCode})
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
              padding: "4px",
              borderRadius: "6px"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Stock Metrics Banner */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
          padding: "12px",
          background: "var(--bg-surface-2)",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
          textAlign: "center"
        }}>
          <div>
            <span style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "700" }}>Current Stock</span>
            <div style={{ fontSize: "1.05rem", fontFamily: "monospace", fontWeight: "800", color: "var(--text-main)", marginTop: "2px" }}>{currentStock}</div>
          </div>
          <div>
            <span style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "700" }}>Adjustment</span>
            <div style={{
              fontSize: "1.05rem",
              fontFamily: "monospace",
              fontWeight: "800",
              marginTop: "2px",
              color: adjustmentType === "ADJUSTMENT_IN" ? "#059669" : "#d97706"
            }}>
              {adjustmentType === "ADJUSTMENT_IN" ? `+${parsedQty}` : `-${parsedQty}`}
            </div>
          </div>
          <div>
            <span style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "700" }}>Resulting Stock</span>
            <div style={{
              fontSize: "1.05rem",
              fontFamily: "monospace",
              fontWeight: "900",
              marginTop: "2px",
              color: isExcessiveDeduction ? "#dc2626" : "var(--text-main)"
            }}>
              {calculatedNewStock}
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            padding: "10px 14px",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            borderRadius: "10px",
            color: "#dc2626",
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Adjustment Type Selector */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px" }}>
              Adjustment Type <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setAdjustmentType("ADJUSTMENT_IN")}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  border: adjustmentType === "ADJUSTMENT_IN" ? "1px solid #059669" : "1px solid var(--border-card)",
                  background: adjustmentType === "ADJUSTMENT_IN" ? "rgba(16, 185, 129, 0.12)" : "var(--bg-card)",
                  color: adjustmentType === "ADJUSTMENT_IN" ? "#059669" : "var(--text-muted)",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.2s ease"
                }}
              >
                <ArrowDownLeft size={16} />
                <span>Stock In (+ Add)</span>
              </button>

              <button
                type="button"
                onClick={() => setAdjustmentType("ADJUSTMENT_OUT")}
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  border: adjustmentType === "ADJUSTMENT_OUT" ? "1px solid #d97706" : "1px solid var(--border-card)",
                  background: adjustmentType === "ADJUSTMENT_OUT" ? "rgba(245, 158, 11, 0.12)" : "var(--bg-card)",
                  color: adjustmentType === "ADJUSTMENT_OUT" ? "#d97706" : "var(--text-muted)",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.2s ease"
                }}
              >
                <ArrowUpRight size={16} />
                <span>Stock Out (- Deduct)</span>
              </button>
            </div>
          </div>

          {/* Quantity Input */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px" }}>
              Quantity ({inventory.unit || "Units"}) <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 25"
              className="input-control"
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "var(--bg-input)",
                border: "1px solid var(--border-card)",
                borderRadius: "10px",
                fontSize: "0.95rem",
                fontFamily: "monospace",
                color: "var(--text-main)"
              }}
              required
            />
            {isExcessiveDeduction && (
              <p style={{ fontSize: "0.75rem", color: "#dc2626", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                <AlertCircle size={14} />
                Deduction exceeds current stock ({currentStock} units).
              </p>
            )}
          </div>

          {/* Mandatory Reason */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px" }}>
              Audit Reason <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Damaged demo stock, Physical audit variance, Supplier promotional stock..."
              className="input-control"
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "var(--bg-input)",
                border: "1px solid var(--border-card)",
                borderRadius: "10px",
                fontSize: "0.85rem",
                color: "var(--text-main)",
                resize: "vertical"
              }}
              required
            />
          </div>

          {/* Confirmation Warning Notice */}
          <div style={{
            padding: "10px 14px",
            background: "rgba(245, 158, 11, 0.08)",
            border: "1px solid rgba(245, 158, 11, 0.25)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            fontSize: "0.75rem",
            color: "#b45309"
          }}>
            <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: "2px" }} />
            <span>
              This adjustment will permanently create an immutable <strong>Stock Movement</strong> ledger record for accounting and audit reconciliation.
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 18px",
                background: "var(--bg-surface-2)",
                border: "1px solid var(--border-card)",
                color: "var(--text-main)",
                fontSize: "0.82rem",
                fontWeight: "700",
                borderRadius: "10px",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || parsedQty <= 0 || !reason.trim() || isExcessiveDeduction}
              className="btn-primary"
              style={{
                padding: "8px 20px",
                fontSize: "0.82rem",
                gap: "6px",
                opacity: (loading || parsedQty <= 0 || !reason.trim() || isExcessiveDeduction) ? 0.5 : 1,
                cursor: (loading || parsedQty <= 0 || !reason.trim() || isExcessiveDeduction) ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Recording..." : "Confirm Adjustment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
