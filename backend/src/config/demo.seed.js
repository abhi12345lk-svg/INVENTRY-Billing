// backend/src/config/demo.seed.js
// Runs once on server startup — seeds 1 complete demo flow for client demo
// Area → Route → Salesman → Customer → Products → Inventory → Order → Bill → Payment

import { createAreaRecord } from "../modules/areas/area.repository.js";
import { createRouteRecord } from "../modules/routes/route.repository.js";
import { createSalesmanRecord } from "../modules/salesmen/salesman.repository.js";
import { createCustomerRecord, findCustomers } from "../modules/customers/customer.repository.js";
import { createProductRecord } from "../modules/products/product.repository.js";
import { findInventoryByProductId, adjustStockRecord } from "../modules/inventory/inventory.repository.js";
import { createOrderRecord, submitOrderRecord } from "../modules/orders/order.repository.js";
import { generateBillFromOrderService, lockBillService } from "../modules/billing/billing.service.js";
import { createPaymentRecord, mapPaymentToBills } from "../modules/payments/payment.repository.js";

const DEMO_USER = { name: "Rajesh Sharma", role: "SUPER_ADMIN", id: "user-owner-01" };

export async function seedDemoData() {
  try {
    // Check if demo data already exists (avoid duplicate seed on restart)
    const existingCustomers = await findCustomers({ page: 1, limit: 1 });
    if (existingCustomers.total > 0) {
      console.log("ℹ️  Demo data already present. Skipping seed.");
      return;
    }

    console.log("🌱 Seeding demo data for client presentation...");

    // ── 1. Area ──────────────────────────────────────────────
    const area = await createAreaRecord({
      areaName: "Raipur Central",
      city: "Raipur",
      state: "Chhattisgarh",
      pincode: "492001",
      description: "Central Commercial Territory"
    }, DEMO_USER);

    // ── 2. Route ──────────────────────────────────────────────
    const route = await createRouteRecord({
      routeName: "Route A - Sadar Bazaar",
      areaId: area.id,
      areaName: area.areaName,
      beatFrequency: "DAILY",
      visitDays: ["MON", "WED", "FRI"],
      description: "Primary Sadar Wholesale Route"
    }, DEMO_USER);

    // ── 3. Salesman ───────────────────────────────────────────
    const salesman = await createSalesmanRecord({
      name: "Rahul Kumar",
      employeeCode: "EMP-001",
      mobile: "9876543213",
      email: "salesman@distributorerp.com",
      assignedRouteId: route.id,
      assignedRouteName: route.routeName
    }, DEMO_USER);

    // ── 4. Customer ───────────────────────────────────────────
    const customer = await createCustomerRecord({
      customerName: "Sharma General Store",
      shopName: "Sharma General Store",
      ownerName: "Ramesh Sharma",
      mobile: "9876500001",
      address: "Shop 12, Sadar Bazaar Main Road, Raipur",
      city: "Raipur",
      pincode: "492001",
      areaId: area.id,
      areaName: area.areaName,
      routeId: route.id,
      routeName: route.routeName,
      salesmanId: salesman.id,
      salesmanName: salesman.name,
      creditLimit: 50000,
      paymentTerms: "7_DAYS",
      gstin: "22AAAAA0000A1Z5",
      outletType: "GENERAL_TRADE"
    }, DEMO_USER);

    // ── 5. Products ───────────────────────────────────────────
    const product1 = await createProductRecord({
      productName: "Maggi 2-Minute Masala Noodles 70g",
      sku: "NEST-MAG-70",
      companyId: "COMP-NESTLE",
      companyName: "Nestlé India",
      category: "Noodles",
      unit: "PACK",
      packSize: "70g",
      mrp: 14,
      saleRate: 12.5,
      purchaseRate: 10.0,
      taxRate: 5,
      minimumStock: 50
    }, DEMO_USER);

    const product2 = await createProductRecord({
      productName: "Parle-G Glucose Biscuits 800g",
      sku: "PARLE-G-800",
      companyId: "COMP-PARLE",
      companyName: "Parle Products",
      category: "Biscuits",
      unit: "PACK",
      packSize: "800g",
      mrp: 60,
      saleRate: 54,
      purchaseRate: 48,
      taxRate: 5,
      minimumStock: 30
    }, DEMO_USER);

    const product3 = await createProductRecord({
      productName: "Amul Butter 500g",
      sku: "AMUL-BUT-500",
      companyId: "COMP-AMUL",
      companyName: "Amul (GCMMF)",
      category: "Dairy",
      unit: "PACK",
      packSize: "500g",
      mrp: 270,
      saleRate: 255,
      purchaseRate: 240,
      taxRate: 5,
      minimumStock: 20
    }, DEMO_USER);

    // ── 6. Inventory Stock ────────────────────────────────────
    const inv1 = await findInventoryByProductId(product1.id);
    if (inv1) await adjustStockRecord(inv1.id, { adjustmentType: "ADJUSTMENT_IN", quantity: 500, reason: "Opening stock - Nestlé depot primary" }, DEMO_USER);

    const inv2 = await findInventoryByProductId(product2.id);
    if (inv2) await adjustStockRecord(inv2.id, { adjustmentType: "ADJUSTMENT_IN", quantity: 200, reason: "Opening stock - Parle depot primary" }, DEMO_USER);

    const inv3 = await findInventoryByProductId(product3.id);
    if (inv3) await adjustStockRecord(inv3.id, { adjustmentType: "ADJUSTMENT_IN", quantity: 80, reason: "Opening stock - Amul depot primary" }, DEMO_USER);

    // ── 7. Demo Order ─────────────────────────────────────────
    const order = await createOrderRecord({
      customerId: customer.id,
      customerName: customer.customerName,
      customerCode: customer.customerCode,
      routeId: route.id,
      routeName: route.routeName,
      salesmanId: salesman.id,
      salesmanName: salesman.name,
      orderDate: new Date().toISOString(),
      items: [
        {
          productId: product1.id,
          productName: product1.productName,
          productCode: product1.productCode,
          sku: product1.sku,
          quantity: 20,
          rate: product1.saleRate,
          mrp: product1.mrp,
          unit: product1.unit,
          taxPercent: product1.taxRate
        },
        {
          productId: product2.id,
          productName: product2.productName,
          productCode: product2.productCode,
          sku: product2.sku,
          quantity: 5,
          rate: product2.saleRate,
          mrp: product2.mrp,
          unit: product2.unit,
          taxPercent: product2.taxRate
        }
      ],
      remarks: "Regular weekly order - demo"
    });

    // Submit order
    await submitOrderRecord(order.id, DEMO_USER);

    // ── 8. Generate & Lock Bill ───────────────────────────────
    const billResult = await generateBillFromOrderService(order.id, DEMO_USER);
    const bill = billResult.bill || billResult;
    await lockBillService(bill.id, DEMO_USER);

    // ── 9. Record & Map Payment ───────────────────────────────
    const payment = await createPaymentRecord({
      customerId: customer.id,
      customerName: customer.customerName,
      customerCode: customer.customerCode,
      salesmanId: salesman.id,
      salesmanName: salesman.name,
      paymentMode: "UPI",
      amount: bill.totalAmount,
      referenceNumber: "UPI-DEMO-998811",
      payerName: "Ramesh Sharma (PhonePe)",
      notes: "Full payment against demo invoice"
    }, DEMO_USER);

    await mapPaymentToBills(payment.id, [
      { billId: bill.id, allocatedAmount: bill.totalAmount }
    ], DEMO_USER);

    console.log(`✅ Demo seed complete!`);
    console.log(`   📍 Area     : ${area.areaName}`);
    console.log(`   🛣️  Route    : ${route.routeName}`);
    console.log(`   👤 Salesman : ${salesman.name} (${salesman.salesmanCode})`);
    console.log(`   🏪 Customer : ${customer.customerName} (${customer.customerCode})`);
    console.log(`   📦 Products : ${product1.productCode}, ${product2.productCode}, ${product3.productCode}`);
    console.log(`   📋 Order    : ${order.orderNumber}`);
    console.log(`   🧾 Invoice  : ${bill.billNumber} — ₹${bill.totalAmount}`);
    console.log(`   💰 Payment  : ${payment.paymentNumber} (MAPPED ✓)`);

  } catch (err) {
    console.error("⚠️  Demo seed warning (non-fatal):", err.message || err);
  }
}
