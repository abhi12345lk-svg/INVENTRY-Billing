import Payment from "../../models/Payment.js";
import { isDatabaseConnected } from "../../config/database.js";
import { applyPaymentToBill, findBillById } from "../billing/billing.repository.js";

const round2 = (num) => Math.round((Number(num || 0) + Number.EPSILON) * 100) / 100;

// Pre-seeded 12 realistic FMCG payments demonstrating Cash, UPI (with Unmatched), and Cheques
const INITIAL_DEMO_PAYMENTS = [];

let inMemoryPayments = [];
let paymentCounter = 0;

export const generatePaymentNumber = async () => {
  const currentYear = new Date().getFullYear();

  if (isDatabaseConnected()) {
    const latest = await Payment.findOne().sort({ createdAt: -1 }).lean();
    if (latest && latest.paymentNumber) {
      const parts = latest.paymentNumber.split("-");
      if (parts.length === 3) {
        const lastNum = parseInt(parts[2], 10);
        if (!isNaN(lastNum)) {
          const nextNum = (lastNum + 1).toString().padStart(6, "0");
          return `PAY-${currentYear}-${nextNum}`;
        }
      }
    }
  }

  paymentCounter += 1;
  const nextNum = paymentCounter.toString().padStart(6, "0");
  return `PAY-${currentYear}-${nextNum}`;
};

export const findPayments = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "ALL",
  paymentMode = "ALL",
  customerId = null,
  salesmanId = null
} = {}) => {
  const skip = (page - 1) * limit;

  if (isDatabaseConnected()) {
    const query = {};

    if (status && status !== "ALL") {
      query.status = status;
    }

    if (paymentMode && paymentMode !== "ALL") {
      query.paymentMode = paymentMode;
    }

    if (customerId) {
      query.customerId = customerId;
    }

    if (salesmanId) {
      query.$or = [{ salesmanId }, { salesmanCode: salesmanId }];
    }

    if (search) {
      const regex = new RegExp(search, "i");
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { paymentNumber: regex },
          { customerName: regex },
          { customerCode: regex },
          { payerName: regex },
          { upiReference: regex },
          { chequeNumber: regex },
          { referenceNumber: regex }
        ]
      });
    }

    const [payments, total] = await Promise.all([
      Payment.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Payment.countDocuments(query)
    ]);

    return {
      payments: payments.map((p) => ({ ...p, id: p._id.toString() })),
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit) || 1
    };
  }

  // In-Memory Fallback
  let filtered = [...inMemoryPayments];

  if (status && status !== "ALL") {
    filtered = filtered.filter((p) => p.status === status);
  }

  if (paymentMode && paymentMode !== "ALL") {
    filtered = filtered.filter((p) => p.paymentMode === paymentMode);
  }

  if (customerId) {
    filtered = filtered.filter((p) => p.customerId === customerId);
  }

  if (salesmanId) {
    filtered = filtered.filter(
      (p) => p.salesmanId === salesmanId || p.salesmanCode === salesmanId
    );
  }

  if (search) {
    const lower = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.paymentNumber?.toLowerCase().includes(lower) ||
        p.customerName?.toLowerCase().includes(lower) ||
        p.customerCode?.toLowerCase().includes(lower) ||
        p.payerName?.toLowerCase().includes(lower) ||
        p.upiReference?.toLowerCase().includes(lower) ||
        p.chequeNumber?.toLowerCase().includes(lower) ||
        p.referenceNumber?.toLowerCase().includes(lower)
    );
  }

  const total = filtered.length;
  const paginated = filtered.slice(skip, skip + limit);

  return {
    payments: paginated,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit) || 1
  };
};

export const findPaymentById = async (id) => {
  if (isDatabaseConnected()) {
    const p = await Payment.findById(id).lean() || await Payment.findOne({ paymentNumber: id }).lean();
    if (p) {
      return { ...p, id: p._id.toString() };
    }
  }

  return inMemoryPayments.find((p) => p.id === id || p.paymentNumber === id) || null;
};

export const findUnmatchedPayments = async () => {
  if (isDatabaseConnected()) {
    const list = await Payment.find({ status: "UNMATCHED" }).sort({ createdAt: -1 }).lean();
    return list.map((p) => ({ ...p, id: p._id.toString() }));
  }

  return inMemoryPayments.filter((p) => p.status === "UNMATCHED");
};

export const createPaymentRecord = async (paymentData) => {
  if (isDatabaseConnected()) {
    const doc = new Payment(paymentData);
    const saved = await doc.save();
    return { ...saved.toObject(), id: saved._id.toString() };
  }

  const paymentNumber = paymentData.paymentNumber || (await generatePaymentNumber());
  const newPayment = {
    id: `pay-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    ...paymentData,
    paymentNumber,
    mappedAmount: paymentData.mappedAmount || 0,
    unmappedAmount:
      paymentData.unmappedAmount !== undefined
        ? paymentData.unmappedAmount
        : round2(paymentData.amount),
    billMappings: paymentData.billMappings || [],
    createdAt: paymentData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  inMemoryPayments.unshift(newPayment);
  return newPayment;
};

export const identifyCustomer = async (id, customerData, user) => {
  const updateTime = new Date().toISOString();

  if (isDatabaseConnected()) {
    const updated = await Payment.findByIdAndUpdate(
      id,
      {
        customerId: customerData.customerId || customerData.id,
        customerCode: customerData.customerCode,
        customerName: customerData.customerName || customerData.shopName,
        status: "RECORDED",
        updatedBy: user?.name || "System"
      },
      { new: true }
    ).lean();

    if (updated) {
      return { ...updated, id: updated._id.toString() };
    }
  }

  const idx = inMemoryPayments.findIndex((p) => p.id === id || p.paymentNumber === id);
  if (idx !== -1) {
    inMemoryPayments[idx] = {
      ...inMemoryPayments[idx],
      customerId: customerData.customerId || customerData.id,
      customerCode: customerData.customerCode,
      customerName: customerData.customerName || customerData.shopName,
      status: "RECORDED",
      updatedBy: user?.name || "System",
      updatedAt: updateTime
    };
    return inMemoryPayments[idx];
  }

  return null;
};

export const mapPaymentToBills = async (id, allocations, user) => {
  const updateTime = new Date().toISOString();
  const payment = await findPaymentById(id);
  if (!payment) return null;

  // Process allocations on each bill
  const newMappings = [...(payment.billMappings || [])];
  let additionalAllocated = 0;

  for (const alloc of allocations) {
    const bill = await findBillById(alloc.billId);
    if (!bill) continue;

    const amountToMap = round2(alloc.allocatedAmount);
    await applyPaymentToBill(alloc.billId, amountToMap, user);

    newMappings.push({
      billId: bill.id || bill.billNumber,
      billNumber: bill.billNumber,
      allocatedAmount: amountToMap,
      allocatedAt: updateTime
    });

    additionalAllocated = round2(additionalAllocated + amountToMap);
  }

  const newMappedAmount = round2((payment.mappedAmount || 0) + additionalAllocated);
  const newUnmappedAmount = round2(Math.max(0, payment.amount - newMappedAmount));
  const newStatus = newMappedAmount >= payment.amount ? "MAPPED" : "PARTIALLY_MAPPED";

  if (isDatabaseConnected()) {
    const updated = await Payment.findByIdAndUpdate(
      id,
      {
        billMappings: newMappings,
        mappedAmount: newMappedAmount,
        unmappedAmount: newUnmappedAmount,
        status: newStatus,
        updatedBy: user?.name || "System"
      },
      { new: true }
    ).lean();

    if (updated) {
      return { ...updated, id: updated._id.toString() };
    }
  }

  const idx = inMemoryPayments.findIndex((p) => p.id === id || p.paymentNumber === id);
  if (idx !== -1) {
    inMemoryPayments[idx] = {
      ...inMemoryPayments[idx],
      billMappings: newMappings,
      mappedAmount: newMappedAmount,
      unmappedAmount: newUnmappedAmount,
      status: newStatus,
      updatedBy: user?.name || "System",
      updatedAt: updateTime
    };
    return inMemoryPayments[idx];
  }

  return null;
};

export const cancelPaymentRecord = async (id, reason, user) => {
  const cancelTime = new Date().toISOString();

  if (isDatabaseConnected()) {
    const updated = await Payment.findByIdAndUpdate(
      id,
      {
        status: "CANCELLED",
        cancelReason: reason,
        cancelledBy: `${user.name} (${user.role})`,
        cancelledAt: cancelTime,
        updatedBy: user.name
      },
      { new: true }
    ).lean();

    if (updated) {
      return { ...updated, id: updated._id.toString() };
    }
  }

  const idx = inMemoryPayments.findIndex((p) => p.id === id || p.paymentNumber === id);
  if (idx !== -1) {
    inMemoryPayments[idx] = {
      ...inMemoryPayments[idx],
      status: "CANCELLED",
      cancelReason: reason,
      cancelledBy: `${user.name} (${user.role})`,
      cancelledAt: cancelTime,
      updatedBy: user.name,
      updatedAt: cancelTime
    };
    return inMemoryPayments[idx];
  }

  return null;
};
