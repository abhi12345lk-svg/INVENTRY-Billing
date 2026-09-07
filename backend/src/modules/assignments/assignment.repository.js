import { findCustomerById, updateCustomerRecord } from "../customers/customer.repository.js";
import { findSalesmanById } from "../salesmen/salesman.repository.js";
import { findRouteById } from "../routes/route.repository.js";
import { findAreaById } from "../areas/area.repository.js";

// Initial seed customer assignments
let initialCustomerAssignments = [
  {
    id: "ca-001",
    customerId: "cus-001",
    salesmanId: "SM-000001", // Rahul Kumar
    routeId: "ROUTE-000001", // Central Route A
    areaId: "AREA-000001",   // Raipur Central
    effectiveFrom: "2026-07-01T08:00:00.000Z",
    effectiveTo: null,
    status: "ACTIVE",
    assignedBy: "system",
    reason: "Initial Beat Mapping",
    createdAt: "2026-07-01T08:00:00.000Z",
    updatedAt: "2026-07-01T08:00:00.000Z"
  },
  {
    id: "ca-002",
    customerId: "cus-002",
    salesmanId: "SM-000001", // Rahul Kumar
    routeId: "ROUTE-000002", // Central Route B
    areaId: "AREA-000001",
    effectiveFrom: "2026-07-01T08:00:00.000Z",
    effectiveTo: null,
    status: "ACTIVE",
    assignedBy: "system",
    reason: "Initial Beat Mapping",
    createdAt: "2026-07-01T08:00:00.000Z",
    updatedAt: "2026-07-01T08:00:00.000Z"
  },
  {
    id: "ca-003",
    customerId: "cus-003",
    salesmanId: "SM-000001", // Rahul Kumar
    routeId: "ROUTE-000001",
    areaId: "AREA-000001",
    effectiveFrom: "2026-07-01T08:00:00.000Z",
    effectiveTo: null,
    status: "ACTIVE",
    assignedBy: "system",
    reason: "Initial Beat Mapping",
    createdAt: "2026-07-01T08:00:00.000Z",
    updatedAt: "2026-07-01T08:00:00.000Z"
  },
  {
    id: "ca-004",
    customerId: "cus-004",
    salesmanId: "SM-000002", // Suresh Yadav
    routeId: "ROUTE-000003", // West Route A
    areaId: "AREA-000002",
    effectiveFrom: "2026-07-01T08:00:00.000Z",
    effectiveTo: null,
    status: "ACTIVE",
    assignedBy: "system",
    reason: "West Territory Allocation",
    createdAt: "2026-07-01T08:00:00.000Z",
    updatedAt: "2026-07-01T08:00:00.000Z"
  },
  {
    id: "ca-005",
    customerId: "cus-005",
    salesmanId: "SM-000001", // Rahul Kumar
    routeId: "ROUTE-000001",
    areaId: "AREA-000001",
    effectiveFrom: "2026-07-01T08:00:00.000Z",
    effectiveTo: null,
    status: "ACTIVE",
    assignedBy: "system",
    reason: "Initial Beat Mapping",
    createdAt: "2026-07-01T08:00:00.000Z",
    updatedAt: "2026-07-01T08:00:00.000Z"
  },
  {
    id: "ca-006",
    customerId: "cus-006",
    salesmanId: "SM-000001", // Rahul Kumar
    routeId: "ROUTE-000002",
    areaId: "AREA-000001",
    effectiveFrom: "2026-07-01T08:00:00.000Z",
    effectiveTo: null,
    status: "ACTIVE",
    assignedBy: "system",
    reason: "Initial Beat Mapping",
    createdAt: "2026-07-01T08:00:00.000Z",
    updatedAt: "2026-07-01T08:00:00.000Z"
  },
  {
    id: "ca-007",
    customerId: "cus-007",
    salesmanId: "SM-000003", // Manish Patel
    routeId: "ROUTE-000004", // East Route A
    areaId: "AREA-000003",
    effectiveFrom: "2026-07-01T08:00:00.000Z",
    effectiveTo: null,
    status: "ACTIVE",
    assignedBy: "system",
    reason: "East Corridor Allocation",
    createdAt: "2026-07-01T08:00:00.000Z",
    updatedAt: "2026-07-01T08:00:00.000Z"
  },
  {
    id: "ca-008",
    customerId: "cus-008",
    salesmanId: "SM-000001", // Rahul Kumar
    routeId: "ROUTE-000001",
    areaId: "AREA-000001",
    effectiveFrom: "2026-07-01T08:00:00.000Z",
    effectiveTo: null,
    status: "ACTIVE",
    assignedBy: "system",
    reason: "Wholesale Beat Allocation",
    createdAt: "2026-07-01T08:00:00.000Z",
    updatedAt: "2026-07-01T08:00:00.000Z"
  },
  {
    id: "ca-009",
    customerId: "cus-009",
    salesmanId: "SM-000001", // Rahul Kumar
    routeId: "ROUTE-000002",
    areaId: "AREA-000001",
    effectiveFrom: "2026-07-01T08:00:00.000Z",
    effectiveTo: null,
    status: "ACTIVE",
    assignedBy: "system",
    reason: "Secondary Market Beat",
    createdAt: "2026-07-01T08:00:00.000Z",
    updatedAt: "2026-07-01T08:00:00.000Z"
  },
  {
    id: "ca-010",
    customerId: "cus-010",
    salesmanId: "SM-000001", // Rahul Kumar
    routeId: "ROUTE-000001",
    areaId: "AREA-000001",
    effectiveFrom: "2026-07-01T08:00:00.000Z",
    effectiveTo: null,
    status: "ACTIVE",
    assignedBy: "system",
    reason: "Initial Beat Mapping",
    createdAt: "2026-07-01T08:00:00.000Z",
    updatedAt: "2026-07-01T08:00:00.000Z"
  }
];

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
  const newAssignmentId = `ca-${Date.now()}`;
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
