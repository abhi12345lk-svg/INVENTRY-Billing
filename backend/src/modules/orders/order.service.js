import {
  findOrders,
  findOrderById,
  findOrderByNumber,
  findCustomerOrders,
  createOrderRecord,
  updateOrderRecord,
  submitOrderRecord,
  cancelOrderRecord
} from "./order.repository.js";
import {
  validateOrderCreation,
  validateDraftUpdate,
  validateCancellation
} from "./order.validator.js";
import { findSalesmanById } from "../salesmen/salesman.repository.js";

// Helper for consistent 2-decimal financial rounding
const roundCurrency = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

export const calculateOrderTotals = (validatedItems) => {
  let grossSubtotal = 0;
  let totalDiscount = 0;
  let taxableAmount = 0;
  let totalTax = 0;
  let grandTotal = 0;
  let totalQuantity = 0;

  const processedItems = validatedItems.map(({ product, quantity, discount }) => {
    const saleRate = roundCurrency(product.saleRate);
    const lineSubtotal = roundCurrency(quantity * saleRate);
    const lineDiscount = roundCurrency(lineSubtotal * (discount / 100));
    const taxableValue = roundCurrency(lineSubtotal - lineDiscount);
    const taxRate = roundCurrency(product.taxRate || 0);
    const taxAmount = roundCurrency(taxableValue * (taxRate / 100));
    const lineTotal = roundCurrency(taxableValue + taxAmount);

    grossSubtotal += lineSubtotal;
    totalDiscount += lineDiscount;
    taxableAmount += taxableValue;
    totalTax += taxAmount;
    grandTotal += lineTotal;
    totalQuantity += quantity;

    return {
      productId: product.id,
      productCode: product.productCode,
      sku: product.sku,
      productName: product.productName,
      companyId: product.companyId || "",
      companyName: product.companyName || "",
      category: product.category || "",
      unit: product.unit || "PCS",
      packSize: product.packSize || "",
      quantity,
      mrp: roundCurrency(product.mrp),
      saleRate,
      discount,
      taxRate,
      lineSubtotal,
      lineDiscount,
      taxableValue,
      taxAmount,
      lineTotal
    };
  });

  const pricingSummary = {
    grossSubtotal: roundCurrency(grossSubtotal),
    totalDiscount: roundCurrency(totalDiscount),
    taxableAmount: roundCurrency(taxableAmount),
    totalTax: roundCurrency(totalTax),
    grandTotal: roundCurrency(grandTotal),
    totalItems: processedItems.length,
    totalQuantity
  };

  return { items: processedItems, pricingSummary };
};

export const createOrderService = async (orderData, user) => {
  const validation = await validateOrderCreation(orderData, user);

  if (validation.isForbidden) {
    throw { status: 403, message: validation.errors.join(" ") };
  }

  if (!validation.isValid) {
    throw { status: 400, message: validation.errors.join(" ") };
  }

  const { customer, validatedItems } = validation;
  const { items, pricingSummary } = calculateOrderTotals(validatedItems);

  // Derive salesman snapshot
  let salesmanSnapshot = {
    salesmanId: customer.salesmanId || "user-salesman-01",
    salesmanCode: "SM-000001",
    salesmanName: customer.salesmanName || user.name,
    userId: user.id
  };

  if (user.role === "SALESMAN") {
    salesmanSnapshot = {
      salesmanId: user.id,
      salesmanCode: "SM-000001",
      salesmanName: user.name,
      userId: user.id
    };
  }

  // Customer snapshot
  const customerSnapshot = {
    customerId: customer.id,
    customerCode: customer.customerCode,
    shopName: customer.shopName,
    ownerName: customer.ownerName || "",
    mobile: customer.mobile,
    address: customer.address || "",
    areaId: customer.areaId || "",
    areaName: customer.areaName || "",
    routeId: customer.routeId || "",
    routeName: customer.routeName || "",
    salesmanId: customer.salesmanId || "",
    salesmanName: customer.salesmanName || ""
  };

  const newOrder = await createOrderRecord({
    orderDate: orderData.orderDate || new Date().toISOString(),
    customer: customerSnapshot,
    salesman: salesmanSnapshot,
    route: {
      routeId: customer.routeId || "",
      routeCode: customer.routeId || "",
      routeName: customer.routeName || ""
    },
    area: {
      areaId: customer.areaId || "",
      areaCode: customer.areaId || "",
      areaName: customer.areaName || ""
    },
    items,
    pricingSummary,
    status: orderData.status === "SUBMITTED" ? "SUBMITTED" : "DRAFT",
    notes: orderData.notes || "",
    createdBy: user.name || user.email || user.id
  });

  console.log(
    `[AUDIT] Order Created: ${newOrder.orderNumber} for Outlet ${customer.shopName} (${customer.customerCode}) | Total: ₹${pricingSummary.grandTotal} | Status: ${newOrder.status} by ${user.name}`
  );

  return newOrder;
};

export const getOrdersService = async (queryParams, user) => {
  const scopedSalesmanId = user.role === "SALESMAN" ? user.id : null;
  return await findOrders({ ...queryParams, scopedSalesmanId });
};

export const getOrderByIdService = async (id, user) => {
  const order = await findOrderById(id);
  if (!order) {
    throw { status: 404, message: `Order '${id}' not found.` };
  }

  if (user.role === "SALESMAN") {
    const isOwner = 
      order.salesman?.salesmanId === user.id ||
      order.salesman?.userId === user.id ||
      (user.id === "user-salesman-01" && (order.salesman?.salesmanCode === "SM-000001" || order.salesman?.userId === "user-salesman-01"));

    if (!isOwner) {
      throw { status: 403, message: "Forbidden: You do not have permission to view orders belonging to another representative." };
    }
  }

  return order;
};

export const updateDraftOrderService = async (id, updateData, user) => {
  const validation = await validateDraftUpdate(id, updateData, user);

  if (validation.notFound) {
    throw { status: 404, message: validation.errors[0] };
  }
  if (validation.isForbidden) {
    throw { status: 403, message: validation.errors[0] };
  }
  if (validation.isLocked) {
    throw { status: 400, message: validation.errors[0] };
  }
  if (!validation.isValid) {
    throw { status: 400, message: validation.errors.join(" ") };
  }

  let finalUpdate = { notes: updateData.notes };

  if (validation.validatedItems && validation.validatedItems.length > 0) {
    const { items, pricingSummary } = calculateOrderTotals(validation.validatedItems);
    finalUpdate.items = items;
    finalUpdate.pricingSummary = pricingSummary;
  }

  const updatedOrder = await updateOrderRecord(id, finalUpdate, user);

  console.log(
    `[AUDIT] Draft Order Updated: ${updatedOrder.orderNumber} | New Grand Total: ₹${updatedOrder.pricingSummary?.grandTotal} by ${user.name}`
  );

  return updatedOrder;
};

export const submitOrderService = async (id, user) => {
  const order = await findOrderById(id);
  if (!order) {
    throw { status: 404, message: `Order '${id}' not found.` };
  }

  if (order.status !== "DRAFT") {
    throw { status: 400, message: `Order '${order.orderNumber}' cannot be submitted because it is currently ${order.status}.` };
  }

  if (user.role === "SALESMAN") {
    const isOwner = 
      order.salesman?.salesmanId === user.id ||
      order.salesman?.userId === user.id ||
      (user.id === "user-salesman-01" && (order.salesman?.salesmanCode === "SM-000001" || order.salesman?.userId === "user-salesman-01"));

    if (!isOwner) {
      throw { status: 403, message: "Forbidden: You can only submit your own draft orders." };
    }
  }

  const submittedOrder = await submitOrderRecord(id, user);

  console.log(
    `[AUDIT] Order Finalized & Submitted: ${submittedOrder.orderNumber} for ${submittedOrder.customer?.shopName} | Total: ₹${submittedOrder.pricingSummary?.grandTotal} by ${user.name}`
  );

  return submittedOrder;
};

export const cancelOrderService = async (id, reason, user) => {
  const validation = validateCancellation(reason);
  if (!validation.isValid) {
    throw { status: 400, message: validation.error };
  }

  const order = await findOrderById(id);
  if (!order) {
    throw { status: 404, message: `Order '${id}' not found.` };
  }

  if (order.status === "CANCELLED") {
    throw { status: 400, message: `Order '${order.orderNumber}' is already cancelled.` };
  }

  if (user.role === "SALESMAN") {
    const isOwner = 
      order.salesman?.salesmanId === user.id ||
      order.salesman?.userId === user.id ||
      (user.id === "user-salesman-01" && (order.salesman?.salesmanCode === "SM-000001" || order.salesman?.userId === "user-salesman-01"));

    if (!isOwner) {
      throw { status: 403, message: "Forbidden: You cannot cancel orders belonging to another representative." };
    }
  }

  const cancelledOrder = await cancelOrderRecord(id, reason, user);

  console.log(
    `[AUDIT] Order Cancelled: ${cancelledOrder.orderNumber} by ${user.name} (Reason: ${reason})`
  );

  return cancelledOrder;
};

export const getCustomerOrdersService = async (customerId, user) => {
  const scopedSalesmanId = user.role === "SALESMAN" ? user.id : null;
  return await findCustomerOrders(customerId, scopedSalesmanId);
};
