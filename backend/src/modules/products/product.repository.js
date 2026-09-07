// Operational Product Master Repository (Clean Production Foundation)
let initialProducts = [];
let productCounter = 1;

export const generateProductCode = () => {
  const code = `PRD-${String(productCounter).padStart(6, "0")}`;
  productCounter++;
  return code;
};

export const findProducts = async ({
  page = 1,
  limit = 25,
  search = "",
  companyId = "",
  category = "",
  status = "",
  sortBy = "createdAt",
  sortOrder = "desc"
}) => {
  let list = [...initialProducts];

  // 1. Search Filter (productName, sku, productCode)
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.productName.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.productCode.toLowerCase().includes(q)
    );
  }

  // 2. Company Filter
  if (companyId && companyId !== "ALL") {
    list = list.filter((p) => p.companyId === companyId);
  }

  // 3. Category Filter
  if (category && category !== "ALL") {
    list = list.filter((p) => p.category === category);
  }

  // 4. Status Filter
  if (status && status !== "ALL") {
    list = list.filter((p) => p.status === status);
  }

  // 5. Sorting
  list.sort((a, b) => {
    let valA = a[sortBy] !== undefined ? a[sortBy] : "";
    let valB = b[sortBy] !== undefined ? b[sortBy] : "";
    
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (sortOrder === "asc") return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  // 6. Pagination
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

export const findActiveProducts = async () => {
  return initialProducts
    .filter((p) => p.status === "ACTIVE")
    .map((p) => ({
      id: p.id,
      productId: p.id,
      productCode: p.productCode,
      productName: p.productName,
      sku: p.sku,
      companyId: p.companyId,
      company: p.companyName,
      category: p.category,
      unit: p.unit,
      packSize: p.packSize,
      mrp: p.mrp,
      saleRate: p.saleRate,
      taxRate: p.taxRate,
      batchTracking: p.batchTracking,
      expiryTracking: p.expiryTracking
    }));
};

export const findProductById = async (id) => {
  return initialProducts.find((p) => p.id === id || p.productCode === id) || null;
};

export const findProductBySku = async (sku) => {
  if (!sku) return null;
  return initialProducts.find((p) => p.sku.toUpperCase() === sku.trim().toUpperCase()) || null;
};

export const findProductByCode = async (productCode) => {
  if (!productCode) return null;
  return initialProducts.find((p) => p.productCode === productCode.trim()) || null;
};

export const createProductRecord = async (productData) => {
  const newId = `prd-${Date.now()}`;
  const code = generateProductCode();
  const now = new Date().toISOString();

  // Map companyId to standard display name
  const companyNameMap = {
    "COMP-NESTLE": "Nestlé",
    "COMP-PATANJALI": "Patanjali",
    "COMP-GSK": "GSK / Health"
  };
  const companyName = productData.companyName || companyNameMap[productData.companyId] || productData.companyId;

  const newProduct = {
    id: newId,
    productCode: code,
    sku: productData.sku.trim().toUpperCase(),
    productName: productData.productName.trim(),
    companyId: productData.companyId.trim(),
    companyName: companyName,
    category: productData.category.trim(),
    subcategory: (productData.subcategory || "").trim(),
    unit: productData.unit || "PCS",
    packSize: (productData.packSize || "").trim(),
    mrp: parseFloat(productData.mrp) || 0,
    purchaseRate: parseFloat(productData.purchaseRate) || 0,
    saleRate: parseFloat(productData.saleRate) || 0,
    taxRate: parseFloat(productData.taxRate) !== undefined ? parseFloat(productData.taxRate) : 5,
    discount: parseFloat(productData.discount) || 0,
    minimumStock: parseInt(productData.minimumStock, 10) || 10,
    batchTracking: Boolean(productData.batchTracking),
    expiryTracking: Boolean(productData.expiryTracking),
    status: productData.status || "ACTIVE",
    description: (productData.description || "").trim(),
    createdBy: productData.createdBy || "system",
    updatedBy: productData.updatedBy || "system",
    createdAt: now,
    updatedAt: now
  };

  initialProducts.unshift(newProduct);
  return newProduct;
};

export const updateProductRecord = async (id, updateData) => {
  const index = initialProducts.findIndex((p) => p.id === id || p.productCode === id);
  if (index === -1) return null;

  const current = initialProducts[index];

  const companyNameMap = {
    "COMP-NESTLE": "Nestlé",
    "COMP-PATANJALI": "Patanjali",
    "COMP-GSK": "GSK / Health"
  };
  const targetCompanyId = updateData.companyId ? updateData.companyId.trim() : current.companyId;
  const companyName = updateData.companyName || companyNameMap[targetCompanyId] || current.companyName;

  const updated = {
    ...current,
    ...updateData,
    sku: updateData.sku ? updateData.sku.trim().toUpperCase() : current.sku,
    productName: updateData.productName ? updateData.productName.trim() : current.productName,
    companyId: targetCompanyId,
    companyName: companyName,
    category: updateData.category ? updateData.category.trim() : current.category,
    subcategory: updateData.subcategory !== undefined ? updateData.subcategory.trim() : current.subcategory,
    unit: updateData.unit || current.unit,
    packSize: updateData.packSize !== undefined ? updateData.packSize.trim() : current.packSize,
    mrp: updateData.mrp !== undefined ? parseFloat(updateData.mrp) : current.mrp,
    purchaseRate: updateData.purchaseRate !== undefined ? parseFloat(updateData.purchaseRate) : current.purchaseRate,
    saleRate: updateData.saleRate !== undefined ? parseFloat(updateData.saleRate) : current.saleRate,
    taxRate: updateData.taxRate !== undefined ? parseFloat(updateData.taxRate) : current.taxRate,
    discount: updateData.discount !== undefined ? parseFloat(updateData.discount) : current.discount,
    minimumStock: updateData.minimumStock !== undefined ? parseInt(updateData.minimumStock, 10) : current.minimumStock,
    batchTracking: updateData.batchTracking !== undefined ? Boolean(updateData.batchTracking) : current.batchTracking,
    expiryTracking: updateData.expiryTracking !== undefined ? Boolean(updateData.expiryTracking) : current.expiryTracking,
    description: updateData.description !== undefined ? updateData.description.trim() : current.description,
    updatedBy: updateData.updatedBy || "system",
    updatedAt: new Date().toISOString()
  };

  initialProducts[index] = updated;
  return updated;
};

export const updateProductStatusRecord = async (id, status, updatedBy = "system") => {
  const index = initialProducts.findIndex((p) => p.id === id || p.productCode === id);
  if (index === -1) return null;

  initialProducts[index].status = status;
  initialProducts[index].updatedBy = updatedBy;
  initialProducts[index].updatedAt = new Date().toISOString();

  return initialProducts[index];
};
