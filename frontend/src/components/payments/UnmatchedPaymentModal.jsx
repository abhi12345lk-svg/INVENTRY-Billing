import React, { useState, useEffect } from "react";
import { X, AlertTriangle, Store, CheckCircle2, ArrowRight } from "lucide-react";

export default function UnmatchedPaymentModal({ 
  payment, 
  token, 
  onClose, 
  onSuccess 
}) {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const format = (num) => `₹${Number(num || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("http://localhost:5005/api/customers?limit=100", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success && json.data) {
          setCustomers(json.data);
          if (json.data.length > 0) {
            setSelectedCustomerId(json.data[0].id || json.data[0].customerId);
          }
        }
      } catch (err) {
        console.error("Failed to load customers:", err);
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      setError("Please select a registered customer.");
      return;
    }

    const selectedCust = customers.find((c) => (c.id || c.customerId) === selectedCustomerId);
    if (!selectedCust) {
      setError("Selected customer not found.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:5005/api/payments/${payment.id || payment.paymentNumber}/identify-customer`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          customerId: selectedCust.id || selectedCust.customerId,
          customerCode: selectedCust.customerCode,
          customerName: selectedCust.shopName || selectedCust.ownerName
        })
      });

      const json = await response.json();

      if (response.ok && json.success) {
        onSuccess(json.message, json.data);
        onClose();
      } else {
        setError(json.message || "Failed to identify customer.");
      }
    } catch (err) {
      console.error("Identify customer error:", err);
      setError("Unable to connect to Payment API.");
    } finally {
      setSubmitting(false);
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
        maxWidth: "500px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)"
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "rgba(239, 68, 68, 0.15)",
              color: "#f87171",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>
                Identify UPI Customer
              </h3>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Resolve unknown payer from Suspense Queue
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Unmatched Details Card */}
        <div style={{
          background: "rgba(239, 68, 68, 0.08)",
          border: "1px solid rgba(239, 68, 68, 0.25)",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "18px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>UPI Reference:</span>
            <strong style={{ fontSize: "0.85rem", color: "var(--text-main)", fontFamily: "monospace" }}>
              {payment.upiReference || payment.referenceNumber || "N/A"}
            </strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Sender Payer Name:</span>
            <strong style={{ fontSize: "0.85rem", color: "#f87171" }}>
              {payment.payerName || "Unknown Bank Transfer"}
            </strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed rgba(239, 68, 68, 0.3)", paddingTop: "8px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)" }}>Amount Received:</span>
            <span style={{ fontSize: "1.1rem", fontWeight: "900", color: "var(--primary-400)", fontFamily: "monospace" }}>
              {format(payment.amount)}
            </span>
          </div>
        </div>

        {error && (
          <div style={{
            padding: "10px 14px",
            borderRadius: "10px",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#f87171",
            fontSize: "0.85rem",
            marginBottom: "14px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "6px" }}>
              Link to Registered Retail Customer *
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              disabled={loadingCustomers}
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
              {customers.map((c) => (
                <option key={c.id || c.customerId} value={c.id || c.customerId}>
                  {c.shopName || c.customerName} ({c.customerCode})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 16px",
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
              disabled={submitting || loadingCustomers}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                color: "#ffffff",
                fontSize: "0.85rem",
                fontWeight: "700",
                cursor: submitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.35)"
              }}
            >
              <span>{submitting ? "Linking..." : "Identify & Unlock Mapping"}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
