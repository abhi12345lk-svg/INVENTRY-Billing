// In-memory + Mongoose Order Repository
let orderCounter = 1;

export const generateOrderNumber = () => {
  const num = `ORD-${String(orderCounter).padStart(6, "0")}`;
  orderCounter++;
  return num;
};

// Seed Realistic Demo Orders
let initialOrders = [
  {
    id: "ord-001",
    orderNumber: "ORD-000001",
    orderDate: "2026-09-01T10:15:00.000Z",
    customer: {
      customerId: "cus-001",
      customerCode: "CUS-000001",
      shopName: "Sharma General Store",
      ownerName: "Sharma Ji",
      mobile: "9876500001",
      address: "Shop 12, Main Market, Sadar Bazaar, Raipur",
      areaId: "AREA-01",
      areaName: "Raipur Central",
      routeId: "ROUTE-A",
      routeName: "Route A - Sadar Bazaar Wholesale",
      salesmanId: "user-salesman-01",
      salesmanName: "Rahul Kumar"
    },
    salesman: {
      salesmanId: "user-salesman-01",
      salesmanCode: "SM-000001",
      salesmanName: "Rahul Kumar",
      userId: "user-salesman-01"
    },
    route: {
      routeId: "ROUTE-A",
      routeCode: "ROUTE-000001",
      routeName: "Route A - Sadar Bazaar Wholesale"
    },
    area: {
      areaId: "AREA-01",
      areaCode: "AREA-000001",
      areaName: "Raipur Central"
    },
    items: [
      {
        productId: "prod-001",
        productCode: "PRD-000001",
        sku: "NES-MAG-70G",
        productName: "Maggi 2-Minute Noodles 70g",
        companyId: "CMP-01",
        companyName: "Nestlé India",
        category: "Packaged Foods",
        unit: "PACK",
        packSize: "70g",
        quantity: 96,
        mrp: 14,
        saleRate: 12,
        discount: 2,
        taxRate: 5,
        lineSubtotal: 1152.00,
        lineDiscount: 23.04,
        taxableValue: 1128.96,
        taxAmount: 56.45,
        lineTotal: 1185.41
      },
      {
        productId: "prod-002",
        productCode: "PRD-000002",
        sku: "NES-KIT-38G",
        productName: "KitKat 4-Finger Chocolate 38.5g",
        companyId: "CMP-01",
        companyName: "Nestlé India",
        category: "Chocolates & Confectionery",
        unit: "PCS",
        packSize: "38.5g",
        quantity: 48,
        mrp: 30,
        saleRate: 26,
        discount: 3,
        taxRate: 18,
        lineSubtotal: 1248.00,
        lineDiscount: 37.44,
        taxableValue: 1210.56,
        taxAmount: 217.90,
        lineTotal: 1428.46
      }
    ],
    pricingSummary: {
      grossSubtotal: 2400.00,
      totalDiscount: 60.48,
      taxableAmount: 2339.52,
      totalTax: 274.35,
      grandTotal: 2613.87,
      totalItems: 2,
      totalQuantity: 144
    },
    status: "SUBMITTED",
    notes: "Prompt delivery requested for morning inventory refill.",
    submittedAt: "2026-09-01T10:20:00.000Z",
    submittedBy: "Rahul Kumar",
    auditLog: [
      { action: "ORDER_CREATED", actor: "Rahul Kumar", timestamp: "2026-09-01T10:15:00.000Z" },
      { action: "ORDER_SUBMITTED", actor: "Rahul Kumar", timestamp: "2026-09-01T10:20:00.000Z" }
    ],
    createdAt: "2026-09-01T10:15:00.000Z",
    updatedAt: "2026-09-01T10:20:00.000Z"
  },
  {
    id: "ord-002",
    orderNumber: "ORD-000002",
    orderDate: "2026-09-02T11:45:00.000Z",
    customer: {
      customerId: "cus-002",
      customerCode: "CUS-000002",
      shopName: "Gupta Traders",
      ownerName: "Amit Gupta",
      mobile: "9876500002",
      address: "Plot 45, Commercial Complex, Model Town",
      areaId: "AREA-02",
      areaName: "Raipur North",
      routeId: "ROUTE-B",
      routeName: "Route B - Model Town Commercial",
      salesmanId: "user-salesman-01",
      salesmanName: "Rahul Kumar"
    },
    salesman: {
      salesmanId: "user-salesman-01",
      salesmanCode: "SM-000001",
      salesmanName: "Rahul Kumar",
      userId: "user-salesman-01"
    },
    route: {
      routeId: "ROUTE-B",
      routeCode: "ROUTE-000002",
      routeName: "Route B - Model Town Commercial"
    },
    area: {
      areaId: "AREA-02",
      areaCode: "AREA-000002",
      areaName: "Raipur North"
    },
    items: [
      {
        productId: "prod-005",
        productCode: "PRD-000005",
        sku: "PAT-DAN-100G",
        productName: "Patanjali Dant Kanti Toothpaste 100g",
        companyId: "CMP-02",
        companyName: "Patanjali Ayurved",
        category: "Oral Care",
        unit: "PCS",
        packSize: "100g",
        quantity: 50,
        mrp: 55,
        saleRate: 48,
        discount: 2,
        taxRate: 12,
        lineSubtotal: 2400.00,
        lineDiscount: 48.00,
        taxableValue: 2352.00,
        taxAmount: 282.24,
        lineTotal: 2634.24
      }
    ],
    pricingSummary: {
      grossSubtotal: 2400.00,
      totalDiscount: 48.00,
      taxableAmount: 2352.00,
      totalTax: 282.24,
      grandTotal: 2634.24,
      totalItems: 1,
      totalQuantity: 50
    },
    status: "SUBMITTED",
    notes: "Cash on delivery upon verification.",
    submittedAt: "2026-09-02T11:50:00.000Z",
    submittedBy: "Rahul Kumar",
    auditLog: [
      { action: "ORDER_CREATED", actor: "Rahul Kumar", timestamp: "2026-09-02T11:45:00.000Z" },
      { action: "ORDER_SUBMITTED", actor: "Rahul Kumar", timestamp: "2026-09-02T11:50:00.000Z" }
    ],
    createdAt: "2026-09-02T11:45:00.000Z",
    updatedAt: "2026-09-02T11:50:00.000Z"
  },
  {
    id: "ord-003",
    orderNumber: "ORD-000003",
    orderDate: "2026-09-03T14:20:00.000Z",
    customer: {
      customerId: "cus-003",
      customerCode: "CUS-000003",
      shopName: "Verma Supermarket",
      ownerName: "Rakesh Verma",
      mobile: "9876500003",
      address: "G-12, Sector 2, Devendra Nagar",
      areaId: "AREA-01",
      areaName: "Raipur Central",
      routeId: "ROUTE-A",
      routeName: "Route A - Sadar Bazaar Wholesale",
      salesmanId: "user-salesman-01",
      salesmanName: "Rahul Kumar"
    },
    salesman: {
      salesmanId: "user-salesman-01",
      salesmanCode: "SM-000001",
      salesmanName: "Rahul Kumar",
      userId: "user-salesman-01"
    },
    route: {
      routeId: "ROUTE-A",
      routeCode: "ROUTE-000001",
      routeName: "Route A - Sadar Bazaar Wholesale"
    },
    area: {
      areaId: "AREA-01",
      areaCode: "AREA-000001",
      areaName: "Raipur Central"
    },
    items: [
      {
        productId: "prod-003",
        productCode: "PRD-000003",
        sku: "NES-NES-50G",
        productName: "Nescafé Classic Instant Coffee 50g Glass Jar",
        companyId: "CMP-01",
        companyName: "Nestlé India",
        category: "Beverages",
        unit: "PCS",
        packSize: "50g",
        quantity: 24,
        mrp: 175,
        saleRate: 152,
        discount: 2,
        taxRate: 18,
        lineSubtotal: 3648.00,
        lineDiscount: 72.96,
        taxableValue: 3575.04,
        taxAmount: 643.51,
        lineTotal: 4218.55
      }
    ],
    pricingSummary: {
      grossSubtotal: 3648.00,
      totalDiscount: 72.96,
      taxableAmount: 3575.04,
      totalTax: 643.51,
      grandTotal: 4218.55,
      totalItems: 1,
      totalQuantity: 24
    },
    status: "DRAFT",
    notes: "Outlet owner reviewing additional beverage order lines.",
    auditLog: [
      { action: "ORDER_CREATED", actor: "Rahul Kumar", timestamp: "2026-09-03T14:20:00.000Z" }
    ],
    createdAt: "2026-09-03T14:20:00.000Z",
    updatedAt: "2026-09-03T14:20:00.000Z"
  },
  {
    id: "ord-004",
    orderNumber: "ORD-000004",
    orderDate: "2026-09-04T09:30:00.000Z",
    customer: {
      customerId: "cus-004",
      customerCode: "CUS-000004",
      shopName: "Kisan Kirana Store",
      ownerName: "Sunil Sahu",
      mobile: "9876500004",
      address: "Near Mandi Gate, Pandri",
      areaId: "AREA-03",
      areaName: "Raipur East",
      routeId: "ROUTE-C",
      routeName: "Route C - Pandri Cloth Market",
      salesmanId: "sm-002",
      salesmanName: "Deepak Sahu"
    },
    salesman: {
      salesmanId: "sm-002",
      salesmanCode: "SM-000002",
      salesmanName: "Deepak Sahu",
      userId: null
    },
    route: {
      routeId: "ROUTE-C",
      routeCode: "ROUTE-000003",
      routeName: "Route C - Pandri Cloth Market"
    },
    area: {
      areaId: "AREA-03",
      areaCode: "AREA-000003",
      areaName: "Raipur East"
    },
    items: [
      {
        productId: "prod-009",
        productCode: "PRD-000009",
        sku: "GSK-HOR-500G",
        productName: "Horlicks Classic Malt Health Drink 500g Refill",
        companyId: "CMP-03",
        companyName: "GlaxoSmithKline Consumer Healthcare",
        category: "Health Foods & Drinks",
        unit: "PACK",
        packSize: "500g",
        quantity: 20,
        mrp: 260,
        saleRate: 232,
        discount: 2.5,
        taxRate: 18,
        lineSubtotal: 4640.00,
        lineDiscount: 116.00,
        taxableValue: 4524.00,
        taxAmount: 814.32,
        lineTotal: 5338.32
      }
    ],
    pricingSummary: {
      grossSubtotal: 4640.00,
      totalDiscount: 116.00,
      taxableAmount: 4524.00,
      totalTax: 814.32,
      grandTotal: 5338.32,
      totalItems: 1,
      totalQuantity: 20
    },
    status: "CANCELLED",
    notes: "Cancelled due to temporary outlet renovation.",
    cancelledAt: "2026-09-04T12:10:00.000Z",
    cancelledBy: "Deepak Sahu",
    cancellationReason: "Retailer requested order hold due to shop expansion.",
    auditLog: [
      { action: "ORDER_CREATED", actor: "Deepak Sahu", timestamp: "2026-09-04T09:30:00.000Z" },
      { action: "ORDER_CANCELLED", actor: "Deepak Sahu", timestamp: "2026-09-04T12:10:00.000Z" }
    ],
    createdAt: "2026-09-04T09:30:00.000Z",
    updatedAt: "2026-09-04T12:10:00.000Z"
  }
];

// Set initial counter past the seeded demo orders
orderCounter = 5;

export const findOrders = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "ALL",
  salesmanId = "",
  customerId = "",
  routeId = "",
  areaId = "",
  startDate = "",
  endDate = "",
  scopedSalesmanId = null
}) => {
  let list = [...initialOrders];

  // 1. Scoping Enforcement (Salesman can ONLY view their own orders)
  if (scopedSalesmanId) {
    list = list.filter((o) => 
      o.salesman?.salesmanId === scopedSalesmanId || 
      o.salesman?.userId === scopedSalesmanId ||
      (scopedSalesmanId === "user-salesman-01" && (o.salesman?.salesmanCode === "SM-000001" || o.salesman?.userId === "user-salesman-01"))
    );
  } else if (salesmanId && salesmanId !== "ALL") {
    list = list.filter((o) => 
      o.salesman?.salesmanId === salesmanId || 
      o.salesman?.salesmanCode === salesmanId ||
      o.salesman?.userId === salesmanId
    );
  }

  // 2. Status Filter
  if (status && status !== "ALL") {
    list = list.filter((o) => o.status === status);
  }

  // 3. Customer Filter
  if (customerId && customerId !== "ALL") {
    list = list.filter((o) => o.customer?.customerId === customerId || o.customer?.customerCode === customerId);
  }

  // 4. Route Filter
  if (routeId && routeId !== "ALL") {
    list = list.filter((o) => o.route?.routeId === routeId || o.route?.routeCode === routeId || o.customer?.routeId === routeId);
  }

  // 5. Area Filter
  if (areaId && areaId !== "ALL") {
    list = list.filter((o) => o.area?.areaId === areaId || o.area?.areaCode === areaId || o.customer?.areaId === areaId);
  }

  // 6. Date Range Filters
  if (startDate) {
    list = list.filter((o) => new Date(o.orderDate) >= new Date(startDate));
  }
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    list = list.filter((o) => new Date(o.orderDate) <= end);
  }

  // 7. Search Filter (orderNumber, customer shop name, owner name, customer code)
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter((o) => 
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customer?.shopName?.toLowerCase().includes(q) ||
      o.customer?.ownerName?.toLowerCase().includes(q) ||
      o.customer?.customerCode?.toLowerCase().includes(q) ||
      o.salesman?.salesmanName?.toLowerCase().includes(q)
    );
  }

  // Sort descending by orderDate / createdAt
  list.sort((a, b) => new Date(b.orderDate || b.createdAt) - new Date(a.orderDate || a.createdAt));

  // Pagination
  const total = list.length;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const totalPages = Math.ceil(total / limitNum) || 1;
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedData = list.slice(startIndex, startIndex + limitNum);

  return {
    data: paginatedData,
    page: pageNum,
    limit: limitNum,
    total,
    totalPages
  };
};

export const findOrderById = async (id) => {
  return initialOrders.find((o) => o.id === id || o.orderNumber === id) || null;
};

export const findOrderByNumber = async (orderNumber) => {
  return initialOrders.find((o) => o.orderNumber === orderNumber.trim()) || null;
};

export const findCustomerOrders = async (customerId, scopedSalesmanId = null) => {
  let list = initialOrders.filter((o) => o.customer?.customerId === customerId || o.customer?.customerCode === customerId);
  
  if (scopedSalesmanId) {
    list = list.filter((o) => 
      o.salesman?.salesmanId === scopedSalesmanId || 
      o.salesman?.userId === scopedSalesmanId ||
      (scopedSalesmanId === "user-salesman-01" && (o.salesman?.salesmanCode === "SM-000001" || o.salesman?.userId === "user-salesman-01"))
    );
  }

  list.sort((a, b) => new Date(b.orderDate || b.createdAt) - new Date(a.orderDate || a.createdAt));
  return list;
};

export const createOrderRecord = async (orderData) => {
  const newId = `ord-${Date.now()}`;
  const orderNumber = generateOrderNumber();
  const now = new Date().toISOString();

  const newOrder = {
    id: newId,
    orderNumber,
    orderDate: orderData.orderDate || now,
    customer: orderData.customer,
    salesman: orderData.salesman,
    route: orderData.route || {},
    area: orderData.area || {},
    items: orderData.items,
    pricingSummary: orderData.pricingSummary,
    status: orderData.status || "DRAFT",
    notes: (orderData.notes || "").trim(),
    submittedAt: orderData.status === "SUBMITTED" ? now : null,
    submittedBy: orderData.status === "SUBMITTED" ? orderData.createdBy : null,
    auditLog: [
      {
        action: "ORDER_CREATED",
        actor: orderData.createdBy || "system",
        timestamp: now,
        details: { status: orderData.status || "DRAFT", total: orderData.pricingSummary?.grandTotal }
      }
    ],
    createdBy: orderData.createdBy || "system",
    updatedBy: orderData.createdBy || "system",
    createdAt: now,
    updatedAt: now
  };

  initialOrders.unshift(newOrder);
  return newOrder;
};

export const updateOrderRecord = async (id, updateData, user) => {
  const index = initialOrders.findIndex((o) => o.id === id || o.orderNumber === id);
  if (index === -1) return null;

  const current = initialOrders[index];
  const now = new Date().toISOString();

  const updated = {
    ...current,
    items: updateData.items || current.items,
    pricingSummary: updateData.pricingSummary || current.pricingSummary,
    notes: updateData.notes !== undefined ? updateData.notes.trim() : current.notes,
    updatedBy: user.name || user.email || user.id,
    updatedAt: now,
    auditLog: [
      ...current.auditLog,
      {
        action: "DRAFT_UPDATED",
        actor: user.name || user.email || user.id,
        timestamp: now,
        details: { previousTotal: current.pricingSummary?.grandTotal, newTotal: updateData.pricingSummary?.grandTotal }
      }
    ]
  };

  initialOrders[index] = updated;
  return updated;
};

export const submitOrderRecord = async (id, user) => {
  const index = initialOrders.findIndex((o) => o.id === id || o.orderNumber === id);
  if (index === -1) return null;

  const current = initialOrders[index];
  const now = new Date().toISOString();

  const submitted = {
    ...current,
    status: "SUBMITTED",
    submittedAt: now,
    submittedBy: user.name || user.email || user.id,
    updatedBy: user.name || user.email || user.id,
    updatedAt: now,
    auditLog: [
      ...current.auditLog,
      {
        action: "ORDER_SUBMITTED",
        actor: user.name || user.email || user.id,
        timestamp: now,
        details: { grandTotal: current.pricingSummary?.grandTotal }
      }
    ]
  };

  initialOrders[index] = submitted;
  return submitted;
};

export const cancelOrderRecord = async (id, reason, user) => {
  const index = initialOrders.findIndex((o) => o.id === id || o.orderNumber === id);
  if (index === -1) return null;

  const current = initialOrders[index];
  const now = new Date().toISOString();

  const cancelled = {
    ...current,
    status: "CANCELLED",
    cancelledAt: now,
    cancelledBy: user.name || user.email || user.id,
    cancellationReason: reason.trim(),
    updatedBy: user.name || user.email || user.id,
    updatedAt: now,
    auditLog: [
      ...current.auditLog,
      {
        action: "ORDER_CANCELLED",
        actor: user.name || user.email || user.id,
        timestamp: now,
        details: { previousStatus: current.status, reason }
      }
    ]
  };

  initialOrders[index] = cancelled;
  return cancelled;
};
