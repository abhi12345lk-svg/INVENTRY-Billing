import {
  getInventoryListService,
  getInventoryDetailsService,
  getInventorySummaryService,
  adjustStockService,
  getStockMovementsService
} from "./inventory.service.js";

export const getInventory = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, companyId, category, status } = req.query;
    const result = await getInventoryListService(
      { search, companyId, category, status },
      { page, limit }
    );
    return res.status(200).json({
      success: true,
      message: "Inventory retrieved successfully.",
      data: result.data,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      limit: result.limit
    });
  } catch (error) {
    console.error("Error in getInventory controller:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Server error retrieving inventory."
    });
  }
};

export const getInventorySummary = async (req, res) => {
  try {
    const summary = await getInventorySummaryService();
    return res.status(200).json({
      success: true,
      message: "Inventory dashboard summary retrieved successfully.",
      data: summary
    });
  } catch (error) {
    console.error("Error in getInventorySummary controller:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Server error retrieving inventory summary."
    });
  }
};

export const getInventoryById = async (req, res) => {
  try {
    const item = await getInventoryDetailsService(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Inventory details retrieved successfully.",
      data: item
    });
  } catch (error) {
    console.error("Error in getInventoryById controller:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Server error retrieving inventory details."
    });
  }
};

export const postStockAdjustment = async (req, res) => {
  try {
    const result = await adjustStockService(req.params.id, req.body, req.user);
    return res.status(200).json({
      success: true,
      message: `Stock successfully adjusted for ${result.inventory.productName}.`,
      data: result
    });
  } catch (error) {
    console.error("Error in postStockAdjustment controller:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Server error adjusting stock."
    });
  }
};

export const getStockMovements = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const inventoryId = req.params.id === "all" ? null : req.params.id;
    const result = await getStockMovementsService(inventoryId, { page, limit });
    return res.status(200).json({
      success: true,
      message: "Stock movements retrieved successfully.",
      data: result.data,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      limit: result.limit
    });
  } catch (error) {
    console.error("Error in getStockMovements controller:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Server error retrieving stock movements."
    });
  }
};
