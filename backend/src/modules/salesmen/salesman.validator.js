import { findSalesmanByMobile, findSalesmanByEmployeeCode, findSalesmanById } from "./salesman.repository.js";
import { findRouteById } from "../routes/route.repository.js";

const VALID_STATUSES = ["ACTIVE", "INACTIVE"];

export const validateCreateSalesman = async (data) => {
  const errors = [];

  if (!data.name || !data.name.trim()) {
    errors.push("Salesman name is required.");
  }

  if (!data.employeeCode || !data.employeeCode.trim()) {
    errors.push("Employee code is required.");
  } else {
    const existing = await findSalesmanByEmployeeCode(data.employeeCode.trim());
    if (existing) {
      errors.push(`A salesman with employee code '${data.employeeCode.trim()}' already exists (${existing.name} - ${existing.salesmanCode}).`);
    }
  }

  if (!data.mobile || !data.mobile.trim()) {
    errors.push("Mobile number is required.");
  } else {
    const cleanMobile = data.mobile.trim();
    if (!/^\d{10}$/.test(cleanMobile)) {
      errors.push("Mobile number must be a valid 10-digit number.");
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

export const validateUpdateSalesman = async (id, data) => {
  const errors = [];

  if (data.name !== undefined && !data.name.trim()) {
    errors.push("Salesman name cannot be empty.");
  }

  if (data.employeeCode !== undefined) {
    if (!data.employeeCode.trim()) {
      errors.push("Employee code cannot be empty.");
    } else {
      const existing = await findSalesmanByEmployeeCode(data.employeeCode.trim());
      if (existing && existing.id !== id && existing.salesmanCode !== id) {
        errors.push(`Another salesman with employee code '${data.employeeCode.trim()}' already exists (${existing.name} - ${existing.salesmanCode}).`);
      }
    }
  }

  if (data.mobile !== undefined) {
    const cleanMobile = data.mobile.trim();
    if (!/^\d{10}$/.test(cleanMobile)) {
      errors.push("Mobile number must be a valid 10-digit number.");
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

export const validateAssignRoute = async ({ salesmanId, routeId }) => {
  const errors = [];

  const salesman = await findSalesmanById(salesmanId);
  if (!salesman) {
    errors.push(`Salesman '${salesmanId}' not found.`);
  } else if (salesman.status !== "ACTIVE") {
    errors.push(`Cannot assign routes to an INACTIVE salesman (${salesman.name}).`);
  }

  const route = await findRouteById(routeId);
  if (!route) {
    errors.push(`Route '${routeId}' not found.`);
  } else if (route.status !== "ACTIVE") {
    errors.push(`Cannot assign an INACTIVE route (${route.routeName}).`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    salesman,
    route
  };
};
