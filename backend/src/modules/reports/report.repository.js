// backend/src/modules/reports/report.repository.js

import { findBills } from "../billing/billing.repository.js";
import { findPayments } from "../payments/payment.repository.js";
import { findCustomers } from "../customers/customer.repository.js";
import { findProducts } from "../products/product.repository.js";
import { findSalesmen } from "../salesmen/salesman.repository.js";
import { exceptionRepository } from "../exceptions/exception.repository.js";

const round2 = (num) => Math.round((Number(num || 0) + Number.EPSILON) * 100) / 100;

export const reportRepository = {
  async getExecutiveSummary(dateRange = "today") {
    const [billsRes, paymentsRes, customersRes, exceptionsRes] = await Promise.all([
      findBills({ limit: 1000 }).catch(() => ({ bills: [], total: 0 })),
      findPayments({ limit: 1000 }).catch(() => ({ payments: [], total: 0 })),
      findCustomers({ limit: 1000 }).catch(() => ({ data: [], total: 0 })),
      exceptionRepository.getExceptionSummary().catch(() => ({ critical: 0 }))
    ]);

    const bills = billsRes.bills || [];
    const payments = paymentsRes.payments || [];
    const customers = customersRes.data || [];

    let totalSales = 0;
    let totalOutstanding = 0;
    bills.forEach((b) => {
      const net = round2(b.netAmount || b.totalAmount || 0);
      const balance = round2(b.balanceAmount !== undefined ? b.balanceAmount : (net - (b.paidAmount || 0)));
      totalSales = round2(totalSales + net);
      if (b.status !== "CANCELLED") {
        totalOutstanding = round2(totalOutstanding + Math.max(0, balance));
      }
    });

    let totalCollection = 0;
    payments.forEach((p) => {
      totalCollection = round2(totalCollection + (p.amount || 0));
    });

    const activeCustomers = customers.filter((c) => c.status === "ACTIVE").length;
    const totalBills = bills.length;
    const averageBillValue = totalBills > 0 ? round2(totalSales / totalBills) : 0;

    return {
      dateRange,
      totalSales,
      salesTrend: "+0.0%",
      totalCollection,
      collectionTrend: "+0.0%",
      totalOutstanding,
      outstandingTrend: "0.0%",
      totalBills,
      billsCapacity: Math.max(10, totalBills + 10),
      activeCustomers,
      criticalExceptions: exceptionsRes.critical || 0,
      averageBillValue
    };
  },

  async getSalesAnalytics(dateRange = "today") {
    const billsRes = await findBills({ limit: 1000 }).catch(() => ({ bills: [] }));
    const bills = billsRes.bills || [];

    let grossSales = 0;
    const nowMs = Date.now();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const trendMap = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date(nowMs - i * 24 * 60 * 60 * 1000);
      const dStr = d.toISOString().split("T")[0];
      const dayLabel = daysOfWeek[d.getDay()];
      trendMap[dStr] = { day: dayLabel, sales: 0, bills: 0 };
    }

    bills.forEach((b) => {
      const net = round2(b.netAmount || b.totalAmount || 0);
      grossSales = round2(grossSales + net);
      const bDate = b.billDate ? b.billDate.split("T")[0] : (b.createdAt ? b.createdAt.split("T")[0] : "");
      if (trendMap[bDate]) {
        trendMap[bDate].sales = round2(trendMap[bDate].sales + net);
        trendMap[bDate].bills += 1;
      }
    });

    const salesTrend = Object.values(trendMap);
    const totalBills = bills.length;
    const averageBillValue = totalBills > 0 ? round2(grossSales / totalBills) : 0;

    return {
      dateRange,
      salesTrend,
      grossSales,
      totalBills,
      averageBillValue
    };
  },

  async getCollectionAnalytics(dateRange = "today") {
    const paymentsRes = await findPayments({ limit: 1000 }).catch(() => ({ payments: [] }));
    const payments = paymentsRes.payments || [];

    let cashCollection = 0;
    let upiCollection = 0;
    let chequeCollection = 0;
    let totalCollection = 0;
    let mappedPayments = 0;
    let unmappedPayments = 0;

    payments.forEach((p) => {
      const amt = round2(p.amount || 0);
      totalCollection = round2(totalCollection + amt);
      const mode = (p.paymentMode || "").toUpperCase();
      if (mode === "CASH") cashCollection = round2(cashCollection + amt);
      else if (mode === "UPI") upiCollection = round2(upiCollection + amt);
      else if (mode === "CHEQUE") chequeCollection = round2(chequeCollection + amt);

      if (p.status === "MAPPED") mappedPayments = round2(mappedPayments + amt);
      else unmappedPayments = round2(unmappedPayments + amt);
    });

    const cashPct = totalCollection > 0 ? round2((cashCollection / totalCollection) * 100) : 0;
    const upiPct = totalCollection > 0 ? round2((upiCollection / totalCollection) * 100) : 0;
    const chequePct = totalCollection > 0 ? round2((chequeCollection / totalCollection) * 100) : 0;

    return {
      dateRange,
      cashCollection,
      upiCollection,
      chequeCollection,
      totalCollection,
      mappedPayments,
      suspensePayments: 0,
      unmappedPayments,
      breakdown: [
        { mode: "Cash", amount: cashCollection, percentage: cashPct, color: "#10b981" },
        { mode: "UPI / QR", amount: upiCollection, percentage: upiPct, color: "#6366f1" },
        { mode: "Cheque", amount: chequeCollection, percentage: chequePct, color: "#f59e0b" }
      ]
    };
  },

  async getOutstandingReport() {
    const billsRes = await findBills({ limit: 1000 }).catch(() => ({ bills: [] }));
    const bills = billsRes.bills || [];

    let totalOutstanding = 0;
    const nowMs = Date.now();
    const buckets = [
      { range: "0–7 Days", amount: 0, percentage: 0, count: 0, risk: "Low", color: "#10b981" },
      { range: "8–15 Days", amount: 0, percentage: 0, count: 0, risk: "Medium", color: "#3b82f6" },
      { range: "16–30 Days", amount: 0, percentage: 0, count: 0, risk: "Medium-High", color: "#eab308" },
      { range: "31–60 Days", amount: 0, percentage: 0, count: 0, risk: "High", color: "#f97316" },
      { range: "61–90 Days", amount: 0, percentage: 0, count: 0, risk: "Critical", color: "#ef4444" },
      { range: "90+ Days", amount: 0, percentage: 0, count: 0, risk: "Severe", color: "#b91c1c" }
    ];

    const customerBalances = {};

    bills.forEach((b) => {
      const balance = round2(b.balanceAmount !== undefined ? b.balanceAmount : ((b.netAmount || 0) - (b.paidAmount || 0)));
      if (balance > 0 && b.status !== "CANCELLED") {
        totalOutstanding = round2(totalOutstanding + balance);
        const bDateMs = new Date(b.billDate || b.createdAt || nowMs).getTime();
        const ageDays = Math.max(0, Math.floor((nowMs - bDateMs) / (1000 * 60 * 60 * 24)));

        let bucketIdx = 0;
        if (ageDays <= 7) bucketIdx = 0;
        else if (ageDays <= 15) bucketIdx = 1;
        else if (ageDays <= 30) bucketIdx = 2;
        else if (ageDays <= 60) bucketIdx = 3;
        else if (ageDays <= 90) bucketIdx = 4;
        else bucketIdx = 5;

        buckets[bucketIdx].amount = round2(buckets[bucketIdx].amount + balance);
        buckets[bucketIdx].count += 1;

        const cId = b.customer?.customerId || b.customer?.customerCode || "UNKNOWN";
        if (!customerBalances[cId]) {
          customerBalances[cId] = {
            name: b.customer?.customerName || "Retail Outlet",
            code: b.customer?.customerCode || cId,
            outstanding: 0,
            overdueDays: ageDays,
            creditLimit: 50000,
            status: "ACTIVE"
          };
        }
        customerBalances[cId].outstanding = round2(customerBalances[cId].outstanding + balance);
        if (ageDays > customerBalances[cId].overdueDays) {
          customerBalances[cId].overdueDays = ageDays;
        }
      }
    });

    if (totalOutstanding > 0) {
      buckets.forEach((b) => {
        b.percentage = round2((b.amount / totalOutstanding) * 100);
      });
    }

    const criticalCustomers = Object.values(customerBalances)
      .sort((a, b) => b.outstanding - a.outstanding)
      .slice(0, 5);

    return {
      totalOutstanding,
      ageingBuckets: buckets,
      criticalCustomers
    };
  },

  async getTopCustomers() {
    const [billsRes, paymentsRes] = await Promise.all([
      findBills({ limit: 1000 }).catch(() => ({ bills: [] })),
      findPayments({ limit: 1000 }).catch(() => ({ payments: [] }))
    ]);

    const customerMap = {};
    billsRes.bills.forEach((b) => {
      const cId = b.customer?.customerId || b.customer?.customerCode || "UNKNOWN";
      if (!customerMap[cId]) {
        customerMap[cId] = {
          name: b.customer?.customerName || "Retail Outlet",
          code: b.customer?.customerCode || cId,
          tier: "Retailer",
          sales: 0,
          collection: 0,
          outstanding: 0,
          status: "ACTIVE",
          ordersCount: 0
        };
      }
      customerMap[cId].sales = round2(customerMap[cId].sales + (b.netAmount || 0));
      customerMap[cId].ordersCount += 1;
      const balance = round2(b.balanceAmount !== undefined ? b.balanceAmount : ((b.netAmount || 0) - (b.paidAmount || 0)));
      customerMap[cId].outstanding = round2(customerMap[cId].outstanding + Math.max(0, balance));
    });

    paymentsRes.payments.forEach((p) => {
      const cId = p.customerId || p.customerCode;
      if (cId && customerMap[cId]) {
        customerMap[cId].collection = round2(customerMap[cId].collection + (p.amount || 0));
      }
    });

    const customers = Object.values(customerMap)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10)
      .map((c, idx) => ({ ...c, rank: idx + 1 }));

    return {
      customers,
      totalTracked: customers.length
    };
  },

  async getTopProducts() {
    const billsRes = await findBills({ limit: 1000 }).catch(() => ({ bills: [] }));
    const prodMap = {};

    billsRes.bills.forEach((b) => {
      (b.items || []).forEach((item) => {
        const pId = item.productId || item.productCode || item.sku || "PROD";
        if (!prodMap[pId]) {
          prodMap[pId] = {
            name: item.productName || "Product",
            shortName: item.productName || "Product",
            company: item.companyName || "Brand",
            sku: item.sku || item.productCode || "",
            unitsSold: 0,
            salesAmount: 0,
            growthPct: "+0.0%",
            stockStatus: "IN_STOCK"
          };
        }
        prodMap[pId].unitsSold += (parseInt(item.quantity, 10) || 0);
        prodMap[pId].salesAmount = round2(prodMap[pId].salesAmount + (item.totalAmount || item.netAmount || 0));
      });
    });

    const products = Object.values(prodMap)
      .sort((a, b) => b.salesAmount - a.salesAmount)
      .slice(0, 10)
      .map((p, idx) => ({ ...p, rank: idx + 1 }));

    return {
      products,
      totalTracked: products.length
    };
  },

  async getSalesmanPerformance() {
    const [salesmenRes, billsRes, paymentsRes] = await Promise.all([
      findSalesmen({ limit: 1000 }).catch(() => ({ data: [] })),
      findBills({ limit: 1000 }).catch(() => ({ bills: [] })),
      findPayments({ limit: 1000 }).catch(() => ({ payments: [] }))
    ]);

    const salesmanMap = {};
    salesmenRes.data.forEach((s) => {
      salesmanMap[s.id] = {
        name: s.name || s.salesmanName,
        employeeCode: s.code || s.salesmanCode || "SLS-001",
        route: s.assignedRouteName || s.route || "All Routes",
        assignedCustomers: 0,
        orders: 0,
        sales: 0,
        collection: 0,
        targetAchieved: 0,
        achievementRate: "0%"
      };
    });

    billsRes.bills.forEach((b) => {
      const smId = b.salesmanId || (b.salesman && b.salesman.id);
      if (smId && salesmanMap[smId]) {
        salesmanMap[smId].sales = round2(salesmanMap[smId].sales + (b.netAmount || 0));
        salesmanMap[smId].orders += 1;
      }
    });

    paymentsRes.payments.forEach((p) => {
      const smId = p.salesmanId;
      if (smId && salesmanMap[smId]) {
        salesmanMap[smId].collection = round2(salesmanMap[smId].collection + (p.amount || 0));
      }
    });

    const salesmen = Object.values(salesmanMap)
      .sort((a, b) => b.sales - a.sales)
      .map((sm, idx) => {
        const rate = sm.sales > 0 ? Math.min(100, Math.round((sm.collection / sm.sales) * 100)) : 0;
        return {
          ...sm,
          rank: idx + 1,
          targetAchieved: rate,
          achievementRate: `${rate}%`
        };
      });

    const topPerformer = salesmen.length > 0 ? { ...salesmen[0], badge: "TOP PERFORMER", growth: "+0.0%" } : null;

    return {
      topPerformer,
      salesmen
    };
  },

  async getExceptionSummary() {
    const summary = await exceptionRepository.getExceptionSummary().catch(() => ({
      totalOpen: 0,
      critical: 0,
      high: 0,
      warning: 0,
      info: 0
    }));

    return {
      criticalCount: summary.critical || 0,
      highCount: summary.high || 0,
      warningCount: summary.warning || 0,
      totalCount: summary.totalOpen || 0,
      exceptionCategories: []
    };
  }
};
