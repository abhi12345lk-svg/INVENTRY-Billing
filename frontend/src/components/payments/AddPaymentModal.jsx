import React, { useState, useEffect } from "react";
import { 
  X, 
  Banknote, 
  QrCode, 
  CreditCard, 
  Store, 
  UserCheck, 
  Calendar, 
  AlertCircle, 
  CheckCircle2,
  AlertTriangle,
  HelpCircle
} from "lucide-react";

export default function AddPaymentModal({ 
  token, 
  user, 
  preselectedCustomer = null, 
  isOpen = true,
  onClose, 
  onSuccess,
  onPaymentCreated
}) {
  if (isOpen === false) return null;
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(preselectedCustomer?.id || preselectedCustomer?._id || preselectedCustomer?.customerId || "");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  // UPI specific state
  const [isUnknownUpi, setIsUnknownUpi] = useState(false);
  const [payerName, setPayerName] = useState("");
  const [upiReference, setUpiReference] = useState("");

  // Cheque specific state
  const [chequeNumber, setChequeNumber] = useState("");
  const [chequeBank, setChequeBank] = useState("");
  const [chequeDate, setChequeDate] = useState(new Date().toISOString().split("T")[0]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isSalesman = user?.role === "SALESMAN";

  // Fetch customers for selector
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("http://localhost:5005/api/customers?limit=100", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success && json.data) {
          setCustomers(json.data);
          if (!selectedCustomerId && json.data.length > 0) {
            setSelectedCustomerId(json.data[0].id || json.data[0].customerId);
          }
        }
      } catch (err) {
        console.error("Failed to fetch customers for payment modal:", err);
      }
    };

    fetchCustomers();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid payment amount greater than zero.");
      return;
    }

    if (!isUnknownUpi && !selectedCustomerId) {
      setError("Please select a retail customer.");
      return;
    }

    if (paymentMode === "CHEQUE") {
      if (!chequeNumber.trim()) {
        setError("Cheque number is required.");
        return;
      }
      if (!chequeBank.trim()) {
        setError("Issuing bank name is required.");
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        paymentMode,
        amount: numAmount,
        paymentDate: new Date(paymentDate).toISOString(),
        notes: notes.trim(),
        customerId: isUnknownUpi ? null : selectedCustomerId,
        payerName: payerName.trim() || undefined,
        upiReference: upiReference.trim() || undefined,
        chequeNumber: chequeNumber.trim() || undefined,
        chequeBank: chequeBank.trim() || undefined,
        chequeDate: chequeDate || undefined
      };

      const response = await fetch("http://localhost:5005/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const json = await response.json();

      if (response.ok && json.success) {
        if (onPaymentCreated) onPaymentCreated(json.data);
        if (onSuccess) onSuccess(json.message, json.data);
        if (onClose) onClose();
      } else {
        setError(json.message || "Failed to record payment.");
      }
    } catch (err) {
      console.error("Record payment error:", err);
      setError("Unable to connect to Payment API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(4px)",
      zIndex: 1100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px"
    }}>
      <div className="glass-card" style={{
        width: "100%",
        maxWidth: "560px",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        padding: "28px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)"
      }}>
        {/* Modal Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>
              Record Payment Collection
            </h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
              Enter payment details received via Cash, UPI, or Cheque
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            padding: "10px 14px",
            borderRadius: "10px",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#f87171",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "18px"
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Mode Selector Tabs */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
          background: "var(--bg-secondary)",
          padding: "5px",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
          marginBottom: "20px"
        }}>
          <button
            type="button"
            onClick={() => {
              setPaymentMode("CASH");
              setIsUnknownUpi(false);
            }}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              background: paymentMode === "CASH" ? "rgba(16, 185, 129, 0.2)" : "transparent",
              color: paymentMode === "CASH" ? "#10b981" : "var(--text-muted)",
              fontWeight: paymentMode === "CASH" ? "700" : "500",
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}
          >
            <Banknote size={16} />
            <span>Cash</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMode("UPI")}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              background: paymentMode === "UPI" ? "rgba(99, 102, 241, 0.2)" : "transparent",
              color: paymentMode === "UPI" ? "var(--primary-400)" : "var(--text-muted)",
              fontWeight: paymentMode === "UPI" ? "700" : "500",
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}
          >
            <QrCode size={16} />
            <span>UPI</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPaymentMode("CHEQUE");
              setIsUnknownUpi(false);
            }}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              background: paymentMode === "CHEQUE" ? "rgba(245, 158, 11, 0.2)" : "transparent",
              color: paymentMode === "CHEQUE" ? "#f59e0b" : "var(--text-muted)",
              fontWeight: paymentMode === "CHEQUE" ? "700" : "500",
              fontSize: "0.85rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}
          >
            <CreditCard size={16} />
            <span>Cheque</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Unknown UPI Suspense Toggle (UPI only for Owner/Finance) */}
          {paymentMode === "UPI" && !isSalesman && (
            <div style={{
              padding: "12px 14px",
              borderRadius: "10px",
              background: isUnknownUpi ? "rgba(239, 68, 68, 0.12)" : "var(--bg-secondary)",
              border: `1px solid ${isUnknownUpi ? "rgba(239, 68, 68, 0.3)" : "var(--border-color)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertTriangle size={18} color={isUnknownUpi ? "#f87171" : "var(--text-muted)"} />
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: "700", color: isUnknownUpi ? "#f87171" : "var(--text-main)" }}>
                    Unmatched / Unknown Payer
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Send this payment to Suspense Queue for later reconciliation
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isUnknownUpi}
                onChange={(e) => setIsUnknownUpi(e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "#ef4444" }}
              />
            </div>
          )}

          {/* Customer Selection */}
          {!isUnknownUpi && (
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "6px" }}>
                Retail Customer / Outlet *
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-main)",
                  fontSize: "0.88rem",
                  outline: "none"
                }}
              >
                <option value="">-- Select Retail Customer --</option>
                {customers.map((c) => (
                  <option key={c.id || c.customerId} value={c.id || c.customerId}>
                    {c.shopName || c.customerName} ({c.customerCode})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Amount & Date Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "6px" }}>
                Amount (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="₹ Amount received"
                required
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-main)",
                  fontSize: "0.95rem",
                  fontWeight: "700",
                  outline: "none"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "6px" }}>
                Payment Date
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-main)",
                  fontSize: "0.88rem",
                  outline: "none"
                }}
              />
            </div>
          </div>

          {/* UPI Mode Specific Fields */}
          {paymentMode === "UPI" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "6px" }}>
                  UPI Reference / UTR No.
                </label>
                <input
                  type="text"
                  value={upiReference}
                  onChange={(e) => setUpiReference(e.target.value)}
                  placeholder="e.g. UPI882190382"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-main)",
                    fontSize: "0.88rem",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "6px" }}>
                  Payer Name
                </label>
                <input
                  type="text"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  placeholder={isUnknownUpi ? "e.g. Ramesh Kumar (Savings)" : "Account holder name"}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-main)",
                    fontSize: "0.88rem",
                    outline: "none"
                  }}
                />
              </div>
            </div>
          )}

          {/* Cheque Mode Specific Fields */}
          {paymentMode === "CHEQUE" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "6px" }}>
                    Cheque Number *
                  </label>
                  <input
                    type="text"
                    value={chequeNumber}
                    onChange={(e) => setChequeNumber(e.target.value)}
                    placeholder="6-digit cheque number"
                    required
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-secondary)",
                      color: "var(--text-main)",
                      fontSize: "0.88rem",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "6px" }}>
                    Cheque Date
                  </label>
                  <input
                    type="date"
                    value={chequeDate}
                    onChange={(e) => setChequeDate(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-secondary)",
                      color: "var(--text-main)",
                      fontSize: "0.88rem",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "6px" }}>
                  Issuing Bank Name *
                </label>
                <input
                  type="text"
                  value={chequeBank}
                  onChange={(e) => setChequeBank(e.target.value)}
                  placeholder="e.g. State Bank of India, HDFC Bank, ICICI Bank"
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                    color: "var(--text-main)",
                    fontSize: "0.88rem",
                    outline: "none"
                  }}
                />
              </div>
            </>
          )}

          {/* Notes */}
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "6px" }}>
              Collection Remarks / Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Cash collected against morning delivery"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-main)",
                fontSize: "0.85rem",
                outline: "none"
              }}
            />
          </div>

          {/* Form Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                background: "transparent",
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 22px",
                borderRadius: "10px",
                border: "none",
                background: isUnknownUpi
                  ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                  : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#ffffff",
                fontSize: "0.85rem",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: isUnknownUpi
                  ? "0 4px 12px rgba(239, 68, 68, 0.35)"
                  : "0 4px 12px rgba(16, 185, 129, 0.35)"
              }}
            >
              {loading ? "Recording..." : isUnknownUpi ? "Send to Suspense Queue ⚠" : "Record Payment ✓"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
