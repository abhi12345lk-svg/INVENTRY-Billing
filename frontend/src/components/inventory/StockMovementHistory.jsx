import React, { useState, useEffect } from "react";
import { 
  History, 
  Search, 
  Calendar, 
  UserCheck, 
  FileText, 
  RefreshCw, 
  AlertCircle,
  Package
} from "lucide-react";
import { MovementTypeBadge } from "./InventoryStatusBadge";

export default function StockMovementHistory({
  inventoryId = null,
  token,
  user,
  title = "Stock Movement History"
}) {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchMovements = async () => {
    setLoading(true);
    setError("");

    try {
      const endpoint = inventoryId
        ? `http://localhost:5005/api/inventory/${inventoryId}/movements?page=${page}&limit=${limit}`
        : `http://localhost:5005/api/inventory/movements/all?page=${page}&limit=${limit}`;

      const response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setMovements(json.data || []);
        setTotalPages(json.totalPages || 1);
        setTotalRecords(json.total || 0);
      } else {
        setError(json.message || "Failed to load stock movements.");
      }
    } catch (err) {
      console.error("Fetch movements error:", err);
      setError("Unable to connect to inventory server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, [inventoryId, page]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <History size={18} color="var(--primary-500)" />
          <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>{title}</h3>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "monospace" }}>({totalRecords} movements)</span>
        </div>

        <button
          onClick={fetchMovements}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            color: "var(--text-muted)",
            padding: "6px 12px",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.8rem",
            fontWeight: "600"
          }}
          title="Refresh movements"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} color="var(--primary-500)" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="glass-card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{
              width: "32px",
              height: "32px",
              border: "3px solid rgba(99, 102, 241, 0.2)",
              borderTopColor: "var(--primary-500)",
              borderRadius: "50%",
              margin: "0 auto 12px",
              animation: "spin 1s linear infinite"
            }} />
            <p style={{ fontSize: "0.85rem", fontWeight: "600" }}>Loading movement ledger...</p>
          </div>
        ) : error ? (
          <div style={{ padding: "30px", textAlign: "center", color: "#dc2626" }}>
            <p style={{ fontSize: "0.85rem", fontWeight: "700" }}>{error}</p>
          </div>
        ) : movements.length === 0 ? (
          <div style={{ padding: "50px 20px", textAlign: "center", color: "var(--text-muted)" }}>
            <Package size={36} style={{ margin: "0 auto 10px", color: "var(--text-dim)" }} />
            <p style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)", margin: "0 0 4px" }}>No stock movements recorded</p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
              Stock movements will appear when invoices are billed or manual adjustments are made.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{
                  background: "var(--table-header-bg)",
                  borderBottom: "1px solid var(--border-color)",
                  color: "var(--text-muted)",
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em"
                }}>
                  <th style={{ padding: "12px 16px" }}>Movement #</th>
                  <th style={{ padding: "12px 16px" }}>Date & Time</th>
                  {!inventoryId && <th style={{ padding: "12px 16px" }}>Product</th>}
                  <th style={{ padding: "12px 16px" }}>Type</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Quantity</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Pre Stock</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Post Stock</th>
                  <th style={{ padding: "12px 16px" }}>Reference / Bill</th>
                  <th style={{ padding: "12px 16px" }}>Audit Reason</th>
                  <th style={{ padding: "12px 16px" }}>Performed By</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((mv, idx) => {
                  const isPositive =
                    mv.movementType === "ADJUSTMENT_IN" ||
                    mv.movementType === "OPENING_STOCK" ||
                    mv.movementType === "RETURN_IN" ||
                    mv.movementType === "DEMO_SEED";

                  return (
                    <tr
                      key={mv.id || mv._id}
                      style={{
                        borderBottom: "1px solid var(--border-color)",
                        background: idx % 2 === 0 ? "var(--bg-card)" : "var(--table-row-even)",
                        transition: "background 0.15s ease"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-row-hover)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? "var(--bg-card)" : "var(--table-row-even)"}
                    >
                      {/* Movement Number */}
                      <td style={{ padding: "12px 16px", fontFamily: "monospace", fontWeight: "800", color: "var(--text-main)" }}>
                        {mv.movementNumber}
                      </td>

                      {/* Date */}
                      <td style={{ padding: "12px 16px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                        {mv.createdAt ? new Date(mv.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        }) : "-"}
                      </td>

                      {/* Product (if viewing all movements) */}
                      {!inventoryId && (
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ fontWeight: "700", color: "var(--text-main)", maxWidth: "180px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{mv.productName}</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", fontFamily: "monospace" }}>{mv.productCode}</div>
                        </td>
                      )}

                      {/* Type Badge */}
                      <td style={{ padding: "12px 16px" }}>
                        <MovementTypeBadge type={mv.movementType} />
                      </td>

                      {/* Quantity */}
                      <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "monospace", fontWeight: "800", fontSize: "0.88rem" }}>
                        <span style={{ color: isPositive ? "#059669" : "#dc2626" }}>
                          {isPositive ? `+${mv.quantity}` : `-${mv.quantity}`}
                        </span>
                      </td>

                      {/* Pre Stock */}
                      <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "monospace", color: "var(--text-muted)" }}>
                        {mv.previousStock}
                      </td>

                      {/* Post Stock */}
                      <td style={{ padding: "12px 16px", textAlign: "right", fontFamily: "monospace", fontWeight: "800", color: "var(--text-main)" }}>
                        {mv.newStock}
                      </td>

                      {/* Reference */}
                      <td style={{ padding: "12px 16px", fontFamily: "monospace", color: "var(--text-main)" }}>
                        {mv.referenceId || mv.referenceType || "-"}
                      </td>

                      {/* Audit Reason */}
                      <td style={{ padding: "12px 16px", color: "var(--text-muted)", maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={mv.reason}>
                        {mv.reason || "-"}
                      </td>

                      {/* Performed By */}
                      <td style={{ padding: "12px 16px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                        {mv.performedBy || "System"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && movements.length > 0 && totalPages > 1 && (
          <div style={{
            padding: "12px 18px",
            background: "var(--table-header-bg)",
            borderTop: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.78rem",
            color: "var(--text-muted)"
          }}>
            <span>
              Page {page} of {totalPages} ({totalRecords} records)
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{
                  padding: "4px 12px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  color: "var(--text-main)",
                  borderRadius: "6px",
                  fontSize: "0.78rem",
                  cursor: page <= 1 ? "not-allowed" : "pointer",
                  opacity: page <= 1 ? 0.4 : 1
                }}
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                style={{
                  padding: "4px 12px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  color: "var(--text-main)",
                  borderRadius: "6px",
                  fontSize: "0.78rem",
                  cursor: page >= totalPages ? "not-allowed" : "pointer",
                  opacity: page >= totalPages ? 0.4 : 1
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
