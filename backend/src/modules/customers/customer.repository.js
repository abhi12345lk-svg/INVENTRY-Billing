// Initial Seed Data for Customer Master (12 Outlets across Routes & Salesmen)
let initialCustomers = [
  {
    id: "cus-001",
    customerCode: "CUS-000001",
    shopName: "Sharma General Store",
    ownerName: "Sharma Ji",
    mobile: "9876500001",
    alternateMobile: "9876500091",
    email: "sharma.store@gmail.com",
    address: "Shop 12, Main Market, Sadar Bazaar, Raipur",
    areaId: "AREA-01",
    areaName: "Raipur Central",
    routeId: "ROUTE-A",
    routeName: "Route A - Sadar Bazaar",
    salesmanId: "user-salesman-01",
    salesmanName: "Rahul Kumar",
    creditLimit: 150000,
    openingBalance: 45000,
    paymentTerms: "Net 15 Days",
    status: "ACTIVE",
    statusReason: "",
    notes: "Key FMCG retailer for Nestlé & Patanjali products",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-08-01T10:00:00Z").toISOString()
  },
  {
    id: "cus-002",
    customerCode: "CUS-000002",
    shopName: "Gupta Traders",
    ownerName: "Amit Gupta",
    mobile: "9876500002",
    alternateMobile: "",
    email: "guptatraders@yahoo.com",
    address: "Plot 45, Commercial Complex, Model Town",
    areaId: "AREA-02",
    areaName: "Raipur North",
    routeId: "ROUTE-B",
    routeName: "Route B - Model Town",
    salesmanId: "user-salesman-01",
    salesmanName: "Rahul Kumar",
    creditLimit: 100000,
    openingBalance: 12000,
    paymentTerms: "Cash on Delivery",
    status: "ACTIVE",
    statusReason: "",
    notes: "Prompt payments via UPI",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-02T11:30:00Z").toISOString(),
    updatedAt: new Date("2026-08-02T11:30:00Z").toISOString()
  },
  {
    id: "cus-003",
    customerCode: "CUS-000003",
    shopName: "Verma Supermarket",
    ownerName: "Rakesh Verma",
    mobile: "9876500003",
    alternateMobile: "9876500093",
    email: "verma.super@gmail.com",
    address: "Opposite Bus Stand, Civil Lines",
    areaId: "AREA-01",
    areaName: "Raipur Central",
    routeId: "ROUTE-A",
    routeName: "Route A - Sadar Bazaar",
    salesmanId: "user-salesman-01",
    salesmanName: "Rahul Kumar",
    creditLimit: 200000,
    openingBalance: 89000,
    paymentTerms: "Net 30 Days",
    status: "BLOCKED",
    statusReason: "Payment overdue > 60 days (₹90,000 pending)",
    notes: "Requires Owner approval for new billing",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-05T09:15:00Z").toISOString(),
    updatedAt: new Date("2026-09-01T14:20:00Z").toISOString()
  },
  {
    id: "cus-004",
    customerCode: "CUS-000004",
    shopName: "Patanjali Mega Store",
    ownerName: "Subhash Chandra",
    mobile: "9876500004",
    alternateMobile: "",
    email: "patanjali.raipur@gmail.com",
    address: "Shop 1-2, Swadeshi Plaza, G.T. Road",
    areaId: "AREA-03",
    areaName: "Raipur East",
    routeId: "ROUTE-C",
    routeName: "Route C - G.T. Road",
    salesmanId: "user-salesmgr-01",
    salesmanName: "Vikas Malhotra",
    creditLimit: 250000,
    openingBalance: 0,
    paymentTerms: "Net 15 Days",
    status: "ACTIVE",
    statusReason: "",
    notes: "Exclusive Patanjali & GSK products distributor",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-10T14:00:00Z").toISOString(),
    updatedAt: new Date("2026-08-10T14:00:00Z").toISOString()
  },
  {
    id: "cus-005",
    customerCode: "CUS-000005",
    shopName: "Ahuja Provision Store",
    ownerName: "Sunil Ahuja",
    mobile: "9876500005",
    alternateMobile: "",
    email: "",
    address: "Block B, Pocket 3, Station Road",
    areaId: "AREA-01",
    areaName: "Raipur Central",
    routeId: "ROUTE-A",
    routeName: "Route A - Sadar Bazaar",
    salesmanId: "user-salesman-01",
    salesmanName: "Rahul Kumar",
    creditLimit: 75000,
    openingBalance: 15000,
    paymentTerms: "Net 7 Days",
    status: "ACTIVE",
    statusReason: "",
    notes: "",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-12T16:45:00Z").toISOString(),
    updatedAt: new Date("2026-08-12T16:45:00Z").toISOString()
  },
  {
    id: "cus-006",
    customerCode: "CUS-000006",
    shopName: "Aggarwal Sweets & Grocery",
    ownerName: "Vijay Aggarwal",
    mobile: "9876500006",
    alternateMobile: "",
    email: "aggarwalsweets@gmail.com",
    address: "Corner Shop, Chowk Bazaar",
    areaId: "AREA-02",
    areaName: "Raipur North",
    routeId: "ROUTE-B",
    routeName: "Route B - Model Town",
    salesmanId: "user-salesman-01",
    salesmanName: "Rahul Kumar",
    creditLimit: 50000,
    openingBalance: 8000,
    paymentTerms: "Cash on Delivery",
    status: "ON_HOLD",
    statusReason: "Cheque bounce verification pending",
    notes: "Under review by Finance team",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-15T12:10:00Z").toISOString(),
    updatedAt: new Date("2026-08-30T10:00:00Z").toISOString()
  },
  {
    id: "cus-007",
    customerCode: "CUS-000007",
    shopName: "Jain Kirana Store",
    ownerName: "Mahesh Jain",
    mobile: "9876500007",
    alternateMobile: "",
    email: "",
    address: "Shop 8, Temple Lane, Old City",
    areaId: "AREA-01",
    areaName: "Raipur Central",
    routeId: "ROUTE-A",
    routeName: "Route A - Sadar Bazaar",
    salesmanId: "user-salesman-01",
    salesmanName: "Rahul Kumar",
    creditLimit: 60000,
    openingBalance: 0,
    paymentTerms: "Net 15 Days",
    status: "ACTIVE",
    statusReason: "",
    notes: "",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-18T11:00:00Z").toISOString(),
    updatedAt: new Date("2026-08-18T11:00:00Z").toISOString()
  },
  {
    id: "cus-008",
    customerCode: "CUS-000008",
    shopName: "Malhotra Departmental Store",
    ownerName: "Karan Malhotra",
    mobile: "9876500008",
    alternateMobile: "9876500098",
    email: "malhotra.dept@gmail.com",
    address: "14 Shopping Arcade, Sector 5",
    areaId: "AREA-03",
    areaName: "Raipur East",
    routeId: "ROUTE-C",
    routeName: "Route C - G.T. Road",
    salesmanId: "user-salesmgr-01",
    salesmanName: "Vikas Malhotra",
    creditLimit: 300000,
    openingBalance: 110000,
    paymentTerms: "Net 30 Days",
    status: "ACTIVE",
    statusReason: "",
    notes: "High volume Nestlé distributor",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-20T09:30:00Z").toISOString(),
    updatedAt: new Date("2026-08-20T09:30:00Z").toISOString()
  },
  {
    id: "cus-009",
    customerCode: "CUS-000009",
    shopName: "Singla Retail Store",
    ownerName: "Pawan Singla",
    mobile: "9876500009",
    alternateMobile: "",
    email: "",
    address: "Near Post Office, Ring Road",
    areaId: "AREA-02",
    areaName: "Raipur North",
    routeId: "ROUTE-B",
    routeName: "Route B - Model Town",
    salesmanId: "user-salesman-01",
    salesmanName: "Rahul Kumar",
    creditLimit: 40000,
    openingBalance: 0,
    paymentTerms: "Cash on Delivery",
    status: "INACTIVE",
    statusReason: "Shop undergoing renovation",
    notes: "",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-22T15:20:00Z").toISOString(),
    updatedAt: new Date("2026-08-28T16:00:00Z").toISOString()
  },
  {
    id: "cus-010",
    customerCode: "CUS-000010",
    shopName: "Kapoor Bakers & FMCG",
    ownerName: "Deepak Kapoor",
    mobile: "9876500010",
    alternateMobile: "",
    email: "kapoorbakers@gmail.com",
    address: "Shop 22, Central Market",
    areaId: "AREA-01",
    areaName: "Raipur Central",
    routeId: "ROUTE-A",
    routeName: "Route A - Sadar Bazaar",
    salesmanId: "user-salesman-01",
    salesmanName: "Rahul Kumar",
    creditLimit: 90000,
    openingBalance: 22000,
    paymentTerms: "Net 15 Days",
    status: "ACTIVE",
    statusReason: "",
    notes: "",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-25T13:40:00Z").toISOString(),
    updatedAt: new Date("2026-08-25T13:40:00Z").toISOString()
  },
  {
    id: "cus-011",
    customerCode: "CUS-000011",
    shopName: "Devendra Nagar Supermart",
    ownerName: "Alok Jain",
    mobile: "9876500011",
    alternateMobile: "",
    email: "alok.supermart@gmail.com",
    address: "Sector 3, Main Boulevard, Devendra Nagar",
    areaId: "AREA-000005",
    areaName: "Devendra Nagar",
    routeId: "ROUTE-000006",
    routeName: "Devendra Nagar Route A - High Street",
    salesmanId: "SM-000005",
    salesmanName: "Arjun Sahu",
    creditLimit: 200000,
    openingBalance: 35000,
    paymentTerms: "Net 15 Days",
    status: "ACTIVE",
    statusReason: "",
    notes: "Key retail supermarket account",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-26T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-08-26T10:00:00Z").toISOString()
  },
  {
    id: "cus-012",
    customerCode: "CUS-000012",
    shopName: "Highway Dhaba & Provision",
    ownerName: "Harpreet Singh",
    mobile: "9876500012",
    alternateMobile: "",
    email: "",
    address: "NH-53, Tatibandh Bypass",
    areaId: "AREA-000004",
    areaName: "Tatibandh",
    routeId: "ROUTE-000005",
    routeName: "Tatibandh Route A - Industrial Beat",
    salesmanId: null,
    salesmanName: "Unassigned",
    creditLimit: 50000,
    openingBalance: 0,
    paymentTerms: "Cash on Delivery",
    status: "ACTIVE",
    statusReason: "",
    notes: "Newly onboarded outlet awaiting salesman beat assignment.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-27T11:00:00Z").toISOString(),
    updatedAt: new Date("2026-08-27T11:00:00Z").toISOString()
  }
];

let customerCounter = 13;

export const generateCustomerCode = () => {
  const code = `CUS-${String(customerCounter).padStart(6, "0")}`;
  customerCounter++;
  return code;
};

export const findCustomers = async ({
  page = 1,
  limit = 25,
  search = "",
  status = "",
  routeId = "",
  salesmanId = "",
  areaId = "",
  sortBy = "createdAt",
  sortOrder = "desc",
  scopedSalesmanId = null,
  unassignedOnly = false
}) => {
  let list = [...initialCustomers];

  // 1. Data Scope Enforcement (Salesman can ONLY see assigned outlets!)
  if (scopedSalesmanId) {
    list = list.filter((c) => 
      c.salesmanId === scopedSalesmanId || 
      (scopedSalesmanId === "user-salesman-01" && (c.salesmanId === "user-salesman-01" || c.salesmanId === "SM-000001"))
    );
  } else if (unassignedOnly) {
    list = list.filter((c) => !c.salesmanId || !c.routeId || c.salesmanId === "UNASSIGNED" || c.routeId === "UNASSIGNED" || c.salesmanId === "Unassigned");
  } else if (salesmanId) {
    if (salesmanId === "UNASSIGNED") {
      list = list.filter((c) => !c.salesmanId || c.salesmanId === "Unassigned");
    } else {
      list = list.filter((c) => c.salesmanId === salesmanId);
    }
  }

  // 2. Search Filter (shopName, ownerName, mobile, customerCode)
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (c) =>
        c.shopName.toLowerCase().includes(q) ||
        c.ownerName.toLowerCase().includes(q) ||
        c.customerCode.toLowerCase().includes(q) ||
        c.mobile.includes(q)
    );
  }

  // 3. Status Filter
  if (status && status !== "ALL") {
    list = list.filter((c) => c.status === status);
  }

  // 4. Route Filter
  if (routeId && routeId !== "ALL") {
    list = list.filter((c) => c.routeId === routeId);
  }

  // 5. Area Filter
  if (areaId && areaId !== "ALL") {
    list = list.filter((c) => c.areaId === areaId);
  }

  // 6. Sorting
  list.sort((a, b) => {
    let valA = a[sortBy] || "";
    let valB = b[sortBy] || "";
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (sortOrder === "asc") return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  // 7. Pagination
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

export const findCustomerById = async (id) => {
  return initialCustomers.find((c) => c.id === id || c.customerCode === id) || null;
};

export const findCustomerByMobile = async (mobile) => {
  return initialCustomers.find((c) => c.mobile === mobile.trim()) || null;
};

export const createCustomerRecord = async (customerData) => {
  const newId = `cus-${Date.now()}`;
  const code = generateCustomerCode();
  const now = new Date().toISOString();

  const newCustomer = {
    id: newId,
    customerCode: code,
    shopName: customerData.shopName.trim(),
    ownerName: (customerData.ownerName || "").trim(),
    mobile: customerData.mobile.trim(),
    alternateMobile: (customerData.alternateMobile || "").trim(),
    email: (customerData.email || "").trim(),
    address: customerData.address.trim(),
    areaId: customerData.areaId || "AREA-01",
    areaName: customerData.areaName || "Raipur Central",
    routeId: customerData.routeId || "ROUTE-A",
    routeName: customerData.routeName || "Route A - Main Market",
    salesmanId: customerData.salesmanId || "user-salesman-01",
    salesmanName: customerData.salesmanName || "Rahul Kumar",
    creditLimit: parseFloat(customerData.creditLimit) || 0,
    openingBalance: parseFloat(customerData.openingBalance) || 0,
    paymentTerms: customerData.paymentTerms || "Net 15 Days",
    status: customerData.status || "ACTIVE",
    statusReason: customerData.statusReason || "",
    notes: (customerData.notes || "").trim(),
    createdBy: customerData.createdBy || "system",
    updatedBy: customerData.updatedBy || "system",
    createdAt: now,
    updatedAt: now
  };

  initialCustomers.unshift(newCustomer);
  return newCustomer;
};

export const updateCustomerRecord = async (id, updateData) => {
  const index = initialCustomers.findIndex((c) => c.id === id || c.customerCode === id);
  if (index === -1) return null;

  const current = initialCustomers[index];
  const updated = {
    ...current,
    ...updateData,
    shopName: updateData.shopName ? updateData.shopName.trim() : current.shopName,
    ownerName: updateData.ownerName !== undefined ? updateData.ownerName.trim() : current.ownerName,
    mobile: updateData.mobile ? updateData.mobile.trim() : current.mobile,
    address: updateData.address ? updateData.address.trim() : current.address,
    creditLimit: updateData.creditLimit !== undefined ? parseFloat(updateData.creditLimit) : current.creditLimit,
    openingBalance: updateData.openingBalance !== undefined ? parseFloat(updateData.openingBalance) : current.openingBalance,
    updatedAt: new Date().toISOString()
  };

  initialCustomers[index] = updated;
  return updated;
};

export const updateCustomerStatusRecord = async (id, status, statusReason = "", updatedBy = "system") => {
  const index = initialCustomers.findIndex((c) => c.id === id || c.customerCode === id);
  if (index === -1) return null;

  initialCustomers[index].status = status;
  initialCustomers[index].statusReason = statusReason;
  initialCustomers[index].updatedBy = updatedBy;
  initialCustomers[index].updatedAt = new Date().toISOString();

  return initialCustomers[index];
};
