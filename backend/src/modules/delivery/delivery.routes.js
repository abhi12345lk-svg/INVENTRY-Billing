import express from "express";
import { verifyToken } from "../../middlewares/authMiddleware.js";
import * as controller from "./delivery.controller.js";

export const deliveryRouter = express.Router();
export const vehicleRouter = express.Router();

// ==========================================
// VEHICLE ROUTES (/api/vehicles)
// ==========================================
vehicleRouter.use(verifyToken);

vehicleRouter.get("/", controller.getVehicles);
vehicleRouter.post("/", controller.createVehicle);
vehicleRouter.get("/:id", controller.getVehicleById);
vehicleRouter.patch("/:id", controller.updateVehicle);
vehicleRouter.patch("/:id/status", controller.updateVehicleStatus);

// ==========================================
// DELIVERY & TRIP ROUTES (/api/delivery)
// ==========================================
deliveryRouter.use(verifyToken);

// Dashboard Summary & Ready Bills
deliveryRouter.get("/summary/dashboard", controller.getDashboardSummary);
deliveryRouter.get("/ready-bills", controller.getReadyBills);

// Trips Endpoints
deliveryRouter.get("/trips", controller.getTrips);
deliveryRouter.get("/trips/:id", controller.getTripById);
deliveryRouter.post("/trips", controller.createTrip);
deliveryRouter.patch("/trips/:id/dispatch", controller.dispatchTrip);
deliveryRouter.patch("/trips/:id/start", controller.startTrip);
deliveryRouter.patch("/trips/:tripId/delivery/:billId", controller.updateDeliveryItem);
deliveryRouter.patch("/trips/:id/complete", controller.completeTrip);

export default deliveryRouter;
