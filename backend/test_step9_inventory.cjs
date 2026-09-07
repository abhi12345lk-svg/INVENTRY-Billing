/**
 * Comprehensive Automated Test Suite for STEP 9:
 * INVENTORY & BASIC STOCK MANAGEMENT ENGINE (DEMO VERSION)
 */

const http = require("http");

const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(`http://localhost:5005${path}`);
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({ status: res.statusCode, data: json });
      });
    });

    req.on("error", (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function runTests() {
  console.log("================================================================================");
  console.log("🧪 STARTING STEP 9: INVENTORY & BASIC STOCK MANAGEMENT TEST SUITE");
  console.log("================================================================================\n");

  let passed = 0;
  let failed = 0;

  const assert = (condition, title) => {
    if (condition) {
      console.log(`  ✅ PASS: ${title}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${title}`);
      failed++;
    }
  };

  try {
    // ----------------------------------------------------
    // PHASE 1: Authentication & Health Check
    // ----------------------------------------------------
    console.log("--- Phase 1: Authentication & Health ---");
    const health = await request("GET", "/api/health");
    assert(health.status === 200 && health.data.status === "online", "Health check /api/health (Criteria 1)");

    const ownerLogin = await request("POST", "/api/auth/login", {
      emailOrMobile: "owner@distributorerp.com",
      password: "password123",
      role: "SUPER_ADMIN"
    });
    const ownerToken = ownerLogin.data?.token;
    assert(ownerLogin.status === 200 && !!ownerToken, "Owner Login (SUPER_ADMIN) (Criteria 2)");

    const salesmanLogin = await request("POST", "/api/auth/login", {
      emailOrMobile: "salesman@distributorerp.com",
      password: "password123",
      role: "SALESMAN"
    });
    const salesmanToken = salesmanLogin.data?.token;
    assert(salesmanLogin.status === 200 && !!salesmanToken, "Salesman Login (SALESMAN) (Criteria 3)");

    const financeLogin = await request("POST", "/api/auth/login", {
      emailOrMobile: "finance@distributorerp.com",
      password: "password123",
      role: "FINANCE"
    });
    const financeToken = financeLogin.data?.token;
    assert(financeLogin.status === 200 && !!financeToken, "Finance Login (FINANCE)");

    // ----------------------------------------------------
    // PHASE 2: Inventory Query, Summary & Search
    // ----------------------------------------------------
    console.log("\n--- Phase 2: Inventory Query, Summary & Filters ---");
    const invList = await request("GET", "/api/inventory", null, ownerToken);
    assert(invList.status === 200 && Array.isArray(invList.data.data), "GET /api/inventory returns list (Criteria 4)");
    assert(invList.data.total >= 20, `Pre-seeded 20 realistic FMCG products (Found: ${invList.data.total})`);

    const invSummary = await request("GET", "/api/inventory/summary/dashboard", null, ownerToken);
    assert(invSummary.status === 200 && invSummary.data.success, "GET /api/inventory/summary/dashboard (Criteria 5)");
    const sumData = invSummary.data.data;
    assert(sumData.totalProducts >= 20, `Summary reports totalProducts: ${sumData.totalProducts}`);
    assert(sumData.totalStockUnits > 10000, `Summary reports totalStockUnits: ${sumData.totalStockUnits}`);
    assert(sumData.stockValue > 1000000, `Summary reports stockValue: ₹${sumData.stockValue.toLocaleString("en-IN")}`);
    assert(sumData.lowStockProducts >= 1, `Summary reports lowStockProducts >= 1 (${sumData.lowStockProducts})`);
    assert(sumData.outOfStockProducts >= 1, `Summary reports outOfStockProducts >= 1 (${sumData.outOfStockProducts})`);

    // Search
    const searchMaggi = await request("GET", "/api/inventory?search=Maggi", null, ownerToken);
    assert(searchMaggi.status === 200 && searchMaggi.data.data.length >= 1, "Search inventory for 'Maggi' (Criteria 6)");

    // Low stock filter
    const lowStockList = await request("GET", "/api/inventory?status=LOW_STOCK", null, ownerToken);
    assert(
      lowStockList.status === 200 && lowStockList.data.data.every((i) => i.status === "LOW_STOCK"),
      "Filter LOW_STOCK returns only low stock items (Criteria 7)"
    );

    // Out of stock filter
    const outOfStockList = await request("GET", "/api/inventory?status=OUT_OF_STOCK", null, ownerToken);
    assert(
      outOfStockList.status === 200 && outOfStockList.data.data.every((i) => i.status === "OUT_OF_STOCK"),
      "Filter OUT_OF_STOCK returns only out of stock items (Criteria 8)"
    );

    // ----------------------------------------------------
    // PHASE 3: Inventory Details & Movements
    // ----------------------------------------------------
    console.log("\n--- Phase 3: Inventory Details & Stock Movements ---");
    const targetItem = invList.data.data[0];
    const details = await request("GET", `/api/inventory/${targetItem.id}`, null, ownerToken);
    assert(details.status === 200 && details.data.data.productName === targetItem.productName, "GET /api/inventory/:id (Criteria 9)");
    assert(Array.isArray(details.data.data.recentMovements), "Details includes recentMovements array");

    const movements = await request("GET", `/api/inventory/${targetItem.id}/movements`, null, ownerToken);
    assert(movements.status === 200 && Array.isArray(movements.data.data), "GET /api/inventory/:id/movements (Criteria 10)");
    assert(movements.data.data.length >= 1, "Product has initial OPENING_STOCK movement ledger");

    // ----------------------------------------------------
    // PHASE 4: Stock Adjustment & Audit Trail
    // ----------------------------------------------------
    console.log("\n--- Phase 4: Stock Adjustments & Validation ---");
    const preStock = targetItem.currentStock;

    // 11. Adjustment IN
    const adjustIn = await request(
      "POST",
      `/api/inventory/${targetItem.id}/adjust`,
      {
        adjustmentType: "ADJUSTMENT_IN",
        quantity: 50,
        reason: "Received complimentary supplier promo cases"
      },
      ownerToken
    );
    assert(adjustIn.status === 200 && adjustIn.data.success, "Stock adjustment IN (Criteria 11)");
    assert(adjustIn.data.data.inventory.currentStock === preStock + 50, "Current stock increased by 50");
    assert(adjustIn.data.data.movement.movementType === "ADJUSTMENT_IN", "Stock movement record type is ADJUSTMENT_IN");

    // 12. Adjustment OUT
    const adjustOut = await request(
      "POST",
      `/api/inventory/${targetItem.id}/adjust`,
      {
        adjustmentType: "ADJUSTMENT_OUT",
        quantity: 20,
        reason: "Damaged box discarded during warehouse handling"
      },
      ownerToken
    );
    assert(adjustOut.status === 200 && adjustOut.data.success, "Stock adjustment OUT (Criteria 12)");
    assert(adjustOut.data.data.inventory.currentStock === preStock + 30, "Current stock decreased by 20");
    assert(adjustOut.data.data.movement.movementType === "ADJUSTMENT_OUT", "Stock movement record type is ADJUSTMENT_OUT");

    // 13. Negative quantity rejection
    const negQty = await request(
      "POST",
      `/api/inventory/${targetItem.id}/adjust`,
      {
        adjustmentType: "ADJUSTMENT_IN",
        quantity: -10,
        reason: "Test negative"
      },
      ownerToken
    );
    assert(negQty.status === 400, "Negative quantity rejected (HTTP 400) (Criteria 13)");

    // 14. Missing reason rejection
    const missingReason = await request(
      "POST",
      `/api/inventory/${targetItem.id}/adjust`,
      {
        adjustmentType: "ADJUSTMENT_IN",
        quantity: 10,
        reason: ""
      },
      ownerToken
    );
    assert(missingReason.status === 400, "Missing reason rejected (HTTP 400) (Criteria 14)");

    // 15. Stock cannot become negative
    const overDeduct = await request(
      "POST",
      `/api/inventory/${targetItem.id}/adjust`,
      {
        adjustmentType: "ADJUSTMENT_OUT",
        quantity: 999999,
        reason: "Attempt to drain stock below 0"
      },
      ownerToken
    );
    assert(overDeduct.status === 400, "Excessive deduction rejected; stock cannot become negative (HTTP 400) (Criteria 15)");

    // 16. Salesman cannot adjust stock
    const salesmanAdjust = await request(
      "POST",
      `/api/inventory/${targetItem.id}/adjust`,
      {
        adjustmentType: "ADJUSTMENT_IN",
        quantity: 10,
        reason: "Salesman trying to adjust stock"
      },
      salesmanToken
    );
    assert(salesmanAdjust.status === 403, "Salesman cannot adjust stock (HTTP 403 Forbidden) (Criteria 16)");

    // ----------------------------------------------------
    // PHASE 5: Billing Integration & Automatic Stock Deduction
    // ----------------------------------------------------
    console.log("\n--- Phase 5: Billing Integration & Automatic Stock Deduction ---");
    // Create a fresh test order with Maggi
    const freshOrderRes = await request(
      "POST",
      "/api/orders",
      {
        customerId: "cus-001",
        items: [
          {
            productId: "prd-001",
            quantity: 20,
            saleRate: 12.5,
            mrp: 14.0
          }
        ],
        notes: "Demo order for Step 9 inventory deduction"
      },
      salesmanToken
    );
    assert(freshOrderRes.status === 201, "Salesman booked fresh order for inventory test");
    const freshOrder = freshOrderRes.data?.data;
    const orderId = freshOrder?.id || freshOrder?._id;

    // Submit the order so it becomes eligible for billing
    const submitRes = await request("PATCH", `/api/orders/${orderId}/submit`, {}, salesmanToken);
    assert(submitRes.status === 200, "Order submitted successfully for billing");

    // Check stock before bill
    const maggiBefore = await request("GET", `/api/inventory/inv-001`, null, ownerToken);
    const maggiStockBefore = maggiBefore.data?.data?.currentStock || 0;

    // Generate Bill from submitted order
    const billGen = await request(
      "POST",
      `/api/bills/generate/${orderId}`,
      {},
      ownerToken
    );

    assert(billGen.status === 201 && billGen.data.success, "Generated bill successfully from confirmed order");
    const generatedBill = billGen.data.data;

    // 18. Billing reduces inventory stock automatically
    const maggiAfter = await request("GET", `/api/inventory/inv-001`, null, ownerToken);
    const maggiStockAfter = maggiAfter.data?.data?.currentStock || 0;
    assert(maggiStockAfter === maggiStockBefore - 20, `Billing reduced inventory automatically (From ${maggiStockBefore} to ${maggiStockAfter}) (Criteria 18)`);

    // 19. Stock movement created after billing
    const billMovements = await request("GET", `/api/inventory/inv-001/movements`, null, ownerToken);
    const billSaleMv = billMovements.data.data.find(
      (m) => m.movementType === "BILL_SALE" && m.referenceId === generatedBill.billNumber
    );
    assert(!!billSaleMv, `StockMovement 'BILL_SALE' created with referenceId ${generatedBill.billNumber} (Criteria 19)`);

    // 17. Insufficient stock bill validation test
    // Try to book and bill an item that is OUT_OF_STOCK (e.g. Patanjali Honey: prd-010 has 0 stock)
    const outOfStockOrder = await request(
      "POST",
      "/api/orders",
      {
        customerId: "cus-001",
        items: [
          {
            productId: "prd-010",
            quantity: 50,
            saleRate: 198.0,
            mrp: 220.0
          }
        ],
        notes: "Test order with 0 stock item"
      },
      salesmanToken
    );
    const oosOrd = outOfStockOrder.data?.data;
    if (oosOrd) {
      await request("PATCH", `/api/orders/${oosOrd.id || oosOrd._id}/submit`, {}, salesmanToken);
      const oosBill = await request(
        "POST",
        `/api/bills/generate/${oosOrd.id || oosOrd._id}`,
        {},
        ownerToken
      );
      assert(oosBill.status === 400, "Insufficient stock bill generation returns HTTP 400 (Criteria 17)");
    }

    // ----------------------------------------------------
    // PHASE 6: Steps 1-8 Full Regression Testing
    // ----------------------------------------------------
    console.log("\n--- Phase 6: Steps 1-8 Full Regression Testing ---");
    const ownerDash = await request("GET", "/api/dashboard/owner", null, ownerToken);
    assert(ownerDash.status === 200 && ownerDash.data.success, "Step 2: Owner Dashboard intact (Criteria 20)");

    const customers = await request("GET", "/api/customers", null, ownerToken);
    assert(customers.status === 200 && customers.data.data.length > 0, "Step 3: Customer Master intact (Criteria 21)");

    const products = await request("GET", "/api/products", null, ownerToken);
    assert(products.status === 200 && products.data.data.length >= 20, "Step 4: Product Master intact (Criteria 22)");

    const routes = await request("GET", "/api/routes", null, ownerToken);
    assert(routes.status === 200 && routes.data.data.length > 0, "Step 5: Routes Master intact");

    const orders = await request("GET", "/api/orders", null, ownerToken);
    assert(orders.status === 200 && Array.isArray(orders.data.data), "Step 6: Orders Engine intact (Criteria 23)");

    const bills = await request("GET", "/api/bills", null, ownerToken);
    assert(bills.status === 200 && Array.isArray(bills.data.data), "Step 7: Billing Engine intact (Criteria 24)");

    const payments = await request("GET", "/api/payments", null, ownerToken);
    assert(payments.status === 200 && Array.isArray(payments.data.data), "Step 8: Payment Collections & Recon intact (Criteria 24)");

  } catch (err) {
    console.error("Test execution exception:", err);
    failed++;
  }

  console.log("\n================================================================================");
  console.log(`📊 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("================================================================================\n");

  if (failed > 0) process.exit(1);
}

runTests();
