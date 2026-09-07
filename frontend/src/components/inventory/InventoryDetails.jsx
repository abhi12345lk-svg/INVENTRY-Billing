import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Package, 
  Layers, 
  Building2, 
  MapPin, 
  DollarSign, 
  History, 
  Sliders, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  ShoppingCart
} from "lucide-react";
import { InventoryStatusBadge } from "./InventoryStatusBadge";
import StockAdjustmentModal from "./StockAdjustmentModal";
import StockMovementHistory from "./StockMovementHistory";

export default function InventoryDetails({
  inventoryId,
  initialInventory = null,
  token,
  user,
  onBack,
  onInventoryUpdated
}) {
  const [inventory, setInventory] = useState(initialInventory);
  const [loading, setLoading] = useState(!initialInventory);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "movements" | "warehouse" | "purchase"
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const canAdjustStock = ["SUPER_ADMIN", "ADMIN", "FINANCE"].includes(user?.role);

  const fetchDetails = async () => {
    if (!inventoryId && !initialInventory) return;
    const targetId = inventoryId || initialInventory.id || initialInventory._id;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:5005/api/inventory/${targetId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setInventory(json.data);
      } else {
        setError(json.message || "Failed to load inventory details.");
      }
    } catch (err) {
      console.error("Fetch inventory details error:", err);
      setError("Unable to connect to inventory server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [inventoryId]);

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
        <p style={{ fontSize: "0.9rem", fontWeight: "600" }}>Loading inventory details...</p>
      </div>
    );
  }

  if (error || !inventory) {
    return (
      <div className="glass-card" style={{ padding: "40px", textAlign: "center", maxWidth: "520px", margin: "40px auto" }}>
        <AlertCircle size={40} color="#ef4444" style={{ marginBottom: "12px" }} />
        <p style={{ fontWeight: "700", fontSize: "1rem", color: "#dc2626" }}>{error || "Inventory record not found."}</p>
        <button
          onClick={onBack}
          className="btn-primary"
          style={{ marginTop: "16px", padding: "8px 20px", fontSize: "0.85rem" }}
        >
          Return to Inventory List
        </button>
      </div>
    );
  }

  const currentStock = Number(inventory.currentStock) || 0;
  const minimumStock = Number(inventory.minimumStock) || 0;
  const saleRate = Number(inventory.saleRate) || 0;
  const stockValuation = currentStock * saleRate;

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

      {/* Top Header & Actions */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button
            onClick={onBack}
            style={{
              background: "transparent",
              border: "1px solid var(--border-card)",
              color: "var(--text-main)",
              padding: "8px",
              borderRadius: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            title="Go Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h1 style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em", margin: 0 }}>
                {inventory.productName}
              </h1>
              <InventoryStatusBadge status={inventory.status} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "4px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "monospace", color: "var(--text-main)", fontWeight: "700" }}>{inventory.productCode}</span>
              {inventory.sku && <span>• SKU: <strong style={{ fontFamily: "monospace", color: "var(--text-main)" }}>{inventory.sku}</strong></span>}
              <span>• Company: <strong style={{ color: "var(--text-main)" }}>{inventory.companyName}</strong></span>
              <span>• Category: <strong style={{ color: "var(--text-main)" }}>{inventory.category}</strong></span>
            </div>
          </div>
        </div>

        {canAdjustStock && (
          <button
            onClick={() => setShowAdjustmentModal(true)}
            className="btn-primary"
            style={{ padding: "8px 20px", fontSize: "0.82rem", gap: "8px" }}
          >
            <Sliders size={15} />
            <span>Adjust Stock</span>
          </button>
        )}
      </div>

      {/* 4 Metric Cards Strip */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "14px"
      }}>
        <div className="glass-card" style={{ padding: "18px" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Current Stock</span>
          <div style={{ fontSize: "1.75rem", fontFamily: "monospace", fontWeight: "900", color: "var(--text-main)", marginTop: "6px" }}>
            {currentStock.toLocaleString("en-IN")} <span style={{ fontSize: "0.75rem", fontWeight: "normal", color: "var(--text-muted)" }}>{inventory.unit || "Units"}</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "4px" }}>
            Physical inventory on hand
          </div>
        </div>

        <div className="glass-card" style={{ padding: "18px" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Available to Sell</span>
          <div style={{ fontSize: "1.75rem", fontFamily: "monospace", fontWeight: "900", color: "#059669", marginTop: "6px" }}>
            {(inventory.availableStock || 0).toLocaleString("en-IN")} <span style={{ fontSize: "0.75rem", fontWeight: "normal", color: "#059669" }}>{inventory.unit || "Units"}</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "4px" }}>
            Unallocated / Free stock
          </div>
        </div>

        <div className="glass-card" style={{ padding: "18px" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Minimum Threshold</span>
          <div style={{ fontSize: "1.75rem", fontFamily: "monospace", fontWeight: "900", color: "#d97706", marginTop: "6px" }}>
            {minimumStock.toLocaleString("en-IN")} <span style={{ fontSize: "0.75rem", fontWeight: "normal", color: "#d97706" }}>{inventory.unit || "Units"}</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "4px" }}>
            Reorder trigger level
          </div>
        </div>

        <div className="glass-card" style={{ padding: "18px" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Stock Valuation</span>
          <div style={{ fontSize: "1.75rem", fontFamily: "monospace", fontWeight: "900", color: "var(--primary-600)", marginTop: "6px" }}>
            ₹{stockValuation.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "4px" }}>
            @ ₹{saleRate}/unit wholesale
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)", gap: "18px", fontSize: "0.88rem", fontWeight: "700" }}>
        <button
          onClick={() => setActiveTab("overview")}
          style={{
            background: "transparent",
            border: "none",
            padding: "10px 4px",
            color: activeTab === "overview" ? "var(--primary-600)" : "var(--text-muted)",
            borderBottom: activeTab === "overview" ? "2px solid var(--primary-600)" : "2px solid transparent",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          Product Overview
        </button>

        <button
          onClick={() => setActiveTab("movements")}
          style={{
            background: "transparent",
            border: "none",
            padding: "10px 4px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: activeTab === "movements" ? "var(--primary-600)" : "var(--text-muted)",
            borderBottom: activeTab === "movements" ? "2px solid var(--primary-600)" : "2px solid transparent",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          <History size={15} />
          <span>Stock Movements</span>
        </button>

        <button
          onClick={() => setActiveTab("warehouse")}
          style={{
            background: "transparent",
            border: "none",
            padding: "10px 4px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: activeTab === "warehouse" ? "var(--primary-600)" : "var(--text-muted)",
            borderBottom: activeTab === "warehouse" ? "2px solid var(--primary-600)" : "2px solid transparent",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          <MapPin size={15} />
          <span>Warehouse & Bin (Future)</span>
          <span style={{ fontSize: "0.7rem", background: "var(--border-card)", color: "var(--text-muted)", padding: "2px 6px", borderRadius: "4px" }}>v2</span>
        </button>

        <button
          onClick={() => setActiveTab("purchase")}
          style={{
            background: "transparent",
            border: "none",
            padding: "10px 4px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: activeTab === "purchase" ? "var(--primary-600)" : "var(--text-muted)",
            borderBottom: activeTab === "purchase" ? "2px solid var(--primary-600)" : "2px solid transparent",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          <Truck size={15} />
          <span>Purchase / GRN (Future)</span>
          <span style={{ fontSize: "0.7rem", background: "var(--border-card)", color: "var(--text-muted)", padding: "2px 6px", borderRadius: "4px" }}>v2</span>
        </button>
      </div>

      {/* Tab Content: Overview */}
      {activeTab === "overview" && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px"
        }}>
          {/* Specifications Card */}
          <div className="glass-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "0.85rem", fontWeight: "800", color: "var(--text-main)", textTransform: "uppercase", letterSpacing: "0.03em", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
              <Package size={16} color="var(--primary-500)" />
              Product Specifications
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid var(--border-color)" }}>
                <span style={{ color: "var(--text-muted)" }}>Product Name</span>
                <span style={{ fontWeight: "800", color: "var(--text-main)", textAlign: "right" }}>{inventory.productName}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid var(--border-color)" }}>
                <span style={{ color: "var(--text-muted)" }}>Product Code</span>
                <span style={{ fontFamily: "monospace", fontWeight: "700", color: "var(--text-main)" }}>{inventory.productCode}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid var(--border-color)" }}>
                <span style={{ color: "var(--text-muted)" }}>SKU</span>
                <span style={{ fontFamily: "monospace", color: "var(--text-main)" }}>{inventory.sku || "-"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid var(--border-color)" }}>
                <span style={{ color: "var(--text-muted)" }}>Brand / Company</span>
                <span style={{ fontWeight: "700", color: "var(--text-main)" }}>{inventory.companyName}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid var(--border-color)" }}>
                <span style={{ color: "var(--text-muted)" }}>Category</span>
                <span style={{ color: "var(--text-main)" }}>{inventory.category}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid var(--border-color)" }}>
                <span style={{ color: "var(--text-muted)" }}>Pack Size & Unit</span>
                <span style={{ color: "var(--text-main)" }}>{inventory.packSize || "-"} ({inventory.unit})</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Warehouse Location</span>
                <span style={{ color: "var(--text-main)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <MapPin size={14} color="var(--primary-500)" />
                  {inventory.location || "Warehouse Central (Raipur)"}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing & Reorder Card */}
          <div className="glass-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "0.85rem", fontWeight: "800", color: "var(--text-main)", textTransform: "uppercase", letterSpacing: "0.03em", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
              <DollarSign size={16} color="#059669" />
              Wholesale Pricing & Thresholds
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid var(--border-color)" }}>
                <span style={{ color: "var(--text-muted)" }}>Maximum Retail Price (MRP)</span>
                <span style={{ fontFamily: "monospace", fontWeight: "800", color: "var(--text-main)" }}>₹{Number(inventory.mrp || 0).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid var(--border-color)" }}>
                <span style={{ color: "var(--text-muted)" }}>Distributor Sale Rate</span>
                <span style={{ fontFamily: "monospace", fontWeight: "800", color: "#059669" }}>₹{saleRate.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid var(--border-color)" }}>
                <span style={{ color: "var(--text-muted)" }}>Purchase Cost Rate</span>
                <span style={{ fontFamily: "monospace", color: "var(--text-muted)" }}>₹{Number(inventory.purchaseRate || 0).toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid var(--border-color)" }}>
                <span style={{ color: "var(--text-muted)" }}>Minimum Stock Threshold</span>
                <span style={{ fontFamily: "monospace", fontWeight: "800", color: "#d97706" }}>{minimumStock} {inventory.unit}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "10px", borderBottom: "1px solid var(--border-color)" }}>
                <span style={{ color: "var(--text-muted)" }}>Opening Stock</span>
                <span style={{ fontFamily: "monospace", color: "var(--text-muted)" }}>{inventory.openingStock || 0} {inventory.unit}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Last Stock Movement</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                  {inventory.lastMovementAt ? new Date(inventory.lastMovementAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  }) : "-"}
                </span>
              </div>
            </div>

            {/* Low stock alert banner if low or out */}
            {inventory.status !== "IN_STOCK" && (
              <div style={{
                padding: "12px 16px",
                borderRadius: "10px",
                background: "rgba(245, 158, 11, 0.1)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                color: "#b45309",
                fontSize: "0.8rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0 }} />
                <span>
                  {inventory.status === "OUT_OF_STOCK"
                    ? "Product is currently completely out of stock. Bookings cannot be fulfilled."
                    : `Current stock (${currentStock}) has dropped below the minimum reorder threshold (${minimumStock}).`}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content: Stock Movements */}
      {activeTab === "movements" && (
        <StockMovementHistory
          inventoryId={inventory.id || inventory._id}
          token={token}
          user={user}
          title={`Movement Ledger for ${inventory.productName}`}
        />
      )}

      {/* Tab Content: Future Roadmap Placeholder */}
      {(activeTab === "warehouse" || activeTab === "purchase") && (
        <div className="glass-card" style={{ padding: "48px 24px", textAlign: "center", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(99, 102, 241, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Layers size={24} color="var(--primary-500)" />
          </div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>
            {activeTab === "warehouse" ? "Multi-Warehouse & Bin Location Engine" : "Purchase Orders & Goods Receipt Note (GRN)"}
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "460px", margin: 0, lineHeight: 1.6 }}>
            Advanced warehouse pallet layout, multi-location stock transfer, supplier purchase orders, and batch expiry tracking will be connected in future development phases.
          </p>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: "700",
            background: "rgba(99, 102, 241, 0.1)",
            color: "var(--primary-600)",
            border: "1px solid rgba(99, 102, 241, 0.25)"
          }}>
            <span>Client Demo Roadmap: Phase 2</span>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {showAdjustmentModal && (
        <StockAdjustmentModal
          isOpen={showAdjustmentModal}
          onClose={() => setShowAdjustmentModal(false)}
          inventory={inventory}
          token={token}
          user={user}
          onSuccess={(result) => {
            showToast(`Stock adjusted successfully! New stock: ${result.inventory.currentStock} units.`);
            setInventory(result.inventory);
            if (onInventoryUpdated) onInventoryUpdated(result.inventory);
            fetchDetails();
          }}
        />
      )}
    </div>
  );
}
