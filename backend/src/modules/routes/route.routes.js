import express from "express";
import {
  getRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  updateRouteStatus
} from "./route.controller.js";
import { verifyToken, requireRole } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

// Read routes - accessible by all authenticated roles
router.get("/", getRoutes);
router.get("/:id", getRouteById);

// Create route - restricted to Super Admin, Admin, Sales Manager
router.post(
  "/",
  requireRole("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  createRoute
);

// Update route - restricted to Super Admin, Admin, Sales Manager
router.patch(
  "/:id",
  requireRole("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  updateRoute
);

// Toggle route status - restricted to Super Admin, Admin, Sales Manager
router.patch(
  "/:id/status",
  requireRole("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  updateRouteStatus
);

export default router;
