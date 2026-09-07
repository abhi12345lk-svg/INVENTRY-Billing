import express from "express";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  updateCustomerStatus
} from "./customer.controller.js";
import { getCustomerOrders } from "../orders/order.controller.js";
import { verifyToken, requireRole } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// All customer routes require authentication
router.use(verifyToken);

// GET /api/customers - List customers (Supports pagination, search, filters, & Salesman Data Scoping)
router.get("/", getCustomers);

// GET /api/customers/:id/orders - Customer order history (respects salesman scope)
router.get("/:id/orders", getCustomerOrders);

// GET /api/customers/:id - Customer details
router.get("/:id", getCustomerById);

// POST /api/customers - Create new customer (Authorized roles)
router.post(
  "/",
  requireRole("SUPER_ADMIN", "ADMIN", "FINANCE", "SALES_MANAGER", "SALESMAN"),
  createCustomer
);

// PATCH /api/customers/:id - Update customer fields
router.patch(
  "/:id",
  requireRole("SUPER_ADMIN", "ADMIN", "FINANCE", "SALES_MANAGER", "SALESMAN"),
  updateCustomer
);

// PATCH /api/customers/:id/status - Change status (ACTIVE, INACTIVE, BLOCKED, ON_HOLD)
router.patch(
  "/:id/status",
  requireRole("SUPER_ADMIN", "ADMIN", "FINANCE", "SALES_MANAGER"),
  updateCustomerStatus
);

export default router;
