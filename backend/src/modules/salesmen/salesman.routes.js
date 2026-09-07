import express from "express";
import {
  getSalesmen,
  getSalesmanById,
  createSalesman,
  updateSalesman,
  updateSalesmanStatus,
  getSalesmanRoutes,
  assignRouteToSalesman,
  unassignRouteFromSalesman
} from "./salesman.controller.js";
import { verifyToken, requireRole } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

// Read salesmen list & details
router.get("/", getSalesmen);
router.get("/:id", getSalesmanById);
router.get("/:id/routes", getSalesmanRoutes);

// Salesmen Profile Management - restricted to Super Admin, Admin, Sales Manager
router.post(
  "/",
  requireRole("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  createSalesman
);

router.patch(
  "/:id",
  requireRole("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  updateSalesman
);

router.patch(
  "/:id/status",
  requireRole("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  updateSalesmanStatus
);

// Route Assignments - restricted to Super Admin, Admin, Sales Manager
router.post(
  "/:id/assign-route",
  requireRole("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  assignRouteToSalesman
);

router.patch(
  "/:id/unassign-route",
  requireRole("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  unassignRouteFromSalesman
);

export default router;
