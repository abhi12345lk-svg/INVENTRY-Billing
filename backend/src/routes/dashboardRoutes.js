import express from "express";
import { getOwnerDashboard } from "../controllers/dashboardController.js";
import { verifyToken, requireRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/dashboard/owner - Protected route (SUPER_ADMIN only!)
router.get("/owner", verifyToken, requireRole("SUPER_ADMIN"), getOwnerDashboard);

export default router;
