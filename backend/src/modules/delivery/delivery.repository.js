import Vehicle from "../../models/Vehicle.js";
import DeliveryTrip from "../../models/DeliveryTrip.js";
import { isDatabaseConnected } from "../../config/database.js";
import { findBillById, updateBillDeliveryStatus, findBillsReadyForDispatch } from "../billing/billing.repository.js";

// ==========================================
// OPERATIONAL DELIVERY & FLEET REPOSITORY (Clean Production Foundation)
// ==========================================
const INITIAL_DEMO_VEHICLES = [];
const INITIAL_DEMO_TRIPS = [];

let inMemoryVehicles = [];
let inMemoryTrips = [];

// ==========================================
// VEHICLE METHODS
// ==========================================

export const findVehicles = async ({ search = "", status = "ALL", page = 1, limit = 50 } = {}) => {
  if (isDatabaseConnected()) {
    const query = {};
    if (status && status !== "ALL") query.status = status;
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { vehicleNumber: regex },
        { vehicleCode: regex },
        { driverName: regex },
        { vehicleType: regex }
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [vehicles, total] = await Promise.all([
      Vehicle.find(query).sort({ vehicleNumber: 1 }).skip(skip).limit(Number(limit)).lean(),
      Vehicle.countDocuments(query)
    ]);
    return {
      vehicles: vehicles.map((v) => ({ ...v, id: v._id.toString() })),
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)) || 1
    };
  }

  let filtered = [...inMemoryVehicles];
  if (status && status !== "ALL") {
    filtered = filtered.filter((v) => v.status === status);
  }
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (v) =>
        v.vehicleNumber.toLowerCase().includes(q) ||
        v.vehicleCode.toLowerCase().includes(q) ||
        v.driverName.toLowerCase().includes(q) ||
        v.vehicleType.toLowerCase().includes(q)
    );
  }
  const total = filtered.length;
  const skip = (Number(page) - 1) * Number(limit);
  const paginated = filtered.slice(skip, skip + Number(limit));
  return {
    vehicles: paginated,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)) || 1
  };
};

export const findVehicleById = async (id) => {
  if (isDatabaseConnected()) {
    const v = await Vehicle.findById(id).lean() || await Vehicle.findOne({ vehicleNumber: id }).lean();
    if (v) return { ...v, id: v._id.toString() };
  }
  return inMemoryVehicles.find((v) => v.id === id || v.vehicleNumber === id || v.vehicleCode === id) || null;
};

export const createVehicleRecord = async (data, user) => {
  const count = inMemoryVehicles.length + 1;
  const vehicleCode = data.vehicleCode || `VEH-${String(count).padStart(6, "0")}`;
  const record = {
    ...data,
    vehicleCode,
    vehicleNumber: (data.vehicleNumber || "").toUpperCase().trim(),
    status: data.status || "AVAILABLE",
    currentTripId: null,
    createdBy: user?.name || "System",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (isDatabaseConnected()) {
    const doc = new Vehicle(record);
    const saved = await doc.save();
    return { ...saved.toObject(), id: saved._id.toString() };
  }

  const newVehicle = { id: `veh-${Date.now()}`, ...record };
  inMemoryVehicles.unshift(newVehicle);
  return newVehicle;
};

export const updateVehicleRecord = async (id, data, user) => {
  const updateData = {
    ...data,
    updatedBy: user?.name || "System",
    updatedAt: new Date().toISOString()
  };
  if (data.vehicleNumber) {
    updateData.vehicleNumber = data.vehicleNumber.toUpperCase().trim();
  }

  if (isDatabaseConnected()) {
    const updated = await Vehicle.findByIdAndUpdate(id, updateData, { new: true }).lean();
    if (updated) return { ...updated, id: updated._id.toString() };
  }

  const idx = inMemoryVehicles.findIndex((v) => v.id === id || v.vehicleNumber === id);
  if (idx !== -1) {
    inMemoryVehicles[idx] = { ...inMemoryVehicles[idx], ...updateData };
    return inMemoryVehicles[idx];
  }
  return null;
};

export const updateVehicleStatus = async (id, status, currentTripId = null) => {
  if (isDatabaseConnected()) {
    await Vehicle.findByIdAndUpdate(id, { status, currentTripId });
  }
  const idx = inMemoryVehicles.findIndex((v) => v.id === id || v.vehicleNumber === id);
  if (idx !== -1) {
    inMemoryVehicles[idx] = {
      ...inMemoryVehicles[idx],
      status,
      currentTripId,
      updatedAt: new Date().toISOString()
    };
    return inMemoryVehicles[idx];
  }
  return null;
};

// ==========================================
// DELIVERY TRIP METHODS
// ==========================================

export const findTrips = async ({ status = "ALL", vehicle = "", route = "", search = "", page = 1, limit = 20 } = {}) => {
  if (isDatabaseConnected()) {
    const query = {};
    if (status && status !== "ALL") query.status = status;
    if (vehicle && vehicle !== "ALL") {
      query.$or = [{ vehicleId: vehicle }, { vehicleNumber: vehicle }];
    }
    if (route && route !== "ALL") query.routeId = route;
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { tripNumber: regex },
        { vehicleNumber: regex },
        { driverName: regex },
        { routeName: regex },
        { "deliveries.customerName": regex }
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [trips, total] = await Promise.all([
      DeliveryTrip.find(query).sort({ tripDate: -1, createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      DeliveryTrip.countDocuments(query)
    ]);
    return {
      trips: trips.map((t) => ({ ...t, id: t._id.toString() })),
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)) || 1
    };
  }

  let filtered = [...inMemoryTrips];
  if (status && status !== "ALL") {
    filtered = filtered.filter((t) => t.status === status);
  }
  if (vehicle && vehicle !== "ALL") {
    filtered = filtered.filter((t) => t.vehicleId === vehicle || t.vehicleNumber === vehicle);
  }
  if (route && route !== "ALL") {
    filtered = filtered.filter((t) => t.routeId === route);
  }
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.tripNumber.toLowerCase().includes(q) ||
        t.vehicleNumber.toLowerCase().includes(q) ||
        t.driverName.toLowerCase().includes(q) ||
        (t.routeName && t.routeName.toLowerCase().includes(q)) ||
        t.deliveries.some((d) => d.customerName && d.customerName.toLowerCase().includes(q))
    );
  }
  const total = filtered.length;
  const skip = (Number(page) - 1) * Number(limit);
  const paginated = filtered.slice(skip, skip + Number(limit));
  return {
    trips: paginated,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)) || 1
  };
};

export const findTripById = async (id) => {
  if (isDatabaseConnected()) {
    const t = await DeliveryTrip.findById(id).lean() || await DeliveryTrip.findOne({ tripNumber: id }).lean();
    if (t) return { ...t, id: t._id.toString() };
  }
  return inMemoryTrips.find((t) => t.id === id || t.tripNumber === id) || null;
};

export const createTripRecord = async (tripData, user) => {
  const count = inMemoryTrips.length + 1;
  const tripNumber = tripData.tripNumber || `TRIP-2026-${String(count).padStart(5, "0")}`;

  const totalBills = tripData.deliveries?.length || 0;
  const deliveredBills = tripData.deliveries?.filter((d) => d.status === "DELIVERED").length || 0;
  const failedBills = tripData.deliveries?.filter((d) => d.status === "FAILED" || d.status === "RETURN_PENDING").length || 0;
  const pendingBills = totalBills - deliveredBills - failedBills;
  const totalAmount = tripData.deliveries?.reduce((sum, d) => sum + (Number(d.amount) || 0), 0) || 0;

  const record = {
    ...tripData,
    tripNumber,
    tripDate: tripData.tripDate || new Date().toISOString(),
    status: tripData.status || "READY",
    totalBills,
    deliveredBills,
    pendingBills,
    failedBills,
    totalAmount,
    dispatchTime: null,
    returnTime: null,
    createdBy: user?.name || "System",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (isDatabaseConnected()) {
    const doc = new DeliveryTrip(record);
    const saved = await doc.save();
    return { ...saved.toObject(), id: saved._id.toString() };
  }

  const newTrip = { id: `trip-${Date.now()}`, ...record };
  inMemoryTrips.unshift(newTrip);
  return newTrip;
};

export const dispatchTripRecord = async (tripId, user) => {
  const dispatchTime = new Date().toISOString();
  const trip = await findTripById(tripId);
  if (!trip) return null;

  const updatedTripData = {
    status: "DISPATCHED",
    dispatchTime,
    updatedBy: user?.name || "System",
    updatedAt: dispatchTime
  };

  // Update trip deliveries status if still PENDING
  const updatedDeliveries = (trip.deliveries || []).map((d) => ({
    ...d,
    status: d.status === "PENDING" ? "OUT_FOR_DELIVERY" : d.status
  }));
  updatedTripData.deliveries = updatedDeliveries;

  if (isDatabaseConnected()) {
    const updated = await DeliveryTrip.findByIdAndUpdate(trip.id || tripId, updatedTripData, { new: true }).lean();
    return updated ? { ...updated, id: updated._id.toString() } : null;
  }

  const idx = inMemoryTrips.findIndex((t) => t.id === tripId || t.tripNumber === tripId);
  if (idx !== -1) {
    inMemoryTrips[idx] = { ...inMemoryTrips[idx], ...updatedTripData };
    return inMemoryTrips[idx];
  }
  return null;
};

export const startTripRecord = async (tripId, user) => {
  const startTime = new Date().toISOString();
  const trip = await findTripById(tripId);
  if (!trip) return null;

  const updatedDeliveries = (trip.deliveries || []).map((d) => ({
    ...d,
    status: d.status === "PENDING" ? "OUT_FOR_DELIVERY" : d.status
  }));

  const updatedTripData = {
    status: "IN_PROGRESS",
    deliveries: updatedDeliveries,
    updatedBy: user?.name || "System",
    updatedAt: startTime
  };

  if (isDatabaseConnected()) {
    const updated = await DeliveryTrip.findByIdAndUpdate(trip.id || tripId, updatedTripData, { new: true }).lean();
    return updated ? { ...updated, id: updated._id.toString() } : null;
  }

  const idx = inMemoryTrips.findIndex((t) => t.id === tripId || t.tripNumber === tripId);
  if (idx !== -1) {
    inMemoryTrips[idx] = { ...inMemoryTrips[idx], ...updatedTripData };
    return inMemoryTrips[idx];
  }
  return null;
};

export const updateBillDeliveryRecord = async (tripId, billId, deliveryStatus, remarks = "", user = null) => {
  const trip = await findTripById(tripId);
  if (!trip) return null;

  const now = new Date().toISOString();
  const deliveries = [...(trip.deliveries || [])];
  const dIdx = deliveries.findIndex((d) => d.billId === billId || d.billNumber === billId);
  if (dIdx === -1) return null;

  deliveries[dIdx] = {
    ...deliveries[dIdx],
    status: deliveryStatus,
    deliveryTime: deliveryStatus === "DELIVERED" ? now : deliveries[dIdx].deliveryTime,
    remarks: remarks || deliveries[dIdx].remarks
  };

  const totalBills = deliveries.length;
  const deliveredBills = deliveries.filter((d) => d.status === "DELIVERED").length;
  const failedBills = deliveries.filter((d) => d.status === "FAILED" || d.status === "RETURN_PENDING").length;
  const pendingBills = totalBills - deliveredBills - failedBills;

  // Auto-transition trip status if all deliveries resolved
  let tripStatus = trip.status;
  if (pendingBills === 0 && tripStatus === "IN_PROGRESS") {
    tripStatus = "IN_PROGRESS"; // keep in progress until completed explicitly
  }

  const updatePayload = {
    deliveries,
    totalBills,
    deliveredBills,
    pendingBills,
    failedBills,
    status: tripStatus,
    updatedBy: user?.name || "System",
    updatedAt: now
  };

  if (isDatabaseConnected()) {
    const updated = await DeliveryTrip.findByIdAndUpdate(trip.id || tripId, updatePayload, { new: true }).lean();
    return updated ? { ...updated, id: updated._id.toString() } : null;
  }

  const idx = inMemoryTrips.findIndex((t) => t.id === tripId || t.tripNumber === tripId);
  if (idx !== -1) {
    inMemoryTrips[idx] = { ...inMemoryTrips[idx], ...updatePayload };
    return inMemoryTrips[idx];
  }
  return null;
};

export const completeTripRecord = async (tripId, user) => {
  const returnTime = new Date().toISOString();
  const trip = await findTripById(tripId);
  if (!trip) return null;

  const updatePayload = {
    status: "COMPLETED",
    returnTime,
    updatedBy: user?.name || "System",
    updatedAt: returnTime
  };

  if (isDatabaseConnected()) {
    const updated = await DeliveryTrip.findByIdAndUpdate(trip.id || tripId, updatePayload, { new: true }).lean();
    return updated ? { ...updated, id: updated._id.toString() } : null;
  }

  const idx = inMemoryTrips.findIndex((t) => t.id === tripId || t.tripNumber === tripId);
  if (idx !== -1) {
    inMemoryTrips[idx] = { ...inMemoryTrips[idx], ...updatePayload };
    return inMemoryTrips[idx];
  }
  return null;
};

// ==========================================
// DELIVERY SUMMARY FOR DASHBOARD
// ==========================================

export const getDeliveryDashboardSummary = async () => {
  const vehiclesRes = await findVehicles({ limit: 100 });
  const tripsRes = await findTrips({ limit: 100 });
  const readyBills = await findBillsReadyForDispatch();

  const vehicles = vehiclesRes.vehicles || [];
  const trips = tripsRes.trips || [];

  const vehiclesAvailable = vehicles.filter((v) => v.status === "AVAILABLE").length;
  const vehiclesOnTrip = vehicles.filter((v) => v.status === "ON_TRIP").length;
  const vehiclesMaintenance = vehicles.filter((v) => v.status === "MAINTENANCE").length;

  const activeTrips = trips.filter((t) => t.status === "DISPATCHED" || t.status === "IN_PROGRESS");
  const readyTrips = trips.filter((t) => t.status === "READY" || t.status === "PLANNED");

  // Sum out for delivery & delivered count across today's trips
  let outForDelivery = 0;
  let deliveredToday = 0;
  let failedToday = 0;

  trips.forEach((t) => {
    outForDelivery += t.deliveries?.filter((d) => d.status === "OUT_FOR_DELIVERY").length || 0;
    deliveredToday += t.deliveries?.filter((d) => d.status === "DELIVERED").length || 0;
    failedToday += t.deliveries?.filter((d) => d.status === "FAILED" || d.status === "RETURN_PENDING").length || 0;
  });

  const exceptions = [];
  if (readyBills.length > 0) {
    exceptions.push({
      id: "del-exc-01",
      type: "BILLS_WAITING_DISPATCH",
      severity: "WARNING",
      title: `${readyBills.length} Bills Waiting for Dispatch`,
      message: `${readyBills.length} locked bills require delivery trip planning and vehicle assignment.`,
      targetTab: "delivery-ready"
    });
  }
  if (activeTrips.length > 0) {
    exceptions.push({
      id: "del-exc-02",
      type: "ACTIVE_DELIVERY_TRIPS",
      severity: "INFO",
      title: `${activeTrips.length} Trips Currently Active`,
      message: `${vehiclesOnTrip} vehicles out on delivery beats across routes.`,
      targetTab: "delivery-trips"
    });
  }
  if (vehiclesMaintenance > 0) {
    exceptions.push({
      id: "del-exc-03",
      type: "VEHICLE_MAINTENANCE",
      severity: "WARNING",
      title: `${vehiclesMaintenance} Vehicle in Maintenance`,
      message: `Fleet maintenance alert: One or more vehicles undergoing service.`,
      targetTab: "delivery-vehicles"
    });
  }

  return {
    vehiclesTotal: vehicles.length,
    vehiclesAvailable,
    vehiclesOnTrip,
    vehiclesMaintenance,
    activeTripsCount: activeTrips.length,
    readyTripsCount: readyTrips.length,
    billsReadyForDispatchCount: readyBills.length,
    outForDelivery,
    deliveredToday,
    failedToday,
    exceptions
  };
};
