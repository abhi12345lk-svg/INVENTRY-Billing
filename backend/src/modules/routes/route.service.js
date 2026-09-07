import {
  findRoutes,
  findRouteById,
  createRouteRecord,
  updateRouteRecord,
  updateRouteStatusRecord
} from "./route.repository.js";
import { findAreaById } from "../areas/area.repository.js";
import { validateCreateRoute, validateUpdateRoute } from "./route.validator.js";

export const getRoutesService = async (queryParams, user) => {
  return await findRoutes(queryParams);
};

export const getRouteByIdService = async (id, user) => {
  return await findRouteById(id);
};

export const createRouteService = async (routeData, user) => {
  if (user.role === "SALESMAN") {
    throw { status: 403, message: "Forbidden: Salesmen are not authorized to create routes." };
  }

  const validation = await validateCreateRoute(routeData);
  if (!validation.isValid) {
    throw { status: 400, message: validation.errors.join(" ") };
  }

  const area = await findAreaById(routeData.areaId.trim());

  const newRoute = await createRouteRecord({
    ...routeData,
    areaName: area ? area.areaName : routeData.areaId,
    createdBy: user.name || user.email || user.id
  });

  console.log(`[AUDIT] Route Created: ${newRoute.routeCode} (${newRoute.routeName}) in Area ${newRoute.areaName} by ${user.name} [${user.role}]`);

  return newRoute;
};

export const updateRouteService = async (id, updateData, user) => {
  const existing = await findRouteById(id);
  if (!existing) {
    throw { status: 404, message: "Route not found." };
  }

  if (user.role === "SALESMAN") {
    throw { status: 403, message: "Forbidden: Salesmen are not authorized to edit routes." };
  }

  const validation = await validateUpdateRoute(id, updateData);
  if (!validation.isValid) {
    throw { status: 400, message: validation.errors.join(" ") };
  }

  let areaName = existing.areaName;
  if (updateData.areaId) {
    const area = await findAreaById(updateData.areaId.trim());
    if (area) areaName = area.areaName;
  }

  const updated = await updateRouteRecord(id, {
    ...updateData,
    areaName,
    updatedBy: user.name || user.email || user.id
  });

  console.log(`[AUDIT] Route Updated: ${updated.routeCode} (${updated.routeName}) by ${user.name} [${user.role}]`);

  return updated;
};

export const updateRouteStatusService = async (id, status, user) => {
  const existing = await findRouteById(id);
  if (!existing) {
    throw { status: 404, message: "Route not found." };
  }

  if (!["SUPER_ADMIN", "ADMIN", "SALES_MANAGER"].includes(user.role)) {
    throw { status: 403, message: "Forbidden: You do not have permission to change route status." };
  }

  if (!["ACTIVE", "INACTIVE"].includes(status)) {
    throw { status: 400, message: "Status must be either 'ACTIVE' or 'INACTIVE'." };
  }

  const updated = await updateRouteStatusRecord(
    id,
    status,
    user.name || user.email || user.id
  );

  console.log(`[AUDIT] Route Status Changed: ${updated.routeCode} (${updated.routeName}) to ${status} by ${user.name} [${user.role}]`);

  return updated;
};
