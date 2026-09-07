import { findCustomerById } from "../customers/customer.repository.js";
import { findSalesmanById } from "../salesmen/salesman.repository.js";
import { findRouteById } from "../routes/route.repository.js";
import { findAreaById } from "../areas/area.repository.js";

export const validateCustomerAssignment = async ({
  customerId,
  salesmanId,
  routeId,
  areaId
}) => {
  const errors = [];

  // 1. Customer Check
  if (!customerId) {
    errors.push("Customer ID is required.");
  } else {
    const customer = await findCustomerById(customerId);
    if (!customer) {
      errors.push(`Customer '${customerId}' not found.`);
    }
  }

  // 2. Area Check
  let validArea = null;
  if (!areaId) {
    errors.push("Area ID is required.");
  } else {
    validArea = await findAreaById(areaId);
    if (!validArea) {
      errors.push(`Referenced Area '${areaId}' does not exist.`);
    } else if (validArea.status !== "ACTIVE") {
      errors.push(`Cannot assign customer to an INACTIVE area (${validArea.areaName}).`);
    }
  }

  // 3. Route Check
  let validRoute = null;
  if (!routeId) {
    errors.push("Route ID is required.");
  } else {
    validRoute = await findRouteById(routeId);
    if (!validRoute) {
      errors.push(`Referenced Route '${routeId}' does not exist.`);
    } else if (validRoute.status !== "ACTIVE") {
      errors.push(`Cannot assign customer to an INACTIVE route (${validRoute.routeName}).`);
    } else if (validArea && validRoute.areaId !== validArea.areaCode && validRoute.areaId !== validArea.id) {
      errors.push(`Route '${validRoute.routeName}' does not belong to Area '${validArea.areaName}'.`);
    }
  }

  // 4. Salesman Check
  let validSalesman = null;
  if (!salesmanId) {
    errors.push("Salesman ID is required.");
  } else {
    validSalesman = await findSalesmanById(salesmanId);
    if (!validSalesman) {
      errors.push(`Referenced Salesman '${salesmanId}' does not exist.`);
    } else if (validSalesman.status !== "ACTIVE") {
      errors.push(`Cannot assign customer to an INACTIVE salesman (${validSalesman.name}).`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    customer: customerId ? await findCustomerById(customerId) : null,
    salesman: validSalesman,
    route: validRoute,
    area: validArea
  };
};
