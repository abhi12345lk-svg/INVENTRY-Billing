import {
  findSalesmen,
  findSalesmanById,
  createSalesmanRecord,
  updateSalesmanRecord,
  updateSalesmanStatusRecord,
  getSalesmanRouteAssignments,
  assignRouteRecord,
  unassignRouteRecord
} from "./salesman.repository.js";
import {
  validateCreateSalesman,
  validateUpdateSalesman,
  validateAssignRoute
} from "./salesman.validator.js";

export const getSalesmenService = async (queryParams, user) => {
  return await findSalesmen(queryParams);
};

export const getSalesmanByIdService = async (id, user) => {
  const sm = await findSalesmanById(id);
  if (!sm) return null;

  // Salesman role check: can only view own profile
  if (user.role === "SALESMAN" && user.id !== sm.userId && user.id !== sm.id && user.id !== sm.salesmanCode) {
    throw { status: 403, message: "Forbidden: You are only authorized to view your own salesman profile." };
  }

  return sm;
};

export const createSalesmanService = async (salesmanData, user) => {
  if (user.role === "SALESMAN") {
    throw { status: 403, message: "Forbidden: Salesmen are not authorized to create salesman profiles." };
  }

  const validation = await validateCreateSalesman(salesmanData);
  if (!validation.isValid) {
    throw { status: 400, message: validation.errors.join(" ") };
  }

  const newSalesman = await createSalesmanRecord({
    ...salesmanData,
    createdBy: user.name || user.email || user.id
  });

  console.log(`[AUDIT] Salesman Created: ${newSalesman.salesmanCode} (${newSalesman.name} - ${newSalesman.employeeCode}) by ${user.name} [${user.role}]`);

  return newSalesman;
};

export const updateSalesmanService = async (id, updateData, user) => {
  const existing = await findSalesmanById(id);
  if (!existing) {
    throw { status: 404, message: "Salesman not found." };
  }

  if (user.role === "SALESMAN") {
    throw { status: 403, message: "Forbidden: Salesmen cannot edit salesman profiles." };
  }

  const validation = await validateUpdateSalesman(id, updateData);
  if (!validation.isValid) {
    throw { status: 400, message: validation.errors.join(" ") };
  }

  const updated = await updateSalesmanRecord(id, {
    ...updateData,
    updatedBy: user.name || user.email || user.id
  });

  console.log(`[AUDIT] Salesman Updated: ${updated.salesmanCode} (${updated.name}) by ${user.name} [${user.role}]`);

  return updated;
};

export const updateSalesmanStatusService = async (id, status, user) => {
  const existing = await findSalesmanById(id);
  if (!existing) {
    throw { status: 404, message: "Salesman not found." };
  }

  if (!["SUPER_ADMIN", "ADMIN", "SALES_MANAGER"].includes(user.role)) {
    throw { status: 403, message: "Forbidden: You do not have permission to change salesman status." };
  }

  if (!["ACTIVE", "INACTIVE"].includes(status)) {
    throw { status: 400, message: "Status must be either 'ACTIVE' or 'INACTIVE'." };
  }

  const updated = await updateSalesmanStatusRecord(
    id,
    status,
    user.name || user.email || user.id
  );

  console.log(`[AUDIT] Salesman Status Changed: ${updated.salesmanCode} (${updated.name}) to ${status} by ${user.name} [${user.role}]`);

  return updated;
};

export const getSalesmanRoutesService = async (salesmanId, user) => {
  return await getSalesmanRouteAssignments(salesmanId);
};

export const assignRouteToSalesmanService = async ({ salesmanId, routeId, reason }, user) => {
  if (!["SUPER_ADMIN", "ADMIN", "SALES_MANAGER"].includes(user.role)) {
    throw { status: 403, message: "Forbidden: You do not have permission to assign routes." };
  }

  const validation = await validateAssignRoute({ salesmanId, routeId });
  if (!validation.isValid) {
    throw { status: 400, message: validation.errors.join(" ") };
  }

  const assignment = await assignRouteRecord({
    salesmanId: validation.salesman.salesmanCode,
    routeId: validation.route.routeCode,
    areaId: validation.route.areaId,
    assignedBy: user.name || user.email || user.id,
    reason: reason || "Beat Territory Assignment"
  });

  console.log(`[AUDIT] Route Assigned: Route ${validation.route.routeCode} -> Salesman ${validation.salesman.salesmanCode} (${validation.salesman.name}) by ${user.name} [${user.role}]`);

  return assignment;
};

export const unassignRouteFromSalesmanService = async ({ salesmanId, routeId, reason }, user) => {
  if (!["SUPER_ADMIN", "ADMIN", "SALES_MANAGER"].includes(user.role)) {
    throw { status: 403, message: "Forbidden: You do not have permission to unassign routes." };
  }

  const sm = await findSalesmanById(salesmanId);
  if (!sm) {
    throw { status: 404, message: "Salesman not found." };
  }

  const unassigned = await unassignRouteRecord({
    salesmanId: sm.salesmanCode,
    routeId,
    reason
  });

  if (!unassigned) {
    throw { status: 404, message: "Active route assignment not found." };
  }

  console.log(`[AUDIT] Route Unassigned: Route ${routeId} from Salesman ${sm.salesmanCode} (${sm.name}) by ${user.name} [${user.role}]`);

  return unassigned;
};
