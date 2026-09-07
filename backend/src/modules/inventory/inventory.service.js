import {
  findInventory,
  findInventoryById,
  findInventoryByProductId,
  getInventoryDashboardSummary,
  adjustStockRecord,
  getStockMovements
} from "./inventory.repository.js";
import { validateStockAdjustment } from "./inventory.validator.js";

export const getInventoryListService = async (query = {}, pagination = {}) => {
  return await findInventory(query, pagination);
};

export const getInventoryDetailsService = async (id) => {
  const item = await findInventoryById(id);
  if (!item) {
    throw { status: 404, message: "Inventory record not found." };
  }
  return item;
};

export const getInventorySummaryService = async () => {
  return await getInventoryDashboardSummary();
};

export const adjustStockService = async (inventoryId, body, user) => {
  // First fetch the inventory to check currentStock
  const existing = await findInventoryById(inventoryId);
  if (!existing) {
    throw { status: 404, message: "Inventory record not found." };
  }

  const validation = validateStockAdjustment(body, user, existing.currentStock);

  if (validation.isForbidden) {
    throw { status: 403, message: validation.errors.join(" ") };
  }

  if (!validation.isValid) {
    throw { status: 400, message: validation.errors.join(" ") };
  }

  try {
    return await adjustStockRecord(
      inventoryId,
      {
        adjustmentType: body.adjustmentType,
        quantity: validation.parsedQuantity,
        reason: body.reason
      },
      user
    );
  } catch (err) {
    throw { status: 400, message: err.message || "Failed to adjust stock." };
  }
};

export const getStockMovementsService = async (inventoryId, pagination) => {
  return await getStockMovements(inventoryId, pagination);
};
