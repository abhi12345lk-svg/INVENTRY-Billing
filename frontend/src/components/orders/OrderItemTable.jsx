import React from "react";
import { Package, Trash2 } from "lucide-react";

export default function OrderItemTable({ items = [], editable = false, onUpdateQuantity, onRemoveItem }) {
  const format = (num) => `₹${Number(num || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div style={{
      borderRadius: "12px",
      overflow: "hidden",
      border: "1px solid var(--border-color)",
      background: "var(--bg-surface)"
    }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--table-header-bg)", borderBottom: "1px solid var(--border-color)" }}>
              <th style={{ padding: "12px 16px", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
                Product SKU & Description
              </th>
              <th style={{ padding: "12px 16px", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
                Pack / Unit
              </th>
              <th style={{ padding: "12px 16px", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", textAlign: "right" }}>
                Sale Rate
              </th>
              <th style={{ padding: "12px 16px", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", textAlign: "center" }}>
                Qty
              </th>
              <th style={{ padding: "12px 16px", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", textAlign: "center" }}>
                Disc %
              </th>
              <th style={{ padding: "12px 16px", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", textAlign: "right" }}>
                Line Total
              </th>
              {editable && (
                <th style={{ padding: "12px 16px", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", textAlign: "right" }}>
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={editable ? 7 : 6} style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  No products added yet.
                </td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <tr key={item.productId || idx} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "6px",
                        background: "rgba(99, 102, 241, 0.1)",
                        color: "var(--primary-400)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}>
                        <Package size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: "600", color: "var(--text-main)", fontSize: "0.875rem" }}>
                          {item.productName}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                          {item.sku} • {item.companyName || "FMCG"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: "12px 16px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    {item.packSize || "-"} / {item.unit || "PCS"}
                  </td>

                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "var(--text-main)", textAlign: "right", fontWeight: "600" }}>
                    {format(item.saleRate)}
                  </td>

                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    {editable ? (
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => onUpdateQuantity && onUpdateQuantity(item.productId, parseInt(e.target.value, 10) || 1)}
                        style={{
                          width: "60px",
                          padding: "6px 8px",
                          borderRadius: "6px",
                          border: "1px solid var(--border-color)",
                          background: "var(--bg-secondary)",
                          color: "var(--text-main)",
                          fontSize: "0.85rem",
                          textAlign: "center",
                          outline: "none"
                        }}
                      />
                    ) : (
                      <span style={{ fontWeight: "700", color: "var(--text-main)", fontSize: "0.875rem" }}>
                        {item.quantity}
                      </span>
                    )}
                  </td>

                  <td style={{ padding: "12px 16px", textAlign: "center", fontSize: "0.82rem", color: item.discount > 0 ? "#34d399" : "var(--text-muted)" }}>
                    {item.discount > 0 ? `${item.discount}%` : "-"}
                  </td>

                  <td style={{ padding: "12px 16px", fontSize: "0.9rem", color: "var(--text-main)", textAlign: "right", fontWeight: "700" }}>
                    {format(item.lineTotal || (item.quantity * item.saleRate))}
                  </td>

                  {editable && (
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => onRemoveItem && onRemoveItem(item.productId)}
                        style={{
                          padding: "5px 8px",
                          borderRadius: "6px",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          background: "rgba(239, 68, 68, 0.1)",
                          color: "#f87171",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center"
                        }}
                        title="Remove product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
