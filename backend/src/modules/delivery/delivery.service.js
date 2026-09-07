import * as deliveryRepo from "./delivery.repository.js";
import * as validator from "./delivery.validator.js";
import { findBillById, updateBillDeliveryStatus, findBillsReadyForDispatch } from "../billing/billing.repository.js";

// ==========================================
// VEHICLE SERVICES
// ==========================================

export const listVehicles = async (filters) => {
  return await deliveryRepo.findVehicles(filters);
};

export const getVehicleDetails = async (id) => {
  const vehicle = await deliveryRepo.findVehicleById(id);
  if (!vehicle) {
    throw { statusCode: 404, message: "Vehicle not found." };
  }
  return vehicle;
};

export const registerVehicle = async (data, user) => {
  if (!validator.isAuthorizedToManageVehicles(user)) {
    throw { statusCode: 403, message: "Access denied. Only Admin / Finance can register new fleet vehicles." };
  }

  const valResult = validator.validateVehicleData(data);
  if (!valResult.valid) {
    throw { statusCode: 400, message: valResult.error };
  }

  // Check duplicate vehicle registration number
  const existing = await deliveryRepo.findVehicleById(data.vehicleNumber.toUpperCase().trim());
  if (existing) {
    throw { statusCode: 400, message: `Vehicle with registration number "${data.vehicleNumber.toUpperCase().trim()}" already exists.` };
  }

  return await deliveryRepo.createVehicleRecord(data, user);
};

export const updateVehicle = async (id, data, user) => {
  if (!validator.isAuthorizedToManageVehicles(user)) {
    throw { statusCode: 403, message: "Access denied. Only Admin / Finance can modify fleet vehicles." };
  }

  const existing = await deliveryRepo.findVehicleById(id);
  if (!existing) {
    throw { statusCode: 404, message: "Vehicle not found." };
  }

  return await deliveryRepo.updateVehicleRecord(id, data, user);
};

export const setVehicleStatus = async (id, status, user) => {
  if (!validator.isAuthorizedToManageVehicles(user)) {
    throw { statusCode: 403, message: "Access denied. Only Admin / Finance can change vehicle status." };
  }

  const existing = await deliveryRepo.findVehicleById(id);
  if (!existing) {
    throw { statusCode: 404, message: "Vehicle not found." };
  }

  const validStatuses = ["AVAILABLE", "ON_TRIP", "MAINTENANCE", "INACTIVE"];
  if (!validStatuses.includes(status)) {
    throw { statusCode: 400, message: `Status must be one of: ${validStatuses.join(", ")}` };
  }

  return await deliveryRepo.updateVehicleStatus(id, status);
};

// ==========================================
// DELIVERY & TRIP SERVICES
// ==========================================

export const getReadyBills = async (filters = {}) => {
  return await findBillsReadyForDispatch(filters);
};

export const listTrips = async (filters, user) => {
  return await deliveryRepo.findTrips(filters);
};

export const getTripDetails = async (id) => {
  const trip = await deliveryRepo.findTripById(id);
  if (!trip) {
    throw { statusCode: 404, message: "Delivery trip not found." };
  }
  return trip;
};

export const createTrip = async (data, user) => {
  if (!validator.isAuthorizedToManageTrips(user)) {
    throw { statusCode: 403, message: "Access denied. Salesmen cannot plan or create delivery trips." };
  }

  const valResult = validator.validateCreateTrip(data);
  if (!valResult.valid) {
    throw { statusCode: 400, message: valResult.error };
  }

  // 1. Verify Vehicle
  const vehicle = await deliveryRepo.findVehicleById(data.vehicleId);
  if (!vehicle) {
    throw { statusCode: 400, message: "Selected vehicle does not exist." };
  }
  if (vehicle.status !== "AVAILABLE") {
    throw {
      statusCode: 400,
      message: `Vehicle ${vehicle.vehicleNumber} is not available (Current status: ${vehicle.status}).`
    };
  }

  // 2. Verify all Bills & check duplicate active trips
  const deliveries = [];
  for (const billId of data.billIds) {
    const bill = await findBillById(billId);
    if (!bill) {
      throw { statusCode: 400, message: `Invoice / Bill "${billId}" does not exist.` };
    }
    if (bill.billStatus !== "LOCKED") {
      throw { statusCode: 400, message: `Bill ${bill.billNumber} must be locked before adding to dispatch trip.` };
    }
    if (bill.deliveryStatus === "DISPATCHED" || bill.deliveryStatus === "OUT_FOR_DELIVERY" || bill.deliveryStatus === "DELIVERED") {
      throw {
        statusCode: 400,
        message: `Bill ${bill.billNumber} is already in delivery status "${bill.deliveryStatus}". Cannot re-assign.`
      };
    }

    deliveries.push({
      billId: bill.id || bill._id?.toString(),
      billNumber: bill.billNumber,
      customerId: bill.customer?.customerId || bill.customer?.id,
      customerName: bill.customer?.customerName || "Customer",
      address: bill.customer?.address || "",
      mobile: bill.customer?.mobile || "",
      amount: Number(bill.totalAmount) || 0,
      status: "PENDING",
      deliveryTime: null,
      remarks: ""
    });
  }

  // 3. Create Trip record
  const tripPayload = {
    vehicleId: vehicle.id || vehicle._id?.toString(),
    vehicleNumber: vehicle.vehicleNumber,
    driverName: data.driverName || vehicle.driverName,
    driverMobile: data.driverMobile || vehicle.driverMobile,
    routeId: data.routeId || "",
    routeName: data.routeName || "",
    salesmanId: data.salesmanId || "",
    salesmanName: data.salesmanName || "",
    billIds: data.billIds,
    deliveries,
    notes: data.notes || ""
  };

  const newTrip = await deliveryRepo.createTripRecord(tripPayload, user);

  // 4. Update bills to show they are staged in trip
  for (const billId of data.billIds) {
    await updateBillDeliveryStatus(billId, "READY_FOR_DISPATCH", {
      tripId: newTrip.id,
      tripNumber: newTrip.tripNumber,
      user
    });
  }

  return newTrip;
};

export const dispatchTrip = async (tripId, user) => {
  if (!validator.isAuthorizedToManageTrips(user)) {
    throw { statusCode: 403, message: "Access denied. Salesmen cannot dispatch trips." };
  }

  const trip = await deliveryRepo.findTripById(tripId);
  if (!trip) {
    throw { statusCode: 404, message: "Delivery trip not found." };
  }

  if (trip.status !== "READY" && trip.status !== "PLANNED") {
    throw {
      statusCode: 400,
      message: `Trip ${trip.tripNumber} cannot be dispatched from status "${trip.status}".`
    };
  }

  // 1. Dispatch Trip
  const updatedTrip = await deliveryRepo.dispatchTripRecord(tripId, user);

  // 2. Set Vehicle to ON_TRIP
  await deliveryRepo.updateVehicleStatus(trip.vehicleId, "ON_TRIP", trip.id);

  // 3. Update all bills to DISPATCHED
  for (const d of trip.deliveries || []) {
    await updateBillDeliveryStatus(d.billId, "DISPATCHED", {
      tripId: trip.id,
      tripNumber: trip.tripNumber,
      user
    });
  }

  return updatedTrip;
};

export const startTrip = async (tripId, user) => {
  if (!validator.isAuthorizedToManageTrips(user)) {
    throw { statusCode: 403, message: "Access denied. Salesmen cannot start trips." };
  }

  const trip = await deliveryRepo.findTripById(tripId);
  if (!trip) {
    throw { statusCode: 404, message: "Delivery trip not found." };
  }

  if (trip.status !== "DISPATCHED" && trip.status !== "READY") {
    throw {
      statusCode: 400,
      message: `Trip ${trip.tripNumber} cannot be started from status "${trip.status}".`
    };
  }

  // Start trip and mark items OUT_FOR_DELIVERY
  const updatedTrip = await deliveryRepo.startTripRecord(tripId, user);

  // Update vehicle to ON_TRIP if not already
  await deliveryRepo.updateVehicleStatus(trip.vehicleId, "ON_TRIP", trip.id);

  // Update all bills to OUT_FOR_DELIVERY
  for (const d of trip.deliveries || []) {
    if (d.status === "PENDING" || d.status === "OUT_FOR_DELIVERY") {
      await updateBillDeliveryStatus(d.billId, "OUT_FOR_DELIVERY", {
        tripId: trip.id,
        tripNumber: trip.tripNumber,
        user
      });
    }
  }

  return updatedTrip;
};

export const updateDeliveryItem = async (tripId, billId, data, user) => {
  const valResult = validator.validateDeliveryStatusUpdate(data);
  if (!valResult.valid) {
    throw { statusCode: 400, message: valResult.error };
  }

  const trip = await deliveryRepo.findTripById(tripId);
  if (!trip) {
    throw { statusCode: 404, message: "Delivery trip not found." };
  }

  const updatedTrip = await deliveryRepo.updateBillDeliveryRecord(
    tripId,
    billId,
    data.status,
    data.remarks,
    user
  );

  if (!updatedTrip) {
    throw { statusCode: 404, message: `Delivery item "${billId}" not found on trip ${trip.tripNumber}.` };
  }

  // Update corresponding Bill
  const now = new Date().toISOString();
  await updateBillDeliveryStatus(billId, data.status, {
    tripId: trip.id,
    tripNumber: trip.tripNumber,
    deliveredAt: data.status === "DELIVERED" ? now : null,
    deliveryRemarks: data.remarks || "",
    user
  });

  return updatedTrip;
};

export const completeTrip = async (tripId, user) => {
  if (!validator.isAuthorizedToManageTrips(user)) {
    throw { statusCode: 403, message: "Access denied. Salesmen cannot complete trips." };
  }

  const trip = await deliveryRepo.findTripById(tripId);
  if (!trip) {
    throw { statusCode: 404, message: "Delivery trip not found." };
  }

  if (trip.status === "COMPLETED") {
    throw { statusCode: 400, message: `Trip ${trip.tripNumber} is already completed.` };
  }

  // 1. Complete Trip
  const completedTrip = await deliveryRepo.completeTripRecord(tripId, user);

  // 2. Release Vehicle back to AVAILABLE
  await deliveryRepo.updateVehicleStatus(trip.vehicleId, "AVAILABLE", null);

  return completedTrip;
};

export const getDashboardSummary = async () => {
  return await deliveryRepo.getDeliveryDashboardSummary();
};
