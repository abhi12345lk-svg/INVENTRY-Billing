import express from "express";
import {
  getPayments,
  getPaymentById,
  getUnmatchedPayments,
  recordPayment,
  identifyCustomer,
  mapPayment,
  cancelPayment
} from "./payment.controller.js";
import { verifyToken, requireRole } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

// List all payments (with filters, pagination, search, salesman scoped)
router.get("/", getPayments);

// Unmatched UPI suspense queue
router.get("/unmatched", requireRole("SUPER_ADMIN", "ADMIN", "FINANCE", "SALES_MANAGER"), getUnmatchedPayments);

// Single payment details
router.get("/:id", getPaymentById);

// Record payment entry (Cash, UPI, Cheque)
router.post("/", recordPayment);

// Identify customer for unmatched UPI payment
router.patch(
  "/:id/identify-customer",
  requireRole("SUPER_ADMIN", "ADMIN", "FINANCE", "SALES_MANAGER"),
  identifyCustomer
);

// Map payment to one or multiple invoices
router.patch(
  "/:id/map",
  requireRole("SUPER_ADMIN", "ADMIN", "FINANCE", "SALES_MANAGER"),
  mapPayment
);

// Cancel payment with reason
router.patch(
  "/:id/cancel",
  requireRole("SUPER_ADMIN", "ADMIN", "FINANCE"),
  cancelPayment
);

export default router;
