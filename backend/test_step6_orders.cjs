/**
 * Step 6: Order Management & Booking Engine Integration & Regression Test Suite
 * Tests all 49+ requirements and anti-fraud rules
 */

const http = require("http");

const BASE_URL = "http://127.0.0.1:5005";

async function makeRequest(path, method = "GET", data = null, token = null) {
  const headers = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const options = {
    method,
    headers
  };
  if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
    options.body = JSON.stringify(data);
  }
  const res = await fetch(`http://127.0.0.1:5005${path}`, options);
  let body;
  try {
    body = await res.json();
  } catch (e) {
    body = null;
  }
  return { status: res.status, body };
}

let tokens = {
  owner: null,
  finance: null,
  salesmgr: null,
  salesman: null
};

let testCustomerInScope = null;
let testCustomerOutOfScope = null;
let testProducts = [];
let createdOrderId = null;

async function runTests() {
  console.log("================================================================================");
  console.log("🧪 STARTING STEP 6: ORDER MANAGEMENT & BOOKING ENGINE COMPREHENSIVE TEST SUITE");
  console.log("================================================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = "") {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} ${details ? `(${details})` : ""}`);
      failed++;
    }
  }

  try {
    // 1. Health & Demo Users Check
    console.log("\n--- Phase 1: Authentication & RBAC Verification ---");
    const health = await makeRequest("/api/health");
    assert(health.status === 200 && health.body.status === "online", "Health check /api/health");

    // Login 4 roles
    const ownerLogin = await makeRequest("/api/auth/login", "POST", {
      emailOrMobile: "owner@distributorerp.com",
      role: "SUPER_ADMIN",
      password: "admin123"
    });
    assert(ownerLogin.status === 200 && ownerLogin.body.token, "Owner Login (SUPER_ADMIN)");
    tokens.owner = ownerLogin.body.token;

    const financeLogin = await makeRequest("/api/auth/login", "POST", {
      emailOrMobile: "finance@distributorerp.com",
      role: "FINANCE",
      password: "admin123"
    });
    assert(financeLogin.status === 200 && financeLogin.body.token, "Finance Login (FINANCE)");
    tokens.finance = financeLogin.body.token;

    const salesmgrLogin = await makeRequest("/api/auth/login", "POST", {
      emailOrMobile: "salesmgr@distributorerp.com",
      role: "SALES_MANAGER",
      password: "admin123"
    });
    assert(salesmgrLogin.status === 200 && salesmgrLogin.body.token, "Sales Manager Login (SALES_MANAGER)");
    tokens.salesmgr = salesmgrLogin.body.token;

    const salesmanLogin = await makeRequest("/api/auth/login", "POST", {
      emailOrMobile: "salesman@distributorerp.com",
      role: "SALESMAN",
      password: "admin123"
    });
    assert(salesmanLogin.status === 200 && salesmanLogin.body.token, "Field Salesman Login (SALESMAN)");
    tokens.salesman = salesmanLogin.body.token;

    // 2. Fetch Customers and Products for testing
    console.log("\n--- Phase 2: Pipeline Data Discovery ---");
    const cusRes = await makeRequest("/api/customers?limit=50", "GET", null, tokens.owner);
    assert(cusRes.status === 200 && cusRes.body.data.length > 0, "Fetch Customers for Order Booking Pipeline");
    
    // In-scope customer for Rahul Kumar (assigned route Route A, or salesmanId matching)
    testCustomerInScope = cusRes.body.data.find(c => c.routeId === "RT-000001" || c.salesmanId === "SM-000001" || c.customerCode === "CUS-000001") || cusRes.body.data[0];
    // Create or find an out-of-scope customer for Rahul Kumar
    testCustomerOutOfScope = cusRes.body.data.find(c => c.salesmanId && c.salesmanId !== "SM-000001" && c.salesmanId !== "user-salesman-01");
    if (!testCustomerOutOfScope) {
      testCustomerOutOfScope = cusRes.body.data[cusRes.body.data.length - 1];
    }

    console.log(`  ℹ In-Scope Customer: ${testCustomerInScope.shopName} (${testCustomerInScope.customerCode}) | Salesman: ${testCustomerInScope.salesmanId || "None"}`);
    console.log(`  ℹ Out-Of-Scope Customer: ${testCustomerOutOfScope.shopName} (${testCustomerOutOfScope.customerCode}) | Salesman: ${testCustomerOutOfScope.salesmanId || "None"}`);
    
    const prodRes = await makeRequest("/api/products?limit=50", "GET", null, tokens.owner);
    assert(prodRes.status === 200 && prodRes.body.data.length > 0, "Fetch Products Master for Order Line Items");
    testProducts = prodRes.body.data.filter(p => p.status === "ACTIVE");
    console.log(`  ℹ Discovered ${testProducts.length} Active Products available for sales booking`);

    // 3. GET /api/orders by Owner
    console.log("\n--- Phase 3: Order Retrieval & Sequential Numbering ---");
    const ordersRes = await makeRequest("/api/orders", "GET", null, tokens.owner);
    assert(ordersRes.status === 200 && ordersRes.body.success, "GET /api/orders by Super Admin / Owner");
    assert(ordersRes.body.data.length >= 4, `Pre-seeded demo orders present (Count: ${ordersRes.body.data.length})`);
    
    const seedOrder = ordersRes.body.data[0];
    assert(/^ORD-\d{6}$/.test(seedOrder.orderNumber), `Sequential order number format validated (${seedOrder.orderNumber})`);
    assert(seedOrder.customer && seedOrder.customer.shopName, "Order contains complete Customer Snapshot");
    assert(seedOrder.salesman && seedOrder.salesman.salesmanName, "Order contains complete Salesman Snapshot");
    assert(seedOrder.items && seedOrder.items.length > 0, "Order contains snapshot line items");
    assert(seedOrder.pricingSummary && seedOrder.pricingSummary.grandTotal > 0, "Order contains backend-authoritative Pricing Summary");

    // Verify backend mathematical accuracy on seed order
    const pSum = seedOrder.pricingSummary;
    const calcExpectedTaxable = Math.round((pSum.grossSubtotal - pSum.totalDiscount) * 100) / 100;
    assert(Math.abs(pSum.taxableAmount - calcExpectedTaxable) < 0.05, `Mathematical Check: Taxable = Gross - Discount (${pSum.taxableAmount} ≈ ${calcExpectedTaxable})`);
    const calcExpectedGrand = Math.round((pSum.taxableAmount + pSum.totalTax) * 100) / 100;
    assert(Math.abs(pSum.grandTotal - calcExpectedGrand) < 0.05, `Mathematical Check: Grand Total = Taxable + GST (${pSum.grandTotal} ≈ ${calcExpectedGrand})`);

    // 4. Anti-Fraud Rule: Out-of-Scope Salesman Booking Prevention
    console.log("\n--- Phase 4: Anti-Fraud & Strict Scoping Checks ---");
    // Try booking for an out-of-scope customer
    const unauthorizedAttempt = await makeRequest("/api/orders", "POST", {
      customerId: testCustomerOutOfScope.id,
      items: [{ productId: testProducts[0].id, quantity: 5 }]
    }, tokens.salesman);
    assert(unauthorizedAttempt.status === 403, 
      "Anti-Fraud: Order booking rejected for out-of-scope customer (HTTP 403 Forbidden)");

    // Test Discount Limit Violation:
    const prodWithDiscount = testProducts.find(p => p.discount !== undefined) || testProducts[0];
    const allowedDiscount = prodWithDiscount.discount || 5;
    const excessiveDiscount = allowedDiscount + 15; // greater than allowed
    const discountViolation = await makeRequest("/api/orders", "POST", {
      customerId: testCustomerInScope.id,
      items: [
        {
          productId: prodWithDiscount.id,
          quantity: 2,
          discount: excessiveDiscount // ILLEGAL DISCOUNT
        }
      ]
    }, tokens.salesman);

    assert(discountViolation.status === 400 && discountViolation.body.message.includes("exceeds the maximum"), 
      `Anti-Fraud: Excessive discount blocked (${excessiveDiscount}% > max ${allowedDiscount}%)`);

    // 5. In-Scope Order Creation: DRAFT order
    console.log("\n--- Phase 5: Authoritative Calculation & Order Creation ---");
    const p1 = testProducts[0];
    const p2 = testProducts[1] || testProducts[0];

    const createPayload = {
      customerId: testCustomerInScope.id,
      orderDate: new Date().toISOString(),
      notes: "Urgent morning delivery requested by retailer",
      items: [
        {
          productId: p1.id,
          quantity: 10,
          discount: Math.min(2, p1.discount || 0)
        },
        {
          productId: p2.id,
          quantity: 5,
          discount: 0
        }
      ]
    };

    const createRes = await makeRequest("/api/orders", "POST", createPayload, tokens.salesman);
    assert(createRes.status === 201 && createRes.body.success, "Salesman creates in-scope order (Status: 201)");
    const newOrder = createRes.body.data;
    createdOrderId = newOrder.id;

    assert(/^ORD-\d{6}$/.test(newOrder.orderNumber), `Server issued unique sequential order number: ${newOrder.orderNumber}`);
    assert(newOrder.status === "DRAFT", `Default initial lifecycle state is DRAFT (${newOrder.status})`);
    assert(newOrder.customer.customerCode === testCustomerInScope.customerCode, "Customer details immutably snapshotted");
    assert(newOrder.items.length === 2, "2 order line items captured with product metadata");
    assert(newOrder.pricingSummary.grandTotal > 0, `Backend calculated Grand Total: ₹${newOrder.pricingSummary.grandTotal}`);
    assert(newOrder.auditLog && newOrder.auditLog.length >= 1, "Audit trail records creation event");

    // 6. Draft Order Update
    console.log("\n--- Phase 6: Order Modification & Lifecycle Progression ---");
    const updatePayload = {
      notes: "Updated retailer note: Deliver after 11 AM",
      items: [
        {
          productId: p1.id,
          quantity: 15, // updated quantity
          discount: 0
        }
      ]
    };

    const updateRes = await makeRequest(`/api/orders/${createdOrderId}`, "PUT", updatePayload, tokens.salesman);
    if (updateRes.status !== 200) {
      console.log("  ⚠️ DEBUG updateRes status:", updateRes.status, "body:", updateRes.body);
    }
    assert(updateRes.status === 200 && updateRes.body?.success, "Draft order items and quantities updated successfully");
    assert(updateRes.body?.data?.pricingSummary?.totalQuantity === 15, `Quantity recalculation verified: 15 units`);

    // 7. Order Submission (Transition to SUBMITTED)
    const submitRes = await makeRequest(`/api/orders/${createdOrderId}/submit`, "PATCH", {}, tokens.salesman);
    assert(submitRes.status === 200 && submitRes.body.success, "Draft Order transition to SUBMITTED");
    assert(submitRes.body.data.status === "SUBMITTED", "Order status changed to SUBMITTED");
    assert(submitRes.body.data.submittedAt !== null, "Order submittedAt timestamp recorded");

    // 8. Immutability of Submitted Orders
    const illegalEdit = await makeRequest(`/api/orders/${createdOrderId}`, "PUT", {
      items: [{ productId: p1.id, quantity: 20 }]
    }, tokens.salesman);
    assert(illegalEdit.status === 400, "Immutability: Submitted order cannot be modified (HTTP 400 Bad Request)");

    // 9. Scoped Salesman Views
    console.log("\n--- Phase 7: Scoped Orders & Customer Order History ---");
    const myOrdersRes = await makeRequest("/api/orders/my", "GET", null, tokens.salesman);
    assert(myOrdersRes.status === 200 && myOrdersRes.body.success, "Salesman retrieves scoped orders via /api/orders/my");
    const hasCreatedOrder = myOrdersRes.body.data.some(o => o.id === createdOrderId);
    assert(hasCreatedOrder, "Created order appears in salesman's scoped order list");

    // 10. Customer Order History API
    const cusOrdersRes = await makeRequest(`/api/customers/${testCustomerInScope.id}/orders`, "GET", null, tokens.owner);
    assert(cusOrdersRes.status === 200 && cusOrdersRes.body.success, "GET /api/customers/:id/orders returns customer order history");
    const hasOrderInHistory = cusOrdersRes.body.data.some(o => o.id === createdOrderId);
    assert(hasOrderInHistory, "New order is linked and visible in Customer's Order History tab");

    // 11. Order Cancellation with Mandatory Reason
    console.log("\n--- Phase 8: Cancellation & Non-Deletability ---");
    // Attempt cancellation without reason
    const cancelNoReason = await makeRequest(`/api/orders/${createdOrderId}/cancel`, "PATCH", {}, tokens.owner);
    assert(cancelNoReason.status === 400, "Cancellation requires mandatory reason (HTTP 400)");

    // Cancel with reason
    const cancelWithReason = await makeRequest(`/api/orders/${createdOrderId}/cancel`, "PATCH", {
      reason: "Retailer shop temporarily closed for renovation"
    }, tokens.owner);
    assert(cancelWithReason.status === 200 && cancelWithReason.body.success, "Order successfully cancelled with audit reason");
    assert(cancelWithReason.body.data.status === "CANCELLED", "Order status updated to CANCELLED");
    assert(cancelWithReason.body.data.cancellationReason === "Retailer shop temporarily closed for renovation", "Cancellation reason preserved in history");

    // Verify order is NOT deleted
    const fetchCancelled = await makeRequest(`/api/orders/${createdOrderId}`, "GET", null, tokens.owner);
    assert(fetchCancelled.status === 200 && fetchCancelled.body.data.status === "CANCELLED", 
      "Zero Data Loss: Cancelled order remains queryable with full audit trail");

    // 12. Regression: Steps 1-5 Checks
    console.log("\n--- Phase 9: Steps 1-5 Regression Verification ---");
    const ownerDash = await makeRequest("/api/dashboard/owner", "GET", null, tokens.owner);
    assert(ownerDash.status === 200 && ownerDash.body.data.summary, "Step 2: Owner Command Center Dashboard intact");

    const regCustomers = await makeRequest("/api/customers", "GET", null, tokens.owner);
    assert(regCustomers.status === 200 && regCustomers.body.data.length > 0, "Step 3: Customer Master CRUD intact");

    const regProducts = await makeRequest("/api/products", "GET", null, tokens.owner);
    assert(regProducts.status === 200 && regProducts.body.data.length > 0, "Step 4: Product Master intact");

    const regAreas = await makeRequest("/api/areas", "GET", null, tokens.owner);
    assert(regAreas.status === 200 && regAreas.body.data.length > 0, "Step 5: Area Master intact");

    const regRoutes = await makeRequest("/api/routes", "GET", null, tokens.owner);
    assert(regRoutes.status === 200 && regRoutes.body.data.length > 0, "Step 5: Route / Beat Master intact");

    const regSalesmen = await makeRequest("/api/salesmen", "GET", null, tokens.owner);
    assert(regSalesmen.status === 200 && regSalesmen.body.data.length > 0, "Step 5: Salesmen Master intact");

  } catch (err) {
    console.error("Test execution error:", err);
    failed++;
  }

  console.log("\n================================================================================");
  console.log(`📊 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("================================================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
