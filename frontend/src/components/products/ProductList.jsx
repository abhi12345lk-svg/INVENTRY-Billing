import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Filter, 
  Package, 
  Tag, 
  Layers, 
  Building2, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  Percent,
  Boxes
} from "lucide-react";

export default function ProductList({ 
  token, 
  userRole = "SUPER_ADMIN",
  onSelectProduct, 
  onOpenAddModal, 
  onOpenEditModal, 
  onOpenStatusModal 
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Search & Filter state
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const canModify = userRole !== "SALESMAN";

  const DEFAULT_DEMO_PRODUCTS = [
    {
      id: "prd-001",
      productCode: "PRD-NESTLE-001",
      skuCode: "MAGGI-70G-CTN",
      name: "Maggi 2-Minute Noodles 70g (Carton 96pk)",
      companyId: "COMP-NESTLE",
      companyName: "Nestlé India",
      category: "Food & Snacks",
      packagingUnit: "Carton",
      packSize: "96 Packs",
      mrp: 1440,
      saleRate: 1220,
      gstRate: 12,
      currentStock: 450,
      status: "ACTIVE"
    },
    {
      id: "prd-002",
      productCode: "PRD-PATANJALI-002",
      skuCode: "DANT-KANTI-100G",
      name: "Patanjali Dant Kanti Toothpaste 100g (Box 48)",
      companyId: "COMP-PATANJALI",
      companyName: "Patanjali Ayurved",
      category: "Personal Care",
      packagingUnit: "Box",
      packSize: "48 Tubes",
      mrp: 2400,
      saleRate: 2040,
      gstRate: 18,
      currentStock: 280,
      status: "ACTIVE"
    },
    {
      id: "prd-003",
      productCode: "PRD-GSK-003",
      skuCode: "HORLICKS-500G-JAR",
      name: "Horlicks Classic Malt 500g Jar (Pack 24)",
      companyId: "COMP-GSK",
      companyName: "GSK Healthcare",
      category: "Health Beverages",
      packagingUnit: "Carton",
      packSize: "24 Jars",
      mrp: 6600,
      saleRate: 5740,
      gstRate: 18,
      currentStock: 160,
      status: "ACTIVE"
    },
    {
      id: "prd-004",
      productCode: "PRD-NESTLE-004",
      skuCode: "NESCAFE-CL-100G",
      name: "Nescafé Classic Instant Coffee 100g Glass Jar",
      companyId: "COMP-NESTLE",
      companyName: "Nestlé India",
      category: "Beverages",
      packagingUnit: "Carton",
      packSize: "12 Jars",
      mrp: 3840,
      saleRate: 3310,
      gstRate: 18,
      currentStock: 95,
      status: "ACTIVE"
    }
  ];

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        search: search.trim(),
        companyId: companyFilter,
        category: categoryFilter,
        status: statusFilter
      });

      const response = await fetch(`http://localhost:5005/api/products?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setProducts(json.data);
        setTotalPages(json.totalPages);
        setTotalRecords(json.total);
      } else {
        setProducts(DEFAULT_DEMO_PRODUCTS);
        setTotalPages(1);
        setTotalRecords(DEFAULT_DEMO_PRODUCTS.length);
      }
    } catch (err) {
      console.warn("Fetch products fallback to demo catalog:", err);
      setProducts(DEFAULT_DEMO_PRODUCTS);
      setTotalPages(1);
      setTotalRecords(DEFAULT_DEMO_PRODUCTS.length);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(handler);
  }, [search, companyFilter, categoryFilter, statusFilter, page]);

  const getCompanyBadge = (companyId, companyName) => {
    if (companyId === "COMP-NESTLE") {
      return { bg: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "rgba(59, 130, 246, 0.3)" };
    }
    if (companyId === "COMP-PATANJALI") {
      return { bg: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "rgba(16, 185, 129, 0.3)" };
    }
    if (companyId === "COMP-GSK") {
      return { bg: "rgba(168, 85, 247, 0.15)", color: "#c084fc", border: "rgba(168, 85, 247, 0.3)" };
    }
    return { bg: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", border: "rgba(245, 158, 11, 0.3)" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Header Section */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
              Product Master
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
              {totalRecords} Products
            </span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Centralized FMCG SKU catalog across Nestlé, Patanjali, & GSK / Health
          </p>
        </div>

        {/* Action Button: Add Product (Hidden for Salesmen) */}
        {canModify && (
          <button
            onClick={onOpenAddModal}
            className="glow-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              color: "#ffffff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(99, 102, 241, 0.35)"
            }}
          >
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        )}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-card" style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px"
      }}>
        
        {/* Search Input */}
        <div style={{
          position: "relative",
          flex: "1 1 280px",
          minWidth: "240px"
        }}>
          <Search size={18} color="var(--text-dim)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Search product / SKU / PRD code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{
              width: "100%",
              background: "var(--bg-input)",
              border: "1px solid var(--border-card)",
              color: "var(--text-main)",
              borderRadius: "12px",
              padding: "10px 16px 10px 42px",
              fontSize: "0.88rem",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Filters Group */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
          
          {/* Company Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Building2 size={16} color="var(--text-dim)" />
            <select
              value={companyFilter}
              onChange={(e) => {
                setCompanyFilter(e.target.value);
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
              <option value="ALL">All Companies</option>
              <option value="COMP-NESTLE">Nestlé</option>
              <option value="COMP-PATANJALI">Patanjali</option>
              <option value="COMP-GSK">GSK / Health</option>
            </select>
          </div>

          {/* Category Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Layers size={16} color="var(--text-dim)" />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
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
              <option value="ALL">All Categories</option>
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

          {/* Status Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Filter size={16} color="var(--text-dim)" />
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
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
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
            <span>Loading Products from FMCG Catalog...</span>
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
        {!loading && !error && products.length === 0 && (
          <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)" }}>
            <Package size={44} color="var(--text-dim)" style={{ marginBottom: "12px" }} />
            <h4 style={{ color: "var(--text-main)", marginBottom: "6px", fontSize: "1.05rem" }}>No Products In Catalog</h4>
            <p style={{ fontSize: "0.85rem", maxWidth: "380px", margin: "0 auto 16px auto" }}>
              {search || companyFilter !== "ALL" || categoryFilter !== "ALL" || statusFilter !== "ALL"
                ? "No products match your filter criteria. Try clearing search filters."
                : "Your product master catalog is empty. Add your first FMCG item to begin inventory and billing."}
            </p>
            {onOpenAddModal && (
              <button
                onClick={onOpenAddModal}
                style={{
                  background: "var(--primary-600)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 18px",
                  fontSize: "0.88rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <Plus size={16} />
                <span>Add Product</span>
              </button>
            )}
          </div>
        )}

        {/* Data Table */}
        {!loading && !error && products.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{
                  borderBottom: "1px solid var(--border-card)",
                  background: "var(--table-header-bg)",
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  <th style={{ padding: "14px 20px" }}>Product Code</th>
                  <th style={{ padding: "14px 20px" }}>SKU</th>
                  <th style={{ padding: "14px 20px" }}>Product Name</th>
                  <th style={{ padding: "14px 20px" }}>Company</th>
                  <th style={{ padding: "14px 20px" }}>Category</th>
                  <th style={{ padding: "14px 20px" }}>Unit / Pack</th>
                  <th style={{ padding: "14px 20px", textAlign: "right" }}>MRP</th>
                  <th style={{ padding: "14px 20px", textAlign: "right" }}>Sale Rate</th>
                  <th style={{ padding: "14px 20px", textAlign: "right" }}>Tax</th>
                  <th style={{ padding: "14px 20px", textAlign: "center" }}>Min Stock</th>
                  <th style={{ padding: "14px 20px", textAlign: "center" }}>Status</th>
                  <th style={{ padding: "14px 20px", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, idx) => {
                  const companyStyle = getCompanyBadge(p.companyId, p.companyName);
                  const isActive = p.status === "ACTIVE";

                  return (
                    <tr 
                      key={p.id ? `${p.id}-${p.productCode || idx}` : idx}
                      style={{
                        borderBottom: "1px solid var(--border-card)",
                        transition: "background 0.2s ease"
                      }}
                      className="table-row-hover"
                    >
                      {/* Product Code */}
                      <td style={{ padding: "14px 20px", fontWeight: "700", color: "var(--primary-400)" }}>
                        <span style={{
                          background: "var(--badge-brand-bg)",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "0.78rem",
                          fontFamily: "monospace"
                        }}>
                          {p.productCode}
                        </span>
                      </td>

                      {/* SKU */}
                      <td style={{ padding: "14px 20px", color: "var(--text-dim)", fontFamily: "monospace", fontSize: "0.82rem" }}>
                        {p.sku}
                      </td>

                      {/* Product Name */}
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ fontWeight: "700", color: "var(--text-main)" }}>
                          {p.productName}
                        </div>
                        {p.subcategory && (
                          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                            {p.subcategory}
                          </div>
                        )}
                      </td>

                      {/* Company */}
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{
                          background: companyStyle.bg,
                          color: companyStyle.color,
                          border: `1px solid ${companyStyle.border}`,
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "0.75rem",
                          fontWeight: "700"
                        }}>
                          {p.companyName}
                        </span>
                      </td>

                      {/* Category */}
                      <td style={{ padding: "14px 20px", color: "var(--text-muted)" }}>
                        {p.category}
                      </td>

                      {/* Unit / Pack Size */}
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ fontWeight: "600", color: "var(--text-main)" }}>{p.unit}</span>
                        {p.packSize && (
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "4px" }}>
                            ({p.packSize})
                          </span>
                        )}
                      </td>

                      {/* MRP */}
                      <td style={{ padding: "14px 20px", textAlign: "right", color: "var(--text-muted)", textDecoration: p.mrp > p.saleRate ? "line-through" : "none" }}>
                        ₹{p.mrp.toFixed(2)}
                      </td>

                      {/* Sale Rate */}
                      <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: "800", color: "#10b981" }}>
                        ₹{p.saleRate.toFixed(2)}
                      </td>

                      {/* Tax Rate */}
                      <td style={{ padding: "14px 20px", textAlign: "right", color: "var(--text-dim)" }}>
                        {p.taxRate}%
                      </td>

                      {/* Min Stock */}
                      <td style={{ padding: "14px 20px", textAlign: "center" }}>
                        <span style={{
                          background: "var(--bg-input)",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          color: "var(--text-muted)"
                        }}>
                          {p.minimumStock}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px 20px", textAlign: "center" }}>
                        <span style={{
                          background: isActive ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                          color: isActive ? "#34d399" : "#f87171",
                          border: `1px solid ${isActive ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "0.75rem",
                          fontWeight: "700",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px"
                        }}>
                          <span style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: isActive ? "#10b981" : "#ef4444"
                          }} />
                          {p.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "14px 20px", textAlign: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                          
                          {/* View Details */}
                          <button
                            onClick={() => onSelectProduct(p)}
                            title="View Product Details"
                            style={{
                              background: "var(--bg-input)",
                              border: "1px solid var(--border-card)",
                              color: "var(--text-muted)",
                              padding: "6px",
                              borderRadius: "8px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <Eye size={15} />
                          </button>

                          {/* Edit Product (Permitted roles only) */}
                          {canModify && (
                            <button
                              onClick={() => onOpenEditModal(p)}
                              title="Edit Product"
                              style={{
                                background: "var(--bg-input)",
                                border: "1px solid var(--border-card)",
                                color: "var(--text-muted)",
                                padding: "6px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              <Edit3 size={15} />
                            </button>
                          )}

                          {/* Status Toggle (Permitted roles only) */}
                          {canModify && (
                            <button
                              onClick={() => onOpenStatusModal(p)}
                              title={isActive ? "Deactivate Product" : "Activate Product"}
                              style={{
                                background: "var(--bg-input)",
                                border: "1px solid var(--border-card)",
                                color: isActive ? "#f87171" : "#34d399",
                                padding: "6px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              {isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && !error && products.length > 0 && (
          <div style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border-card)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            background: "var(--table-header-bg)"
          }}>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Showing <span style={{ color: "var(--text-main)", fontWeight: "700" }}>{products.length}</span> of <span style={{ color: "var(--text-main)", fontWeight: "700" }}>{totalRecords}</span> products • Page {page} of {totalPages}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                style={{
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-card)",
                  color: page <= 1 ? "var(--text-dim)" : "var(--text-main)",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  fontWeight: "600",
                  cursor: page <= 1 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <ChevronLeft size={15} />
                <span>Prev</span>
              </button>

              <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)", padding: "0 8px" }}>
                {page} / {totalPages}
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                style={{
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-card)",
                  color: page >= totalPages ? "var(--text-dim)" : "var(--text-main)",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  fontWeight: "600",
                  cursor: page >= totalPages ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <span>Next</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
