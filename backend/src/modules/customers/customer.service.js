import {
  findCustomers,
  findCustomerById,
  createCustomerRecord,
  updateCustomerRecord,
  updateCustomerStatusRecord
} from "./customer.repository.js";
import { validateCreateCustomer, validateUpdateCustomer } from "./customer.validator.js";

export const getCustomersService = async (queryParams, user) => {
  let scopedSalesmanId = null;

  // RBAC Data Scoping: Field Salesman CAN ONLY view assigned outlets!
  if (user.role === "SALESMAN") {
    scopedSalesmanId = user.id;
  }

  return await findCustomers({
    ...queryParams,
    scopedSalesmanId
  });
};

export const getCustomerByIdService = async (id, user) => {
  const customer = await findCustomerById(id);
  if (!customer) return null;

  // RBAC Check for Salesman role
  if (user.role === "SALESMAN" && customer.salesmanId !== user.id) {
    throw { status: 403, message: "Forbidden: You are not authorized to view this customer's details." };
  }

  return customer;
};

export const createCustomerService = async (customerData, user) => {
  const validation = await validateCreateCustomer(customerData);
  if (!validation.isValid) {
    throw { status: 400, message: validation.errors.join(" ") };
  }

  const newCustomer = await createCustomerRecord({
    ...customerData,
    createdBy: user.name || user.email || user.id
  });

  // Audit Log Hook (Prepared for future Audit module)
  console.log(`[AUDIT] Customer Created: ${newCustomer.customerCode} (${newCustomer.shopName}) by ${user.name} [${user.role}]`);

  return newCustomer;
};

export const updateCustomerService = async (id, updateData, user) => {
  const existing = await findCustomerById(id);
  if (!existing) {
    throw { status: 404, message: "Customer not found." };
  }

  // RBAC Check for Salesman
  if (user.role === "SALESMAN" && existing.salesmanId !== user.id) {
    throw { status: 403, message: "Forbidden: You are not authorized to edit this customer." };
  }

  const validation = validateUpdateCustomer(updateData);
  if (!validation.isValid) {
    throw { status: 400, message: validation.errors.join(" ") };
  }

  const updated = await updateCustomerRecord(id, {
    ...updateData,
    updatedBy: user.name || user.email || user.id
  });

  // Audit Log Hook
  console.log(`[AUDIT] Customer Updated: ${updated.customerCode} (${updated.shopName}) by ${user.name} [${user.role}]`);

  return updated;
};

export const updateCustomerStatusService = async (id, status, reason = "", user) => {
  const existing = await findCustomerById(id);
  if (!existing) {
    throw { status: 404, message: "Customer not found." };
  }

  // Only SUPER_ADMIN, ADMIN, FINANCE, or SALES_MANAGER can change status
  if (!["SUPER_ADMIN", "ADMIN", "FINANCE", "SALES_MANAGER"].includes(user.role)) {
    throw { status: 403, message: "Forbidden: You do not have permission to change customer status." };
  }

  const updated = await updateCustomerStatusRecord(
    id,
    status,
    reason,
    user.name || user.email || user.id
  );

  // Audit Log Hook
  console.log(`[AUDIT] Customer Status Changed: ${updated.customerCode} to ${status} (Reason: ${reason || 'N/A'}) by ${user.name} [${user.role}]`);

  return updated;
};
