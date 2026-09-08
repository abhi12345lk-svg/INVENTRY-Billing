import express from "express";
import {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  toggleSchemeStatus,
  deleteScheme
} from "./scheme.controller.js";
import { verifyToken, requireRole } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

// Read schemes: accessible by all authenticated roles (Admin, Sales Manager, Salesman)
router.get("/", getSchemes);
router.get("/:id", getSchemeById);

// Create scheme: Admin, Sales Manager
router.post(
  "/",
  requireRole("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  createScheme
);

// Update scheme: Admin, Sales Manager
router.put(
  "/:id",
  requireRole("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  updateScheme
);

// Toggle scheme status: Admin, Sales Manager
router.patch(
  "/:id/status",
  requireRole("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  toggleSchemeStatus
);

// Delete scheme: Admin only
router.delete(
  "/:id",
  requireRole("SUPER_ADMIN", "ADMIN"),
  deleteScheme
);

export default router;
