// Initial Seed Data for Area Master (5 Primary Territories in Raipur)
let initialAreas = [
  {
    id: "area-001",
    areaCode: "AREA-000001",
    areaName: "Raipur Central",
    description: "Main commercial market, Sadar Bazaar & wholesale FMCG trading hub.",
    status: "ACTIVE",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-07-01T08:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-01T08:00:00Z").toISOString()
  },
  {
    id: "area-002",
    areaCode: "AREA-000002",
    areaName: "Raipur West",
    description: "G.T. Road, Model Town & residential grocery outlet clusters.",
    status: "ACTIVE",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-07-01T08:30:00Z").toISOString(),
    updatedAt: new Date("2026-07-01T08:30:00Z").toISOString()
  },
  {
    id: "area-003",
    areaCode: "AREA-000003",
    areaName: "Raipur East",
    description: "Railway Station Road, Telibandha & outer township corridors.",
    status: "ACTIVE",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-07-01T09:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-01T09:00:00Z").toISOString()
  },
  {
    id: "area-004",
    areaCode: "AREA-000004",
    areaName: "Tatibandh",
    description: "Industrial warehouse logistics zone & national highway junction.",
    status: "ACTIVE",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-07-01T09:30:00Z").toISOString(),
    updatedAt: new Date("2026-07-01T09:30:00Z").toISOString()
  },
  {
    id: "area-005",
    areaCode: "AREA-000005",
    areaName: "Devendra Nagar",
    description: "High-density retail avenues, modern supermarkets & convenience stores.",
    status: "ACTIVE",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-07-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-07-01T10:00:00Z").toISOString()
  }
];

let areaCounter = 6;

export const generateAreaCode = () => {
  const code = `AREA-${String(areaCounter).padStart(6, "0")}`;
  areaCounter++;
  return code;
};

export const findAreas = async ({
  page = 1,
  limit = 25,
  search = "",
  status = "",
  sortBy = "createdAt",
  sortOrder = "desc"
}) => {
  let list = [...initialAreas];

  // 1. Search Filter (areaName, areaCode)
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (a) =>
        a.areaName.toLowerCase().includes(q) ||
        a.areaCode.toLowerCase().includes(q) ||
        (a.description && a.description.toLowerCase().includes(q))
    );
  }

  // 2. Status Filter
  if (status && status !== "ALL") {
    list = list.filter((a) => a.status === status);
  }

  // 3. Sorting
  list.sort((a, b) => {
    let valA = a[sortBy] !== undefined ? a[sortBy] : "";
    let valB = b[sortBy] !== undefined ? b[sortBy] : "";
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();
    if (sortOrder === "asc") return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  // 4. Pagination
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

export const findAreaById = async (id) => {
  return initialAreas.find((a) => a.id === id || a.areaCode === id) || null;
};

export const findAreaByName = async (name) => {
  if (!name) return null;
  return initialAreas.find((a) => a.areaName.toLowerCase() === name.trim().toLowerCase()) || null;
};

export const createAreaRecord = async (areaData) => {
  const newId = `area-${Date.now()}`;
  const code = generateAreaCode();
  const now = new Date().toISOString();

  const newArea = {
    id: newId,
    areaCode: code,
    areaName: areaData.areaName.trim(),
    description: (areaData.description || "").trim(),
    status: areaData.status || "ACTIVE",
    createdBy: areaData.createdBy || "system",
    updatedBy: areaData.updatedBy || "system",
    createdAt: now,
    updatedAt: now
  };

  initialAreas.unshift(newArea);
  return newArea;
};

export const updateAreaRecord = async (id, updateData) => {
  const index = initialAreas.findIndex((a) => a.id === id || a.areaCode === id);
  if (index === -1) return null;

  const current = initialAreas[index];
  const updated = {
    ...current,
    ...updateData,
    areaName: updateData.areaName ? updateData.areaName.trim() : current.areaName,
    description: updateData.description !== undefined ? updateData.description.trim() : current.description,
    updatedBy: updateData.updatedBy || "system",
    updatedAt: new Date().toISOString()
  };

  initialAreas[index] = updated;
  return updated;
};

export const updateAreaStatusRecord = async (id, status, updatedBy = "system") => {
  const index = initialAreas.findIndex((a) => a.id === id || a.areaCode === id);
  if (index === -1) return null;

  initialAreas[index].status = status;
  initialAreas[index].updatedBy = updatedBy;
  initialAreas[index].updatedAt = new Date().toISOString();

  return initialAreas[index];
};
