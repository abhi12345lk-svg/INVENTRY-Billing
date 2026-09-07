import {
  getRoutesService,
  getRouteByIdService,
  createRouteService,
  updateRouteService,
  updateRouteStatusService
} from "./route.service.js";

export const getRoutes = async (req, res) => {
  try {
    const result = await getRoutesService(req.query, req.user);
    return res.status(200).json({
      success: true,
      message: "Routes retrieved successfully.",
      ...result
    });
  } catch (error) {
    console.error("Get routes controller error:", error);
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to fetch routes."
    });
  }
};

export const getRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await getRouteByIdService(id, req.user);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found."
      });
    }
    return res.status(200).json({
      success: true,
      route
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Error retrieving route details."
    });
  }
};

export const createRoute = async (req, res) => {
  try {
    const newRoute = await createRouteService(req.body, req.user);
    return res.status(201).json({
      success: true,
      message: `Route '${newRoute.routeName}' (${newRoute.routeCode}) created successfully.`,
      route: newRoute
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to create route."
    });
  }
};

export const updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateRouteService(id, req.body, req.user);
    return res.status(200).json({
      success: true,
      message: `Route ${updated.routeCode} updated successfully.`,
      route: updated
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to update route."
    });
  }
};

export const updateRouteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status field is required ('ACTIVE' or 'INACTIVE')."
      });
    }
    const updated = await updateRouteStatusService(id, status, req.user);
    return res.status(200).json({
      success: true,
      message: `Route ${updated.routeCode} status changed to ${updated.status}.`,
      route: updated
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to change route status."
    });
  }
};
