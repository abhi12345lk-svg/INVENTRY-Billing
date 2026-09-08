import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import customerRoutes from "./modules/customers/customer.routes.js";
import productRoutes from "./modules/products/product.routes.js";
import areaRoutes from "./modules/areas/area.routes.js";
import routeRoutes from "./modules/routes/route.routes.js";
import salesmanRoutes from "./modules/salesmen/salesman.routes.js";
import assignmentRoutes from "./modules/assignments/assignment.routes.js";
import orderRoutes from "./modules/orders/order.routes.js";
import billingRoutes from "./modules/billing/billing.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import inventoryRoutes from "./modules/inventory/inventory.routes.js";
import { deliveryRouter, vehicleRouter } from "./modules/delivery/delivery.routes.js";
import { exceptionRouter, approvalRouter } from "./modules/exceptions/exception.routes.js";
import reportRoutes from "./modules/reports/report.routes.js";
import schemeRoutes from "./modules/schemes/scheme.routes.js";
import { connectDB } from "./config/database.js";
import { seedDemoData } from "./config/demo.seed.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

// Initialize MongoDB Atlas connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/salesmen", salesmanRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bills", billingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/delivery", deliveryRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/exceptions", exceptionRouter);
app.use("/api/approvals", approvalRouter);
app.use("/api/reports", reportRoutes);

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    system: "FMCG Distributor ERP Backend",
    version: "1.0.0-demo",
    timestamp: new Date().toISOString()
  });
});

export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 Distributor ERP Backend running on port ${PORT}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🔗 Customers API: http://localhost:${PORT}/api/customers`);
    console.log(`=================================================`);
    // Auto-seed demo data (skips if data already exists)
    seedDemoData();
  });
} else {
  seedDemoData();
}
