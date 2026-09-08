import {
  getSchemesService,
  getSchemeByIdService,
  createSchemeService,
  updateSchemeService,
  toggleSchemeStatusService,
  deleteSchemeService
} from "./scheme.service.js";

export const getSchemes = async (req, res) => {
  try {
    const result = await getSchemesService(req.query);
    return res.status(200).json({
      success: true,
      message: "Trade schemes retrieved successfully.",
      ...result
    });
  } catch (error) {
    console.error("Get schemes controller error:", error);
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to retrieve trade schemes."
    });
  }
};

export const getSchemeById = async (req, res) => {
  try {
    const { id } = req.params;
    const scheme = await getSchemeByIdService(id);
    return res.status(200).json({
      success: true,
      data: scheme
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to retrieve scheme details."
    });
  }
};

export const createScheme = async (req, res) => {
  try {
    const newScheme = await createSchemeService(req.body, req.user);
    return res.status(201).json({
      success: true,
      message: `Trade scheme '${newScheme.schemeName}' (${newScheme.schemeCode}) created successfully.`,
      scheme: newScheme
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to create trade scheme."
    });
  }
};

export const updateScheme = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateSchemeService(id, req.body, req.user);
    return res.status(200).json({
      success: true,
      message: `Trade scheme '${updated.schemeName}' updated successfully.`,
      scheme: updated
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to update trade scheme."
    });
  }
};

export const toggleSchemeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await toggleSchemeStatusService(id, req.user);
    return res.status(200).json({
      success: true,
      message: `Scheme status changed to ${updated.status}.`,
      scheme: updated
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to update scheme status."
    });
  }
};

export const deleteScheme = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteSchemeService(id);
    return res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to delete scheme."
    });
  }
};
