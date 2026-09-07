import {
  getAreasService,
  getAreaByIdService,
  createAreaService,
  updateAreaService,
  updateAreaStatusService
} from "./area.service.js";

export const getAreas = async (req, res) => {
  try {
    const result = await getAreasService(req.query, req.user);
    return res.status(200).json({
      success: true,
      message: "Areas retrieved successfully.",
      ...result
    });
  } catch (error) {
    console.error("Get areas controller error:", error);
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to fetch areas."
    });
  }
};

export const getAreaById = async (req, res) => {
  try {
    const { id } = req.params;
    const area = await getAreaByIdService(id, req.user);
    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Area not found."
      });
    }
    return res.status(200).json({
      success: true,
      area
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Error retrieving area details."
    });
  }
};

export const createArea = async (req, res) => {
  try {
    const newArea = await createAreaService(req.body, req.user);
    return res.status(201).json({
      success: true,
      message: `Area '${newArea.areaName}' (${newArea.areaCode}) created successfully.`,
      area: newArea
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to create area."
    });
  }
};

export const updateArea = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateAreaService(id, req.body, req.user);
    return res.status(200).json({
      success: true,
      message: `Area ${updated.areaCode} updated successfully.`,
      area: updated
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to update area."
    });
  }
};

export const updateAreaStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status field is required ('ACTIVE' or 'INACTIVE')."
      });
    }
    const updated = await updateAreaStatusService(id, status, req.user);
    return res.status(200).json({
      success: true,
      message: `Area ${updated.areaCode} status changed to ${updated.status}.`,
      area: updated
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to change area status."
    });
  }
};
