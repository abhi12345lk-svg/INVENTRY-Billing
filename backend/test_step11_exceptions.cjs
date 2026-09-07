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
  console.log("🧪 STARTING STEP 11: OWNER EXCEPTION & APPROVAL CONTROL CENTER TEST SUITE");
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
    // --- Phase 1: Authentication & Health ---
    console.log("--- Phase 1: Authentication & Health ---");
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

    // Reset demo exceptions and approvals state
    const resetRes = await makeRequest("/api/exceptions/reset", {
      method: "POST",
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(resetRes.status === 200 && resetRes.body.success, "Reset demo exceptions & approvals to clean baseline");

    // --- Phase 2: Exception List & Summary ---
    console.log("\n--- Phase 2: Exception List & Summary ---");
    const exceptionsRes = await makeRequest("/api/exceptions", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(exceptionsRes.status === 200 && Array.isArray(exceptionsRes.body.data.exceptions), "5. GET /api/exceptions returns list");
    assert(exceptionsRes.body.data.exceptions.length >= 8, `Pre-seeded realistic FMCG exceptions (Found: ${exceptionsRes.body.data.exceptions.length})`);

    const summaryRes = await makeRequest("/api/exceptions/summary", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(summaryRes.status === 200 && summaryRes.body.data.totalOpen >= 8, "6. GET /api/exceptions/summary counts open issues");
    assert(summaryRes.body.data.critical >= 2, `Summary critical count is accurate (${summaryRes.body.data.critical})`);
    assert(summaryRes.body.data.high >= 4, `Summary high priority count is accurate (${summaryRes.body.data.high})`);

    // --- Phase 3: Filters & Details ---
    console.log("\n--- Phase 3: Filters & Details ---");
    const criticalFilter = await makeRequest("/api/exceptions?severity=CRITICAL", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(
      criticalFilter.status === 200 &&
      criticalFilter.body.data.exceptions.every((e) => e.severity === "CRITICAL"),
      "7. GET /api/exceptions?severity=CRITICAL returns only critical exceptions"
    );

    const moduleFilter = await makeRequest("/api/exceptions?module=PAYMENTS", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(
      moduleFilter.status === 200 &&
      moduleFilter.body.data.exceptions.every((e) => e.module === "PAYMENTS"),
      "8. GET /api/exceptions?module=PAYMENTS returns only payment module exceptions"
    );

    const sampleExc = exceptionsRes.body.data.exceptions[0];
    const detailsRes = await makeRequest(`/api/exceptions/${sampleExc.id || sampleExc._id}`, {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(detailsRes.status === 200 && detailsRes.body.data.title === sampleExc.title, "9. GET /api/exceptions/:id returns full details");

    // --- Phase 4: Exception Status Workflow ---
    console.log("\n--- Phase 4: Exception Status Workflow & Auditing ---");
    const targetExc = exceptionsRes.body.data.exceptions.find((e) => e.exceptionNumber === "EXC-2026-00003"); // Cash mismatch
    const excId = targetExc.id || targetExc._id;

    // Mark Under Review
    const underReviewRes = await makeRequest(`/api/exceptions/${excId}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: { status: "UNDER_REVIEW", resolutionNote: "Investigating cash drawer discrepancy with cashier" }
    });
    assert(underReviewRes.status === 200 && underReviewRes.body.data.status === "UNDER_REVIEW", "10. PATCH /api/exceptions/:id/status -> UNDER_REVIEW");

    // Resolve Exception without note should FAIL (HTTP 400)
    const resolveFail = await makeRequest(`/api/exceptions/${excId}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: { status: "RESOLVED", resolutionNote: "   " }
    });
    assert(resolveFail.status === 400, "11. Validation: resolutionNote required when status is RESOLVED (HTTP 400)");

    // Resolve Exception with note
    const resolveRes = await makeRequest(`/api/exceptions/${excId}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: { status: "RESOLVED", resolutionNote: "Cashier located ₹100 note in petty register. Tally reconciled." }
    });
    assert(resolveRes.status === 200 && resolveRes.body.data.status === "RESOLVED", "12. PATCH /api/exceptions/:id/status -> RESOLVED with resolutionNote");
    assert(resolveRes.body.data.auditHistory.some((a) => a.action === "EXCEPTION_RESOLVED"), "Audit history tracks EXCEPTION_RESOLVED event");

    // RBAC: Salesman cannot resolve owner exception
    const salesmanResolve = await makeRequest(`/api/exceptions/${excId}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${salesmanToken}` },
      body: { status: "RESOLVED", resolutionNote: "Trying to self-resolve" }
    });
    assert(salesmanResolve.status === 403, "13. RBAC: Salesman forbidden from resolving owner exception (HTTP 403 Forbidden)");

    // --- Phase 5: Approval Queue & Details ---
    console.log("\n--- Phase 5: Approval Queue & Details ---");
    const approvalsRes = await makeRequest("/api/approvals", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(approvalsRes.status === 200 && Array.isArray(approvalsRes.body.data.approvals), "14. GET /api/approvals returns list");
    assert(approvalsRes.body.data.approvals.length >= 3, `Pre-seeded realistic approval requests (Found: ${approvalsRes.body.data.approvals.length})`);

    const approvalSummaryRes = await makeRequest("/api/approvals/summary", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(approvalSummaryRes.status === 200 && approvalSummaryRes.body.data.pending >= 3, "15. GET /api/approvals/summary returns pending count");

    const sampleApr = approvalsRes.body.data.approvals[0];
    const aprDetailsRes = await makeRequest(`/api/approvals/${sampleApr.id || sampleApr._id}`, {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(aprDetailsRes.status === 200 && aprDetailsRes.body.data.title === sampleApr.title, "16. GET /api/approvals/:id returns full request details");

    // --- Phase 6: Owner Approval & Rejection Decisions ---
    console.log("\n--- Phase 6: Owner Approval & Rejection Decisions ---");
    // Owner approves APR-2026-00001 (Bill amendment)
    const billApr = approvalsRes.body.data.approvals.find((a) => a.approvalNumber === "APR-2026-00001");
    const billAprId = billApr.id || billApr._id;

    const approveRes = await makeRequest(`/api/approvals/${billAprId}/approve`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: { decisionNote: "Approved after verifying retailer unloading damage slip." }
    });
    assert(approveRes.status === 200 && approveRes.body.data.status === "APPROVED", "17. Owner approval: PATCH /api/approvals/:id/approve -> APPROVED");
    assert(approveRes.body.data.reviewerName.includes("Owner") || approveRes.body.data.reviewerName.includes("Rajesh Sharma"), "Reviewer name recorded as Owner");

    // Owner rejects APR-2026-00002 (Duplicate payment)
    const dupApr = approvalsRes.body.data.approvals.find((a) => a.approvalNumber === "APR-2026-00002");
    const dupAprId = dupApr.id || dupApr._id;

    const rejectRes = await makeRequest(`/api/approvals/${dupAprId}/reject`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${ownerToken}` },
      body: { decisionNote: "Rejected. Verified that both cash and UPI were collected for two separate bills." }
    });
    assert(rejectRes.status === 200 && rejectRes.body.data.status === "REJECTED", "18. Owner rejection: PATCH /api/approvals/:id/reject -> REJECTED");

    // Non-owner (Finance) tries to approve stock adjustment APR-2026-00003
    const stockApr = approvalsRes.body.data.approvals.find((a) => a.approvalNumber === "APR-2026-00003");
    const stockAprId = stockApr.id || stockApr._id;

    const financeApprove = await makeRequest(`/api/approvals/${stockAprId}/approve`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${financeToken}` },
      body: { decisionNote: "Finance trying to approve" }
    });
    assert(financeApprove.status === 403, "19. RBAC: Finance user cannot approve owner requests (HTTP 403 Forbidden)");

    // Audit History tracking
    assert(
      approveRes.body.data.auditHistory.some((a) => a.action === "APPROVAL_APPROVED"),
      "20. Audit history includes APPROVAL_APPROVED event with timestamp & note"
    );

    // --- Phase 7: Steps 1-10 Full Regression Testing ---
    console.log("\n--- Phase 7: Steps 1-10 Full Regression Testing ---");
    const ownerDash = await makeRequest("/api/dashboard/owner", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(ownerDash.status === 200 && ownerDash.body.success, "21. Step 2: Owner Dashboard intact");

    const customers = await makeRequest("/api/customers?limit=1", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(customers.status === 200 && customers.body.success, "22. Step 3: Customer Master intact");

    const products = await makeRequest("/api/products?limit=1", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(products.status === 200 && products.body.success, "23. Step 4: Product Master intact");

    const routes = await makeRequest("/api/routes", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(routes.status === 200 && routes.body.success, "24. Step 5: Routes Master intact");

    const orders = await makeRequest("/api/orders?limit=1", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(orders.status === 200 && orders.body.success, "25. Step 6: Orders Engine intact");

    const bills = await makeRequest("/api/bills?limit=1", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(bills.status === 200 && bills.body.success, "26. Step 7: Billing Engine intact");

    const payments = await makeRequest("/api/payments?limit=1", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(payments.status === 200 && payments.body.success, "27. Step 8: Payments & Recon intact");

    const inventory = await makeRequest("/api/inventory/summary/dashboard", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(inventory.status === 200 && inventory.body.success, "28. Step 9: Inventory Engine intact");

    const delivery = await makeRequest("/api/delivery/summary/dashboard", {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    assert(delivery.status === 200 && delivery.body.success, "29. Step 10: Delivery Engine intact");

  } catch (err) {
    console.error("Test Suite crashed with unexpected error:", err);
    failed++;
  }

  console.log("\n================================================================================");
  console.log(`📊 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("================================================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
