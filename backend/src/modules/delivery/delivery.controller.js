import * as deliveryService from "./delivery.service.js";

// ==========================================
// VEHICLE CONTROLLER
// ==========================================

export const getVehicles = async (req, res) => {
  try {
    const { search, status, page, limit } = req.query;
    const result = await deliveryService.listVehicles({ search, status, page, limit });
    return res.status(200).json({
      success: true,
      count: result.vehicles.length,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      data: result.vehicles
    });
  } catch (error) {
    console.error("getVehicles error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to retrieve vehicles."
    });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await deliveryService.getVehicleDetails(req.params.id);
    return res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to retrieve vehicle details."
    });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const newVehicle = await deliveryService.registerVehicle(req.body, req.user);
    return res.status(201).json({
      success: true,
      message: `Vehicle ${newVehicle.vehicleNumber} registered successfully.`,
      data: newVehicle
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to register vehicle."
    });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const updated = await deliveryService.updateVehicle(req.params.id, req.body, req.user);
    return res.status(200).json({
      success: true,
      message: `Vehicle ${updated.vehicleNumber} updated successfully.`,
      data: updated
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update vehicle."
    });
  }
};

export const updateVehicleStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await deliveryService.setVehicleStatus(req.params.id, status, req.user);
    return res.status(200).json({
      success: true,
      message: `Vehicle status changed to ${status}.`,
      data: updated
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to change vehicle status."
    });
  }
};

// ==========================================
// DELIVERY & TRIP CONTROLLER
// ==========================================

export const getReadyBills = async (req, res) => {
  try {
    const { routeId, salesmanId } = req.query;
    const bills = await deliveryService.getReadyBills({ routeId, salesmanId });
    return res.status(200).json({
      success: true,
      count: bills.length,
      data: bills
    });
  } catch (error) {
    console.error("getReadyBills error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve bills ready for dispatch."
    });
  }
};

export const getTrips = async (req, res) => {
  try {
    const { status, vehicle, route, search, page, limit } = req.query;
    const result = await deliveryService.listTrips({ status, vehicle, route, search, page, limit }, req.user);
    return res.status(200).json({
      success: true,
      count: result.trips.length,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      data: result.trips
    });
  } catch (error) {
    console.error("getTrips error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve delivery trips."
    });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await deliveryService.getTripDetails(req.params.id);
    return res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to retrieve trip details."
    });
  }
};

export const createTrip = async (req, res) => {
  try {
    const trip = await deliveryService.createTrip(req.body, req.user);
    return res.status(201).json({
      success: true,
      message: `Delivery trip ${trip.tripNumber} planned successfully.`,
      data: trip
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create delivery trip."
    });
  }
};

export const dispatchTrip = async (req, res) => {
  try {
    const trip = await deliveryService.dispatchTrip(req.params.id, req.user);
    return res.status(200).json({
      success: true,
      message: `Trip ${trip.tripNumber} marked as DISPATCHED. Vehicle and invoices updated.`,
      data: trip
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to dispatch trip."
    });
  }
};

export const startTrip = async (req, res) => {
  try {
    const trip = await deliveryService.startTrip(req.params.id, req.user);
    return res.status(200).json({
      success: true,
      message: `Trip ${trip.tripNumber} started. Invoices are now OUT FOR DELIVERY.`,
      data: trip
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to start delivery trip."
    });
  }
};

export const updateDeliveryItem = async (req, res) => {
  try {
    const { tripId, billId } = req.params;
    const trip = await deliveryService.updateDeliveryItem(tripId, billId, req.body, req.user);
    return res.status(200).json({
      success: true,
      message: `Delivery for invoice ${billId} updated to ${req.body.status}.`,
      data: trip
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update delivery item."
    });
  }
};

export const completeTrip = async (req, res) => {
  try {
    const trip = await deliveryService.completeTrip(req.params.id, req.user);
    return res.status(200).json({
      success: true,
      message: `Trip ${trip.tripNumber} marked as COMPLETED. Vehicle released back to available.`,
      data: trip
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to complete delivery trip."
    });
  }
};

export const getDashboardSummary = async (req, res) => {
  try {
    const summary = await deliveryService.getDashboardSummary();
    return res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error("getDashboardSummary error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve delivery dashboard metrics."
    });
  }
};
