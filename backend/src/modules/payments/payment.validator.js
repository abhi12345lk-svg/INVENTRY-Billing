import { findBillById } from "../billing/billing.repository.js";

const round2 = (num) => Math.round((Number(num || 0) + Number.EPSILON) * 100) / 100;

export const validatePaymentEntry = (data, user) => {
  const paymentMode = (data.paymentMode || data.mode || "").toUpperCase();
  const { amount, customerId, chequeNumber, chequeBank } = data;

  if (!paymentMode || !["CASH", "UPI", "CHEQUE"].includes(paymentMode)) {
    return {
      isValid: false,
      message: "Valid payment mode (CASH, UPI, CHEQUE) is required."
    };
  }

  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return {
      isValid: false,
      message: "Payment amount must be greater than zero."
    };
  }

  // Salesman RBAC checks
  if (user.role === "SALESMAN") {
    if (paymentMode === "UPI" && !customerId) {
      return {
        isValid: false,
        message: "Salesman must specify a customer for payment collection."
      };
    }
  }

  // Cash & Cheque require customer
  if (["CASH", "CHEQUE"].includes(paymentMode) && !customerId) {
    return {
      isValid: false,
      message: `Customer selection is required for ${paymentMode} payments.`
    };
  }

  // Cheque mode validation
  if (paymentMode === "CHEQUE") {
    if (!chequeNumber || !chequeNumber.trim()) {
      return {
        isValid: false,
        message: "Cheque number is required for cheque payments."
      };
    }
    if (!chequeBank || !chequeBank.trim()) {
      return {
        isValid: false,
        message: "Issuing bank name is required for cheque payments."
      };
    }
  }

  return { isValid: true };
};

export const validateCustomerIdentification = (payment, customerData, user) => {
  if (!payment) {
    return { isValid: false, statusCode: 404, message: "Payment not found." };
  }

  if (["SALESMAN"].includes(user.role)) {
    return {
      isValid: false,
      statusCode: 403,
      message: "Salesman is not authorized to identify suspense payments."
    };
  }

  if (payment.status !== "UNMATCHED") {
    return {
      isValid: false,
      statusCode: 400,
      message: `Payment status is ${payment.status}, not UNMATCHED.`
    };
  }

  if (!customerData || (!customerData.customerId && !customerData.id)) {
    return {
      isValid: false,
      statusCode: 400,
      message: "Valid customer identification details are required."
    };
  }

  return { isValid: true };
};

export const validatePaymentMapping = async (payment, allocations, user) => {
  if (!payment) {
    return { isValid: false, statusCode: 404, message: "Payment not found." };
  }

  if (["SALESMAN"].includes(user.role)) {
    return {
      isValid: false,
      statusCode: 403,
      message: "Salesman is not authorized to perform payment reconciliation mapping."
    };
  }

  if (payment.status === "CANCELLED") {
    return {
      isValid: false,
      statusCode: 400,
      message: "Cancelled payments cannot be mapped."
    };
  }

  if (payment.status === "UNMATCHED") {
    return {
      isValid: false,
      statusCode: 400,
      message: "Customer must be identified before mapping an unknown payment."
    };
  }

  if (!Array.isArray(allocations) || allocations.length === 0) {
    return {
      isValid: false,
      statusCode: 400,
      message: "At least one bill allocation is required."
    };
  }

  let totalAllocated = 0;

  for (const alloc of allocations) {
    const allocAmount = round2(alloc.allocatedAmount);
    if (isNaN(allocAmount) || allocAmount <= 0) {
      return {
        isValid: false,
        statusCode: 400,
        message: "Each bill allocation amount must be greater than zero."
      };
    }

    const bill = await findBillById(alloc.billId);
    if (!bill) {
      return {
        isValid: false,
        statusCode: 404,
        message: `Invoice ${alloc.billId} not found.`
      };
    }

    if (bill.billStatus === "CANCELLED") {
      return {
        isValid: false,
        statusCode: 400,
        message: `Invoice ${bill.billNumber} is cancelled and cannot accept payments.`
      };
    }

    if (allocAmount > round2(bill.outstandingAmount)) {
      return {
        isValid: false,
        statusCode: 400,
        message: `Allocation exceeds invoice outstanding amount for ${bill.billNumber}. Max outstanding is ₹${bill.outstandingAmount}.`
      };
    }

    totalAllocated = round2(totalAllocated + allocAmount);
  }

  if (totalAllocated > round2(payment.unmappedAmount)) {
    return {
      isValid: false,
      statusCode: 400,
      message: `Total allocation (₹${totalAllocated}) exceeds payment unmapped balance (₹${payment.unmappedAmount}).`
    };
  }

  return { isValid: true };
};

export const validatePaymentCancellation = (payment, reason, user) => {
  if (!payment) {
    return { isValid: false, statusCode: 404, message: "Payment not found." };
  }

  if (["SALESMAN"].includes(user.role)) {
    return {
      isValid: false,
      statusCode: 403,
      message: "Salesman is not authorized to cancel payments."
    };
  }

  if (payment.status === "CANCELLED") {
    return {
      isValid: false,
      statusCode: 400,
      message: "Payment is already cancelled."
    };
  }

  if (!reason || !reason.trim()) {
    return {
      isValid: false,
      statusCode: 400,
      message: "A cancellation justification reason is required."
    };
  }

  return { isValid: true };
};
