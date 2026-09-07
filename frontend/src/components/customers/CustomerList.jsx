import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Filter, 
  Store, 
  Phone, 
  MapPin, 
  UserCheck, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Edit3, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  X,
  CreditCard
} from "lucide-react";

export default function CustomerList({ token, onSelectCustomer, onOpenAddModal, onOpenEditModal, onOpenStatusModal }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Search & Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [routeFilter, setRouteFilter] = useState("ALL");
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchCustomers = async () => {
    setLoading(true);
    setError("");

    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        search: search.trim(),
        status: statusFilter,
        routeId: routeFilter
      });

      const response = await fetch(`http://localhost:5005/api/customers?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setCustomers(json.data);
        setTotalPages(json.totalPages);
        setTotalRecords(json.total);
      } else {
        setError(json.message || "Failed to load customers.");
      }
    } catch (err) {
      console.error("Fetch customers error:", err);
      setError("Unable to connect to Customer Master API.");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchCustomers();
    }, 300);
    return () => clearTimeout(handler);
  }, [search, statusFilter, routeFilter, page, token]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return <span style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981", padding: "3px 10px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "700" }}>● ACTIVE</span>;
      case "BLOCKED":
        return <span style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", padding: "3px 10px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "700" }}>● BLOCKED</span>;
      case "ON_HOLD":
        return <span style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", padding: "3px 10px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "700" }}>● ON HOLD</span>;
      case "INACTIVE":
        return <span style={{ background: "rgba(100, 116, 139, 0.15)", color: "#64748b", padding: "3px 10px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "700" }}>● INACTIVE</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Top Title & Action Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <Store size={24} color="var(--primary-400)" />
            <h1 style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
              Customer / Outlet Master
            </h1>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Manage 4,000+ FMCG retail outlets, routes, credit limits & salesman assignments
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenAddModal}>
          <Plus size={18} />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ padding: "20px", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between" }}>
        
        {/* Server-Side Search */}
        <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
          <input
            type="text"
            className="input-control"
            placeholder="Search shop name, owner, mobile or CUS code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{ paddingLeft: "42px", height: "42px" }}
          />
          <Search className="input-icon" size={18} style={{ left: "14px" }} />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          
          {/* Status Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "600" }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-card)",
                color: "var(--text-main)",
                borderRadius: "10px",
                padding: "8px 12px",
                fontSize: "0.85rem",
                outline: "none"
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="BLOCKED">Blocked</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Route Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "600" }}>Route:</span>
            <select
              value={routeFilter}
              onChange={(e) => {
                setRouteFilter(e.target.value);
                setPage(1);
              }}
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-card)",
                color: "var(--text-main)",
                borderRadius: "10px",
                padding: "8px 12px",
                fontSize: "0.85rem",
                outline: "none"
              }}
            >
              <option value="ALL">All Routes</option>
              <option value="ROUTE-A">Route A - Sadar Bazaar</option>
              <option value="ROUTE-B">Route B - Model Town</option>
              <option value="ROUTE-C">Route C - G.T. Road</option>
            </select>
          </div>

        </div>

      </div>

      {/* Table & Content Section */}
      <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
        
        {/* Loading */}
        {loading && (
          <div style={{ padding: "60px", textAlign: "center", color: "var(--text-muted)" }}>
            <div style={{
              width: "36px",
              height: "36px",
              border: "3px solid rgba(99, 102, 241, 0.2)",
              borderTopColor: "var(--primary-400)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px auto"
            }} />
            <span>Loading Customers from MongoDB Atlas...</span>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{ padding: "40px", textAlign: "center", color: "#fca5a5" }}>
            <AlertCircle size={32} style={{ marginBottom: "12px" }} />
            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && customers.length === 0 && (
          <div style={{ padding: "60px", textAlign: "center", color: "var(--text-muted)" }}>
            <Store size={40} color="var(--text-dim)" style={{ marginBottom: "12px" }} />
            <h4 style={{ color: "var(--text-main)", marginBottom: "4px" }}>No Outlets Found</h4>
            <p style={{ fontSize: "0.85rem" }}>Try adjusting your search terms or filters.</p>
          </div>
        )}

        {/* Data Table */}
        {!loading && !error && customers.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ background: "var(--bg-input)", borderBottom: "1px solid var(--border-card)", color: "var(--text-muted)", fontSize: "0.78rem", textTransform: "uppercase" }}>
                  <th style={{ padding: "16px 20px" }}>Code</th>
                  <th style={{ padding: "16px 20px" }}>Shop & Owner</th>
                  <th style={{ padding: "16px 20px" }}>Contact</th>
                  <th style={{ padding: "16px 20px" }}>Route & Area</th>
                  <th style={{ padding: "16px 20px" }}>Salesman</th>
                  <th style={{ padding: "16px 20px" }}>Credit Limit</th>
                  <th style={{ padding: "16px 20px" }}>Status</th>
                  <th style={{ padding: "16px 20px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr 
                    key={c.id} 
                    style={{ borderBottom: "1px solid var(--border-card)", transition: "background 0.2s ease" }}
                  >
                    <td style={{ padding: "16px 20px", fontWeight: "700", color: "var(--primary-400)" }}>
                      {c.customerCode}
                    </td>

                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ fontWeight: "700", color: "var(--text-main)" }}>{c.shopName}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>Owner: {c.ownerName || "N/A"}</div>
                    </td>

                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-main)" }}>
                        <Phone size={14} color="var(--text-muted)" />
                        <span>{c.mobile}</span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{c.address.slice(0, 25)}...</div>
                    </td>

                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ fontWeight: "600", color: "var(--text-main)" }}>{c.routeName}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{c.areaName}</div>
                    </td>

                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-main)", fontWeight: "500" }}>{c.salesmanName}</div>
                    </td>

                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ fontWeight: "700", color: "#10b981" }}>{formatCurrency(c.creditLimit)}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>Terms: {c.paymentTerms}</div>
                    </td>

                    <td style={{ padding: "16px 20px" }}>
                      {getStatusBadge(c.status)}
                    </td>

                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => onSelectCustomer(c)}
                          title="View Details"
                          style={{
                            background: "var(--bg-input)",
                            border: "1px solid var(--border-card)",
                            color: "var(--text-main)",
                            padding: "6px 10px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "0.78rem"
                          }}
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </button>

                        <button
                          onClick={() => onOpenEditModal(c)}
                          title="Edit Customer"
                          style={{
                            background: "var(--bg-input)",
                            border: "1px solid var(--border-card)",
                            color: "var(--primary-400)",
                            padding: "6px 10px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "0.78rem"
                          }}
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => onOpenStatusModal(c)}
                          title="Change Status"
                          style={{
                            background: "rgba(245, 158, 11, 0.12)",
                            border: "1px solid rgba(245, 158, 11, 0.3)",
                            color: "#f59e0b",
                            padding: "6px 10px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "0.78rem"
                          }}
                        >
                          <ShieldAlert size={14} />
                          <span>Status</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && !error && customers.length > 0 && (
          <div style={{
            padding: "16px 24px",
            background: "var(--bg-input)",
            borderTop: "1px solid var(--border-card)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.85rem",
            color: "var(--text-muted)"
          }}>
            <div>
              Showing <strong style={{ color: "var(--text-main)" }}>{customers.length}</strong> of <strong style={{ color: "var(--text-main)" }}>{totalRecords}</strong> Outlets
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  color: page <= 1 ? "var(--text-dim)" : "var(--text-main)",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  cursor: page <= 1 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>

              <span>Page <strong style={{ color: "var(--text-main)" }}>{page}</strong> of {totalPages}</span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  color: page >= totalPages ? "var(--text-dim)" : "var(--text-main)",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  cursor: page >= totalPages ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
