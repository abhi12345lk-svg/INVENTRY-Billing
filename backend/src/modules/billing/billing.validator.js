import { findOrderById } from "../orders/order.repository.js";
import { findBillById, findBillByOrderId } from "./billing.repository.js";

export const validateBillGeneration = async (orderId, user) => {
  const errors = [];

  // Role check: Salesman cannot generate bills
  if (user.role === "SALESMAN") {
    return {
      isValid: false,
      isForbidden: true,
      errors: ["Forbidden: Sales representatives are not authorized to generate billing invoices."]
    };
  }

  if (!orderId) {
    errors.push("Source order ID is required for billing.");
    return { isValid: false, errors };
  }

  const order = await findOrderById(orderId);
  if (!order) {
    return {
      isValid: false,
      notFound: true,
      errors: [`Order '${orderId}' does not exist.`]
    };
  }

  if (order.status !== "SUBMITTED") {
    errors.push(`Cannot generate bill for an order with status '${order.status}'. Only SUBMITTED orders can be converted into invoices.`);
  }

  // Check if invoice already generated for this order
  const existingBill = await findBillByOrderId(orderId);
  if (existingBill) {
    errors.push(`An invoice (${existingBill.billNumber}) has already been generated for Order #${order.orderNumber}.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    order
  };
};

export const validateBillLock = async (billId, user) => {
  const errors = [];

  // Role check: Salesman cannot lock bills
  if (user.role === "SALESMAN") {
    return {
      isValid: false,
      isForbidden: true,
      errors: ["Forbidden: Sales representatives are not authorized to lock billing invoices."]
    };
  }

  const bill = await findBillById(billId);
  if (!bill) {
    return {
      isValid: false,
      notFound: true,
      errors: [`Bill '${billId}' not found.`]
    };
  }

  if (bill.billStatus === "LOCKED") {
    errors.push(`Invoice '${bill.billNumber}' is already locked.`);
  } else if (bill.billStatus === "CANCELLED") {
    errors.push(`Cannot lock CANCELLED invoice '${bill.billNumber}'.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    bill
  };
};

export const validateBillCancellation = async (billId, reason, user) => {
  const errors = [];

  // Role check: Salesman cannot cancel bills
  if (user.role === "SALESMAN") {
    return {
      isValid: false,
      isForbidden: true,
      errors: ["Forbidden: Sales representatives are not authorized to cancel billing invoices."]
    };
  }

  const bill = await findBillById(billId);
  if (!bill) {
    return {
      isValid: false,
      notFound: true,
      errors: [`Bill '${billId}' not found.`]
    };
  }

  if (bill.billStatus === "CANCELLED") {
    errors.push(`Invoice '${bill.billNumber}' is already cancelled.`);
  }

  if (!reason || typeof reason !== "string" || !reason.trim()) {
    errors.push("A valid cancellation reason is required to cancel an invoice.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    bill
  };
};

export const validateBillMutation = (bill) => {
  if (bill.billStatus === "LOCKED") {
    return {
      isAllowed: false,
      error: "This invoice is locked and cannot be modified."
    };
  }
  if (bill.billStatus === "CANCELLED") {
    return {
      isAllowed: false,
      error: "This invoice is cancelled and cannot be modified."
    };
  }
  return { isAllowed: true };
};
