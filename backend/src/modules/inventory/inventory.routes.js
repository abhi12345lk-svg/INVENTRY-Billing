import express from "express";
import {
  getInventory,
  getInventorySummary,
  getInventoryById,
  postStockAdjustment,
  getStockMovements
} from "./inventory.controller.js";
import { verifyToken, requireRole } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// 1. Dashboard summary route (MUST come before /:id param route)
router.get("/summary/dashboard", verifyToken, getInventorySummary);

// 2. All movements route
router.get("/movements/all", verifyToken, getStockMovements);

// 3. List inventory with search and filters
router.get("/", verifyToken, getInventory);

// 4. Single inventory details
router.get("/:id", verifyToken, getInventoryById);

// 5. Movements for a specific inventory item
router.get("/:id/movements", verifyToken, getStockMovements);

// 6. Stock adjustment (Owner, Admin, Finance only)
router.post(
  "/:id/adjust",
  verifyToken,
  requireRole("SUPER_ADMIN", "ADMIN", "FINANCE"),
  postStockAdjustment
);
router.post(
  "/:id/adjustment",
  verifyToken,
  requireRole("SUPER_ADMIN", "ADMIN", "FINANCE"),
  postStockAdjustment
);

export default router;
