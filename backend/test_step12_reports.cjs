// backend/test_step12_reports.cjs

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
  console.log("🧪 STARTING STEP 12: EXECUTIVE REPORTS & BUSINESS ANALYTICS TEST SUITE");
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
    // --- Phase 1: Health & Authentication ---
    console.log("--- Phase 1: Health & Authentication ---");
    const health = await makeRequest("/api/health");
    assert(health.status === 200 && health.body.status === "online", "1. Health check /api/health");

    // Owner Login
    const ownerLogin = await makeRequest("/api/auth/login", {
      method: "POST",
      body: { emailOrMobile: "owner@distributorerp.com", password: "password123", role: "SUPER_ADMIN" }
    });
    assert(ownerLogin.status === 200 && ownerLogin.body.token, "2. Owner Login (SUPER_ADMIN)");
    const ownerToken = ownerLogin.body.token;

    // Finance Login
    const financeLogin = await makeRequest("/api/auth/login", {
      method: "POST",
      body: { emailOrMobile: "finance@distributorerp.com", password: "password123", role: "FINANCE" }
    });
    assert(financeLogin.status === 200 && financeLogin.body.token, "3. Finance Login (FINANCE)");
    const financeToken = financeLogin.body.token;

    // Salesman Login
    const salesmanLogin = await makeRequest("/api/auth/login", {
      method: "POST",
      body: { emailOrMobile: "rahul@distributorerp.com", password: "password123", role: "SALESMAN" }
    });
    assert(salesmanLogin.status === 200 && salesmanLogin.body.token, "4. Salesman Login (SALESMAN)");
    const salesmanToken = salesmanLogin.body.token;

    // --- Phase 2: RBAC Security Guards ---
    console.log("\n--- Phase 2: RBAC Security Guards ---");
    // Salesman should be forbidden from complete business financial reports
    const salesmanSalesAttempt = await makeRequest("/api/reports/sales", {
      headers: { Authorization: `Bearer ${salesmanToken}` }
    });
    assert(salesmanSalesAttempt.status === 403, "5. RBAC: Salesman forbidden from Sales Analytics (HTTP 403)");

    const salesmanCollAttempt = await makeRequest("/api/reports/collections", {
      headers: { Authorization: `Bearer ${salesmanToken}` }
    });
    assert(salesmanCollAttempt.status === 403, "6. RBAC: Salesman forbidden from Collections Analytics (HTTP 403)");

    const salesmanOutAttempt = await makeRequest("/api/reports/outstanding", {
      headers: { Authorization: `Bearer ${salesmanToken}` }
    });
    assert(salesmanOutAttempt.status === 403, "7. RBAC: Salesman forbidden from Outstanding Receivables (HTTP 403)");

    const salesmanCustAttempt = await makeRequest("/api/reports/top-customers", {
      headers: { Authorization: `Bearer ${salesmanToken}` }
    });
    assert(salesmanCustAttempt.status === 403, "8. RBAC: Salesman forbidden from Top Customers (HTTP 403)");

    // Finance should have read access
    const financeSummary = await makeRequest("/api/reports/executive-summary", {
      headers: { Authorization: `Bearer ${financeToken}` }
    });
    assert(financeSummary.status === 200 && financeSummary.body.data, "9. RBAC: Finance user has read access to Executive Summary");

    // --- Phase 3: Executive Summary & Date Range Filters ---
    console.log("\n--- Phase 3: Executive Summary & Date Range Filters ---");
    const summaryToday = await makeRequest("/api/reports/executive-summary?dateRange=today", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(summaryToday.status === 200, "10. GET /api/reports/executive-summary (Today)");
    assert(summaryToday.body.data.totalSales === 1485400, `Today sales matches FMCG baseline (₹${summaryToday.body.data.totalSales})`);
    assert(summaryToday.body.data.totalCollection === 1140200, `Today collection matches FMCG baseline (₹${summaryToday.body.data.totalCollection})`);
    assert(summaryToday.body.data.totalOutstanding === 4890000, `Total outstanding is ₹48,90,000`);
    assert(summaryToday.body.data.totalBills === 684, `Total bills count is 684`);
    assert(summaryToday.body.data.activeCustomers === 3890, `Active customers count is 3,890`);
    assert(summaryToday.body.data.criticalExceptions === 6, `Critical exceptions count is 6`);

    const summaryWeek = await makeRequest("/api/reports/executive-summary?dateRange=last7days", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(summaryWeek.status === 200 && summaryWeek.body.data.totalSales === 9275400, "11. GET /api/reports/executive-summary (Last 7 Days) reflects multi-day aggregation");

    const summaryMonth = await makeRequest("/api/reports/executive-summary?dateRange=thismonth", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(summaryMonth.status === 200 && summaryMonth.body.data.totalSales === 38540000, "12. GET /api/reports/executive-summary (This Month) reflects monthly volume");

    // --- Phase 4: Sales Analytics ---
    console.log("\n--- Phase 4: Sales Analytics ---");
    const salesRes = await makeRequest("/api/reports/sales?dateRange=today", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(salesRes.status === 200 && salesRes.body.data, "13. GET /api/reports/sales returns valid payload");
    assert(Array.isArray(salesRes.body.data.salesTrend) && salesRes.body.data.salesTrend.length === 7, `Sales trend contains 7 daily points`);
    assert(salesRes.body.data.grossSales === 1485400, `Gross sales is ₹14,85,400`);
    assert(salesRes.body.data.totalBills === 684, `Total bills is 684`);
    assert(salesRes.body.data.averageBillValue === 2171, `Average bill value is ₹2,171`);

    // --- Phase 5: Collection Analytics ---
    console.log("\n--- Phase 5: Collection Analytics ---");
    const collRes = await makeRequest("/api/reports/collections?dateRange=today", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(collRes.status === 200 && collRes.body.data, "14. GET /api/reports/collections returns valid payload");
    assert(collRes.body.data.cashCollection === 342000, `Cash collection is ₹3,42,000`);
    assert(collRes.body.data.upiCollection === 513000, `UPI collection is ₹5,13,000`);
    assert(collRes.body.data.chequeCollection === 285200, `Cheque collection is ₹2,85,200`);
    assert(collRes.body.data.totalCollection === 1140200, `Total collection is ₹11,40,200`);
    assert(collRes.body.data.mappedPayments === 1085200, `Mapped payments is ₹10,85,200`);
    assert(collRes.body.data.suspensePayments === 25000, `Suspense payments is ₹25,000`);
    assert(Array.isArray(collRes.body.data.breakdown) && collRes.body.data.breakdown.length === 3, `Payment channels breakdown has 3 modes`);

    // --- Phase 6: Outstanding & Receivables ---
    console.log("\n--- Phase 6: Outstanding & Receivables ---");
    const outRes = await makeRequest("/api/reports/outstanding", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(outRes.status === 200 && outRes.body.data, "15. GET /api/reports/outstanding returns valid payload");
    assert(outRes.body.data.totalOutstanding === 4890000, `Total outstanding is ₹48,90,000`);
    assert(Array.isArray(outRes.body.data.ageingBuckets) && outRes.body.data.ageingBuckets.length === 6, `Ageing spectrum has 6 buckets (0-7, 8-15, 16-30, 31-60, 61-90, 90+)`);
    assert(Array.isArray(outRes.body.data.criticalCustomers) && outRes.body.data.criticalCustomers.length === 5, `Top 5 Critical Overdue Customers returned`);
    assert(outRes.body.data.criticalCustomers[0].name === "Sharma General Store" && outRes.body.data.criticalCustomers[0].overdueDays === 62, "Top 1 overdue customer is Sharma General Store (62 days)");

    // --- Phase 7: Top Customers & Top Products ---
    console.log("\n--- Phase 7: Top Customers & Top Products ---");
    const topCustRes = await makeRequest("/api/reports/top-customers", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(topCustRes.status === 200 && Array.isArray(topCustRes.body.data.customers), "16. GET /api/reports/top-customers returns customers list");
    assert(topCustRes.body.data.customers.length === 5, `Top 5 customers included`);
    assert(topCustRes.body.data.customers[0].name === "Sharma General Store" && topCustRes.body.data.customers[0].sales === 450000, "Customer #1 is Sharma General Store (₹4,50,000 sales)");

    const topProdRes = await makeRequest("/api/reports/top-products", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(topProdRes.status === 200 && Array.isArray(topProdRes.body.data.products), "17. GET /api/reports/top-products returns products list");
    assert(topProdRes.body.data.products.length === 5, `Top 5 products included`);
    assert(topProdRes.body.data.products[0].shortName === "Maggi 70g" && topProdRes.body.data.products[0].unitsSold === 12500, "Product #1 is Maggi 70g (12,500 units sold)");

    // --- Phase 8: Salesman Performance ---
    console.log("\n--- Phase 8: Salesman Performance ---");
    const salesmenRes = await makeRequest("/api/reports/salesmen", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(salesmenRes.status === 200 && salesmenRes.body.data, "18. GET /api/reports/salesmen returns valid payload");
    assert(salesmenRes.body.data.topPerformer && salesmenRes.body.data.topPerformer.name === "Rahul Kumar", "Top Performer 🏆 is Rahul Kumar");
    assert(salesmenRes.body.data.topPerformer.sales === 250000, "Rahul Kumar sales is ₹2,50,000");
    assert(Array.isArray(salesmenRes.body.data.salesmen) && salesmenRes.body.data.salesmen.length === 5, "Top 5 Salesmen performance records returned");

    // --- Phase 9: Exceptions Summary ---
    console.log("\n--- Phase 9: Exceptions Summary ---");
    const excRes = await makeRequest("/api/reports/exceptions", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(excRes.status === 200 && excRes.body.data, "19. GET /api/reports/exceptions returns valid payload");
    assert(excRes.body.data.criticalCount === 2, `Critical count is 2`);
    assert(excRes.body.data.highCount === 2, `High priority count is 2`);
    assert(excRes.body.data.warningCount === 2, `Warning count is 2`);
    assert(Array.isArray(excRes.body.data.exceptionCategories) && excRes.body.data.exceptionCategories.length === 6, "6 exception categories (Cash, UPI, Cheque, Overdue, Amendment, Stock) returned");

    // --- Phase 10: Regression Testing (Steps 1 to 11) ---
    console.log("\n--- Phase 10: Steps 1-11 Full Regression Testing ---");
    const regOwnerDash = await makeRequest("/api/dashboard/owner", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(regOwnerDash.status === 200, "20. Step 2: Owner Dashboard intact");

    const regCust = await makeRequest("/api/customers", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(regCust.status === 200, "21. Step 3: Customer Master intact");

    const regProd = await makeRequest("/api/products", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(regProd.status === 200, "22. Step 4: Product Master intact");

    const regRoutes = await makeRequest("/api/routes", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(regRoutes.status === 200, "23. Step 5: Routes Master intact");

    const regOrders = await makeRequest("/api/orders", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(regOrders.status === 200, "24. Step 6: Orders Engine intact");

    const regBills = await makeRequest("/api/bills", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(regBills.status === 200, "25. Step 7: Billing Engine intact");

    const regPayments = await makeRequest("/api/payments", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(regPayments.status === 200, "26. Step 8: Payments & Recon intact");

    const regInventory = await makeRequest("/api/inventory", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(regInventory.status === 200, "27. Step 9: Inventory Engine intact");

    const regDelivery = await makeRequest("/api/delivery/trips", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(regDelivery.status === 200, "28. Step 10: Delivery Engine intact");

    const regExceptions = await makeRequest("/api/exceptions", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(regExceptions.status === 200, "29. Step 11: Exception Engine intact");

    const regApprovals = await makeRequest("/api/approvals", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(regApprovals.status === 200, "30. Step 11: Approval Queue intact");

    console.log("\n================================================================================");
    console.log(`📊 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
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
