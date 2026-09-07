import React from "react";

export default function OrderSummary({ pricingSummary }) {
  if (!pricingSummary) return null;

  const {
    grossSubtotal = 0,
    totalDiscount = 0,
    taxableAmount = 0,
    totalTax = 0,
    grandTotal = 0,
    totalItems = 0,
    totalQuantity = 0
  } = pricingSummary;

  const format = (num) => `₹${Number(num || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="glass-card" style={{
      padding: "20px",
      borderRadius: "14px",
      background: "var(--bg-secondary)",
      border: "1px solid var(--border-color)",
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
        <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)", margin: 0 }}>
          Order Pricing Summary
        </h4>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          {totalItems} SKU lines • {totalQuantity} units
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
          <span>Gross Subtotal</span>
          <span style={{ color: "var(--text-main)", fontWeight: "600" }}>{format(grossSubtotal)}</span>
        </div>

        {totalDiscount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", color: "#34d399" }}>
            <span>Special Line Discounts</span>
            <span style={{ fontWeight: "600" }}>- {format(totalDiscount)}</span>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
          <span>Taxable Amount</span>
          <span style={{ color: "var(--text-main)", fontWeight: "600" }}>{format(taxableAmount)}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
          <span>GST / Applicable Tax</span>
          <span style={{ color: "var(--text-main)", fontWeight: "600" }}>{format(totalTax)}</span>
        </div>
      </div>

      <div style={{
        marginTop: "4px",
        paddingTop: "12px",
        borderTop: "1px solid var(--border-color)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>
            Estimated Order Value
          </span>
          <span style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
            *Final invoice generated upon billing
          </span>
        </div>
        <strong style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--primary-400)" }}>
          {format(grandTotal)}
        </strong>
      </div>
    </div>
  );
}
