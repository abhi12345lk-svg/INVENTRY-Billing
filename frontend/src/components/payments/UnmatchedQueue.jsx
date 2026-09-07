import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Search,
  UserCheck,
  AlertTriangle,
  Receipt,
  CheckCircle2,
  RefreshCw,
  CreditCard,
  Building2,
  ArrowRightLeft
} from "lucide-react";
import { PaymentModeBadge } from "./PaymentStatusBadge";
import UnmatchedPaymentModal from "./UnmatchedPaymentModal";
import MapPaymentModal from "./MapPaymentModal";

export default function UnmatchedQueue({
  token,
  user,
  onSelectPayment,
  onOpenAllPayments
}) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [search, setSearch] = useState("");

  // Modals
  const [identifyingPayment, setIdentifyingPayment] = useState(null);
  const [mappedReadyPayment, setMappedReadyPayment] = useState(null);

  const fetchUnmatched = async () => {
    setLoading(true);
    setError("");

    try {
      const queryParams = new URLSearchParams({
        status: "UNMATCHED",
        paymentMode: "UPI",
        limit: 50,
        search: search.trim()
      });

      const response = await fetch(`http://localhost:5005/api/payments?${queryParams.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const json = await response.json();
      if (response.ok && json.success) {
        setPayments(json.data || []);
      } else {
        setError(json.message || "Failed to load suspense queue.");
      }
    } catch (err) {
      console.error("Fetch unmatched error:", err);
      setError("Unable to connect to Payments server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnmatched();
  }, [search]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 5000);
  };

  const totalSuspenseAmount = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Toast */}
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

      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#d97706", fontSize: "0.82rem", fontWeight: "800", marginBottom: "4px" }}>
            <HelpCircle size={16} />
            SUSPENSE RECONCILIATION
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em", margin: 0 }}>
            UPI Suspense & Unmatched Collections Queue
          </h1>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Reconcile digital payments received directly into the distributor bank account without retailer reference.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={fetchUnmatched}
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
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} color="var(--primary-500)" />
            <span>Refresh</span>
          </button>
          {onOpenAllPayments && (
            <button
              onClick={onOpenAllPayments}
              className="btn-primary"
              style={{ padding: "8px 18px", fontSize: "0.82rem", gap: "8px" }}
            >
              <Receipt size={15} />
              <span>All Payments</span>
            </button>
          )}
        </div>
      </div>

      {/* Warning / Explanation Banner */}
      <div className="glass-card" style={{
        padding: "20px 24px",
        background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(245, 158, 11, 0.05) 100%)",
        border: "1px solid rgba(245, 158, 11, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", flex: 1, minWidth: "280px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "rgba(245, 158, 11, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#d97706",
            flexShrink: 0
          }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>Suspense Reconciliation Protocol</h3>
              <span style={{
                padding: "2px 8px",
                fontSize: "0.7rem",
                fontWeight: "800",
                textTransform: "uppercase",
                borderRadius: "20px",
                background: "rgba(245, 158, 11, 0.15)",
                color: "#d97706",
                border: "1px solid rgba(245, 158, 11, 0.3)"
              }}>
                Action Required
              </span>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "4px", lineHeight: 1.5 }}>
              When retailers transfer money via QR code or IMPS with personal account names (e.g., <em>“SUNIL_K_UPI”</em> or <em>“KIRANA_DIRECT”</em>), funds are held in suspense until verified. Identify the customer to link funds to their ledger and map against open invoices.
            </p>
          </div>
        </div>

        <div style={{
          padding: "12px 18px",
          borderRadius: "12px",
          background: "var(--bg-surface-2)",
          border: "1px solid var(--border-color)",
          textAlign: "right",
          minWidth: "180px"
        }}>
          <div style={{ fontSize: "0.72rem", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)" }}>Suspense Total</div>
          <div style={{ fontSize: "1.5rem", fontFamily: "monospace", fontWeight: "900", color: "#d97706", marginTop: "2px" }}>
            ₹{totalSuspenseAmount.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "2px" }}>
            {payments.length} Unidentified {payments.length === 1 ? "Payment" : "Payments"}
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter suspense queue by UPI Ref ID, Payer Name, or Payment #..."
          className="input-control"
          style={{
            width: "100%",
            paddingLeft: "42px",
            height: "44px",
            background: "var(--bg-input)",
            border: "1px solid var(--border-card)",
            borderRadius: "12px",
            color: "var(--text-main)",
            fontSize: "0.88rem"
          }}
        />
        <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
      </div>

      {/* Suspense Cards Grid */}
      {loading ? (
        <div style={{ padding: "80px 20px", textAlign: "center", color: "var(--text-muted)" }}>
          <div style={{
            width: "36px",
            height: "36px",
            border: "3px solid rgba(245, 158, 11, 0.2)",
            borderTopColor: "#d97706",
            borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "spin 1s linear infinite"
          }} />
          <p style={{ fontSize: "0.9rem", fontWeight: "600" }}>Scanning bank suspense records...</p>
        </div>
      ) : error ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#dc2626" }}>
          <p style={{ fontWeight: "700", fontSize: "0.95rem" }}>{error}</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="glass-card" style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)" }}>
          <CheckCircle2 size={48} color="#059669" style={{ margin: "0 auto 14px" }} />
          <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-main)", margin: "0 0 6px" }}>Suspense Queue is Clean!</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
            All digital UPI collections have been linked to verified customer outlets.
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px"
        }}>
          {payments.map((p) => (
            <div
              key={p.id || p._id}
              className="glass-card"
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                border: "1px solid rgba(245, 158, 11, 0.25)"
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontFamily: "monospace", fontSize: "0.85rem", fontWeight: "800", color: "var(--text-main)" }}>
                    {p.paymentNumber}
                  </span>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    {p.paymentDate ? new Date(p.paymentDate).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    }) : "-"}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.35rem", fontFamily: "monospace", fontWeight: "900", color: "#d97706" }}>
                    ₹{(p.amount || 0).toLocaleString("en-IN")}
                  </div>
                  <span style={{ fontSize: "0.68rem", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    Unmapped Balance
                  </span>
                </div>
              </div>

              {/* UPI & Payer Details */}
              <div style={{
                padding: "12px",
                background: "var(--bg-surface-2)",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "0.8rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Mode:</span>
                  <PaymentModeBadge mode={p.paymentMode} />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Payer Name:</span>
                  <span style={{ fontWeight: "800", color: "var(--text-main)", fontFamily: "monospace" }}>
                    {p.payerName || "UNKNOWN_PAYER"}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>UPI Ref / UTR:</span>
                  <span style={{ fontFamily: "monospace", color: "var(--text-main)" }}>
                    {p.upiReference || "N/A"}
                  </span>
                </div>
                {p.notes && (
                  <div style={{ paddingTop: "6px", fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic", borderTop: "1px solid var(--border-color)" }}>
                    "{p.notes}"
                  </div>
                )}
              </div>

              {/* Action */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "4px" }}>
                <button
                  onClick={() => setIdentifyingPayment(p)}
                  style={{
                    flex: 1,
                    padding: "9px 14px",
                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "0.8rem",
                    fontWeight: "800",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    boxShadow: "0 4px 12px rgba(245, 158, 11, 0.25)"
                  }}
                >
                  <UserCheck size={15} />
                  <span>Identify Retailer</span>
                </button>
                <button
                  onClick={() => onSelectPayment && onSelectPayment(p)}
                  style={{
                    padding: "9px 12px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-card)",
                    color: "var(--text-main)",
                    borderRadius: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center"
                  }}
                  title="View Voucher"
                >
                  <CreditCard size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Identify Modal */}
      {identifyingPayment && (
        <UnmatchedPaymentModal
          isOpen={!!identifyingPayment}
          onClose={() => setIdentifyingPayment(null)}
          token={token}
          user={user}
          payment={identifyingPayment}
          onCustomerIdentified={(updatedP) => {
            showToast(`Identified customer for ${updatedP.paymentNumber}! You can now map it to bills.`);
            setIdentifyingPayment(null);
            fetchUnmatched();
            // Automatically prompt to map bills
            setMappedReadyPayment(updatedP);
          }}
        />
      )}

      {/* Map Payment Modal (after successful identification) */}
      {mappedReadyPayment && (
        <MapPaymentModal
          isOpen={!!mappedReadyPayment}
          onClose={() => setMappedReadyPayment(null)}
          token={token}
          user={user}
          payment={mappedReadyPayment}
          onPaymentMapped={(updatedP) => {
            showToast(`Payment ${updatedP.paymentNumber} successfully mapped to invoices!`);
            setMappedReadyPayment(null);
            fetchUnmatched();
          }}
        />
      )}
    </div>
  );
}
