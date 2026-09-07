import { findRouteByName } from "./route.repository.js";
import { findAreaById } from "../areas/area.repository.js";

const VALID_STATUSES = ["ACTIVE", "INACTIVE"];

export const validateCreateRoute = async (data) => {
  const errors = [];

  if (!data.routeName || !data.routeName.trim()) {
    errors.push("Route name is required.");
  } else {
    const existing = await findRouteByName(data.routeName);
    if (existing) {
      errors.push(`A route with name '${data.routeName.trim()}' already exists (${existing.routeCode}).`);
    }
  }

  if (!data.areaId || !data.areaId.trim()) {
    errors.push("Area is required.");
  } else {
    const area = await findAreaById(data.areaId.trim());
    if (!area) {
      errors.push(`Referenced Area '${data.areaId}' does not exist.`);
    } else if (area.status !== "ACTIVE") {
      errors.push(`Cannot assign route to an INACTIVE area (${area.areaName}).`);
    }
  }

  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(`Status must be either 'ACTIVE' or 'INACTIVE'.`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUpdateRoute = async (id, data) => {
  const errors = [];

  if (data.routeName !== undefined) {
    if (!data.routeName.trim()) {
      errors.push("Route name cannot be empty.");
    } else {
      const existing = await findRouteByName(data.routeName);
      if (existing && existing.id !== id && existing.routeCode !== id) {
        errors.push(`Another route with name '${data.routeName.trim()}' already exists (${existing.routeCode}).`);
      }
    }
  }

  if (data.areaId !== undefined) {
    if (!data.areaId.trim()) {
      errors.push("Area ID cannot be empty.");
    } else {
      const area = await findAreaById(data.areaId.trim());
      if (!area) {
        errors.push(`Referenced Area '${data.areaId}' does not exist.`);
      }
    }
  }

  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(`Status must be either 'ACTIVE' or 'INACTIVE'.`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
