// Operational Salesmen Master Repository (Clean Production Foundation)
let initialSalesmen = [];
let initialRouteAssignments = [];
let salesmanCounter = 1;

export const generateSalesmanCode = () => {
  const code = `SM-${String(salesmanCounter).padStart(6, "0")}`;
  salesmanCounter++;
  return code;
};

export const findSalesmen = async ({
  page = 1,
  limit = 25,
  search = "",
  status = "",
  sortBy = "salesmanCode",
  sortOrder = "asc"
}) => {
  let list = [...initialSalesmen];

  // 1. Search Filter
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.salesmanCode.toLowerCase().includes(q) ||
        s.employeeCode.toLowerCase().includes(q) ||
        s.mobile.includes(q) ||
        (s.email && s.email.toLowerCase().includes(q))
    );
  }

  // 2. Status Filter
  if (status && status !== "ALL") {
    list = list.filter((s) => s.status === status);
  }

  // Attach assigned routes info to each salesman
  const enrichedList = list.map((s) => {
    const assignedRouteIds = initialRouteAssignments
      .filter((a) => (a.salesmanId === s.salesmanCode || a.salesmanId === s.id || a.salesmanId === s.userId) && a.status === "ACTIVE")
      .map((a) => a.routeId);
    return {
      ...s,
      assignedRouteIds,
      assignedRoutesCount: assignedRouteIds.length
    };
  });

  // 3. Sorting
  enrichedList.sort((a, b) => {
    let valA = a[sortBy] !== undefined ? a[sortBy] : "";
    let valB = b[sortBy] !== undefined ? b[sortBy] : "";
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();
    if (sortOrder === "asc") return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  // 4. Pagination
  const total = enrichedList.length;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const totalPages = Math.ceil(total / limitNum) || 1;
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedData = enrichedList.slice(startIndex, startIndex + limitNum);

  return {
    data: paginatedData,
    page: pageNum,
    limit: limitNum,
    total,
    totalPages
  };
};

export const findSalesmanById = async (id) => {
  const salesman = initialSalesmen.find(
    (s) => s.id === id || s.salesmanCode === id || s.userId === id || s.employeeCode === id
  );
  if (!salesman) return null;

  const routes = initialRouteAssignments
    .filter((a) => (a.salesmanId === salesman.salesmanCode || a.salesmanId === salesman.id || a.salesmanId === salesman.userId) && a.status === "ACTIVE")
    .map((a) => a.routeId);

  return {
    ...salesman,
    assignedRouteIds: routes,
    assignedRoutesCount: routes.length
  };
};

export const findSalesmanByMobile = async (mobile) => {
  if (!mobile) return null;
  return initialSalesmen.find((s) => s.mobile === mobile.trim()) || null;
};

export const findSalesmanByEmployeeCode = async (employeeCode) => {
  if (!employeeCode) return null;
  return initialSalesmen.find((s) => s.employeeCode.toUpperCase() === employeeCode.trim().toUpperCase()) || null;
};

export const createSalesmanRecord = async (salesmanData) => {
  const newId = salesmanData.id || `sm-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const code = generateSalesmanCode();
  const now = new Date().toISOString();

  const newSalesman = {
    id: newId,
    salesmanCode: code,
    userId: salesmanData.userId || null,
    employeeCode: salesmanData.employeeCode.trim().toUpperCase(),
    name: salesmanData.name.trim(),
    mobile: salesmanData.mobile.trim(),
    email: (salesmanData.email || "").trim().toLowerCase(),
    joiningDate: salesmanData.joiningDate || now.split("T")[0],
    status: salesmanData.status || "ACTIVE",
    notes: (salesmanData.notes || "").trim(),
    createdBy: salesmanData.createdBy || "system",
    updatedBy: salesmanData.updatedBy || "system",
    createdAt: now,
    updatedAt: now
  };

  initialSalesmen.push(newSalesman);
  return newSalesman;
};

export const updateSalesmanRecord = async (id, updateData) => {
  const index = initialSalesmen.findIndex(
    (s) => s.id === id || s.salesmanCode === id || s.employeeCode === id
  );
  if (index === -1) return null;

  const current = initialSalesmen[index];
  const updated = {
    ...current,
    ...updateData,
    name: updateData.name ? updateData.name.trim() : current.name,
    mobile: updateData.mobile ? updateData.mobile.trim() : current.mobile,
    email: updateData.email !== undefined ? updateData.email.trim().toLowerCase() : current.email,
    employeeCode: updateData.employeeCode ? updateData.employeeCode.trim().toUpperCase() : current.employeeCode,
    notes: updateData.notes !== undefined ? updateData.notes.trim() : current.notes,
    updatedBy: updateData.updatedBy || "system",
    updatedAt: new Date().toISOString()
  };

  initialSalesmen[index] = updated;
  return updated;
};

export const updateSalesmanStatusRecord = async (id, status, updatedBy = "system") => {
  const index = initialSalesmen.findIndex((s) => s.id === id || s.salesmanCode === id);
  if (index === -1) return null;

  initialSalesmen[index].status = status;
  initialSalesmen[index].updatedBy = updatedBy;
  initialSalesmen[index].updatedAt = new Date().toISOString();

  return initialSalesmen[index];
};

// Route Assignment Operations
export const getSalesmanRouteAssignments = async (salesmanIdentifier) => {
  const sm = await findSalesmanById(salesmanIdentifier);
  if (!sm) return [];

  return initialRouteAssignments.filter(
    (a) => (a.salesmanId === sm.salesmanCode || a.salesmanId === sm.id || a.salesmanId === sm.userId)
  );
};

export const assignRouteRecord = async ({ salesmanId, routeId, areaId, assignedBy, reason }) => {
  const now = new Date().toISOString();

  // Check if active assignment already exists
  const existingActive = initialRouteAssignments.find(
    (a) => a.salesmanId === salesmanId && a.routeId === routeId && a.status === "ACTIVE"
  );
  if (existingActive) return existingActive;

  const newAssignment = {
    id: `sra-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    salesmanId,
    routeId,
    areaId,
    effectiveFrom: now,
    effectiveTo: null,
    status: "ACTIVE",
    assignedBy: assignedBy || "system",
    reason: reason || "Route Beat Assignment",
    createdAt: now,
    updatedAt: now
  };

  initialRouteAssignments.push(newAssignment);
  return newAssignment;
};

export const unassignRouteRecord = async ({ salesmanId, routeId, reason }) => {
  const index = initialRouteAssignments.findIndex(
    (a) => (a.salesmanId === salesmanId) && a.routeId === routeId && a.status === "ACTIVE"
  );
  if (index === -1) return null;

  const now = new Date().toISOString();
  initialRouteAssignments[index].status = "INACTIVE";
  initialRouteAssignments[index].effectiveTo = now;
  initialRouteAssignments[index].reason = reason || "Reassigned / Beat Adjusted";
  initialRouteAssignments[index].updatedAt = now;

  return initialRouteAssignments[index];
};
