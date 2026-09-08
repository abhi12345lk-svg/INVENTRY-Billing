import React, { useState, useEffect } from "react";
import { 
  Store, 
  MapPin, 
  Phone, 
  Route as RouteIcon, 
  Calendar, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  CreditCard,
  ShoppingBag,
  Clock,
  ArrowRight,
  FileText,
  Coins,
  Receipt,
  AlertTriangle,
  Plus,
  LogOut
} from "lucide-react";

import CreateOrder from "../orders/CreateOrder";
import OrderList from "../orders/OrderList";
import OrderDetails from "../orders/OrderDetails";
import BillList from "../billing/BillList";
import BillDetails from "../billing/BillDetails";
import PaymentList from "../payments/PaymentList";
import PaymentDetails from "../payments/PaymentDetails";
import AddPaymentModal from "../payments/AddPaymentModal";

export default function SalesmanBeatDashboard({ user, token, onNavigate, onLogout }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("ALL");
  const [assignedRoutes, setAssignedRoutes] = useState([]);
  const [activeView, setActiveView] = useState("outlets"); // "outlets" | "orders" | "bills" | "collections"
  const [bookingCustomer, setBookingCustomer] = useState(null);
  const [collectingCustomer, setCollectingCustomer] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Fetch salesman's assigned routes and customers
  useEffect(() => {
    const fetchSalesmanData = async () => {
      setLoading(true);
      setError("");

      try {
        // 1. Fetch salesman profile / routes
        const smRes = await fetch("http://localhost:5005/api/salesmen", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const smJson = await smRes.json();
        
        let myRoutes = [];
        if (smJson.success && smJson.data) {
          const myProfile = smJson.data.find(s => s.userId === user.id || s.salesmanCode === "SM-000001");
          if (myProfile && myProfile.assignedRoutes) {
            myRoutes = myProfile.assignedRoutes;
            setAssignedRoutes(myRoutes);
          }
        }

        // 2. Fetch scoped customers (salesman role is scoped automatically by backend!)
        const queryParams = new URLSearchParams({
          page: 1,
          limit: 100,
          search: search.trim()
        });

        const cusRes = await fetch(`http://localhost:5005/api/customers?${queryParams.toString()}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const cusJson = await cusRes.json();

        if (cusRes.ok && cusJson.success) {
          setCustomers(cusJson.data || []);
        } else {
          setError(cusJson.message || "Failed to load assigned customers.");
        }
      } catch (err) {
        console.error("Fetch salesman dashboard error:", err);
        setError("Unable to connect to Beat Operations API.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesmanData();
  }, [token, user, search]);

  const filteredCustomers = customers.filter(c => {
    if (selectedRoute === "ALL") return true;
    return c.routeId === selectedRoute;
  });

  const totalAssigned = customers.length;
  const totalOutstanding = customers.reduce((acc, c) => acc + (Number(c.currentBalance) || 0), 0);
  const activeCount = customers.filter(c => c.status === "ACTIVE").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Top Banner */}
      <div className="glass-card" style={{
        padding: "24px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)",
        border: "1px solid rgba(99, 102, 241, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "20px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "var(--primary-600)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 20px rgba(99, 102, 241, 0.4)"
          }}>
            <RouteIcon size={30} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>
                {user.name} — Field Beat Dashboard
              </h2>
              <span style={{
                fontSize: "0.75rem",
                fontWeight: "700",
                background: "rgba(16, 185, 129, 0.15)",
                color: "#34d399",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                padding: "3px 10px",
                borderRadius: "20px"
              }}>
                SM-000001 • On Duty
              </span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: "4px 0 0 0" }}>
              Territory: <strong>Raipur Central</strong> • Assigned Beats: {assignedRoutes.map(r => r.routeName).join(", ") || "Route A (Sadar Bazaar)"}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", width: "100%", maxWidth: "100%" }}>
          <div style={{
            display: "flex",
            background: "var(--bg-secondary)",
            padding: "4px",
            borderRadius: "10px",
            border: "1px solid var(--border-color)",
            gap: "4px",
            overflowX: "auto",
            maxWidth: "100%",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none"
          }}>
            <button
              onClick={() => {
                setActiveView("outlets");
                setSelectedOrder(null);
              }}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                fontSize: "0.82rem",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: activeView === "outlets" ? "var(--primary-600)" : "transparent",
                color: activeView === "outlets" ? "#ffffff" : "var(--text-muted)",
                transition: "all 0.15s ease"
              }}
            >
              <Store size={14} />
              <span>Beat Outlets</span>
            </button>
            <button
              onClick={() => {
                setActiveView("orders");
                setSelectedOrder(null);
                setSelectedBill(null);
              }}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                fontSize: "0.82rem",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: activeView === "orders" ? "var(--primary-600)" : "transparent",
                color: activeView === "orders" ? "#ffffff" : "var(--text-muted)",
                transition: "all 0.15s ease"
              }}
            >
              <ShoppingBag size={14} />
              <span>My Orders</span>
            </button>
            <button
              onClick={() => {
                setActiveView("bills");
                setSelectedOrder(null);
                setSelectedBill(null);
                setSelectedPayment(null);
              }}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                fontSize: "0.82rem",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: activeView === "bills" ? "var(--primary-600)" : "transparent",
                color: activeView === "bills" ? "#ffffff" : "var(--text-muted)",
                transition: "all 0.15s ease"
              }}
            >
              <FileText size={14} />
              <span>My Invoices</span>
            </button>
            <button
              onClick={() => {
                setActiveView("collections");
                setSelectedOrder(null);
                setSelectedBill(null);
                setSelectedPayment(null);
              }}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                fontSize: "0.82rem",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: activeView === "collections" ? "var(--primary-600)" : "transparent",
                color: activeView === "collections" ? "#ffffff" : "var(--text-muted)",
                transition: "all 0.15s ease"
              }}
            >
              <Coins size={14} />
              <span>Collections</span>
            </button>
          </div>

          <div style={{
            padding: "8px 14px",
            background: "var(--bg-surface)",
            borderRadius: "10px",
            border: "1px solid var(--border-color)",
            textAlign: "right"
          }}>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Beat Cycle</span>
            <strong style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>Mon / Wed / Fri</strong>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="btn-logout"
              title="Logout from salesman session"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>

      {feedbackMessage && (
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
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* KPI Stats Strip */}
      <div className="responsive-kpi-grid">
        <div className="glass-card responsive-kpi-card" style={{
          padding: "16px 18px",
          borderRadius: "14px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "10px",
            background: "rgba(99, 102, 241, 0.1)",
            color: "var(--primary-400)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Store size={22} />
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
              Assigned Outlets
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--text-main)", marginTop: "2px" }}>
              {totalAssigned}
            </div>
          </div>
        </div>

        <div className="glass-card" style={{
          padding: "18px 20px",
          borderRadius: "14px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          gap: "14px"
        }}>
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "10px",
            background: "rgba(16, 185, 129, 0.1)",
            color: "#34d399",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
              Active In-Service
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--text-main)", marginTop: "2px" }}>
              {activeCount}
            </div>
          </div>
        </div>

        <div className="glass-card" style={{
          padding: "18px 20px",
          borderRadius: "14px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          gap: "14px"
        }}>
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "10px",
            background: "rgba(245, 158, 11, 0.1)",
            color: "#fbbf24",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <CreditCard size={22} />
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
              Total Outstanding
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--text-main)", marginTop: "2px" }}>
              ₹{totalOutstanding.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      {/* Outlets Beat List */}
      {activeView === "outlets" && (
        <div className="glass-card" style={{
          padding: "20px",
          borderRadius: "16px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          gap: "18px"
        }}>
          {/* Controls Bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)", margin: 0 }}>
                My Assigned Outlets
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                Strictly scoped to your authorized sales beats
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ position: "relative", width: "220px" }}>
                <Search size={16} style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)"
                }} />
                <input 
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search my outlets..."
                  style={{
                    width: "100%",
                    padding: "8px 12px 8px 36px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-main)",
                    fontSize: "0.85rem",
                    outline: "none"
                  }}
                />
              </div>

              {assignedRoutes.length > 1 && (
                <select
                  value={selectedRoute}
                  onChange={(e) => setSelectedRoute(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-main)",
                    fontSize: "0.85rem",
                    outline: "none",
                    cursor: "pointer"
                  }}
                >
                  <option value="ALL">All My Beats</option>
                  {assignedRoutes.map(r => (
                    <option key={r.id} value={r.id}>{r.routeName}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {error && (
            <div style={{
              padding: "12px 16px",
              borderRadius: "8px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#f87171",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Outlets Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              Loading your beat outlets...
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
              No outlets found in your assigned beat.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {filteredCustomers.map((cus) => (
                <div 
                  key={cus.id}
                  style={{
                    padding: "18px",
                    borderRadius: "12px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "14px",
                    transition: "transform 0.15s ease, border-color 0.15s ease"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
                      <div>
                        <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-main)", margin: 0 }}>
                          {cus.shopName}
                        </h4>
                        <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--primary-400)" }}>
                          {cus.customerCode} • {cus.ownerName}
                        </span>
                      </div>
                      <span style={{
                        fontSize: "0.7rem",
                        fontWeight: "700",
                        padding: "3px 8px",
                        borderRadius: "12px",
                        background: cus.status === "ACTIVE" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                        color: cus.status === "ACTIVE" ? "#34d399" : "#f87171"
                      }}>
                        {cus.status}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <MapPin size={13} style={{ flexShrink: 0 }} />
                        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {cus.address || "Address not provided"}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Phone size={13} style={{ flexShrink: 0 }} />
                        <span>{cus.mobile}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <RouteIcon size={13} style={{ color: "var(--primary-400)", flexShrink: 0 }} />
                        <span style={{ color: "var(--primary-300)" }}>
                          {cus.routeName || cus.routeId || "Assigned Beat"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    borderTop: "1px solid var(--border-color)",
                    paddingTop: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <div>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>Outstanding</span>
                      <strong style={{ fontSize: "0.95rem", color: Number(cus.currentBalance) > (cus.creditLimit || 50000) ? "#f87171" : "var(--text-main)" }}>
                        ₹{Number(cus.currentBalance || 0).toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <button
                        onClick={() => setCollectingCustomer(cus)}
                        style={{
                          padding: "7px 12px",
                          borderRadius: "8px",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                          background: "rgba(16, 185, 129, 0.15)",
                          color: "#34d399",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px"
                        }}
                      >
                        <Receipt size={13} />
                        <span>Collect</span>
                      </button>
                      <button
                        onClick={() => setBookingCustomer(cus)}
                        style={{
                          padding: "7px 14px",
                          borderRadius: "8px",
                          border: "none",
                          background: "var(--primary-600)",
                          color: "#ffffff",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <ShoppingBag size={14} />
                        <span>Book Order</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Orders View */}
      {activeView === "orders" && (
        selectedOrder ? (
          <OrderDetails
            orderId={selectedOrder.id || selectedOrder._id}
            token={token}
            userRole="SALESMAN"
            onBack={() => setSelectedOrder(null)}
            onStatusUpdated={() => {
              setFeedbackMessage("Order status updated");
            }}
          />
        ) : (
          <OrderList
            token={token}
            userRole="SALESMAN"
            onSelectOrder={(ord) => setSelectedOrder(ord)}
            onOpenCreate={() => {
              if (customers.length > 0) {
                setBookingCustomer(customers[0]);
              } else {
                setFeedbackMessage("No assigned outlets found to book order.");
              }
            }}
          />
        )
      )}

      {/* Bills View */}
      {activeView === "bills" && (
        selectedBill ? (
          <BillDetails
            bill={selectedBill}
            token={token}
            user={user}
            onBack={() => setSelectedBill(null)}
          />
        ) : (
          <BillList
            token={token}
            user={user}
            onSelectBill={(b) => setSelectedBill(b)}
          />
        )
      )}

      {/* Step 8: Salesman Collections View */}
      {activeView === "collections" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Cash Difference Audit Alert Banner */}
          <div style={{
            padding: "16px 20px",
            borderRadius: "14px",
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "14px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(239, 68, 68, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#dc2626",
                flexShrink: 0
              }}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <div style={{ fontWeight: "800", color: "#dc2626", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>🔴 CASH DIFFERENCE: ₹100 SHORT</span>
                  <span style={{ fontSize: "0.72rem", background: "rgba(239, 68, 68, 0.15)", padding: "2px 8px", borderRadius: "10px", color: "#b91c1c", fontWeight: "700" }}>
                    Demo Reconciliation Alert
                  </span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "#7f1d1d", marginTop: "3px" }}>
                  System Expected Cash from Invoices: <strong style={{ color: "var(--text-main)" }}>₹28,500</strong> • Salesman Recorded Cash Handover: <strong style={{ color: "var(--text-main)" }}>₹28,400</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCollectingCustomer(customers[0] || null)}
              style={{
                padding: "8px 18px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#ffffff",
                fontSize: "0.85rem",
                fontWeight: "700",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
              }}
            >
              <Plus size={16} />
              <span>+ Record Collection</span>
            </button>
          </div>

          {/* Payment List or Details */}
          {selectedPayment ? (
            <PaymentDetails
              payment={selectedPayment}
              token={token}
              user={user}
              onBack={() => setSelectedPayment(null)}
              onPaymentUpdated={(updated) => {
                setSelectedPayment(updated);
                setFeedbackMessage("Payment voucher updated");
              }}
            />
          ) : (
            <PaymentList
              token={token}
              user={user}
              onSelectPayment={(p) => setSelectedPayment(p)}
              onOpenAddPayment={() => setCollectingCustomer(customers[0] || null)}
            />
          )}
        </div>
      )}

      {/* Booking Order Modal */}
      {bookingCustomer && (
        <CreateOrder
          token={token}
          user={user}
          preselectedCustomer={bookingCustomer}
          onClose={() => setBookingCustomer(null)}
          onSuccess={(msg) => {
            setFeedbackMessage(msg);
            setBookingCustomer(null);
            setActiveView("orders");
          }}
        />
      )}

      {/* Record Collection Modal */}
      {collectingCustomer && (
        <AddPaymentModal
          isOpen={!!collectingCustomer}
          token={token}
          user={user}
          preselectedCustomer={collectingCustomer}
          onClose={() => setCollectingCustomer(null)}
          onSuccess={(msg, newP) => {
            setFeedbackMessage(msg || `Collection recorded successfully!`);
            setCollectingCustomer(null);
            setActiveView("collections");
          }}
        />
      )}
    </div>
  );
}
