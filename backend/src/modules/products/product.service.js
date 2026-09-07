import {
  findProducts,
  findActiveProducts,
  findProductById,
  createProductRecord,
  updateProductRecord,
  updateProductStatusRecord
} from "./product.repository.js";
import { validateCreateProduct, validateUpdateProduct } from "./product.validator.js";

export const getProductsService = async (queryParams, user) => {
  return await findProducts(queryParams);
};

export const getActiveProductsService = async (user) => {
  return await findActiveProducts();
};

export const getProductByIdService = async (id, user) => {
  return await findProductById(id);
};

export const createProductService = async (productData, user) => {
  // RBAC Enforcement: Salesman cannot create products
  if (user.role === "SALESMAN") {
    throw { status: 403, message: "Forbidden: Salesmen are not authorized to create products." };
  }

  const validation = await validateCreateProduct(productData);
  if (!validation.isValid) {
    throw { status: 400, message: validation.errors.join(" ") };
  }

  const newProduct = await createProductRecord({
    ...productData,
    createdBy: user.name || user.email || user.id
  });

  // Audit Log Hook (Prepared for future Audit module)
  console.log(`[AUDIT] Product Created: ${newProduct.productCode} (${newProduct.productName}) | SKU: ${newProduct.sku} by ${user.name} [${user.role}]`);

  return newProduct;
};

export const updateProductService = async (id, updateData, user) => {
  const existing = await findProductById(id);
  if (!existing) {
    throw { status: 404, message: "Product not found." };
  }

  // RBAC Enforcement: Salesman cannot edit products
  if (user.role === "SALESMAN") {
    throw { status: 403, message: "Forbidden: Salesmen are not authorized to modify product master records." };
  }

  const validation = await validateUpdateProduct(id, updateData);
  if (!validation.isValid) {
    throw { status: 400, message: validation.errors.join(" ") };
  }

  const updated = await updateProductRecord(id, {
    ...updateData,
    updatedBy: user.name || user.email || user.id
  });

  // Audit Log Hook
  console.log(`[AUDIT] Product Updated: ${updated.productCode} (${updated.productName}) | Changes: [${Object.keys(updateData).join(", ")}] by ${user.name} [${user.role}]`);

  return updated;
};

export const updateProductStatusService = async (id, status, user) => {
  const existing = await findProductById(id);
  if (!existing) {
    throw { status: 404, message: "Product not found." };
  }

  // RBAC: Only authorized roles can change status
  if (!["SUPER_ADMIN", "ADMIN", "FINANCE", "SALES_MANAGER"].includes(user.role)) {
    throw { status: 403, message: "Forbidden: You do not have permission to change product status." };
  }

  if (!["ACTIVE", "INACTIVE"].includes(status)) {
    throw { status: 400, message: "Status must be either 'ACTIVE' or 'INACTIVE'." };
  }

  const updated = await updateProductStatusRecord(
    id,
    status,
    user.name || user.email || user.id
  );

  // Audit Log Hook
  console.log(`[AUDIT] Product Status Changed: ${updated.productCode} (${updated.productName}) to ${status} by ${user.name} [${user.role}]`);

  return updated;
};
