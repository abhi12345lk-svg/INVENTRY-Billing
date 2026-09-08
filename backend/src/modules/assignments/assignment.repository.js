import { findCustomerById, updateCustomerRecord } from "../customers/customer.repository.js";
import { findSalesmanById } from "../salesmen/salesman.repository.js";
import { findRouteById } from "../routes/route.repository.js";
import { findAreaById } from "../areas/area.repository.js";

// Operational Customer Assignments Repository (Clean Production Foundation)
let initialCustomerAssignments = [];

export const getCustomerAssignmentHistory = async (customerId) => {
  return initialCustomerAssignments
    .filter((a) => a.customerId === customerId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getActiveCustomerAssignment = async (customerId) => {
  return initialCustomerAssignments.find(
    (a) => a.customerId === customerId && a.status === "ACTIVE"
  ) || null;
};

export const reassignCustomerRecord = async ({
  customerId,
  salesmanId,
  routeId,
  areaId,
  assignedBy,
  reason
}) => {
  const now = new Date().toISOString();

  // 1. Close/Deactivate previous active assignment
  const activeAssignmentIndex = initialCustomerAssignments.findIndex(
    (a) => a.customerId === customerId && a.status === "ACTIVE"
  );

  let previousSnapshot = null;
  if (activeAssignmentIndex !== -1) {
    initialCustomerAssignments[activeAssignmentIndex].status = "INACTIVE";
    initialCustomerAssignments[activeAssignmentIndex].effectiveTo = now;
    initialCustomerAssignments[activeAssignmentIndex].updatedAt = now;
    previousSnapshot = { ...initialCustomerAssignments[activeAssignmentIndex] };
  }

  // 2. Fetch Entity Names for synchronization
  const salesman = await findSalesmanById(salesmanId);
  const route = await findRouteById(routeId);
  const area = await findAreaById(areaId);

  const salesmanName = salesman ? salesman.name : (salesmanId || "Unassigned");
  const routeName = route ? route.routeName : (routeId || "Unassigned");
  const areaName = area ? area.areaName : (areaId || "Unassigned");

  // 3. Create New Authoritative Assignment Record
  const newAssignmentId = `ca-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const newAssignment = {
    id: newAssignmentId,
    customerId,
    salesmanId: salesman ? salesman.salesmanCode : salesmanId,
    routeId: route ? route.routeCode : routeId,
    areaId: area ? area.areaCode : areaId,
    effectiveFrom: now,
    effectiveTo: null,
    status: "ACTIVE",
    assignedBy: assignedBy || "system",
    reason: reason || "Territory Reassignment",
    createdAt: now,
    updatedAt: now
  };

  initialCustomerAssignments.unshift(newAssignment);

  // 4. Synchronize Customer's denormalized fields
  const updatedCustomer = await updateCustomerRecord(customerId, {
    areaId: area ? area.areaCode : areaId,
    areaName,
    routeId: route ? route.routeCode : routeId,
    routeName,
    salesmanId: salesman ? salesman.salesmanCode : salesmanId,
    salesmanName
  });

  return {
    assignment: newAssignment,
    customer: updatedCustomer,
    previous: previousSnapshot
  };
};

export const getAssignmentSummary = async () => {
  const activeAssignments = initialCustomerAssignments.filter((a) => a.status === "ACTIVE");

  const bySalesman = {};
  const byRoute = {};
  const byArea = {};

  activeAssignments.forEach((a) => {
    bySalesman[a.salesmanId] = (bySalesman[a.salesmanId] || 0) + 1;
    byRoute[a.routeId] = (byRoute[a.routeId] || 0) + 1;
    byArea[a.areaId] = (byArea[a.areaId] || 0) + 1;
  });

  return {
    totalActiveAssignments: activeAssignments.length,
    bySalesman,
    byRoute,
    byArea
  };
};
