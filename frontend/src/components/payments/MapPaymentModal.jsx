import React, { useState, useEffect } from "react";
import { 
  X, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Zap, 
  RotateCcw,
  Sparkles
} from "lucide-react";

export default function MapPaymentModal({ 
  payment, 
  token, 
  onClose, 
  onSuccess 
}) {
  const [openBills, setOpenBills] = useState([]);
  const [loadingBills, setLoadingBills] = useState(true);
  const [allocations, setAllocations] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const format = (num) => `₹${Number(num || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const availableBalance = Number(payment?.unmappedAmount || payment?.amount || 0);

  // Fetch open invoices for customer
  useEffect(() => {
    const fetchOpenBills = async () => {
      setLoadingBills(true);
      setError("");

      try {
        const custId = payment?.customerId || payment?.customerCode;
        if (!custId) {
          setError("Cannot map payment without an identified customer.");
          setLoadingBills(false);
          return;
        }

        const res = await fetch(`http://localhost:5005/api/bills/customer/${custId}/open`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const json = await res.json();

        if (res.ok && json.success) {
          setOpenBills(json.data || []);
        } else {
          setError(json.message || "Failed to load customer open invoices.");
        }
      } catch (err) {
        console.error("Fetch open bills error:", err);
        setError("Unable to connect to Billing API.");
      } finally {
        setLoadingBills(false);
      }
    };

    fetchOpenBills();
  }, [payment, token]);

  const handleAllocationChange = (billId, value) => {
    const val = parseFloat(value);
    setAllocations((prev) => ({
      ...prev,
      [billId]: isNaN(val) ? "" : Math.max(0, val)
    }));
  };

  const handleAutoAllocate = () => {
    let remainingToAllocate = availableBalance;
    const newAllocations = {};

    for (const bill of openBills) {
      if (remainingToAllocate <= 0) break;
      const outstanding = Number(bill.outstandingAmount || 0);
      const alloc = Math.min(outstanding, remainingToAllocate);
      newAllocations[bill.id || bill.billNumber] = alloc;
      remainingToAllocate = Math.round((remainingToAllocate - alloc) * 100) / 100;
    }

    setAllocations(newAllocations);
  };

  const handleClear = () => {
    setAllocations({});
  };

  const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + (Number(val) || 0), 0);
  const remainingBalance = Math.max(0, Math.round((availableBalance - totalAllocated) * 100) / 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const activeAllocations = Object.entries(allocations)
      .filter(([_, amt]) => Number(amt) > 0)
      .map(([billId, amt]) => ({
        billId,
        allocatedAmount: Number(amt)
      }));

    if (activeAllocations.length === 0) {
      setError("Please allocate an amount to at least one invoice.");
      return;
    }

    if (totalAllocated > availableBalance) {
      setError(`Total allocated (₹${totalAllocated}) exceeds available payment balance (₹${availableBalance}).`);
      return;
    }

    for (const alloc of activeAllocations) {
      const bill = openBills.find((b) => (b.id || b.billNumber) === alloc.billId);
      if (bill && alloc.allocatedAmount > Number(bill.outstandingAmount)) {
        setError(`Allocation for ${bill.billNumber} exceeds outstanding (₹${bill.outstandingAmount}).`);
        return;
      }
    }

    setSubmitting(true);

    try {
      const response = await fetch(`http://localhost:5005/api/payments/${payment.id || payment.paymentNumber}/map`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ allocations: activeAllocations })
      });

      const json = await response.json();

      if (response.ok && json.success) {
        onSuccess(json.message, json.data);
        onClose();
      } else {
        setError(json.message || "Failed to map payment to invoices.");
      }
    } catch (err) {
      console.error("Map payment error:", err);
      setError("Network error while submitting payment mapping.");
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
        maxWidth: "760px",
        maxHeight: "90vh",
        overflowY: "auto",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        padding: "28px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)"
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "6px", background: "rgba(99, 102, 241, 0.15)", color: "var(--primary-400)", fontWeight: "700" }}>
                Reconciliation Engine
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                {payment.paymentNumber}
              </span>
            </div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-main)", margin: "4px 0 0 0" }}>
              Map Payment to Invoices
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Payment Summary Banner */}
        <div style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          borderRadius: "12px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "20px"
        }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Customer</div>
            <div style={{ fontSize: "1rem", fontWeight: "800", color: "var(--text-main)" }}>
              {payment.customerName}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
              {payment.customerCode}
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Payment Total</div>
              <div style={{ fontSize: "1rem", fontWeight: "800", color: "var(--text-main)", fontFamily: "monospace" }}>
                {format(payment.amount)}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.72rem", color: "#10b981", textTransform: "uppercase", fontWeight: "700" }}>Unmapped Available</div>
              <div style={{ fontSize: "1.2rem", fontWeight: "900", color: "#10b981", fontFamily: "monospace" }}>
                {format(availableBalance)}
              </div>
            </div>
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
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px"
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Actions Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)" }}>
            Open Locked Invoices ({openBills.length})
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={handleAutoAllocate}
              disabled={openBills.length === 0}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "none",
                background: "rgba(99, 102, 241, 0.15)",
                color: "var(--primary-400)",
                fontSize: "0.8rem",
                fontWeight: "700",
                cursor: openBills.length === 0 ? "not-allowed" : "pointer"
              }}
            >
              <Zap size={14} />
              <span>Auto-Allocate (Oldest First)</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "transparent",
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              <RotateCcw size={14} />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Invoices List Table */}
        {loadingBills ? (
          <div style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)" }}>
            Loading open invoices...
          </div>
        ) : openBills.length === 0 ? (
          <div style={{
            padding: "36px",
            textAlign: "center",
            background: "var(--bg-secondary)",
            borderRadius: "12px",
            border: "1px dashed var(--border-color)",
            color: "var(--text-muted)",
            fontSize: "0.88rem"
          }}>
            <CheckCircle2 size={32} color="#10b981" style={{ marginBottom: "8px" }} />
            <div style={{ fontWeight: "700", color: "var(--text-main)" }}>No Outstanding Invoices Found</div>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem" }}>
              This customer has zero unpaid or partially paid locked bills.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ overflowX: "auto", border: "1px solid var(--border-color)", borderRadius: "10px", marginBottom: "18px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", textAlign: "left" }}>
                    <th style={{ padding: "10px 14px" }}>Invoice</th>
                    <th style={{ padding: "10px 14px" }}>Date</th>
                    <th style={{ padding: "10px 14px", textAlign: "right" }}>Bill Total</th>
                    <th style={{ padding: "10px 14px", textAlign: "right" }}>Outstanding</th>
                    <th style={{ padding: "10px 14px", width: "160px", textAlign: "right" }}>Allocate (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {openBills.map((bill) => {
                    const billId = bill.id || bill.billNumber;
                    const allocatedVal = allocations[billId] || "";
                    const outstanding = Number(bill.outstandingAmount || 0);

                    return (
                      <tr key={billId} style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-main)" }}>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{ fontWeight: "700", fontFamily: "monospace", color: "var(--primary-400)" }}>
                            {bill.billNumber}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px", color: "var(--text-muted)" }}>
                          {new Date(bill.createdAt || bill.billDate).toLocaleDateString("en-IN")}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontFamily: "monospace" }}>
                          {format(bill.totalAmount)}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: "700", color: "#f87171", fontFamily: "monospace" }}>
                          {format(outstanding)}
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right" }}>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max={outstanding}
                            value={allocatedVal}
                            onChange={(e) => handleAllocationChange(billId, e.target.value)}
                            placeholder="₹ 0.00"
                            style={{
                              width: "120px",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              border: allocatedVal > 0 ? "1px solid #10b981" : "1px solid var(--border-color)",
                              background: allocatedVal > 0 ? "rgba(16, 185, 129, 0.1)" : "var(--bg-secondary)",
                              color: "var(--text-main)",
                              textAlign: "right",
                              fontFamily: "monospace",
                              fontWeight: "700",
                              outline: "none"
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Reconciliation Totals Box */}
            <div style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "10px",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px"
            }}>
              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Total Allocated: </span>
                <strong style={{ fontSize: "1rem", color: "var(--primary-400)", fontFamily: "monospace" }}>
                  {format(totalAllocated)}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Remaining Balance: </span>
                <strong style={{ fontSize: "1rem", color: remainingBalance === 0 ? "#10b981" : "#f59e0b", fontFamily: "monospace" }}>
                  {format(remainingBalance)}
                </strong>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
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
                disabled={submitting || totalAllocated <= 0}
                style={{
                  padding: "10px 22px",
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  cursor: submitting || totalAllocated <= 0 ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.35)"
                }}
              >
                {submitting ? "Allocating..." : "Confirm & Map Payment ✓"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
