import {
  getSalesmenService,
  getSalesmanByIdService,
  createSalesmanService,
  updateSalesmanService,
  updateSalesmanStatusService,
  getSalesmanRoutesService,
  assignRouteToSalesmanService,
  unassignRouteFromSalesmanService
} from "./salesman.service.js";

export const getSalesmen = async (req, res) => {
  try {
    const result = await getSalesmenService(req.query, req.user);
    return res.status(200).json({
      success: true,
      message: "Salesmen retrieved successfully.",
      ...result
    });
  } catch (error) {
    console.error("Get salesmen controller error:", error);
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to fetch salesmen."
    });
  }
};

export const getSalesmanById = async (req, res) => {
  try {
    const { id } = req.params;
    const salesman = await getSalesmanByIdService(id, req.user);
    if (!salesman) {
      return res.status(404).json({
        success: false,
        message: "Salesman not found."
      });
    }
    return res.status(200).json({
      success: true,
      salesman
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Error retrieving salesman details."
    });
  }
};

export const createSalesman = async (req, res) => {
  try {
    const newSalesman = await createSalesmanService(req.body, req.user);
    return res.status(201).json({
      success: true,
      message: `Salesman '${newSalesman.name}' (${newSalesman.salesmanCode}) registered successfully.`,
      salesman: newSalesman
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to create salesman."
    });
  }
};

export const updateSalesman = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateSalesmanService(id, req.body, req.user);
    return res.status(200).json({
      success: true,
      message: `Salesman ${updated.salesmanCode} updated successfully.`,
      salesman: updated
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to update salesman."
    });
  }
};

export const updateSalesmanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status field is required ('ACTIVE' or 'INACTIVE')."
      });
    }
    const updated = await updateSalesmanStatusService(id, status, req.user);
    return res.status(200).json({
      success: true,
      message: `Salesman ${updated.salesmanCode} status changed to ${updated.status}.`,
      salesman: updated
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to change salesman status."
    });
  }
};

export const getSalesmanRoutes = async (req, res) => {
  try {
    const { id } = req.params;
    const routes = await getSalesmanRoutesService(id, req.user);
    return res.status(200).json({
      success: true,
      routes
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to fetch routes assigned to salesman."
    });
  }
};

export const assignRouteToSalesman = async (req, res) => {
  try {
    const { id } = req.params;
    const { routeId, reason } = req.body;
    const assignment = await assignRouteToSalesmanService({ salesmanId: id, routeId, reason }, req.user);
    return res.status(201).json({
      success: true,
      message: `Route ${routeId} successfully assigned to salesman ${id}.`,
      assignment
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to assign route to salesman."
    });
  }
};

export const unassignRouteFromSalesman = async (req, res) => {
  try {
    const { id } = req.params;
    const { routeId, reason } = req.body;
    const unassigned = await unassignRouteFromSalesmanService({ salesmanId: id, routeId, reason }, req.user);
    return res.status(200).json({
      success: true,
      message: `Route ${routeId} unassigned from salesman ${id}.`,
      unassigned
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to unassign route from salesman."
    });
  }
};
