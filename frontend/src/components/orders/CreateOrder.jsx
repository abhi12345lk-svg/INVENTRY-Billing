import React, { useState, useEffect } from "react";
import { 
  X, 
  Store, 
  Package, 
  Plus, 
  Search, 
  ShoppingBag, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Send,
  MapPin,
  Phone,
  ArrowLeft
} from "lucide-react";
import OrderItemTable from "./OrderItemTable";
import OrderSummary from "./OrderSummary";

export default function CreateOrder({ 
  token, 
  user, 
  customer = null, 
  preselectedCustomer = null,
  onClose, 
  onSuccess 
}) {
  const [selectedCustomer, setSelectedCustomer] = useState(preselectedCustomer || customer);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingLookups, setLoadingLookups] = useState(true);

  // Cart / Items state
  const [orderItems, setOrderItems] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [notes, setNotes] = useState("");

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmSubmitModal, setConfirmSubmitModal] = useState(false);
  const [submittedOrderResult, setSubmittedOrderResult] = useState(null);

  useEffect(() => {
    if (preselectedCustomer || customer) {
      setSelectedCustomer(preselectedCustomer || customer);
    }
  }, [preselectedCustomer, customer]);

  // Load customer choices (if not passed as prop) & active products
  useEffect(() => {
    const fetchLookups = async () => {
      setLoadingLookups(true);
      try {
        const [prodRes, custRes] = await Promise.all([
          fetch("http://localhost:5005/api/products?status=ACTIVE&limit=100", {
            headers: { "Authorization": `Bearer ${token}` }
          }),
          !customer ? fetch("http://localhost:5005/api/customers?limit=100", {
            headers: { "Authorization": `Bearer ${token}` }
          }) : Promise.resolve(null)
        ]);

        const prodJson = await prodRes.json();
        if (prodJson.success && prodJson.data) {
          setProducts(prodJson.data);
        }

        if (custRes) {
          const custJson = await custRes.json();
          if (custJson.success && custJson.data) {
            setCustomers(custJson.data);
            if (!selectedCustomer && custJson.data.length > 0) {
              setSelectedCustomer(custJson.data[0]);
            }
          }
        }
      } catch (err) {
        console.error("Lookups load error:", err);
      } finally {
        setLoadingLookups(false);
      }
    };

    fetchLookups();
  }, [token, customer]);

  // Add product to cart
  const handleAddProduct = (prod, quantity = 1) => {
    setOrderItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.productId === prod.id);
      if (existingIdx !== -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        const lineSubtotal = newQty * prod.saleRate;
        const lineDiscount = lineSubtotal * ((prod.discount || 0) / 100);
        const taxableValue = lineSubtotal - lineDiscount;
        const taxAmount = taxableValue * ((prod.taxRate || 5) / 100);
        const lineTotal = taxableValue + taxAmount;

        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          lineSubtotal,
          lineDiscount,
          taxableValue,
          taxAmount,
          lineTotal
        };
        return updated;
      } else {
        const lineSubtotal = quantity * prod.saleRate;
        const lineDiscount = lineSubtotal * ((prod.discount || 0) / 100);
        const taxableValue = lineSubtotal - lineDiscount;
        const taxAmount = taxableValue * ((prod.taxRate || 5) / 100);
        const lineTotal = taxableValue + taxAmount;

        return [
          ...prev,
          {
            productId: prod.id,
            productCode: prod.productCode,
            sku: prod.sku,
            productName: prod.productName,
            companyName: prod.companyName,
            unit: prod.unit,
            packSize: prod.packSize,
            quantity,
            saleRate: prod.saleRate,
            discount: prod.discount || 0,
            taxRate: prod.taxRate || 5,
            lineSubtotal,
            lineDiscount,
            taxableValue,
            taxAmount,
            lineTotal
          }
        ];
      }
    });
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }

    setOrderItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const lineSubtotal = newQty * item.saleRate;
          const lineDiscount = lineSubtotal * ((item.discount || 0) / 100);
          const taxableValue = lineSubtotal - lineDiscount;
          const taxAmount = taxableValue * ((item.taxRate || 5) / 100);
          const lineTotal = taxableValue + taxAmount;
          return {
            ...item,
            quantity: newQty,
            lineSubtotal,
            lineDiscount,
            taxableValue,
            taxAmount,
            lineTotal
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId) => {
    setOrderItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Live Pricing Summary calculation
  const livePricingSummary = React.useMemo(() => {
    let grossSubtotal = 0;
    let totalDiscount = 0;
    let taxableAmount = 0;
    let totalTax = 0;
    let grandTotal = 0;
    let totalQuantity = 0;

    for (const item of orderItems) {
      grossSubtotal += item.lineSubtotal || 0;
      totalDiscount += item.lineDiscount || 0;
      taxableAmount += item.taxableValue || 0;
      totalTax += item.taxAmount || 0;
      grandTotal += item.lineTotal || 0;
      totalQuantity += item.quantity || 0;
    }

    return {
      grossSubtotal,
      totalDiscount,
      taxableAmount,
      totalTax,
      grandTotal,
      totalItems: orderItems.length,
      totalQuantity
    };
  }, [orderItems]);

  const handleSaveOrder = async (targetStatus = "DRAFT") => {
    if (!selectedCustomer) {
      setError("Please select a customer outlet.");
      return;
    }
    if (orderItems.length === 0) {
      setError("Please add at least one product to the order.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        customerId: selectedCustomer.id,
        status: targetStatus,
        notes: notes.trim(),
        items: orderItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          discount: item.discount
        }))
      };

      const response = await fetch("http://localhost:5005/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const json = await response.json();

      if (response.ok && json.success) {
        if (targetStatus === "SUBMITTED") {
          setSubmittedOrderResult(json.data);
        } else {
          onSuccess(json.message || `Order saved as Draft (${json.data.orderNumber})!`);
          onClose();
        }
      } else {
        setError(json.message || "Failed to book order.");
      }
    } catch (err) {
      console.error("Order submit error:", err);
      setError("Unable to connect to Order Booking API.");
    } finally {
      setIsSubmitting(false);
      setConfirmSubmitModal(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!productSearch.trim()) return true;
    const q = productSearch.trim().toLowerCase();
    return (
      p.productName.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.companyName.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0, 0, 0, 0.8)",
      backdropFilter: "blur(8px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px"
    }}>
      <div className="glass-card" style={{
        width: "100%",
        maxWidth: "960px",
        height: "92vh",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Modal Header */}
        <div style={{
          padding: "18px 24px",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--table-header-bg)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "var(--primary-600)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <ShoppingBag size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>
                Sales Order Booking
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                Field Sales Representative: <strong>{user?.name}</strong> • FMCG Distributor Order Engine
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
              padding: "6px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Customer Context Banner */}
        <div style={{
          padding: "14px 24px",
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "34px",
              height: "34px",
              borderRadius: "8px",
              background: "rgba(99, 102, 241, 0.15)",
              color: "var(--primary-400)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Store size={18} />
            </div>
            {customer ? (
              <div>
                <span style={{ fontWeight: "800", color: "var(--text-main)", fontSize: "0.95rem" }}>
                  {customer.shopName}
                </span>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", gap: "10px" }}>
                  <span>Code: {customer.customerCode}</span>
                  <span>•</span>
                  <span>Owner: {customer.ownerName}</span>
                  <span>•</span>
                  <span>Beat: {customer.routeName || customer.routeId}</span>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)" }}>
                  Select Outlet:
                </span>
                <select
                  value={selectedCustomer?.id || ""}
                  onChange={(e) => {
                    const found = customers.find((c) => c.id === e.target.value);
                    setSelectedCustomer(found);
                  }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-surface)",
                    color: "var(--text-main)",
                    fontSize: "0.85rem",
                    outline: "none",
                    cursor: "pointer"
                  }}
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.shopName} ({c.customerCode}) — {c.routeName || c.routeId}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div style={{ textAlign: "right", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Outstanding: <strong style={{ color: "var(--text-main)" }}>₹{Number(selectedCustomer?.openingBalance || 0).toLocaleString("en-IN")}</strong>
            <span style={{ margin: "0 8px" }}>|</span>
            Credit Limit: <strong style={{ color: "#34d399" }}>₹{Number(selectedCustomer?.creditLimit || 50000).toLocaleString("en-IN")}</strong>
          </div>
        </div>

        {/* Modal Main Body (Split into Catalog + Cart) */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1.1fr 1fr", overflow: "hidden" }}>
          
          {/* Left Column: Product Selection Catalog */}
          <div style={{
            padding: "20px",
            borderRight: "1px solid var(--border-color)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            overflowY: "auto"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)", margin: 0 }}>
                FMCG Active Catalog
              </h4>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {filteredProducts.length} items available
              </span>
            </div>

            {/* Product Search */}
            <div style={{ position: "relative" }}>
              <Search size={16} style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50)",
                color: "var(--text-muted)"
              }} />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search by product name, SKU, brand..."
                style={{
                  width: "100%",
                  padding: "9px 12px 9px 36px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-main)",
                  fontSize: "0.85rem",
                  outline: "none"
                }}
              />
            </div>

            {/* Product List Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1, overflowY: "auto" }}>
              {loadingLookups ? (
                <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  Loading product catalog...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  No active products match your search.
                </div>
              ) : (
                filteredProducts.map((p) => {
                  const inCart = orderItems.find((i) => i.productId === p.id);
                  return (
                    <div
                      key={p.id}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "10px",
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px"
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "700", color: "var(--text-main)", fontSize: "0.875rem" }}>
                          {p.productName}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "2px" }}>
                          <span style={{ fontFamily: "monospace" }}>{p.sku}</span> • {p.companyName} ({p.packSize || p.unit})
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px", fontSize: "0.8rem" }}>
                          <span style={{ color: "var(--primary-400)", fontWeight: "700" }}>₹{p.saleRate}</span>
                          <span style={{ color: "var(--text-muted)", textDecoration: "line-through", fontSize: "0.75rem" }}>MRP ₹{p.mrp}</span>
                          {p.discount > 0 && (
                            <span style={{ color: "#34d399", fontSize: "0.7rem", fontWeight: "600" }}>
                              {p.discount}% Disc
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {inCart && (
                          <span style={{
                            padding: "3px 8px",
                            borderRadius: "12px",
                            background: "rgba(99, 102, 241, 0.15)",
                            color: "var(--primary-400)",
                            fontSize: "0.75rem",
                            fontWeight: "700"
                          }}>
                            {inCart.quantity} in order
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleAddProduct(p, 1)}
                          style={{
                            padding: "7px 12px",
                            borderRadius: "8px",
                            border: "none",
                            background: "var(--primary-600)",
                            color: "#ffffff",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          <Plus size={14} />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Order Basket & Live Summary */}
          <div style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            overflowY: "auto"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)", margin: 0 }}>
                Order Line Items ({orderItems.length})
              </h4>
              {orderItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setOrderItems([])}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#f87171",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Clear All
                </button>
              )}
            </div>

            {error && (
              <div style={{
                padding: "10px 14px",
                borderRadius: "8px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#f87171",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Line Items Table */}
            <div style={{ flex: 1, minHeight: "180px", overflowY: "auto" }}>
              <OrderItemTable
                items={orderItems}
                editable={true}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            </div>

            {/* Notes */}
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: "600", color: "var(--text-muted)", marginBottom: "4px" }}>
                Delivery / Booking Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Morning delivery, deliver along with secondary invoice..."
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-main)",
                  fontSize: "0.85rem",
                  outline: "none"
                }}
              />
            </div>

            {/* Pricing Summary Component */}
            <OrderSummary pricingSummary={livePricingSummary} />

            {/* Action Buttons */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "10px",
              paddingTop: "12px",
              borderTop: "1px solid var(--border-color)"
            }}>
              <button
                type="button"
                onClick={() => handleSaveOrder("DRAFT")}
                disabled={isSubmitting || orderItems.length === 0}
                style={{
                  padding: "10px 18px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-main)",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  cursor: isSubmitting || orderItems.length === 0 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Save size={16} />
                <span>Save Draft</span>
              </button>

              <button
                type="button"
                onClick={() => setConfirmSubmitModal(true)}
                disabled={isSubmitting || orderItems.length === 0}
                style={{
                  padding: "10px 22px",
                  borderRadius: "8px",
                  border: "none",
                  background: "var(--primary-600)",
                  color: "#ffffff",
                  fontSize: "0.875rem",
                  fontWeight: "700",
                  cursor: isSubmitting || orderItems.length === 0 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Send size={16} />
                <span>Submit Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal before Submit */}
      {confirmSubmitModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(4px)",
          zIndex: 1200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div className="glass-card" style={{
            width: "100%",
            maxWidth: "440px",
            padding: "24px",
            background: "var(--bg-surface)",
            borderRadius: "16px",
            border: "1px solid var(--border-color)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7)"
          }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-main)", margin: "0 0 10px 0" }}>
              Confirm Order Submission
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
              Are you sure you want to finalize and submit this sales order?
            </p>

            <div style={{
              background: "var(--bg-secondary)",
              padding: "14px 18px",
              borderRadius: "10px",
              margin: "16px 0",
              fontSize: "0.85rem",
              display: "flex",
              flexDirection: "column",
              gap: "6px"
            }}>
              <div>Outlet: <strong style={{ color: "var(--text-main)" }}>{selectedCustomer?.shopName}</strong></div>
              <div>Lines: <strong style={{ color: "var(--text-main)" }}>{orderItems.length} Products</strong></div>
              <div>Estimated Total: <strong style={{ color: "var(--primary-400)" }}>₹{livePricingSummary.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></div>
            </div>

            <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", margin: "0 0 20px 0" }}>
              * Once submitted, the order is locked for billing and cannot be directly modified without manager authorization.
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setConfirmSubmitModal(false)}
                disabled={isSubmitting}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "transparent",
                  color: "var(--text-main)",
                  fontSize: "0.85rem",
                  cursor: "pointer"
                }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => handleSaveOrder("SUBMITTED")}
                disabled={isSubmitting}
                style={{
                  padding: "8px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: "var(--primary-600)",
                  color: "#ffffff",
                  fontWeight: "700",
                  fontSize: "0.85rem",
                  cursor: isSubmitting ? "not-allowed" : "pointer"
                }}
              >
                {isSubmitting ? "Submitting..." : "Yes, Submit Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Submitted Successfully Modal (Demo Requirement #7) */}
      {submittedOrderResult && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(6px)",
          zIndex: 1300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div className="glass-card" style={{
            width: "100%",
            maxWidth: "480px",
            padding: "32px",
            background: "var(--bg-surface)",
            borderRadius: "20px",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            boxShadow: "0 25px 60px -15px rgba(0,0,0,0.8)",
            textAlign: "center"
          }}>
            <div style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.15)",
              color: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px auto",
              border: "2px solid rgba(16, 185, 129, 0.3)",
              boxShadow: "0 0 25px rgba(16, 185, 129, 0.25)"
            }}>
              <CheckCircle2 size={38} />
            </div>

            <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "var(--text-main)", margin: "0 0 6px 0" }}>
              Order Submitted Successfully
            </h2>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", margin: "0 0 24px 0" }}>
              Sales Order has been registered and is now visible in the Owner Command Center.
            </p>

            <div style={{
              background: "var(--bg-secondary)",
              borderRadius: "14px",
              border: "1px solid var(--border-color)",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              textAlign: "left",
              fontSize: "0.85rem",
              marginBottom: "24px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
                <span style={{ color: "var(--text-dim)" }}>Order Number</span>
                <span style={{ fontFamily: "monospace", fontWeight: "800", color: "var(--primary-400)", fontSize: "1.05rem" }}>
                  {submittedOrderResult.orderNumber}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-dim)" }}>Customer Outlet</span>
                <span style={{ fontWeight: "700", color: "var(--text-main)", textAlign: "right" }}>
                  {submittedOrderResult.customer?.shopName}
                  <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {submittedOrderResult.customer?.customerCode}
                  </span>
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-dim)" }}>Items & Units</span>
                <span style={{ fontWeight: "600", color: "var(--text-main)" }}>
                  {submittedOrderResult.pricingSummary?.totalItems || submittedOrderResult.items?.length} Lines ({submittedOrderResult.pricingSummary?.totalQuantity} units)
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-dim)" }}>Date & Time</span>
                <span style={{ color: "var(--text-muted)" }}>
                  {new Date(submittedOrderResult.submittedAt || submittedOrderResult.orderDate).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "10px" }}>
                <span style={{ color: "var(--text-main)", fontWeight: "700" }}>Grand Total</span>
                <span style={{ fontSize: "1.2rem", fontWeight: "900", color: "#10b981" }}>
                  ₹{(submittedOrderResult.pricingSummary?.grandTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => {
                  onSuccess(`Order ${submittedOrderResult.orderNumber} submitted successfully!`);
                  onClose();
                }}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  borderRadius: "10px",
                  border: "none",
                  background: "var(--primary-600)",
                  color: "#ffffff",
                  fontSize: "0.92rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 8px 20px rgba(99, 102, 241, 0.35)",
                  transition: "all 0.15s ease"
                }}
              >
                VIEW ORDER
              </button>

              <button
                onClick={() => {
                  setSubmittedOrderResult(null);
                  setOrderItems([]);
                  setNotes("");
                  if (!preselectedCustomer && customers.length > 0) {
                    setSelectedCustomer(customers[0]);
                  }
                }}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-main)",
                  fontSize: "0.92rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                CREATE NEW ORDER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
