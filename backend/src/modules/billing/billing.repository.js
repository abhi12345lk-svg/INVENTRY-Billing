import Bill from "../../models/Bill.js";
import { isDatabaseConnected } from "../../config/database.js";

// Helper for consistent 2-decimal financial rounding
const round2 = (num) => Math.round((Number(num || 0) + Number.EPSILON) * 100) / 100;

// Pre-seeded 12 realistic FMCG distributor demo bills
const INITIAL_DEMO_BILLS = [
  {
    id: "bill-001",
    billNumber: "INV-2026-000001",
    billDate: "2026-09-01T10:15:00.000Z",
    orderId: "ord-001",
    orderNumber: "ORD-000001",
    customer: {
      customerId: "CUS-000001",
      customerCode: "CUS-000001",
      customerName: "Sharma General Store",
      ownerName: "Sharma Ji",
      mobile: "9876500001",
      address: "Shop 12, Sadar Bazaar Main Road, Raipur",
      areaId: "AREA-000001",
      areaName: "Raipur Central",
      routeId: "ROUTE-000001",
      routeName: "Route A - Sadar Bazaar"
    },
    salesman: {
      salesmanId: "user-salesman-01",
      salesmanCode: "SM-000001",
      salesmanName: "Rahul Kumar",
      userId: "user-salesman-01"
    },
    companyName: "Chirag Combines FMCG",
    items: [
      {
        productId: "prd-001",
        productCode: "PRD-000001",
        sku: "SKU-MAGGI-70G",
        productName: "Maggi 2-Minute Masala Noodles 70g (Pack of 24)",
        companyName: "Nestlé",
        quantity: 20,
        rate: 12.0,
        mrp: 14.0,
        discount: 0,
        discountAmount: 0,
        taxableAmount: 240.0,
        taxRate: 5,
        taxAmount: 12.0,
        totalAmount: 252.0
      },
      {
        productId: "prd-002",
        productCode: "PRD-000002",
        sku: "SKU-KITKAT-37G",
        productName: "KitKat 4-Finger Crisp Wafer 37.5g",
        companyName: "Nestlé",
        quantity: 10,
        rate: 21.5,
        mrp: 25.0,
        discount: 0,
        discountAmount: 0,
        taxableAmount: 215.0,
        taxRate: 18,
        taxAmount: 38.7,
        totalAmount: 253.7
      }
    ],
    subtotal: 455.0,
    discountAmount: 0,
    taxableAmount: 455.0,
    taxAmount: 50.7,
    totalAmount: 505.7,
    paidAmount: 0,
    outstandingAmount: 505.7,
    billStatus: "LOCKED",
    paymentStatus: "UNPAID",
    totalItems: 2,
    totalQuantity: 30,
    generatedAt: "2026-09-01T10:15:00.000Z",
    generatedBy: "Rajesh Sharma (Owner)",
    lockedAt: "2026-09-01T10:30:00.000Z",
    lockedBy: "Rajesh Sharma (Owner)",
    notes: "Regular weekly stock order locked for dispatch."
  },
  {
    id: "bill-002",
    billNumber: "INV-2026-000002",
    billDate: "2026-09-02T11:45:00.000Z",
    orderId: "ord-002",
    orderNumber: "ORD-000002",
    customer: {
      customerId: "CUS-000002",
      customerCode: "CUS-000002",
      customerName: "Gupta Traders",
      ownerName: "Ramesh Gupta",
      mobile: "9876500002",
      address: "45, Model Town Market, Raipur",
      areaId: "AREA-000001",
      areaName: "Raipur Central",
      routeId: "ROUTE-000002",
      routeName: "Route B - Model Town"
    },
    salesman: {
      salesmanId: "user-salesman-01",
      salesmanCode: "SM-000001",
      salesmanName: "Rahul Kumar",
      userId: "user-salesman-01"
    },
    companyName: "Chirag Combines FMCG",
    items: [
      {
        productId: "prd-004",
        productCode: "PRD-000004",
        sku: "SKU-PAT-DK-100G",
        productName: "Patanjali Dant Kanti Dental Cream 100g",
        companyName: "Patanjali",
        quantity: 50,
        rate: 45.0,
        mrp: 50.0,
        discount: 2,
        discountAmount: 45.0,
        taxableAmount: 2205.0,
        taxRate: 12,
        taxAmount: 264.6,
        totalAmount: 2469.6
      }
    ],
    subtotal: 2250.0,
    discountAmount: 45.0,
    taxableAmount: 2205.0,
    taxAmount: 264.6,
    totalAmount: 2469.6,
    paidAmount: 1000.0,
    outstandingAmount: 1469.6,
    billStatus: "LOCKED",
    paymentStatus: "PARTIAL",
    totalItems: 1,
    totalQuantity: 50,
    generatedAt: "2026-09-02T11:45:00.000Z",
    generatedBy: "Amit Verma (Finance)",
    lockedAt: "2026-09-02T12:00:00.000Z",
    lockedBy: "Amit Verma (Finance)",
    notes: "Advance UPI received ₹1000, balance pending on delivery."
  },
  {
    id: "bill-003",
    billNumber: "INV-2026-000003",
    billDate: "2026-09-03T14:20:00.000Z",
    orderId: "ord-003",
    orderNumber: "ORD-000003",
    customer: {
      customerId: "CUS-000003",
      customerCode: "CUS-000003",
      customerName: "Verma Supermarket",
      ownerName: "Vipin Verma",
      mobile: "9876500003",
      address: "Plot 8, City Centre, Sadar Bazaar",
      areaId: "AREA-000001",
      areaName: "Raipur Central",
      routeId: "ROUTE-000001",
      routeName: "Route A - Sadar Bazaar"
    },
    salesman: {
      salesmanId: "user-salesman-01",
      salesmanCode: "SM-000001",
      salesmanName: "Rahul Kumar",
      userId: "user-salesman-01"
    },
    companyName: "Chirag Combines FMCG",
    items: [
      {
        productId: "prd-007",
        productCode: "PRD-000007",
        sku: "SKU-HORL-CL-500G",
        productName: "Horlicks Classic Malt 500g Jar",
        companyName: "GSK / Health",
        quantity: 12,
        rate: 245.0,
        mrp: 275.0,
        discount: 0,
        discountAmount: 0,
        taxableAmount: 2940.0,
        taxRate: 18,
        taxAmount: 529.2,
        totalAmount: 3469.2
      }
    ],
    subtotal: 2940.0,
    discountAmount: 0,
    taxableAmount: 2940.0,
    taxAmount: 529.2,
    totalAmount: 3469.2,
    paidAmount: 3469.2,
    outstandingAmount: 0,
    billStatus: "LOCKED",
    paymentStatus: "PAID",
    totalItems: 1,
    totalQuantity: 12,
    generatedAt: "2026-09-03T14:20:00.000Z",
    generatedBy: "Rajesh Sharma (Owner)",
    lockedAt: "2026-09-03T14:30:00.000Z",
    lockedBy: "Rajesh Sharma (Owner)",
    notes: "Full payment cleared via immediate Cheque #482910."
  },
  {
    id: "bill-004",
    billNumber: "INV-2026-000004",
    billDate: "2026-09-04T09:30:00.000Z",
    orderId: "ord-004",
    orderNumber: "ORD-000004",
    customer: {
      customerId: "CUS-000005",
      customerCode: "CUS-000005",
      customerName: "Ahuja Provision Store",
      ownerName: "Harish Ahuja",
      mobile: "9876500005",
      address: "Opp. SBI Branch, Sadar Bazaar",
      areaId: "AREA-000001",
      areaName: "Raipur Central",
      routeId: "ROUTE-000001",
      routeName: "Route A - Sadar Bazaar"
    },
    salesman: {
      salesmanId: "user-salesman-01",
      salesmanCode: "SM-000001",
      salesmanName: "Rahul Kumar",
      userId: "user-salesman-01"
    },
    companyName: "Chirag Combines FMCG",
    items: [
      {
        productId: "prd-005",
        productCode: "PRD-000005",
        sku: "SKU-PAT-GHEE-1L",
        productName: "Patanjali Pure Cow Ghee 1 Litre Ceka Pack",
        companyName: "Patanjali",
        quantity: 10,
        rate: 590.0,
        mrp: 650.0,
        discount: 0,
        discountAmount: 0,
        taxableAmount: 5900.0,
        taxRate: 12,
        taxAmount: 708.0,
        totalAmount: 6608.0
      }
    ],
    subtotal: 5900.0,
    discountAmount: 0,
    taxableAmount: 5900.0,
    taxAmount: 708.0,
    totalAmount: 6608.0,
    paidAmount: 0,
    outstandingAmount: 6608.0,
    billStatus: "GENERATED",
    paymentStatus: "UNPAID",
    totalItems: 1,
    totalQuantity: 10,
    generatedAt: "2026-09-04T09:30:00.000Z",
    generatedBy: "Vikas Malhotra (Sales Mgr)",
    lockedAt: null,
    lockedBy: null,
    notes: "Bill generated from field order, awaiting owner verification to lock."
  },
  {
    id: "bill-005",
    billNumber: "INV-2026-000005",
    billDate: "2026-09-04T12:00:00.000Z",
    orderId: "ord-005",
    orderNumber: "ORD-000005",
    customer: {
      customerId: "CUS-000006",
      customerCode: "CUS-000006",
      customerName: "Aggarwal Sweets & Grocery",
      ownerName: "Sunil Aggarwal",
      mobile: "9876500006",
      address: "12, Main Roundabout, Model Town",
      areaId: "AREA-000001",
      areaName: "Raipur Central",
      routeId: "ROUTE-000002",
      routeName: "Route B - Model Town"
    },
    salesman: {
      salesmanId: "user-salesman-01",
      salesmanCode: "SM-000001",
      salesmanName: "Rahul Kumar",
      userId: "user-salesman-01"
    },
    companyName: "Chirag Combines FMCG",
    items: [
      {
        productId: "prd-003",
        productCode: "PRD-000003",
        sku: "SKU-NES-CL-50G",
        productName: "Nescafé Classic Instant Coffee Glass Jar 50g",
        companyName: "Nestlé",
        quantity: 15,
        rate: 180.0,
        mrp: 200.0,
        discount: 0,
        discountAmount: 0,
        taxableAmount: 2700.0,
        taxRate: 18,
        taxAmount: 486.0,
        totalAmount: 3186.0
      }
    ],
    subtotal: 2700.0,
    discountAmount: 0,
    taxableAmount: 2700.0,
    taxAmount: 486.0,
    totalAmount: 3186.0,
    paidAmount: 0,
    outstandingAmount: 3186.0,
    billStatus: "CANCELLED",
    paymentStatus: "UNPAID",
    totalItems: 1,
    totalQuantity: 15,
    generatedAt: "2026-09-04T12:00:00.000Z",
    generatedBy: "Amit Verma (Finance)",
    cancelledAt: "2026-09-04T12:45:00.000Z",
    cancelledBy: "Rajesh Sharma (Owner)",
    cancelReason: "Customer requested cancellation due to duplicate order booking.",
    notes: "Order cancelled before dispatch."
  },
  {
    id: "bill-006",
    billNumber: "INV-2026-000006",
    billDate: "2026-09-04T15:10:00.000Z",
    orderId: "ord-006",
    orderNumber: "ORD-000006",
    customer: {
      customerId: "CUS-000007",
      customerCode: "CUS-000007",
      customerName: "Jain Kirana Store",
      ownerName: "Praveen Jain",
      mobile: "9876500007",
      address: "Shop 14, Sadar Bazaar Main Road",
      areaId: "AREA-000001",
      areaName: "Raipur Central",
      routeId: "ROUTE-000001",
      routeName: "Route A - Sadar Bazaar"
    },
    salesman: {
      salesmanId: "user-salesman-01",
      salesmanCode: "SM-000001",
      salesmanName: "Rahul Kumar",
      userId: "user-salesman-01"
    },
    companyName: "Chirag Combines FMCG",
    items: [
      {
        productId: "prd-008",
        productCode: "PRD-000008",
        sku: "SKU-BOOST-500G",
        productName: "Boost Energy Health Drink 500g Pet Jar",
        companyName: "GSK / Health",
        quantity: 10,
        rate: 260.0,
        mrp: 290.0,
        discount: 0,
        discountAmount: 0,
        taxableAmount: 2600.0,
        taxRate: 18,
        taxAmount: 468.0,
        totalAmount: 3068.0
      }
    ],
    subtotal: 2600.0,
    discountAmount: 0,
    taxableAmount: 2600.0,
    taxAmount: 468.0,
    totalAmount: 3068.0,
    paidAmount: 0,
    outstandingAmount: 3068.0,
    billStatus: "LOCKED",
    paymentStatus: "UNPAID",
    totalItems: 1,
    totalQuantity: 10,
    generatedAt: "2026-09-04T15:10:00.000Z",
    generatedBy: "Rajesh Sharma (Owner)",
    lockedAt: "2026-09-04T15:20:00.000Z",
    lockedBy: "Rajesh Sharma (Owner)",
    notes: "Locked and scheduled for tomorrow morning delivery trip."
  },
  {
    id: "bill-007",
    billNumber: "INV-2026-000007",
    billDate: "2026-09-05T09:15:00.000Z",
    orderId: "ord-007",
    orderNumber: "ORD-000007",
    customer: {
      customerId: "CUS-000009",
      customerCode: "CUS-000009",
      customerName: "Singla Retail Store",
      ownerName: "Ashok Singla",
      mobile: "9876500009",
      address: "Shop 22, Near Water Tank, Model Town",
      areaId: "AREA-000001",
      areaName: "Raipur Central",
      routeId: "ROUTE-000002",
      routeName: "Route B - Model Town"
    },
    salesman: {
      salesmanId: "user-salesman-01",
      salesmanCode: "SM-000001",
      salesmanName: "Rahul Kumar",
      userId: "user-salesman-01"
    },
    companyName: "Chirag Combines FMCG",
    items: [
      {
        productId: "prd-001",
        productCode: "PRD-000001",
        sku: "SKU-MAGGI-70G",
        productName: "Maggi 2-Minute Masala Noodles 70g (Pack of 24)",
        companyName: "Nestlé",
        quantity: 50,
        rate: 12.0,
        mrp: 14.0,
        discount: 0,
        discountAmount: 0,
        taxableAmount: 600.0,
        taxRate: 5,
        taxAmount: 30.0,
        totalAmount: 630.0
      },
      {
        productId: "prd-006",
        productCode: "PRD-000006",
        sku: "SKU-PAT-KESH-200ML",
        productName: "Patanjali Kesh Kanti Herbal Hair Expert Oil 200ml",
        companyName: "Patanjali",
        quantity: 20,
        rate: 175.0,
        mrp: 195.0,
        discount: 0,
        discountAmount: 0,
        taxableAmount: 3500.0,
        taxRate: 18,
        taxAmount: 630.0,
        totalAmount: 4130.0
      }
    ],
    subtotal: 4100.0,
    discountAmount: 0,
    taxableAmount: 4100.0,
    taxAmount: 660.0,
    totalAmount: 4760.0,
    paidAmount: 2500.0,
    outstandingAmount: 2260.0,
    billStatus: "LOCKED",
    paymentStatus: "PARTIAL",
    totalItems: 2,
    totalQuantity: 70,
    generatedAt: "2026-09-05T09:15:00.000Z",
    generatedBy: "Amit Verma (Finance)",
    lockedAt: "2026-09-05T09:30:00.000Z",
    lockedBy: "Amit Verma (Finance)",
    notes: "Part payment received via PhonePe UPI."
  },
  {
    id: "bill-008",
    billNumber: "INV-2026-000008",
    billDate: "2026-09-05T11:00:00.000Z",
    orderId: "ord-008",
    orderNumber: "ORD-000008",
    customer: {
      customerId: "CUS-000010",
      customerCode: "CUS-000010",
      customerName: "Kapoor Bakers & FMCG",
      ownerName: "Sanjay Kapoor",
      mobile: "9876500010",
      address: "Shop 5, Sadar Bazaar Cross Road",
      areaId: "AREA-000001",
      areaName: "Raipur Central",
      routeId: "ROUTE-000001",
      routeName: "Route A - Sadar Bazaar"
    },
    salesman: {
      salesmanId: "user-salesman-01",
      salesmanCode: "SM-000001",
      salesmanName: "Rahul Kumar",
      userId: "user-salesman-01"
    },
    companyName: "Chirag Combines FMCG",
    items: [
      {
        productId: "prd-002",
        productCode: "PRD-000002",
        sku: "SKU-KITKAT-37G",
        productName: "KitKat 4-Finger Crisp Wafer 37.5g",
        companyName: "Nestlé",
        quantity: 40,
        rate: 21.5,
        mrp: 25.0,
        discount: 0,
        discountAmount: 0,
        taxableAmount: 860.0,
        taxRate: 18,
        taxAmount: 154.8,
        totalAmount: 1014.8
      }
    ],
    subtotal: 860.0,
    discountAmount: 0,
    taxableAmount: 860.0,
    taxAmount: 154.8,
    totalAmount: 1014.8,
    paidAmount: 0,
    outstandingAmount: 1014.8,
    billStatus: "GENERATED",
    paymentStatus: "UNPAID",
    totalItems: 1,
    totalQuantity: 40,
    generatedAt: "2026-09-05T11:00:00.000Z",
    generatedBy: "Vikas Malhotra (Sales Mgr)",
    lockedAt: null,
    lockedBy: null,
    notes: "Recently converted from sales order. Ready for owner lock."
  },
  {
    id: "bill-009",
    billNumber: "INV-2026-000009",
    billDate: "2026-09-05T14:30:00.000Z",
    orderId: "ord-009",
    orderNumber: "ORD-000009",
    customer: {
      customerId: "CUS-000001",
      customerCode: "CUS-000001",
      customerName: "Sharma General Store",
      ownerName: "Sharma Ji",
      mobile: "9876500001",
      address: "Shop 12, Sadar Bazaar Main Road, Raipur",
      areaId: "AREA-000001",
      areaName: "Raipur Central",
      routeId: "ROUTE-000001",
      routeName: "Route A - Sadar Bazaar"
    },
    salesman: {
      salesmanId: "user-salesman-01",
      salesmanCode: "SM-000001",
      salesmanName: "Rahul Kumar",
      userId: "user-salesman-01"
    },
    companyName: "Chirag Combines FMCG",
    items: [
      {
        productId: "prd-005",
        productCode: "PRD-000005",
        sku: "SKU-PAT-GHEE-1L",
        productName: "Patanjali Pure Cow Ghee 1 Litre Ceka Pack",
        companyName: "Patanjali",
        quantity: 15,
        rate: 590.0,
        mrp: 650.0,
        discount: 0,
        discountAmount: 0,
        taxableAmount: 8850.0,
        taxRate: 12,
        taxAmount: 1062.0,
        totalAmount: 9912.0
      }
    ],
    subtotal: 8850.0,
    discountAmount: 0,
    taxableAmount: 8850.0,
    taxAmount: 1062.0,
    totalAmount: 9912.0,
    paidAmount: 9912.0,
    outstandingAmount: 0,
    billStatus: "LOCKED",
    paymentStatus: "PAID",
    totalItems: 1,
    totalQuantity: 15,
    generatedAt: "2026-09-05T14:30:00.000Z",
    generatedBy: "Rajesh Sharma (Owner)",
    lockedAt: "2026-09-05T14:40:00.000Z",
    lockedBy: "Rajesh Sharma (Owner)",
    notes: "Fully paid via RTGS/NEFT transaction."
  },
  {
    id: "bill-010",
    billNumber: "INV-2026-000010",
    billDate: "2026-09-06T10:00:00.000Z",
    orderId: "ord-010",
    orderNumber: "ORD-000010",
    customer: {
      customerId: "CUS-000002",
      customerCode: "CUS-000002",
      customerName: "Gupta Traders",
      ownerName: "Ramesh Gupta",
      mobile: "9876500002",
      address: "45, Model Town Market, Raipur",
      areaId: "AREA-000001",
      areaName: "Raipur Central",
      routeId: "ROUTE-000002",
      routeName: "Route B - Model Town"
    },
    salesman: {
      salesmanId: "user-salesman-01",
      salesmanCode: "SM-000001",
      salesmanName: "Rahul Kumar",
      userId: "user-salesman-01"
    },
    companyName: "Chirag Combines FMCG",
    items: [
      {
        productId: "prd-007",
        productCode: "PRD-000007",
        sku: "SKU-HORL-CL-500G",
        productName: "Horlicks Classic Malt 500g Jar",
        companyName: "GSK / Health",
        quantity: 24,
        rate: 245.0,
        mrp: 275.0,
        discount: 0,
        discountAmount: 0,
        taxableAmount: 5880.0,
        taxRate: 18,
        taxAmount: 1058.4,
        totalAmount: 6938.4
      }
    ],
    subtotal: 5880.0,
    discountAmount: 0,
    taxableAmount: 5880.0,
    taxAmount: 1058.4,
    totalAmount: 6938.4,
    paidAmount: 0,
    outstandingAmount: 6938.4,
    billStatus: "LOCKED",
    paymentStatus: "UNPAID",
    totalItems: 1,
    totalQuantity: 24,
    generatedAt: "2026-09-06T10:00:00.000Z",
    generatedBy: "Rajesh Sharma (Owner)",
    lockedAt: "2026-09-06T10:15:00.000Z",
    lockedBy: "Rajesh Sharma (Owner)",
    notes: "Locked for weekly delivery cycle."
  }
];

let inMemoryBills = [...INITIAL_DEMO_BILLS];
let billSequenceCounter = 10;

export const getNextBillNumber = async () => {
  if (isDatabaseConnected()) {
    const latest = await Bill.findOne().sort({ createdAt: -1 });
    if (latest && latest.billNumber) {
      const match = latest.billNumber.match(/INV-\d{4}-(\d+)/);
      if (match) {
        const nextNum = parseInt(match[1], 10) + 1;
        const year = new Date().getFullYear();
        return `INV-${year}-${String(nextNum).padStart(6, "0")}`;
      }
    }
  }

  billSequenceCounter += 1;
  const year = new Date().getFullYear();
  return `INV-${year}-${String(billSequenceCounter).padStart(6, "0")}`;
};

export const findBills = async ({
  page = 1,
  limit = 10,
  search = "",
  billStatus = "ALL",
  paymentStatus = "ALL",
  salesmanId = "",
  customerId = ""
} = {}) => {
  const skip = (page - 1) * limit;

  if (isDatabaseConnected()) {
    const filter = {};
    if (billStatus && billStatus !== "ALL") {
      filter.billStatus = billStatus;
    }
    if (paymentStatus && paymentStatus !== "ALL") {
      filter.paymentStatus = paymentStatus;
    }
    if (salesmanId) {
      filter.$or = [
        { "salesman.salesmanId": salesmanId },
        { "salesman.userId": salesmanId }
      ];
    }
    if (customerId) {
      filter["customer.customerId"] = customerId;
    }
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { billNumber: regex },
        { orderNumber: regex },
        { "customer.customerName": regex },
        { "customer.customerCode": regex },
        { "salesman.salesmanName": regex }
      ];
    }

    const [bills, total] = await Promise.all([
      Bill.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Bill.countDocuments(filter)
    ]);

    const formattedBills = bills.map((b) => ({
      ...b,
      id: b._id.toString()
    }));

    return {
      bills: formattedBills,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit) || 1
    };
  }

  // In-Memory Fallback
  let filtered = [...inMemoryBills];

  if (billStatus && billStatus !== "ALL") {
    filtered = filtered.filter((b) => b.billStatus === billStatus);
  }
  if (paymentStatus && paymentStatus !== "ALL") {
    filtered = filtered.filter((b) => b.paymentStatus === paymentStatus);
  }
  if (salesmanId) {
    filtered = filtered.filter(
      (b) => b.salesman?.salesmanId === salesmanId || b.salesman?.userId === salesmanId
    );
  }
  if (customerId) {
    filtered = filtered.filter((b) => b.customer?.customerId === customerId);
  }
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter((b) =>
      b.billNumber.toLowerCase().includes(q) ||
      b.orderNumber.toLowerCase().includes(q) ||
      (b.customer?.customerName && b.customer.customerName.toLowerCase().includes(q)) ||
      (b.customer?.customerCode && b.customer.customerCode.toLowerCase().includes(q)) ||
      (b.salesman?.salesmanName && b.salesman.salesmanName.toLowerCase().includes(q))
    );
  }

  const total = filtered.length;
  const paginated = filtered.slice(skip, skip + limit);

  return {
    bills: paginated,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit) || 1
  };
};

export const findBillById = async (id) => {
  if (isDatabaseConnected()) {
    const bill = await Bill.findById(id).lean() || await Bill.findOne({ billNumber: id }).lean();
    if (bill) {
      return { ...bill, id: bill._id.toString() };
    }
  }

  return inMemoryBills.find((b) => b.id === id || b.billNumber === id) || null;
};

export const findBillByOrderId = async (orderId) => {
  if (isDatabaseConnected()) {
    const bill = await Bill.findOne({
      $or: [{ orderId }, { orderNumber: orderId }]
    }).lean();
    if (bill) {
      return { ...bill, id: bill._id.toString() };
    }
  }

  return inMemoryBills.find((b) => b.orderId === orderId || b.orderNumber === orderId) || null;
};

export const createBillRecord = async (billData) => {
  if (isDatabaseConnected()) {
    const doc = new Bill(billData);
    const saved = await doc.save();
    return { ...saved.toObject(), id: saved._id.toString() };
  }

  const newBill = {
    id: `bill-${Date.now()}`,
    ...billData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  inMemoryBills.unshift(newBill);
  return newBill;
};

export const lockBillRecord = async (id, user) => {
  const lockTime = new Date().toISOString();

  if (isDatabaseConnected()) {
    const updated = await Bill.findByIdAndUpdate(
      id,
      {
        billStatus: "LOCKED",
        lockedAt: lockTime,
        lockedBy: `${user.name} (${user.role})`,
        updatedBy: user.name
      },
      { new: true }
    ).lean();

    if (updated) {
      return { ...updated, id: updated._id.toString() };
    }
  }

  const idx = inMemoryBills.findIndex((b) => b.id === id || b.billNumber === id);
  if (idx !== -1) {
    inMemoryBills[idx] = {
      ...inMemoryBills[idx],
      billStatus: "LOCKED",
      lockedAt: lockTime,
      lockedBy: `${user.name} (${user.role})`,
      updatedBy: user.name,
      updatedAt: lockTime
    };
    return inMemoryBills[idx];
  }

  return null;
};

export const cancelBillRecord = async (id, reason, user) => {
  const cancelTime = new Date().toISOString();

  if (isDatabaseConnected()) {
    const updated = await Bill.findByIdAndUpdate(
      id,
      {
        billStatus: "CANCELLED",
        cancelledAt: cancelTime,
        cancelledBy: `${user.name} (${user.role})`,
        cancelReason: reason,
        updatedBy: user.name
      },
      { new: true }
    ).lean();

    if (updated) {
      return { ...updated, id: updated._id.toString() };
    }
  }

  const idx = inMemoryBills.findIndex((b) => b.id === id || b.billNumber === id);
  if (idx !== -1) {
    inMemoryBills[idx] = {
      ...inMemoryBills[idx],
      billStatus: "CANCELLED",
      cancelledAt: cancelTime,
      cancelledBy: `${user.name} (${user.role})`,
      cancelReason: reason,
      updatedBy: user.name,
      updatedAt: cancelTime
    };
    return inMemoryBills[idx];
  }

  return null;
};
