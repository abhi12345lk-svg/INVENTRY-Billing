import express from "express";
import { login, getDemoUsers, getProfile } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.get("/demo-users", getDemoUsers);
router.get("/profile", getProfile);

export default router;
