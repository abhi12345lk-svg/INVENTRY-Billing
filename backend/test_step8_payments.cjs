const http = require("http");

const BASE_URL = "http://localhost:5005";

let passedCount = 0;
let failedCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedCount++;
  }
}

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        "Content-Type": "application/json"
      }
    };

    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on("error", (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("================================================================================");
  console.log("🧪 STARTING STEP 8: PAYMENT COLLECTION & RECONCILIATION TEST SUITE");
  console.log("================================================================================\n");

  try {
    // -------------------------------------------------------------------------
    // Phase 1: Authentication & Health
    // -------------------------------------------------------------------------
    console.log("--- Phase 1: Authentication & Health ---");
    const health = await request("GET", "/api/health");
    assert(health.status === 200 && health.data.status === "online", "Health check /api/health");

    // Login Owner
    const ownerAuth = await request("POST", "/api/auth/login", {
      emailOrMobile: "owner@distributorerp.com",
      password: "password123",
      role: "SUPER_ADMIN"
    });
    assert(ownerAuth.status === 200 && ownerAuth.data.token, "Owner Login (SUPER_ADMIN)");
    const ownerToken = ownerAuth.data.token;

    // Login Finance
    const financeAuth = await request("POST", "/api/auth/login", {
      emailOrMobile: "finance@distributorerp.com",
      password: "password123",
      role: "FINANCE"
    });
    assert(financeAuth.status === 200 && financeAuth.data.token, "Finance Login (FINANCE)");
    const financeToken = financeAuth.data.token;

    // Login Salesman
    const salesmanAuth = await request("POST", "/api/auth/login", {
      emailOrMobile: "salesman@distributorerp.com",
      password: "password123",
      role: "SALESMAN"
    });
    assert(salesmanAuth.status === 200 && salesmanAuth.data.token, "Salesman Login (SALESMAN)");
    const salesmanToken = salesmanAuth.data.token;

    // -------------------------------------------------------------------------
    // Phase 2: Initial Payments Query & Pre-Seeded Data
    // -------------------------------------------------------------------------
    console.log("\n--- Phase 2: Querying Payments & Suspense Queue ---");
    const paymentsRes = await request("GET", "/api/payments", null, ownerToken);
    assert(paymentsRes.status === 200 && Array.isArray(paymentsRes.data.data), "GET /api/payments returns list");
    assert(paymentsRes.data.data.length >= 10, `Found ${paymentsRes.data.data.length} pre-seeded payments (expected >= 10)`);

    const unmatchedRes = await request("GET", "/api/payments/unmatched", null, ownerToken);
    assert(unmatchedRes.status === 200 && Array.isArray(unmatchedRes.data.data), "GET /api/payments/unmatched returns array");
    assert(unmatchedRes.data.count >= 2, `Found ${unmatchedRes.data.count} UNMATCHED UPI payments in suspense queue`);

    // -------------------------------------------------------------------------
    // Phase 3: Salesman Payment Recording & Scoping RBAC
    // -------------------------------------------------------------------------
    console.log("\n--- Phase 3: Salesman Payment Recording & Scoping ---");
    // Salesman attempts to record unmatched UPI (should fail)
    const invalidSalesmanUpi = await request(
      "POST",
      "/api/payments",
      {
        paymentMode: "UPI",
        amount: 5000
      },
      salesmanToken
    );
    assert(invalidSalesmanUpi.status === 400, "Salesman cannot record unidentified UPI (HTTP 400)");

    // Salesman records valid cash collection for Sharma General Store
    const salesmanCashRes = await request(
      "POST",
      "/api/payments",
      {
        paymentMode: "CASH",
        amount: 2500,
        customerId: "CUS-000001",
        customerName: "Sharma General Store",
        notes: "Cash collected during Tuesday beat visit"
      },
      salesmanToken
    );
    assert(salesmanCashRes.status === 201, "Salesman recorded cash collection successfully (HTTP 201)");
    assert(salesmanCashRes.data.data.paymentNumber.startsWith("PAY-"), `Generated valid payment number (${salesmanCashRes.data.data.paymentNumber})`);
    assert(salesmanCashRes.data.data.salesmanName === "Rahul Kumar", "Payment accurately scoped to Rahul Kumar");

    // Salesman payment list scoping check
    const salesmanListRes = await request("GET", "/api/payments", null, salesmanToken);
    assert(salesmanListRes.status === 200, "Salesman fetched payment list");
    const allBelongToSalesman = salesmanListRes.data.data.every(
      (p) => p.salesmanId === "user-salesman-01" || p.salesmanCode === "SM-000001"
    );
    assert(allBelongToSalesman, "Salesman receives strictly scoped collections");

    // Salesman attempts to view unmatched queue (should be 403 Forbidden)
    const salesmanSuspenseRes = await request("GET", "/api/payments/unmatched", null, salesmanToken);
    assert(salesmanSuspenseRes.status === 403, "Salesman blocked from accessing central suspense queue (HTTP 403)");

    // -------------------------------------------------------------------------
    // Phase 4: Unknown UPI Payment & Identification Workflow
    // -------------------------------------------------------------------------
    console.log("\n--- Phase 4: Unknown UPI & Customer Identification ---");
    const newUnknownUpi = await request(
      "POST",
      "/api/payments",
      {
        paymentMode: "UPI",
        amount: 15000,
        upiReference: "UPI-TEST-998811",
        payerName: "M/s Random Unregistered Shop",
        notes: "Direct bank transfer received via static QR"
      },
      financeToken
    );
    assert(newUnknownUpi.status === 201, "Finance recorded direct unknown UPI (HTTP 201)");
    const unknownPayId = newUnknownUpi.data.data.id || newUnknownUpi.data.data.paymentNumber;
    assert(newUnknownUpi.data.data.status === "UNMATCHED", "Initial status is UNMATCHED");
    assert(newUnknownUpi.data.data.unmappedAmount === 15000, "Unmapped balance equals total amount");

    // Salesman attempts to identify customer (should be 403)
    const salesmanIdentify = await request(
      "PATCH",
      `/api/payments/${unknownPayId}/identify-customer`,
      { customerId: "CUS-000001" },
      salesmanToken
    );
    assert(salesmanIdentify.status === 403, "Salesman cannot identify suspense customer (HTTP 403 Forbidden)");

    // Owner identifies customer for the unknown payment
    const ownerIdentify = await request(
      "PATCH",
      `/api/payments/${unknownPayId}/identify-customer`,
      {
        customerId: "CUS-000001",
        customerCode: "CUS-000001",
        customerName: "Sharma General Store"
      },
      ownerToken
    );
    assert(ownerIdentify.status === 200, "Owner identified customer for unmatched UPI (HTTP 200)");
    assert(ownerIdentify.data.data.status === "RECORDED", "Status transitioned from UNMATCHED to RECORDED");
    assert(ownerIdentify.data.data.customerName === "Sharma General Store", "Customer name successfully updated");

    // -------------------------------------------------------------------------
    // Phase 5: Payment to Bill Mapping & Financial Integrity
    // -------------------------------------------------------------------------
    console.log("\n--- Phase 5: Payment to Bill Mapping & Allocation ---");
    // Fetch open bills for Sharma General Store
    const openBillsRes = await request("GET", "/api/bills/customer/CUS-000001/open", null, financeToken);
    assert(openBillsRes.status === 200 && Array.isArray(openBillsRes.data.data), "GET /api/bills/customer/:id/open returns array");

    let targetBill = openBillsRes.data.data[0];
    if (!targetBill) {
      // Create and lock a bill for testing
      const orderDraft = await request(
        "POST",
        "/api/orders",
        {
          customerId: "CUS-000001",
          items: [{ productId: "prd-001", quantity: 10, rate: 20 }]
        },
        salesmanToken
      );
      const submitted = await request("POST", `/api/orders/${orderDraft.data.data.id}/submit`, {}, salesmanToken);
      const generated = await request("POST", `/api/bills/generate/${submitted.data.data.id}`, {}, ownerToken);
      const locked = await request("PATCH", `/api/bills/${generated.data.data.id}/lock`, {}, ownerToken);
      targetBill = locked.data.data;
    }

    assert(targetBill && targetBill.outstandingAmount > 0, `Target bill ${targetBill.billNumber} has outstanding ₹${targetBill.outstandingAmount}`);

    // Test 1: Salesman attempts to map (should be 403)
    const salesmanMapAttempt = await request(
      "PATCH",
      `/api/payments/${unknownPayId}/map`,
      {
        allocations: [{ billId: targetBill.id, allocatedAmount: 100 }]
      },
      salesmanToken
    );
    assert(salesmanMapAttempt.status === 403, "Salesman cannot map payment (HTTP 403 Forbidden)");

    // Test 2: Allocation exceeding bill outstanding
    const excessiveBillAlloc = await request(
      "PATCH",
      `/api/payments/${unknownPayId}/map`,
      {
        allocations: [{ billId: targetBill.id, allocatedAmount: targetBill.outstandingAmount + 50000 }]
      },
      financeToken
    );
    assert(excessiveBillAlloc.status === 400, "Allocation exceeding invoice outstanding rejected (HTTP 400)");

    // Test 3: Allocation exceeding payment unmapped amount
    const excessivePaymentAlloc = await request(
      "PATCH",
      `/api/payments/${unknownPayId}/map`,
      {
        allocations: [{ billId: targetBill.id, allocatedAmount: 999999 }]
      },
      financeToken
    );
    assert(excessivePaymentAlloc.status === 400, "Allocation exceeding payment unmapped balance rejected (HTTP 400)");

    // Test 4: Successful Partial Allocation
    const allocAmount = Math.min(100, targetBill.outstandingAmount);
    const validMappingRes = await request(
      "PATCH",
      `/api/payments/${unknownPayId}/map`,
      {
        allocations: [{ billId: targetBill.id, allocatedAmount: allocAmount }]
      },
      financeToken
    );
    assert(validMappingRes.status === 200, `Successfully allocated ₹${allocAmount} to ${targetBill.billNumber}`);
    assert(validMappingRes.data.data.mappedAmount === allocAmount, `Payment mappedAmount updated to ₹${allocAmount}`);
    assert(validMappingRes.data.data.unmappedAmount === 15000 - allocAmount, "Payment unmapped balance correctly reduced");
    assert(validMappingRes.data.data.status === "PARTIALLY_MAPPED", "Payment status is PARTIALLY_MAPPED");

    // Check Bill update
    const updatedBillRes = await request("GET", `/api/bills/${targetBill.id}`, null, financeToken);
    assert(updatedBillRes.data.data.paidAmount >= allocAmount, "Bill paidAmount was incremented");
    assert(updatedBillRes.data.data.outstandingAmount === targetBill.outstandingAmount - allocAmount, "Bill outstandingAmount was decremented");

    // -------------------------------------------------------------------------
    // Phase 6: Payment Cancellation Audit & Non-Deletability
    // -------------------------------------------------------------------------
    console.log("\n--- Phase 6: Cancellation Audit & Non-Deletability ---");
    // Record a payment to cancel
    const payToCancelRes = await request(
      "POST",
      "/api/payments",
      {
        paymentMode: "CASH",
        amount: 3000,
        customerId: "CUS-000001",
        customerName: "Sharma General Store"
      },
      ownerToken
    );
    const cancelPayId = payToCancelRes.data.data.id;

    // Salesman attempts to cancel (should be 403)
    const salesmanCancelRes = await request(
      "PATCH",
      `/api/payments/${cancelPayId}/cancel`,
      { reason: "Customer requested receipt void" },
      salesmanToken
    );
    assert(salesmanCancelRes.status === 403, "Salesman cannot cancel payments (HTTP 403 Forbidden)");

    // Cancellation without reason (should fail 400)
    const emptyReasonRes = await request(
      "PATCH",
      `/api/payments/${cancelPayId}/cancel`,
      { reason: "" },
      ownerToken
    );
    assert(emptyReasonRes.status === 400, "Payment cancellation requires justification reason (HTTP 400)");

    // Owner cancels with reason
    const validCancelRes = await request(
      "PATCH",
      `/api/payments/${cancelPayId}/cancel`,
      { reason: "Cheque bounced / Counter entry correction" },
      ownerToken
    );
    assert(validCancelRes.status === 200, "Owner cancelled payment successfully (HTTP 200)");
    assert(validCancelRes.data.data.status === "CANCELLED", "Payment status updated to CANCELLED");

    // Verify cancelled payment remains in database
    const verifyHistoryRes = await request("GET", `/api/payments/${cancelPayId}`, null, ownerToken);
    assert(verifyHistoryRes.status === 200 && verifyHistoryRes.data.data.status === "CANCELLED", "Cancelled payment preserved in database history (Zero hard deletion)");

    // -------------------------------------------------------------------------
    // Phase 7: Steps 1-7 Regression Checks
    // -------------------------------------------------------------------------
    console.log("\n--- Phase 7: Steps 1-7 Regression ---");
    const dashCheck = await request("GET", "/api/dashboard/owner", null, ownerToken);
    assert(dashCheck.status === 200 && dashCheck.data.data.summary.todaysSales > 0, "Step 2: Owner Dashboard intact");

    const cusCheck = await request("GET", "/api/customers", null, ownerToken);
    assert(cusCheck.status === 200 && cusCheck.data.data.length > 0, "Step 3: Customer Master intact");

    const prdCheck = await request("GET", "/api/products", null, ownerToken);
    assert(prdCheck.status === 200 && prdCheck.data.data.length > 0, "Step 4: Product Master intact");

    const routeCheck = await request("GET", "/api/routes", null, ownerToken);
    assert(routeCheck.status === 200 && routeCheck.data.data.length > 0, "Step 5: Routes Master intact");

    const ordersCheck = await request("GET", "/api/orders", null, ownerToken);
    assert(ordersCheck.status === 200 && ordersCheck.data.data.length > 0, "Step 6: Orders Engine intact");

    const billsCheck = await request("GET", "/api/bills", null, ownerToken);
    assert(billsCheck.status === 200 && billsCheck.data.data.length > 0, "Step 7: Billing Engine intact");

    console.log("\n================================================================================");
    console.log(`📊 TEST RESULTS: ${passedCount} PASSED | ${failedCount} FAILED`);
    console.log("================================================================================");

    if (failedCount > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution encountered an error:", err);
    process.exit(1);
  }
}

runTests();
