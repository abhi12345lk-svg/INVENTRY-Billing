// backend/src/modules/reports/report.routes.js

import express from "express";
import { reportController } from "./report.controller.js";
import { verifyToken, requireRole } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// All report endpoints require valid JWT authentication
router.use(verifyToken);

// Executive Summary - Owner, Admin, Finance, Sales Manager
router.get(
  "/executive-summary",
  requireRole("SUPER_ADMIN", "ADMIN", "FINANCE", "SALES_MANAGER"),
  reportController.getExecutiveSummary
);

// Sales Analytics - Financial / Executive roles only
router.get(
  "/sales",
  requireRole("SUPER_ADMIN", "ADMIN", "FINANCE"),
  reportController.getSalesAnalytics
);

// Collection Analytics - Financial / Executive roles only
router.get(
  "/collections",
  requireRole("SUPER_ADMIN", "ADMIN", "FINANCE"),
  reportController.getCollectionAnalytics
);

// Outstanding & Receivables - Financial / Executive roles only
router.get(
  "/outstanding",
  requireRole("SUPER_ADMIN", "ADMIN", "FINANCE"),
  reportController.getOutstandingReport
);

// Top Customers - Owner, Admin, Finance
router.get(
  "/top-customers",
  requireRole("SUPER_ADMIN", "ADMIN", "FINANCE"),
  reportController.getTopCustomers
);

// Top Products - Owner, Admin, Finance, Sales Manager
router.get(
  "/top-products",
  requireRole("SUPER_ADMIN", "ADMIN", "FINANCE", "SALES_MANAGER"),
  reportController.getTopProducts
);

// Salesman Performance - Owner, Admin, Finance, Sales Manager
router.get(
  "/salesmen",
  requireRole("SUPER_ADMIN", "ADMIN", "FINANCE", "SALES_MANAGER"),
  reportController.getSalesmanPerformance
);

// Exception Summary - Owner, Admin, Finance
router.get(
  "/exceptions",
  requireRole("SUPER_ADMIN", "ADMIN", "FINANCE"),
  reportController.getExceptionSummary
);

export default router;
