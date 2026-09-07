import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Calendar, 
  Filter, 
  XCircle,
  AlertCircle,
  CheckCircle2,
  Store,
  UserCheck
} from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import CancelOrderModal from "./CancelOrderModal";

export default function OrderList({ 
  token, 
  user, 
  onSelectOrder, 
  onOpenCreateModal 
}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Cancellation Modal
  const [cancellingOrder, setCancellingOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        search: search.trim(),
        status: statusFilter
      });

      // If user is salesman, calls /api/orders/my
      const endpoint = user?.role === "SALESMAN"
        ? `http://localhost:5005/api/orders/my?${queryParams.toString()}`
        : `http://localhost:5005/api/orders?${queryParams.toString()}`;

      const response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setOrders(json.data || []);
        setTotalPages(json.totalPages || 1);
        setTotalRecords(json.total || 0);
      } else {
        setError(json.message || "Failed to load orders.");
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError("Unable to connect to Orders API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchOrders();
    }, 300);

    return () => clearTimeout(handler);
  }, [search, statusFilter, page]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const format = (num) => `₹${Number(num || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          padding: "12px 18px",
          borderRadius: "10px",
          background: "rgba(16, 185, 129, 0.12)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          color: "#34d399",
          fontSize: "0.875rem",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
              {user?.role === "SALESMAN" ? "My Beat Sales Orders" : "Sales Order Management"}
            </h2>
            <span style={{
              background: "var(--badge-brand-bg)",
              color: "var(--primary-400)",
              fontSize: "0.75rem",
              fontWeight: "700",
              padding: "3px 10px",
              borderRadius: "20px",
              border: "1px solid rgba(99, 102, 241, 0.3)"
            }}>
              {totalRecords} Orders
            </span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "4px" }}>
            Real-time field orders, draft lifecycle, and pricing values ready for billing
          </p>
        </div>

        {onOpenCreateModal && (
          <button
            onClick={onOpenCreateModal}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--primary-600)",
              color: "#ffffff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "0.875rem",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
              transition: "all 0.2s ease"
            }}
          >
            <Plus size={18} />
            <span>Book New Order</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{
        padding: "16px 20px",
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "14px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)"
      }}>
        {/* Search */}
        <div style={{
          position: "relative",
          flex: "1 1 280px",
          minWidth: "220px"
        }}>
          <Search size={18} style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-muted)"
          }} />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search order number, outlet, code..."
            style={{
              width: "100%",
              padding: "10px 14px 10px 42px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
              color: "var(--text-main)",
              fontSize: "0.875rem",
              outline: "none"
            }}
          />
        </div>

        {/* Status Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            style={{
              padding: "9px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
              color: "var(--text-main)",
              fontSize: "0.875rem",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">DRAFT</option>
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div style={{
          padding: "14px 18px",
          borderRadius: "10px",
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          color: "#f87171",
          fontSize: "0.875rem",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Orders Table Container */}
      <div className="glass-card" style={{
        borderRadius: "14px",
        overflow: "hidden",
        border: "1px solid var(--border-color)",
        background: "var(--bg-surface)"
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "var(--table-header-bg)", borderBottom: "1px solid var(--border-color)" }}>
                <th style={{ padding: "14px 18px", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Order #
                </th>
                <th style={{ padding: "14px 18px", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Date
                </th>
                <th style={{ padding: "14px 18px", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Customer
                </th>
                <th style={{ padding: "14px 18px", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Salesman
                </th>
                <th style={{ padding: "14px 18px", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Route
                </th>
                <th style={{ padding: "14px 18px", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>
                  Items
                </th>
                <th style={{ padding: "14px 18px", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>
                  Grand Total
                </th>
                <th style={{ padding: "14px 18px", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Status
                </th>
                <th style={{ padding: "14px 18px", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr 
                    key={ord.id}
                    style={{
                      borderBottom: "1px solid var(--border-color)",
                      transition: "background 0.15s ease"
                    }}
                  >
                    {/* Order # */}
                    <td style={{ padding: "16px 18px" }}>
                      <div style={{ fontSize: "0.875rem", fontFamily: "monospace", fontWeight: "700", color: "var(--primary-400)" }}>
                        {ord.orderNumber}
                      </div>
                    </td>

                    {/* Date */}
                    <td style={{ padding: "16px 18px", fontSize: "0.85rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {new Date(ord.orderDate || ord.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>

                    {/* Customer */}
                    <td style={{ padding: "16px 18px" }}>
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
                          <Store size={15} />
                        </div>
                        <div>
                          <span style={{ fontWeight: "700", color: "var(--text-main)", fontSize: "0.9rem" }}>
                            {ord.customer?.shopName}
                          </span>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            {ord.customer?.customerCode}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Salesman */}
                    <td style={{ padding: "16px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <UserCheck size={14} style={{ color: "var(--primary-400)" }} />
                        <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)" }}>
                          {ord.salesman?.salesmanName || "Unassigned"}
                        </span>
                      </div>
                    </td>

                    {/* Route */}
                    <td style={{ padding: "16px 18px" }}>
                      <span style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                        fontSize: "0.78rem",
                        fontWeight: "600",
                        color: "var(--text-main)"
                      }}>
                        {ord.route?.routeName || ord.customer?.routeName || "General Route"}
                      </span>
                    </td>

                    {/* Items */}
                    <td style={{ padding: "16px 18px", textAlign: "center" }}>
                      <span style={{
                        padding: "3px 8px",
                        borderRadius: "10px",
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "var(--text-main)"
                      }}>
                        {ord.pricingSummary?.totalItems || ord.items?.length || 0} Lines
                      </span>
                    </td>

                    {/* Grand Total */}
                    <td style={{ padding: "16px 18px", textAlign: "right" }}>
                      <strong style={{ fontSize: "0.95rem", color: "var(--text-main)" }}>
                        {format(ord.pricingSummary?.grandTotal)}
                      </strong>
                    </td>

                    {/* Status */}
                    <td style={{ padding: "16px 18px" }}>
                      <OrderStatusBadge status={ord.status} />
                    </td>

                    {/* Action */}
                    <td style={{ padding: "16px 18px", textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                        <button
                          onClick={() => onSelectOrder(ord)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: "1px solid var(--border-color)",
                            background: "var(--bg-secondary)",
                            color: "var(--text-main)",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </button>

                        {ord.status !== "CANCELLED" && (
                          <button
                            onClick={() => setCancellingOrder(ord)}
                            title="Cancel Order"
                            style={{
                              padding: "6px 8px",
                              borderRadius: "6px",
                              border: "none",
                              background: "rgba(239, 68, 68, 0.1)",
                              color: "#f87171",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{
          padding: "14px 20px",
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--table-header-bg)",
          fontSize: "0.85rem",
          color: "var(--text-muted)"
        }}>
          <div>
            Showing {orders.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalRecords)} of {totalRecords} orders
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                background: page <= 1 ? "transparent" : "var(--bg-secondary)",
                color: page <= 1 ? "var(--border-color)" : "var(--text-main)",
                cursor: page <= 1 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center"
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <span>Page {page} of {totalPages || 1}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                background: page >= totalPages ? "transparent" : "var(--bg-secondary)",
                color: page >= totalPages ? "var(--border-color)" : "var(--text-main)",
                cursor: page >= totalPages ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center"
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {cancellingOrder && (
        <CancelOrderModal
          token={token}
          order={cancellingOrder}
          onClose={() => setCancellingOrder(null)}
          onSuccess={(msg) => {
            showToast(msg);
            fetchOrders();
          }}
        />
      )}
    </div>
  );
}
