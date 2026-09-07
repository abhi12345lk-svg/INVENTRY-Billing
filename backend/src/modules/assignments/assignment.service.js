import {
  getCustomerAssignmentHistory,
  getActiveCustomerAssignment,
  reassignCustomerRecord,
  getAssignmentSummary
} from "./assignment.repository.js";
import { validateCustomerAssignment } from "./assignment.validator.js";
import { findRouteById } from "../routes/route.repository.js";

export const getCustomerHistoryService = async (customerId, user) => {
  return await getCustomerAssignmentHistory(customerId);
};

export const reassignCustomerService = async (assignmentData, user) => {
  if (user.role === "SALESMAN") {
    throw { status: 403, message: "Forbidden: Salesmen are not authorized to assign or reassign customers." };
  }

  // Auto-infer areaId from Route if omitted
  if (!assignmentData.areaId && assignmentData.routeId) {
    const route = await findRouteById(assignmentData.routeId);
    if (route && route.areaId) {
      assignmentData.areaId = route.areaId;
    }
  }

  const validation = await validateCustomerAssignment(assignmentData);
  if (!validation.isValid) {
    throw { status: 400, message: validation.errors.join(" ") };
  }

  const result = await reassignCustomerRecord({
    ...assignmentData,
    assignedBy: user.name || user.email || user.id
  });

  console.log(
    `[AUDIT] Customer Reassigned: Outlet ${assignmentData.customerId} -> Salesman: ${validation.salesman.name} (${validation.salesman.salesmanCode}), Route: ${validation.route.routeName} (${validation.route.routeCode}), Area: ${validation.area.areaName} by ${user.name} [${user.role}] (Reason: ${assignmentData.reason || 'N/A'})`
  );

  return result;
};

export const getAssignmentSummaryService = async (user) => {
  return await getAssignmentSummary();
};
