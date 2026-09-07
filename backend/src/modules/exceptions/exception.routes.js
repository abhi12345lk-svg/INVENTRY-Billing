import express from "express";
import { exceptionController } from "./exception.controller.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";
import {
  validateExceptionStatusChange,
  validateApprovalDecision,
  requireOwnerApprovalRole,
  requireExceptionResolutionRole
} from "./exception.validator.js";

export const exceptionRouter = express.Router();
export const approvalRouter = express.Router();

// Exceptions routes
exceptionRouter.post("/reset", verifyToken, exceptionController.resetDemoData);
exceptionRouter.get("/summary", verifyToken, exceptionController.getSummary);
exceptionRouter.get("/", verifyToken, exceptionController.getExceptions);
exceptionRouter.get("/:id", verifyToken, exceptionController.getExceptionById);
exceptionRouter.patch(
  "/:id/status",
  verifyToken,
  requireExceptionResolutionRole,
  validateExceptionStatusChange,
  exceptionController.updateStatus
);

// Approvals routes
approvalRouter.get("/summary", verifyToken, exceptionController.getApprovalSummary);
approvalRouter.get("/", verifyToken, exceptionController.getApprovals);
approvalRouter.get("/:id", verifyToken, exceptionController.getApprovalById);
approvalRouter.patch(
  "/:id/approve",
  verifyToken,
  requireOwnerApprovalRole,
  validateApprovalDecision,
  exceptionController.approveApproval
);
approvalRouter.patch(
  "/:id/reject",
  verifyToken,
  requireOwnerApprovalRole,
  validateApprovalDecision,
  exceptionController.rejectApproval
);
