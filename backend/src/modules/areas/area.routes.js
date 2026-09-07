import express from "express";
import {
  getAreas,
  getAreaById,
  createArea,
  updateArea,
  updateAreaStatus
} from "./area.controller.js";
import { verifyToken, requireRole } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

// Read areas - accessible by all authenticated roles
router.get("/", getAreas);
router.get("/:id", getAreaById);

// Create area - restricted to Super Admin, Admin, Sales Manager
router.post(
  "/",
  requireRole("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  createArea
);

// Update area - restricted to Super Admin, Admin, Sales Manager
router.patch(
  "/:id",
  requireRole("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  updateArea
);

// Toggle area status - restricted to Super Admin, Admin, Sales Manager
router.patch(
  "/:id/status",
  requireRole("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  updateAreaStatus
);

export default router;
