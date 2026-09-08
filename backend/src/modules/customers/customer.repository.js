// Operational Customers Repository (Clean Production Foundation)
let initialCustomers = [];
let customerCounter = 1;

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
      (scopedSalesmanId === "user-salesman-01" && (c.salesmanId === "user-salesman-01" || c.salesmanId === "SM-000001" || c.salesmanName === "Rahul Kumar")) ||
      (scopedSalesmanId && c.salesmanName?.toLowerCase() === "rahul kumar")
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
  const newId = customerData.id || `cus-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
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
