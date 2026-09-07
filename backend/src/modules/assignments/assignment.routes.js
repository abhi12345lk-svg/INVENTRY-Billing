import express from "express";
import {
  getCustomerAssignmentsList,
  getCustomerAssignmentHistory,
  reassignCustomer,
  getAssignmentSummary
} from "./assignment.controller.js";
import { verifyToken, requireRole } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

// Customer assignments table view
router.get("/customers", getCustomerAssignmentsList);

// Summary metrics of territory assignments - accessible by Super Admin, Admin, Sales Manager
router.get("/summary", getAssignmentSummary);

// Customer assignment history (supports both formats)
router.get("/customer/:id/history", getCustomerAssignmentHistory);
router.get("/history/:id", getCustomerAssignmentHistory);

// Reassign customer - restricted to Super Admin, Admin, Sales Manager
router.post(
  "/customer/:id/assign",
  requireRole("SUPER_ADMIN", "ADMIN", "SALES_MANAGER"),
  reassignCustomer
);

export default router;
