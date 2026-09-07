// backend/test_step13_final_demo.cjs

const http = require("http");

const BASE_URL = "http://localhost:5005";

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    };

    const req = http.request(url, reqOptions, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on("error", (err) => reject(err));

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("================================================================================");
  console.log("🧪 STARTING STEP 13: FINAL CLIENT DEMO & CONNECTIVITY TEST SUITE");
  console.log("================================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // --- Phase 1: Health & Unauthenticated Security ---
    console.log("--- Phase 1: Health & Unauthenticated Security ---");
    const health = await makeRequest("/api/health");
    assert(health.status === 200 && health.body.status === "online", "1. Backend Health check /api/health (HTTP 200)");

    const unauthTest = await makeRequest("/api/reports/executive-summary");
    assert(unauthTest.status === 401, "2. Security: Unauthenticated request rejected (HTTP 401 Unauthorized)");

    // --- Phase 2: Multi-Role Authentication Matrix ---
    console.log("\n--- Phase 2: Multi-Role Authentication Matrix ---");
    const ownerLogin = await makeRequest("/api/auth/login", {
      method: "POST",
      body: { emailOrMobile: "owner@distributorerp.com", password: "password123", role: "SUPER_ADMIN" }
    });
    assert(ownerLogin.status === 200 && ownerLogin.body.token, "3. Owner Login (SUPER_ADMIN) - Rajesh Sharma");
    const ownerToken = ownerLogin.body.token;

    const financeLogin = await makeRequest("/api/auth/login", {
      method: "POST",
      body: { emailOrMobile: "finance@distributorerp.com", password: "password123", role: "FINANCE" }
    });
    assert(financeLogin.status === 200 && financeLogin.body.token, "4. Finance Login (FINANCE) - Amit Verma");
    const financeToken = financeLogin.body.token;

    const salesMgrLogin = await makeRequest("/api/auth/login", {
      method: "POST",
      body: { emailOrMobile: "salesmgr@distributorerp.com", password: "password123", role: "SALES_MANAGER" }
    });
    assert(salesMgrLogin.status === 200 && salesMgrLogin.body.token, "5. Sales Manager Login (SALES_MANAGER) - Vikas Malhotra");
    const salesMgrToken = salesMgrLogin.body.token;

    const salesmanLogin = await makeRequest("/api/auth/login", {
      method: "POST",
      body: { emailOrMobile: "rahul@distributorerp.com", password: "password123", role: "SALESMAN" }
    });
    assert(salesmanLogin.status === 200 && salesmanLogin.body.token, "6. Salesman Login (SALESMAN) - Rahul Kumar");
    const salesmanToken = salesmanLogin.body.token;

    // --- Phase 3: Role-Based Authorization Guards (RBAC) ---
    console.log("\n--- Phase 3: Role-Based Authorization Guards (RBAC) ---");
    const salesmanOwnerDash = await makeRequest("/api/dashboard/owner", {
      headers: { Authorization: `Bearer ${salesmanToken}` }
    });
    assert(salesmanOwnerDash.status === 403, "7. RBAC: Salesman blocked from Owner Command Center (HTTP 403)");

    const salesmanReports = await makeRequest("/api/reports/sales", {
      headers: { Authorization: `Bearer ${salesmanToken}` }
    });
    assert(salesmanReports.status === 403, "8. RBAC: Salesman blocked from Executive Sales Reports (HTTP 403)");

    const financeApprovals = await makeRequest("/api/approvals/app-001/approve", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${financeToken}` },
      body: { decisionNote: "Finance attempt" }
    });
    assert(financeApprovals.status === 403, "9. RBAC: Finance blocked from Owner Approvals Queue (HTTP 403)");

    const ownerReports = await makeRequest("/api/reports/executive-summary", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(ownerReports.status === 200, "10. RBAC: Owner has full authorized access to executive reports");

    // --- Phase 4: Connected Demo Datasets Consistency ---
    console.log("\n--- Phase 4: Connected Demo Datasets Consistency ---");

    // 1. Customers Master
    const custRes = await makeRequest("/api/customers?limit=50", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    const customers = Array.isArray(custRes.body.data) ? custRes.body.data : (custRes.body.customers || []);
    assert(custRes.status === 200 && Array.isArray(customers), "11. Customer Master retrieved");
    const customerNames = customers.map((c) => c.shopName);
    assert(customerNames.some((n) => n.includes("Sharma General Store")), "Customer Master contains Sharma General Store");
    assert(customerNames.some((n) => n.includes("Gupta")), "Customer Master contains Gupta Provision / Traders");
    assert(customerNames.some((n) => n.includes("New Horizon Mart")), "Customer Master contains New Horizon Mart");
    assert(customerNames.some((n) => n.includes("Sahu Kirana Store")), "Customer Master contains Sahu Kirana Store");

    // 2. Products Master
    const prodRes = await makeRequest("/api/products?limit=50", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    const products = Array.isArray(prodRes.body.data) ? prodRes.body.data : (prodRes.body.products || []);
    assert(prodRes.status === 200 && Array.isArray(products), "12. Product Master retrieved");
    const productNames = products.map((p) => p.productName);
    assert(productNames.some((n) => n.includes("Maggi")), "Products includes Nestlé Maggi");
    assert(productNames.some((n) => n.includes("KitKat")), "Products includes Nestlé KitKat");
    assert(productNames.some((n) => n.includes("Horlicks")), "Products includes GSK Horlicks");
    assert(productNames.some((n) => n.includes("Honey")), "Products includes Patanjali Honey");
    assert(productNames.some((n) => n.includes("Dant Kanti")), "Products includes Patanjali Dant Kanti");

    // 3. Billing Engine
    const billRes = await makeRequest("/api/bills?limit=50", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    const bills = Array.isArray(billRes.body.data) ? billRes.body.data : (billRes.body.bills || []);
    assert(billRes.status === 200 && Array.isArray(bills), "13. Billing Engine bills retrieved");
    const payStatuses = bills.map((b) => b.paymentStatus);
    assert(payStatuses.includes("UNPAID"), "Billing contains UNPAID invoices");
    assert(payStatuses.includes("PARTIAL") || payStatuses.includes("PARTIALLY_PAID"), "Billing contains PARTIAL invoices");
    assert(payStatuses.includes("PAID"), "Billing contains fully PAID invoices");

    // 4. Payment Collection & Suspense
    const payRes = await makeRequest("/api/payments", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    const payments = Array.isArray(payRes.body.data) ? payRes.body.data : (payRes.body.payments || []);
    assert(payRes.status === 200 && Array.isArray(payments), "14. Payment Collection entries retrieved");
    const payModes = payments.map((p) => p.paymentMode);
    assert(payModes.includes("CASH"), "Payments includes CASH collections");
    assert(payModes.includes("UPI"), "Payments includes UPI credits");
    assert(payModes.includes("CHEQUE"), "Payments includes CHEQUE deposits");

    const unmatchedRes = await makeRequest("/api/payments/unmatched", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(unmatchedRes.status === 200 && Array.isArray(unmatchedRes.body.data), "15. UPI Suspense Queue has unmapped payments");
    assert(unmatchedRes.body.data.length >= 1, `Found ${unmatchedRes.body.data.length} unmatched bank credits`);

    // 5. Exception Engine
    const excRes = await makeRequest("/api/reports/exceptions", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(excRes.status === 200 && excRes.body.data, "16. Exception Summary retrieved");
    assert(excRes.body.data.criticalCount === 2, "Critical exception count is 2");
    assert(excRes.body.data.exceptionCategories.length === 6, "6 realistic exception categories linked");

    // 6. Executive Reports Commercial KPI Consistency
    const execSummary = await makeRequest("/api/reports/executive-summary?dateRange=today", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(execSummary.status === 200, "17. Reports Executive Summary matches Owner Command Center KPIs");
    assert(execSummary.body.data.totalSales === 1485400, "Today Sales is consistent at ₹14,85,400");
    assert(execSummary.body.data.totalCollection === 1140200, "Today Collection is consistent at ₹11,40,200");
    assert(execSummary.body.data.totalOutstanding === 4890000, "Total Outstanding is consistent at ₹48,90,000");

    // --- Phase 5: Steps 1 to 12 Full Regression Verification ---
    console.log("\n--- Phase 5: Steps 1-12 Full Regression Verification ---");
    const regOwner = await makeRequest("/api/dashboard/owner", { headers: { Authorization: `Bearer ${ownerToken}` } });
    assert(regOwner.status === 200, "18. Step 2: Owner Command Center intact");

    const regRoutes = await makeRequest("/api/routes", { headers: { Authorization: `Bearer ${ownerToken}` } });
    assert(regRoutes.status === 200, "19. Step 5: Routes Master intact");

    const regOrders = await makeRequest("/api/orders", { headers: { Authorization: `Bearer ${ownerToken}` } });
    assert(regOrders.status === 200, "20. Step 6: Order Booking Engine intact");

    const regInventory = await makeRequest("/api/inventory", { headers: { Authorization: `Bearer ${ownerToken}` } });
    assert(regInventory.status === 200, "21. Step 9: Inventory Engine intact");

    const regDelivery = await makeRequest("/api/delivery/trips", { headers: { Authorization: `Bearer ${ownerToken}` } });
    assert(regDelivery.status === 200, "22. Step 10: Delivery Engine intact");

    const regExceptions = await makeRequest("/api/exceptions", { headers: { Authorization: `Bearer ${ownerToken}` } });
    assert(regExceptions.status === 200, "23. Step 11: Exception Engine intact");

    const regApprovals = await makeRequest("/api/approvals", { headers: { Authorization: `Bearer ${ownerToken}` } });
    assert(regApprovals.status === 200, "24. Step 11: Approvals Queue intact");

    const regReports = await makeRequest("/api/reports/sales", { headers: { Authorization: `Bearer ${ownerToken}` } });
    assert(regReports.status === 200, "25. Step 12: Reports & Analytics intact");

    console.log("\n================================================================================");
    console.log(`📊 FINAL TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
    console.log("================================================================================\n");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution failed with error:", err);
    process.exit(1);
  }
}

runTests();
