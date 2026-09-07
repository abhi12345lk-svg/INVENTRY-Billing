import React, { useState, useEffect } from "react";
import { 
  Package, 
  Layers, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sliders, 
  ArrowRight, 
  RefreshCw, 
  AlertCircle,
  Building2,
  TrendingUp,
  History
} from "lucide-react";
import { InventoryStatusBadge } from "./InventoryStatusBadge";
import StockAdjustmentModal from "./StockAdjustmentModal";

export default function InventoryDashboard({
  token,
  user,
  onSelectProduct,
  onViewAllStock,
  onViewMovements
}) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Quick adjustment modal
  const [adjustingItem, setAdjustingItem] = useState(null);

  const canAdjustStock = ["SUPER_ADMIN", "ADMIN", "FINANCE"].includes(user?.role);

  const fetchSummary = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5005/api/inventory/summary/dashboard", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setSummary(json.data);
      } else {
        setError(json.message || "Failed to load inventory summary.");
      }
    } catch (err) {
      console.error("Fetch inventory summary error:", err);
      setError("Unable to connect to inventory server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  if (loading) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center", color: "var(--text-muted)" }}>
        <div style={{
          width: "36px",
          height: "36px",
          border: "3px solid rgba(99, 102, 241, 0.2)",
          borderTopColor: "var(--primary-500)",
          borderRadius: "50%",
          margin: "0 auto 16px",
          animation: "spin 1s linear infinite"
        }} />
        <p style={{ fontSize: "0.9rem", fontWeight: "600" }}>Scanning warehouse stock levels...</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="glass-card" style={{ padding: "40px", textAlign: "center", maxWidth: "520px", margin: "40px auto" }}>
        <AlertCircle size={40} color="#ef4444" style={{ marginBottom: "12px" }} />
        <p style={{ fontWeight: "700", fontSize: "1rem", color: "#dc2626" }}>{error || "Failed to retrieve stock dashboard summary."}</p>
        <button
          onClick={fetchSummary}
          className="btn-primary"
          style={{ marginTop: "16px", padding: "8px 20px", fontSize: "0.85rem" }}
        >
          Retry
        </button>
      </div>
    );
  }

  const {
    totalProducts = 0,
    totalStockUnits = 0,
    stockValue = 0,
    inStockProducts = 0,
    lowStockProducts = 0,
    outOfStockProducts = 0,
    lowStockAlerts = []
  } = summary;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 20px",
          background: "rgba(16, 185, 129, 0.12)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          borderRadius: "12px",
          color: "#059669",
          fontWeight: "600",
          fontSize: "0.88rem"
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--primary-600)", fontSize: "0.82rem", fontWeight: "800", marginBottom: "4px" }}>
            <Package size={16} />
            WAREHOUSE & STOCK CONTROL
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em", margin: 0 }}>
            Inventory & Stock Command Center
          </h1>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Warehouse on-hand stock, reorder thresholds, and distributor supply alerts.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {onViewMovements && (
            <button
              onClick={onViewMovements}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-card)",
                color: "var(--text-main)",
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "0.82rem",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              <History size={15} color="var(--primary-500)" />
              <span>Stock Movements</span>
            </button>
          )}
          {onViewAllStock && (
            <button
              onClick={onViewAllStock}
              className="btn-primary"
              style={{ padding: "8px 20px", fontSize: "0.82rem", gap: "8px" }}
            >
              <span>View Stock List</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>

      {/* 6 Core KPI Grid Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "14px"
      }}>
        {/* Total Products */}
        <div className="glass-card" style={{ padding: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase" }}>
            <span>Products</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(99, 102, 241, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Package size={16} color="var(--primary-500)" />
            </div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "900", color: "var(--text-main)", marginTop: "10px" }}>
            {totalProducts}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "4px" }}>Active SKUs</div>
        </div>

        {/* Total Stock Units */}
        <div className="glass-card" style={{ padding: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase" }}>
            <span>Total Units</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(6, 182, 212, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Layers size={16} color="#0891b2" />
            </div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "900", color: "var(--text-main)", marginTop: "10px" }}>
            {totalStockUnits.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "4px" }}>Physical on hand</div>
        </div>

        {/* Estimated Stock Value */}
        <div className="glass-card" style={{ padding: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase" }}>
            <span>Stock Value</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DollarSign size={16} color="#059669" />
            </div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "900", color: "#059669", marginTop: "10px" }}>
            ₹{stockValue.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "4px" }}>Wholesale valuation</div>
        </div>

        {/* In Stock Products */}
        <div className="glass-card" style={{ padding: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase" }}>
            <span>In Stock</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle2 size={16} color="#059669" />
            </div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "900", color: "#059669", marginTop: "10px" }}>
            {inStockProducts}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#059669", fontWeight: "700", marginTop: "4px" }}>Healthy supply</div>
        </div>

        {/* Low Stock Products */}
        <div className="glass-card" style={{ padding: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase" }}>
            <span>Low Stock</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(245, 158, 11, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertTriangle size={16} color="#d97706" />
            </div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "900", color: "#d97706", marginTop: "10px" }}>
            {lowStockProducts}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#d97706", fontWeight: "700", marginTop: "4px" }}>Below threshold</div>
        </div>

        {/* Out Of Stock Products */}
        <div className="glass-card" style={{ padding: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase" }}>
            <span>Out of Stock</span>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <XCircle size={16} color="#dc2626" />
            </div>
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "900", color: "#dc2626", marginTop: "10px" }}>
            {outOfStockProducts}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#dc2626", fontWeight: "700", marginTop: "4px" }}>Immediate reorder</div>
        </div>
      </div>

      {/* Low Stock & Stockout Alerts Section */}
      <div className="glass-card" style={{
        padding: "24px",
        background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(245, 158, 11, 0.04) 100%)",
        border: "1px solid rgba(245, 158, 11, 0.3)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "rgba(245, 158, 11, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#d97706"
            }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>
                  Critical Stock Alerts & Reorder Exceptions
                </h3>
                <span style={{
                  padding: "2px 8px",
                  fontSize: "0.72rem",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  borderRadius: "20px",
                  background: "rgba(245, 158, 11, 0.15)",
                  color: "#d97706",
                  border: "1px solid rgba(245, 158, 11, 0.3)"
                }}>
                  {lowStockAlerts.length} Products Impacted
                </span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                Items requiring immediate purchase replenishment or stock adjustment to prevent order fulfillment delays.
              </p>
            </div>
          </div>
        </div>

        {lowStockAlerts.length === 0 ? (
          <div style={{
            padding: "28px",
            textAlign: "center",
            background: "rgba(16, 185, 129, 0.08)",
            borderRadius: "12px",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            color: "#059669"
          }}>
            <CheckCircle2 size={28} style={{ margin: "0 auto 8px" }} />
            <p style={{ fontSize: "0.88rem", fontWeight: "700" }}>All products are currently well-stocked above minimum thresholds.</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "14px"
          }}>
            {lowStockAlerts.map((alert) => {
              const isOos = alert.status === "OUT_OF_STOCK";

              return (
                <div
                  key={alert.id}
                  style={{
                    padding: "16px",
                    borderRadius: "14px",
                    background: isOos ? "rgba(239, 68, 68, 0.05)" : "rgba(245, 158, 11, 0.05)",
                    border: `1px solid ${isOos ? "rgba(239, 68, 68, 0.25)" : "rgba(245, 158, 11, 0.25)"}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontWeight: "800", color: "var(--text-main)", fontSize: "0.88rem" }}>
                        {alert.productName}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                        {alert.productCode} • <span style={{ color: "var(--text-main)", fontWeight: "600" }}>{alert.companyName}</span>
                      </div>
                    </div>
                    <InventoryStatusBadge status={alert.status} />
                  </div>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "8px",
                    padding: "10px",
                    background: "var(--bg-surface-2)",
                    borderRadius: "10px",
                    textAlign: "center",
                    border: "1px solid var(--border-color)"
                  }}>
                    <div>
                      <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", display: "block", textTransform: "uppercase", fontWeight: "700" }}>Available</span>
                      <span style={{ fontWeight: "800", fontSize: "0.95rem", color: isOos ? "#dc2626" : "#d97706" }}>
                        {alert.availableStock}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", display: "block", textTransform: "uppercase", fontWeight: "700" }}>Minimum</span>
                      <span style={{ fontWeight: "800", fontSize: "0.95rem", color: "var(--text-main)" }}>
                        {alert.minimumStock}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", display: "block", textTransform: "uppercase", fontWeight: "700" }}>Shortage</span>
                      <span style={{ fontWeight: "800", fontSize: "0.95rem", color: "#dc2626" }}>
                        -{alert.deficit}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "4px" }}>
                    {canAdjustStock && (
                      <button
                        onClick={() => setAdjustingItem(alert)}
                        style={{
                          flex: 1,
                          padding: "7px 12px",
                          background: "var(--primary-600)",
                          color: "#ffffff",
                          border: "none",
                          fontSize: "0.78rem",
                          fontWeight: "700",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px"
                        }}
                      >
                        <Sliders size={13} />
                        <span>Adjust / Restock</span>
                      </button>
                    )}
                    {onSelectProduct && (
                      <button
                        onClick={() => onSelectProduct(alert)}
                        style={{
                          padding: "7px 12px",
                          background: "var(--bg-card)",
                          border: "1px solid var(--border-card)",
                          color: "var(--text-main)",
                          fontSize: "0.78rem",
                          fontWeight: "700",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center"
                        }}
                        title="View Details"
                      >
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stock Adjustment Modal */}
      {adjustingItem && (
        <StockAdjustmentModal
          isOpen={!!adjustingItem}
          onClose={() => setAdjustingItem(null)}
          inventory={adjustingItem}
          token={token}
          user={user}
          onSuccess={(result) => {
            showToast(`Adjusted stock for ${result.inventory.productName}! New stock: ${result.inventory.currentStock}`);
            setAdjustingItem(null);
            fetchSummary();
          }}
        />
      )}
    </div>
  );
}
