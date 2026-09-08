// Operational Route / Beat Master Repository (Clean Production Foundation)
let initialRoutes = [];
let routeCounter = 1;

export const generateRouteCode = () => {
  const code = `ROUTE-${String(routeCounter).padStart(6, "0")}`;
  routeCounter++;
  return code;
};

export const findRoutes = async ({
  page = 1,
  limit = 25,
  search = "",
  areaId = "",
  status = "",
  sortBy = "sequence",
  sortOrder = "asc"
}) => {
  let list = [...initialRoutes];

  // 1. Search Filter (routeName, routeCode, description)
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (r) =>
        r.routeName.toLowerCase().includes(q) ||
        r.routeCode.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q))
    );
  }

  // 2. Area Filter
  if (areaId && areaId !== "ALL") {
    list = list.filter((r) => r.areaId === areaId);
  }

  // 3. Status Filter
  if (status && status !== "ALL") {
    list = list.filter((r) => r.status === status);
  }

  // 4. Sorting
  list.sort((a, b) => {
    let valA = a[sortBy] !== undefined ? a[sortBy] : "";
    let valB = b[sortBy] !== undefined ? b[sortBy] : "";
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();
    if (sortOrder === "asc") return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  // 5. Pagination
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

export const findRouteById = async (id) => {
  return initialRoutes.find((r) => r.id === id || r.routeCode === id || r.id === `route-${id.toLowerCase()}`) || null;
};

export const findRouteByName = async (name) => {
  if (!name) return null;
  return initialRoutes.find((r) => r.routeName.toLowerCase() === name.trim().toLowerCase()) || null;
};

export const createRouteRecord = async (routeData) => {
  const newId = routeData.id || `route-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const code = generateRouteCode();
  const now = new Date().toISOString();

  const newRoute = {
    id: newId,
    routeCode: code,
    routeName: routeData.routeName.trim(),
    areaId: routeData.areaId.trim(),
    areaName: routeData.areaName || routeData.areaId,
    description: (routeData.description || "").trim(),
    visitDays: Array.isArray(routeData.visitDays) ? routeData.visitDays : ["Monday", "Wednesday", "Friday"],
    sequence: parseInt(routeData.sequence, 10) || initialRoutes.length + 1,
    status: routeData.status || "ACTIVE",
    createdBy: routeData.createdBy || "system",
    updatedBy: routeData.updatedBy || "system",
    createdAt: now,
    updatedAt: now
  };

  initialRoutes.push(newRoute);
  return newRoute;
};

export const updateRouteRecord = async (id, updateData) => {
  const index = initialRoutes.findIndex((r) => r.id === id || r.routeCode === id);
  if (index === -1) return null;

  const current = initialRoutes[index];
  const updated = {
    ...current,
    ...updateData,
    routeName: updateData.routeName ? updateData.routeName.trim() : current.routeName,
    areaId: updateData.areaId ? updateData.areaId.trim() : current.areaId,
    areaName: updateData.areaName || current.areaName,
    description: updateData.description !== undefined ? updateData.description.trim() : current.description,
    visitDays: updateData.visitDays ? (Array.isArray(updateData.visitDays) ? updateData.visitDays : [updateData.visitDays]) : current.visitDays,
    sequence: updateData.sequence !== undefined ? parseInt(updateData.sequence, 10) : current.sequence,
    updatedBy: updateData.updatedBy || "system",
    updatedAt: new Date().toISOString()
  };

  initialRoutes[index] = updated;
  return updated;
};

export const updateRouteStatusRecord = async (id, status, updatedBy = "system") => {
  const index = initialRoutes.findIndex((r) => r.id === id || r.routeCode === id);
  if (index === -1) return null;

  initialRoutes[index].status = status;
  initialRoutes[index].updatedBy = updatedBy;
  initialRoutes[index].updatedAt = new Date().toISOString();

  return initialRoutes[index];
};
