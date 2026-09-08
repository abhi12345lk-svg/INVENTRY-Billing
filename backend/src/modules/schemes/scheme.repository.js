// FMCG Scheme & Trade Promotion Master Repository
let schemeCounter = 6;

let initialSchemes = [
  {
    id: "scheme-001",
    schemeCode: "SCH-0001",
    schemeName: "Maggi 12+1 Carton Deal",
    schemeType: "QUANTITY_FREE",
    targetBrand: "Nestle",
    applicableCategory: "Instant Noodles",
    minQuantity: 12,
    freeQuantity: 1,
    discountPercent: 0,
    minOrderValue: 0,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    status: "ACTIVE",
    description: "Buy 12 cartons of Maggi Noodles, get 1 carton free. Applies automatically on billing.",
    createdBy: "Rajesh Sharma (SUPER_ADMIN)",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "scheme-002",
    schemeCode: "SCH-0002",
    schemeName: "Parle-G Wholesale Cash Slab",
    schemeType: "PERCENTAGE_DISCOUNT",
    targetBrand: "Parle",
    applicableCategory: "Biscuits",
    minQuantity: 1,
    freeQuantity: 0,
    discountPercent: 4.5,
    minOrderValue: 5000,
    startDate: "2026-02-01",
    endDate: "2026-12-31",
    status: "ACTIVE",
    description: "4.5% instant cash discount on Parle biscuits for order value above ₹5,000.",
    createdBy: "Rajesh Sharma (SUPER_ADMIN)",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "scheme-003",
    schemeCode: "SCH-0003",
    schemeName: "Patanjali Special Festive Slab",
    schemeType: "SLAB_DISCOUNT",
    targetBrand: "Patanjali",
    applicableCategory: "Ayurvedic & Daily Essentials",
    minQuantity: 1,
    freeQuantity: 0,
    discountPercent: 6.0,
    minOrderValue: 12000,
    startDate: "2026-01-15",
    endDate: "2026-11-30",
    status: "ACTIVE",
    description: "6.0% invoice trade discount for total order value exceeding ₹12,000.",
    createdBy: "Rajesh Sharma (SUPER_ADMIN)",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "scheme-004",
    schemeCode: "SCH-0004",
    schemeName: "Fortune Oil Bulk Incentive",
    schemeType: "PERCENTAGE_DISCOUNT",
    targetBrand: "Fortune",
    applicableCategory: "Edible Oil",
    minQuantity: 20,
    freeQuantity: 0,
    discountPercent: 3.0,
    minOrderValue: 8000,
    startDate: "2026-03-01",
    endDate: "2026-10-31",
    status: "ACTIVE",
    description: "3% discount on ordering 20+ tins of Fortune Refined Sunflower/Mustard Oil.",
    createdBy: "Rajesh Sharma (SUPER_ADMIN)",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "scheme-005",
    schemeCode: "SCH-0005",
    schemeName: "Amul Butter Monsoon Bonanza",
    schemeType: "QUANTITY_FREE",
    targetBrand: "Amul",
    applicableCategory: "Dairy & Butter",
    minQuantity: 24,
    freeQuantity: 2,
    discountPercent: 0,
    minOrderValue: 0,
    startDate: "2026-06-01",
    endDate: "2026-12-31",
    status: "ACTIVE",
    description: "Order 24 units of Amul Butter 500g and receive 2 complimentary promotional units.",
    createdBy: "Rajesh Sharma (SUPER_ADMIN)",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const generateSchemeCode = () => {
  const code = `SCH-${String(schemeCounter).padStart(4, "0")}`;
  schemeCounter++;
  return code;
};

export const findSchemes = async ({
  page = 1,
  limit = 25,
  search = "",
  status = "",
  type = "",
  brand = "",
  sortBy = "createdAt",
  sortOrder = "desc"
} = {}) => {
  let list = [...initialSchemes];

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (s) =>
        s.schemeName.toLowerCase().includes(q) ||
        s.schemeCode.toLowerCase().includes(q) ||
        (s.targetBrand && s.targetBrand.toLowerCase().includes(q)) ||
        (s.description && s.description.toLowerCase().includes(q))
    );
  }

  if (status && status !== "ALL") {
    list = list.filter((s) => s.status === status);
  }

  if (type && type !== "ALL") {
    list = list.filter((s) => s.schemeType === type);
  }

  if (brand && brand !== "ALL") {
    list = list.filter((s) => s.targetBrand.toLowerCase() === brand.toLowerCase());
  }

  list.sort((a, b) => {
    let valA = a[sortBy] !== undefined ? a[sortBy] : "";
    let valB = b[sortBy] !== undefined ? b[sortBy] : "";
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();
    if (sortOrder === "asc") return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

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

export const findSchemeById = async (id) => {
  return initialSchemes.find((s) => s.id === id || s.schemeCode === id) || null;
};

export const createSchemeRecord = async (data, user) => {
  const schemeCode = generateSchemeCode();
  const id = `scheme-${Date.now()}`;
  const newScheme = {
    id,
    schemeCode,
    schemeName: data.schemeName.trim(),
    schemeType: data.schemeType || "PERCENTAGE_DISCOUNT",
    targetBrand: data.targetBrand || "All Brands",
    applicableCategory: data.applicableCategory || "General FMCG",
    minQuantity: Number(data.minQuantity) || 1,
    freeQuantity: Number(data.freeQuantity) || 0,
    discountPercent: Number(data.discountPercent) || 0,
    minOrderValue: Number(data.minOrderValue) || 0,
    startDate: data.startDate || new Date().toISOString().slice(0, 10),
    endDate: data.endDate || "2026-12-31",
    status: data.status || "ACTIVE",
    description: data.description || "",
    createdBy: `${user.name} (${user.role})`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  initialSchemes.unshift(newScheme);
  return newScheme;
};

export const updateSchemeRecord = async (id, data, user) => {
  const index = initialSchemes.findIndex((s) => s.id === id || s.schemeCode === id);
  if (index === -1) return null;

  initialSchemes[index] = {
    ...initialSchemes[index],
    ...data,
    updatedBy: `${user.name} (${user.role})`,
    updatedAt: new Date().toISOString()
  };

  return initialSchemes[index];
};

export const toggleSchemeStatusRecord = async (id, user) => {
  const index = initialSchemes.findIndex((s) => s.id === id || s.schemeCode === id);
  if (index === -1) return null;

  const current = initialSchemes[index];
  const newStatus = current.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  initialSchemes[index] = {
    ...current,
    status: newStatus,
    updatedBy: `${user.name} (${user.role})`,
    updatedAt: new Date().toISOString()
  };

  return initialSchemes[index];
};

export const deleteSchemeRecord = async (id) => {
  const index = initialSchemes.findIndex((s) => s.id === id || s.schemeCode === id);
  if (index === -1) return false;
  initialSchemes.splice(index, 1);
  return true;
};
