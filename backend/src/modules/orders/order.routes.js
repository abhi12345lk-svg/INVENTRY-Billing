import express from "express";
import {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateDraftOrder,
  submitOrder,
  cancelOrder,
  getCustomerOrders
} from "./order.controller.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

// Create order / draft
router.post("/", createOrder);

// List orders with server-side filters & pagination
router.get("/", getOrders);

// Convenience endpoint for salesman's own orders
router.get("/my", getMyOrders);

// Orders for a specific customer
router.get("/customer/:id", getCustomerOrders);

// Single order details
router.get("/:id", getOrderById);

// Update draft order (supports both PUT and PATCH)
router.put("/:id", updateDraftOrder);
router.patch("/:id", updateDraftOrder);

// Submit order (supports both POST and PATCH)
router.post("/:id/submit", submitOrder);
router.patch("/:id/submit", submitOrder);

// Cancel order (requires reason, supports both POST and PATCH)
router.post("/:id/cancel", cancelOrder);
router.patch("/:id/cancel", cancelOrder);

export default router;
