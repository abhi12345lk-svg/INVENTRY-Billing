// Initial Seed Data for Salesmen Master (6 Real FMCG Sales Representatives)
let initialSalesmen = [
  {
    id: "sm-001",
    salesmanCode: "SM-000001",
    userId: "user-salesman-01", // Linked to existing demo salesman account (Rahul Kumar)
    employeeCode: "EMP-101",
    name: "Rahul Kumar",
    mobile: "9876543213",
    email: "salesman@distributorerp.com",
    joiningDate: "2024-01-15",
    status: "ACTIVE",
    notes: "Senior field representative handling high-volume Raipur Central markets.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-07-01T08:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-01T08:00:00Z").toISOString()
  },
  {
    id: "sm-002",
    salesmanCode: "SM-000002",
    userId: null,
    employeeCode: "EMP-102",
    name: "Suresh Yadav",
    mobile: "9876543220",
    email: "suresh.yadav@chiragcombines.com",
    joiningDate: "2024-03-01",
    status: "ACTIVE",
    notes: "Assigned to Raipur West highway beat and confectionery outlets.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-07-01T08:30:00Z").toISOString(),
    updatedAt: new Date("2026-07-01T08:30:00Z").toISOString()
  },
  {
    id: "sm-003",
    salesmanCode: "SM-000003",
    userId: null,
    employeeCode: "EMP-103",
    name: "Manish Patel",
    mobile: "9876543221",
    email: "manish.patel@chiragcombines.com",
    joiningDate: "2024-06-10",
    status: "ACTIVE",
    notes: "East sector corridor specialist covering supermarkets and grocery chains.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-07-01T09:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-01T09:00:00Z").toISOString()
  },
  {
    id: "sm-004",
    salesmanCode: "SM-000004",
    userId: null,
    employeeCode: "EMP-104",
    name: "Deepak Verma",
    mobile: "9876543222",
    email: "deepak.verma@chiragcombines.com",
    joiningDate: "2024-09-01",
    status: "ACTIVE",
    notes: "Industrial logistics belt rep for bulk beverage and instant foods supply.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-07-01T09:30:00Z").toISOString(),
    updatedAt: new Date("2026-07-01T09:30:00Z").toISOString()
  },
  {
    id: "sm-005",
    salesmanCode: "SM-000005",
    userId: null,
    employeeCode: "EMP-105",
    name: "Arjun Sahu",
    mobile: "9876543223",
    email: "arjun.sahu@chiragcombines.com",
    joiningDate: "2025-01-10",
    status: "ACTIVE",
    notes: "Devendra Nagar modern trade and chemist/cosmetics network specialist.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-07-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-01T10:00:00Z").toISOString()
  },
  {
    id: "sm-006",
    salesmanCode: "SM-000006",
    userId: null,
    employeeCode: "EMP-106",
    name: "Ravi Sharma",
    mobile: "9876543224",
    email: "ravi.sharma@chiragcombines.com",
    joiningDate: "2025-04-01",
    status: "ACTIVE",
    notes: "Reserve sales executive for emergency route coverage and seasonal surges.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-07-01T10:30:00Z").toISOString(),
    updatedAt: new Date("2026-07-01T10:30:00Z").toISOString()
  }
];

// Initial Route Assignments
let initialRouteAssignments = [
  {
    id: "sra-001",
    salesmanId: "SM-000001", // Rahul Kumar
    routeId: "ROUTE-000001", // Central Route A
    areaId: "AREA-000001",
    effectiveFrom: "2026-07-01T00:00:00.000Z",
    effectiveTo: null,
    status: "ACTIVE",
    assignedBy: "system",
    reason: "Primary Route Allocation",
    createdAt: "2026-07-01T08:00:00.000Z",
    updatedAt: "2026-07-01T08:00:00.000Z"
  },
  {
    id: "sra-002",
    salesmanId: "SM-000001", // Rahul Kumar
    routeId: "ROUTE-000002", // Central Route B
    areaId: "AREA-000001",
    effectiveFrom: "2026-07-01T00:00:00.000Z",
    effectiveTo: null,
    status: "ACTIVE",
    assignedBy: "system",
    reason: "Secondary Beat Allocation",
    createdAt: "2026-07-01T08:00:00.000Z",
    updatedAt: "2026-07-01T08:00:00.000Z"
  },
  {
    id: "sra-003",
    salesmanId: "SM-000002", // Suresh Yadav
    routeId: "ROUTE-000003", // West Route A
    areaId: "AREA-000002",
    effectiveFrom: "2026-07-01T00:00:00.000Z",
    effectiveTo: null,
    status: "ACTIVE",
    assignedBy: "system",
    reason: "Highway Territory Assignment",
    createdAt: "2026-07-01T08:30:00.000Z",
    updatedAt: "2026-07-01T08:30:00.000Z"
  },
  {
    id: "sra-004",
    salesmanId: "SM-000003", // Manish Patel
    routeId: "ROUTE-000004", // East Route A
    areaId: "AREA-000003",
    effectiveFrom: "2026-07-01T00:00:00.000Z",
    effectiveTo: null,
    status: "ACTIVE",
    assignedBy: "system",
    reason: "East Route Allocation",
    createdAt: "2026-07-01T09:00:00.000Z",
    updatedAt: "2026-07-01T09:00:00.000Z"
  },
  {
    id: "sra-005",
    salesmanId: "SM-000004", // Deepak Verma
    routeId: "ROUTE-000005", // Tatibandh Route A
    areaId: "AREA-000004",
    effectiveFrom: "2026-07-01T00:00:00.000Z",
    effectiveTo: null,
    status: "ACTIVE",
    assignedBy: "system",
    reason: "Industrial Area Allocation",
    createdAt: "2026-07-01T09:30:00.000Z",
    updatedAt: "2026-07-01T09:30:00.000Z"
  },
  {
    id: "sra-006",
    salesmanId: "SM-000005", // Arjun Sahu
    routeId: "ROUTE-000006", // Devendra Nagar Route A
    areaId: "AREA-000005",
    effectiveFrom: "2026-07-01T00:00:00.000Z",
    effectiveTo: null,
    status: "ACTIVE",
    assignedBy: "system",
    reason: "Devendra Nagar Modern Trade Allocation",
    createdAt: "2026-07-01T10:00:00.000Z",
    updatedAt: "2026-07-01T10:00:00.000Z"
  }
];

let salesmanCounter = 7;

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
  const newId = `sm-${Date.now()}`;
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
    id: `sra-${Date.now()}`,
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
