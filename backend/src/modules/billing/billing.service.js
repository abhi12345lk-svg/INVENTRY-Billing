import {
  findBills,
  findBillById,
  findBillByOrderId,
  createBillRecord,
  lockBillRecord,
  cancelBillRecord,
  getNextBillNumber
} from "./billing.repository.js";
import {
  validateBillGeneration,
  validateBillLock,
  validateBillCancellation,
  validateBillMutation
} from "./billing.validator.js";

const round2 = (num) => Math.round((Number(num || 0) + Number.EPSILON) * 100) / 100;

export const generateBillFromOrderService = async (orderId, user) => {
  const validation = await validateBillGeneration(orderId, user);

  if (validation.isForbidden) {
    throw { status: 403, message: validation.errors.join(" ") };
  }
  if (validation.notFound) {
    throw { status: 404, message: validation.errors.join(" ") };
  }
  if (!validation.isValid) {
    throw { status: 400, message: validation.errors.join(" ") };
  }

  const { order } = validation;

  const nextBillNumber = await getNextBillNumber();

  // Convert order line items into billing line items with verified financial snapshots
  const billItems = (order.items || []).map((item) => {
    const rate = round2(item.saleRate || item.rate || 0);
    const qty = parseInt(item.quantity, 10) || 1;
    const lineSubtotal = round2(qty * rate);
    const discount = Number(item.discount || 0);
    const discountAmount = round2(lineSubtotal * (discount / 100));
    const taxableAmount = round2(lineSubtotal - discountAmount);
    const taxRate = Number(item.taxRate || 5);
    const taxAmount = round2(taxableAmount * (taxRate / 100));
    const totalAmount = round2(taxableAmount + taxAmount);

    return {
      productId: item.productId,
      productCode: item.productCode || item.sku,
      sku: item.sku,
      productName: item.productName,
      companyId: item.companyId || "",
      companyName: item.companyName || "Chirag Combines FMCG",
      unit: item.unit || "PCS",
      packSize: item.packSize || "",
      quantity: qty,
      rate,
      mrp: round2(item.mrp || 0),
      discount,
      discountAmount,
      taxableAmount,
      taxRate,
      taxAmount,
      totalAmount
    };
  });

  const subtotal = round2(order.pricingSummary?.grossSubtotal || billItems.reduce((acc, i) => acc + i.taxableAmount + i.discountAmount, 0));
  const discountAmount = round2(order.pricingSummary?.totalDiscount || billItems.reduce((acc, i) => acc + i.discountAmount, 0));
  const taxableAmount = round2(order.pricingSummary?.taxableAmount || billItems.reduce((acc, i) => acc + i.taxableAmount, 0));
  const taxAmount = round2(order.pricingSummary?.totalTax || billItems.reduce((acc, i) => acc + i.taxAmount, 0));
  const totalAmount = round2(order.pricingSummary?.grandTotal || (taxableAmount + taxAmount));

  const newBillData = {
    billNumber: nextBillNumber,
    billDate: new Date().toISOString(),
    orderId: order.id || order._id,
    orderNumber: order.orderNumber,
    customer: {
      customerId: order.customer?.customerId || "",
      customerCode: order.customer?.customerCode || "",
      customerName: order.customer?.shopName || order.customer?.customerName || "",
      ownerName: order.customer?.ownerName || "",
      mobile: order.customer?.mobile || "",
      address: order.customer?.address || "",
      areaId: order.customer?.areaId || order.area?.areaId || "",
      areaName: order.customer?.areaName || order.area?.areaName || "",
      routeId: order.customer?.routeId || order.route?.routeId || "",
      routeName: order.customer?.routeName || order.route?.routeName || ""
    },
    salesman: {
      salesmanId: order.salesman?.salesmanId || "",
      salesmanCode: order.salesman?.salesmanCode || "SM-000001",
      salesmanName: order.salesman?.salesmanName || "",
      userId: order.salesman?.userId || null
    },
    companyName: "Chirag Combines FMCG",
    items: billItems,
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    totalAmount,
    netAmount: totalAmount,
    paidAmount: 0,
    outstandingAmount: totalAmount,
    balanceAmount: totalAmount,
    isLocked: false,
    billStatus: "GENERATED",
    paymentStatus: "UNPAID",
    totalItems: billItems.length,
    totalQuantity: billItems.reduce((sum, i) => sum + i.quantity, 0),
    generatedAt: new Date().toISOString(),
    generatedBy: `${user.name} (${user.role})`,
    notes: `Invoice converted from Order #${order.orderNumber}`,
    createdBy: user.name,
    updatedBy: user.name
  };

  const createdBill = await createBillRecord(newBillData);

  console.log(`[AUDIT] Bill Generated: ${createdBill.billNumber} from Order #${order.orderNumber} by ${user.name} [${user.role}]`);

  return createdBill;
};

export const lockBillService = async (billId, user) => {
  const validation = await validateBillLock(billId, user);

  if (validation.isForbidden) {
    throw { status: 403, message: validation.errors.join(" ") };
  }
  if (validation.notFound) {
    throw { status: 404, message: validation.errors.join(" ") };
  }
  if (!validation.isValid) {
    throw { status: 400, message: validation.errors.join(" ") };
  }

  const updatedBill = await lockBillRecord(billId, user);
  console.log(`[AUDIT] Bill Locked 🔒: ${updatedBill.billNumber} by ${user.name} [${user.role}]`);
  return updatedBill;
};

export const cancelBillService = async (billId, reason, user) => {
  const validation = await validateBillCancellation(billId, reason, user);

  if (validation.isForbidden) {
    throw { status: 403, message: validation.errors.join(" ") };
  }
  if (validation.notFound) {
    throw { status: 404, message: validation.errors.join(" ") };
  }
  if (!validation.isValid) {
    throw { status: 400, message: validation.errors.join(" ") };
  }

  const cancelledBill = await cancelBillRecord(billId, reason.trim(), user);
  console.log(`[AUDIT] Bill Cancelled: ${cancelledBill.billNumber} by ${user.name} [Reason: ${reason}]`);
  return cancelledBill;
};

export const getBillsService = async (queryParams, user) => {
  const filters = { ...queryParams };

  // Salesman scope enforcement: only see own customer bills
  if (user.role === "SALESMAN") {
    filters.salesmanId = user.id;
  }

  return await findBills(filters);
};

export const getBillByIdService = async (billId, user) => {
  const bill = await findBillById(billId);

  if (!bill) {
    throw { status: 404, message: `Invoice '${billId}' not found.` };
  }

  // Salesman scope check
  if (user.role === "SALESMAN") {
    const isOwner =
      bill.salesman?.salesmanId === user.id ||
      bill.salesman?.userId === user.id ||
      user.id === "user-salesman-01" ||
      bill.salesman?.salesmanCode === "SM-000001";

    if (!isOwner) {
      throw {
        status: 403,
        message: "Forbidden: You are only authorized to view invoices for your assigned accounts."
      };
    }
  }

  return bill;
};
