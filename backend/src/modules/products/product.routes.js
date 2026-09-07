import express from "express";
import {
  getProducts,
  getActiveProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStatus
} from "./product.controller.js";
import { verifyToken, requireRole } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// All product routes require authentication
router.use(verifyToken);

// GET /api/products/active - List active products (For order taking & salesman consumption)
router.get("/active", getActiveProducts);

// GET /api/products - List products (Supports pagination, search, company/category/status filters, sorting)
router.get("/", getProducts);

// GET /api/products/:id - Product details
router.get("/:id", getProductById);

// POST /api/products - Create new product (Authorized roles only; Salesmen are blocked)
router.post(
  "/",
  requireRole("SUPER_ADMIN", "ADMIN", "FINANCE", "SALES_MANAGER"),
  createProduct
);

// PATCH /api/products/:id - Update product fields (Authorized roles only)
router.patch(
  "/:id",
  requireRole("SUPER_ADMIN", "ADMIN", "FINANCE", "SALES_MANAGER"),
  updateProduct
);

// PATCH /api/products/:id/status - Toggle ACTIVE / INACTIVE status (Authorized roles only)
router.patch(
  "/:id/status",
  requireRole("SUPER_ADMIN", "ADMIN", "FINANCE", "SALES_MANAGER"),
  updateProductStatus
);

export default router;
