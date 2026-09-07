// Initial Seed Data for Product Master (20 realistic FMCG Products across Nestlé, Patanjali, & GSK)
let initialProducts = [
  // --- Nestlé ---
  {
    id: "prd-001",
    productCode: "PRD-000001",
    sku: "SKU-MAGGI-70",
    productName: "Maggi 2-Minute Masala Noodles 70g",
    companyId: "COMP-NESTLE",
    companyName: "Nestlé",
    category: "Noodles",
    subcategory: "Instant Noodles",
    unit: "PACK",
    packSize: "70g",
    mrp: 14,
    purchaseRate: 10.80,
    saleRate: 12.50,
    taxRate: 5,
    discount: 0,
    minimumStock: 100,
    batchTracking: true,
    expiryTracking: true,
    status: "ACTIVE",
    description: "Nestlé classic instant noodles with tastemaker seasoning.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-08-01T10:00:00Z").toISOString()
  },
  {
    id: "prd-002",
    productCode: "PRD-000002",
    sku: "SKU-MAGGI-SPM-70",
    productName: "Maggi Special Masala Noodles 70g",
    companyId: "COMP-NESTLE",
    companyName: "Nestlé",
    category: "Noodles",
    subcategory: "Spicy Noodles",
    unit: "PACK",
    packSize: "70g",
    mrp: 18,
    purchaseRate: 13.90,
    saleRate: 16.00,
    taxRate: 5,
    discount: 0,
    minimumStock: 80,
    batchTracking: true,
    expiryTracking: true,
    status: "ACTIVE",
    description: "Rich blend of 20 whole spices and herbs.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-02T10:30:00Z").toISOString(),
    updatedAt: new Date("2026-08-02T10:30:00Z").toISOString()
  },
  {
    id: "prd-003",
    productCode: "PRD-000003",
    sku: "SKU-KITKAT-38",
    productName: "KitKat 4-Finger Crisp Wafer 38.5g",
    companyId: "COMP-NESTLE",
    companyName: "Nestlé",
    category: "Confectionery",
    subcategory: "Chocolates",
    unit: "PCS",
    packSize: "38.5g Bar",
    mrp: 30,
    purchaseRate: 23.00,
    saleRate: 26.50,
    taxRate: 18,
    discount: 0,
    minimumStock: 50,
    batchTracking: true,
    expiryTracking: true,
    status: "ACTIVE",
    description: "Crisp wafer fingers covered with smooth milk chocolate.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-03T11:00:00Z").toISOString(),
    updatedAt: new Date("2026-08-03T11:00:00Z").toISOString()
  },
  {
    id: "prd-004",
    productCode: "PRD-000004",
    sku: "SKU-NESCAFE-50",
    productName: "Nescafé Classic Instant Coffee 50g Jar",
    companyId: "COMP-NESTLE",
    companyName: "Nestlé",
    category: "Beverages",
    subcategory: "Coffee",
    unit: "PCS",
    packSize: "50g Jar",
    mrp: 185,
    purchaseRate: 145.00,
    saleRate: 165.00,
    taxRate: 18,
    discount: 0,
    minimumStock: 30,
    batchTracking: true,
    expiryTracking: true,
    status: "ACTIVE",
    description: "100% pure instant coffee crafted with Robusta beans.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-04T12:00:00Z").toISOString(),
    updatedAt: new Date("2026-08-04T12:00:00Z").toISOString()
  },
  {
    id: "prd-005",
    productCode: "PRD-000005",
    sku: "SKU-SUNRISE-100",
    productName: "Nescafé Sunrise Coffee-Chicory 100g",
    companyId: "COMP-NESTLE",
    companyName: "Nestlé",
    category: "Beverages",
    subcategory: "Coffee",
    unit: "PACK",
    packSize: "100g Pouch",
    mrp: 140,
    purchaseRate: 110.00,
    saleRate: 125.00,
    taxRate: 18,
    discount: 0,
    minimumStock: 40,
    batchTracking: true,
    expiryTracking: true,
    status: "ACTIVE",
    description: "Blend of slow-roasted Arabica and Robusta coffee with chicory.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-05T09:15:00Z").toISOString(),
    updatedAt: new Date("2026-08-05T09:15:00Z").toISOString()
  },
  {
    id: "prd-006",
    productCode: "PRD-000006",
    sku: "SKU-EVERYDAY-200",
    productName: "Nestlé Everyday Dairy Whitener 200g",
    companyId: "COMP-NESTLE",
    companyName: "Nestlé",
    category: "Dairy",
    subcategory: "Milk Powder",
    unit: "PACK",
    packSize: "200g Pouch",
    mrp: 90,
    purchaseRate: 72.00,
    saleRate: 82.00,
    taxRate: 5,
    discount: 0,
    minimumStock: 50,
    batchTracking: true,
    expiryTracking: true,
    status: "ACTIVE",
    description: "Specialized dairy whitener for rich and creamy tea.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-06T14:20:00Z").toISOString(),
    updatedAt: new Date("2026-08-06T14:20:00Z").toISOString()
  },
  {
    id: "prd-007",
    productCode: "PRD-000007",
    sku: "SKU-MILKMAID-400",
    productName: "Nestlé Milkmaid Sweetened Condensed Milk 400g",
    companyId: "COMP-NESTLE",
    companyName: "Nestlé",
    category: "Dairy",
    subcategory: "Condensed Milk",
    unit: "PCS",
    packSize: "400g Tin",
    mrp: 145,
    purchaseRate: 118.00,
    saleRate: 132.00,
    taxRate: 12,
    discount: 0,
    minimumStock: 25,
    batchTracking: true,
    expiryTracking: true,
    status: "ACTIVE",
    description: "Sweetened condensed milk for festive Indian desserts and puddings.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-07T16:00:00Z").toISOString(),
    updatedAt: new Date("2026-08-07T16:00:00Z").toISOString()
  },

  // --- Patanjali ---
  {
    id: "prd-008",
    productCode: "PRD-000008",
    sku: "SKU-PAT-HONEY-250",
    productName: "Patanjali Pure Natural Honey 250g",
    companyId: "COMP-PATANJALI",
    companyName: "Patanjali",
    category: "Honey",
    subcategory: "Natural Honey",
    unit: "PCS",
    packSize: "250g Bottle",
    mrp: 115,
    purchaseRate: 88.00,
    saleRate: 102.00,
    taxRate: 5,
    discount: 0,
    minimumStock: 60,
    batchTracking: true,
    expiryTracking: true,
    status: "ACTIVE",
    description: "100% pure multifloral forest honey rich in antioxidants.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-08T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-08-08T10:00:00Z").toISOString()
  },
  {
    id: "prd-009",
    productCode: "PRD-000009",
    sku: "SKU-PAT-HONEY-500",
    productName: "Patanjali Pure Natural Honey 500g",
    companyId: "COMP-PATANJALI",
    companyName: "Patanjali",
    category: "Honey",
    subcategory: "Natural Honey",
    unit: "PCS",
    packSize: "500g Bottle",
    mrp: 220,
    purchaseRate: 170.00,
    saleRate: 195.00,
    taxRate: 5,
    discount: 0,
    minimumStock: 40,
    batchTracking: true,
    expiryTracking: true,
    status: "ACTIVE",
    description: "Patanjali natural honey value family jar.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-09T11:45:00Z").toISOString(),
    updatedAt: new Date("2026-08-09T11:45:00Z").toISOString()
  },
  {
    id: "prd-010",
    productCode: "PRD-000010",
    sku: "SKU-PAT-GHEE-1L",
    productName: "Patanjali Pure Cow Desi Ghee 1L",
    companyId: "COMP-PATANJALI",
    companyName: "Patanjali",
    category: "Dairy",
    subcategory: "Ghee",
    unit: "LTR",
    packSize: "1L Carton",
    mrp: 680,
    purchaseRate: 560.00,
    saleRate: 630.00,
    taxRate: 12,
    discount: 0,
    minimumStock: 30,
    batchTracking: true,
    expiryTracking: true,
    status: "ACTIVE",
    description: "Pure cow ghee made with traditional bilona churning methods.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-10T13:10:00Z").toISOString(),
    updatedAt: new Date("2026-08-10T13:10:00Z").toISOString()
  },
  {
    id: "prd-011",
    productCode: "PRD-000011",
    sku: "SKU-PAT-DANT-100",
    productName: "Patanjali Dant Kanti Ayurvedic Toothpaste 100g",
    companyId: "COMP-PATANJALI",
    companyName: "Patanjali",
    category: "Oral Care",
    subcategory: "Ayurvedic Toothpaste",
    unit: "PCS",
    packSize: "100g Tube",
    mrp: 60,
    purchaseRate: 45.00,
    saleRate: 53.00,
    taxRate: 18,
    discount: 0,
    minimumStock: 100,
    batchTracking: true,
    expiryTracking: true,
    status: "ACTIVE",
    description: "Ayurvedic dental cream with akarkara, neem, babool, and vajradanti.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-11T15:00:00Z").toISOString(),
    updatedAt: new Date("2026-08-11T15:00:00Z").toISOString()
  },
  {
    id: "prd-012",
    productCode: "PRD-000012",
    sku: "SKU-PAT-KESH-200",
    productName: "Patanjali Kesh Kanti Natural Hair Cleanser 200ml",
    companyId: "COMP-PATANJALI",
    companyName: "Patanjali",
    category: "Personal Care",
    subcategory: "Shampoo",
    unit: "PCS",
    packSize: "200ml Bottle",
    mrp: 110,
    purchaseRate: 82.00,
    saleRate: 98.00,
    taxRate: 18,
    discount: 0,
    minimumStock: 45,
    batchTracking: true,
    expiryTracking: true,
    status: "ACTIVE",
    description: "Herbal shampoo with bhringraj, heena, shikakai, and reetha.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-12T09:30:00Z").toISOString(),
    updatedAt: new Date("2026-08-12T09:30:00Z").toISOString()
  },
  {
    id: "prd-013",
    productCode: "PRD-000013",
    sku: "SKU-PAT-ALOE-150",
    productName: "Patanjali Soundarya Aloe Vera Gel 150ml",
    companyId: "COMP-PATANJALI",
    companyName: "Patanjali",
    category: "Personal Care",
    subcategory: "Skin Gel",
    unit: "PCS",
    packSize: "150ml Tube",
    mrp: 95,
    purchaseRate: 70.00,
    saleRate: 84.00,
    taxRate: 18,
    discount: 0,
    minimumStock: 50,
    batchTracking: true,
    expiryTracking: true,
    status: "ACTIVE",
    description: "Soothing natural aloe vera gel for face, skin, and acne care.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-13T11:20:00Z").toISOString(),
    updatedAt: new Date("2026-08-13T11:20:00Z").toISOString()
  },
  {
    id: "prd-014",
    productCode: "PRD-000014",
    sku: "SKU-PAT-BESAN-500",
    productName: "Patanjali Pure Chana Dal Besan 500g",
    companyId: "COMP-PATANJALI",
    companyName: "Patanjali",
    category: "Staples",
    subcategory: "Gram Flour",
    unit: "PACK",
    packSize: "500g Pouch",
    mrp: 65,
    purchaseRate: 49.00,
    saleRate: 57.00,
    taxRate: 5,
    discount: 0,
    minimumStock: 40,
    batchTracking: false,
    expiryTracking: true,
    status: "ACTIVE",
    description: "Unadulterated high-protein Bengal gram flour.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-14T14:10:00Z").toISOString(),
    updatedAt: new Date("2026-08-14T14:10:00Z").toISOString()
  },

  // --- GSK / Health ---
  {
    id: "prd-015",
    productCode: "PRD-000015",
    sku: "SKU-HORLICKS-500",
    productName: "Horlicks Classic Malt Nutrition Drink 500g Jar",
    companyId: "COMP-GSK",
    companyName: "GSK / Health",
    category: "Health Drinks",
    subcategory: "Malt Food",
    unit: "PCS",
    packSize: "500g Jar",
    mrp: 285,
    purchaseRate: 225.00,
    saleRate: 255.00,
    taxRate: 18,
    discount: 0,
    minimumStock: 35,
    batchTracking: true,
    expiryTracking: true,
    status: "ACTIVE",
    description: "Clinically proven malt-based nutritional health drink for growth.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-15T10:00:00Z").toISOString(),
    updatedAt: new Date("2026-08-15T10:00:00Z").toISOString()
  },
  {
    id: "prd-016",
    productCode: "PRD-000016",
    sku: "SKU-HORLICKS-CHOC-500",
    productName: "Horlicks Chocolate Delight 500g Refill",
    companyId: "COMP-GSK",
    companyName: "GSK / Health",
    category: "Health Drinks",
    subcategory: "Malt Food",
    unit: "PACK",
    packSize: "500g Refill",
    mrp: 265,
    purchaseRate: 210.00,
    saleRate: 238.00,
    taxRate: 18,
    discount: 0,
    minimumStock: 40,
    batchTracking: true,
    expiryTracking: true,
    status: "ACTIVE",
    description: "Delicious chocolate-flavoured nutritional drink packed with Bio-nutrients.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-16T12:30:00Z").toISOString(),
    updatedAt: new Date("2026-08-16T12:30:00Z").toISOString()
  },
  {
    id: "prd-017",
    productCode: "PRD-000017",
    sku: "SKU-BOOST-500",
    productName: "Boost Malt Energy Drink 500g Jar",
    companyId: "COMP-GSK",
    companyName: "GSK / Health",
    category: "Health Drinks",
    subcategory: "Energy Drink",
    unit: "PCS",
    packSize: "500g Jar",
    mrp: 290,
    purchaseRate: 230.00,
    saleRate: 260.00,
    taxRate: 18,
    discount: 0,
    minimumStock: 30,
    batchTracking: true,
    expiryTracking: true,
    status: "ACTIVE",
    description: "3X stamina nourishing malt-based health beverage formulation.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-17T14:45:00Z").toISOString(),
    updatedAt: new Date("2026-08-17T14:45:00Z").toISOString()
  },
  {
    id: "prd-018",
    productCode: "PRD-000018",
    sku: "SKU-SENS-RAPID-80",
    productName: "Sensodyne Rapid Relief Toothpaste 80g",
    companyId: "COMP-GSK",
    companyName: "GSK / Health",
    category: "Oral Care",
    subcategory: "Sensitive Toothpaste",
    unit: "PCS",
    packSize: "80g Tube",
    mrp: 190,
    purchaseRate: 150.00,
    saleRate: 172.00,
    taxRate: 18,
    discount: 0,
    minimumStock: 50,
    batchTracking: true,
    expiryTracking: true,
    status: "ACTIVE",
    description: "Fast-acting formulation proven to relieve tooth sensitivity within 60 seconds.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-18T16:20:00Z").toISOString(),
    updatedAt: new Date("2026-08-18T16:20:00Z").toISOString()
  },
  {
    id: "prd-019",
    productCode: "PRD-000019",
    sku: "SKU-SENS-MINT-75",
    productName: "Sensodyne Fresh Mint Sensitivity Toothpaste 75g",
    companyId: "COMP-GSK",
    companyName: "GSK / Health",
    category: "Oral Care",
    subcategory: "Sensitive Toothpaste",
    unit: "PCS",
    packSize: "75g Tube",
    mrp: 160,
    purchaseRate: 125.00,
    saleRate: 144.00,
    taxRate: 18,
    discount: 0,
    minimumStock: 50,
    batchTracking: true,
    expiryTracking: true,
    status: "ACTIVE",
    description: "24/7 sensitivity protection with long-lasting clean mint freshness.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-19T09:40:00Z").toISOString(),
    updatedAt: new Date("2026-08-19T09:40:00Z").toISOString()
  },
  {
    id: "prd-020",
    productCode: "PRD-000020",
    sku: "SKU-ENO-LEM-5G",
    productName: "Eno Fruit Salt Lemon Sachet 5g (Box of 30)",
    companyId: "COMP-GSK",
    companyName: "GSK / Health",
    category: "Health Drinks",
    subcategory: "Antacid",
    unit: "PACK",
    packSize: "Box (30 Sachets)",
    mrp: 300,
    purchaseRate: 240.00,
    saleRate: 270.00,
    taxRate: 12,
    discount: 0,
    minimumStock: 20,
    batchTracking: true,
    expiryTracking: true,
    status: "INACTIVE",
    description: "Temporary inactive line: sparkling antacid powder for rapid acidity relief.",
    createdBy: "system",
    updatedBy: "system",
    createdAt: new Date("2026-08-20T11:00:00Z").toISOString(),
    updatedAt: new Date("2026-08-20T11:00:00Z").toISOString()
  }
];

let productCounter = 21;

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
