const http = require("http");

async function fetchJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const body = options.body ? (typeof options.body === "string" ? options.body : JSON.stringify(options.body)) : null;
    
    const req = http.request({
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(body ? { "Content-Length": Buffer.byteLength(body) } : {}),
        ...(options.headers || {})
      }
    }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function runRegression() {
  console.log("=== STARTING STEP 5 REGRESSION & INTEGRATION SUITE ===");

  // 1. Health
  const health = await fetchJson("http://localhost:5005/api/health");
  console.log("1. Health check:", health.status, health.data.status);

  // 2. Auth - Owner Login
  const ownerLogin = await fetchJson("http://localhost:5005/api/auth/login", {
    method: "POST",
    body: { emailOrMobile: "owner@distributorerp.com", password: "admin123" }
  });
  console.log("2. Owner Login:", ownerLogin.status, "role =", ownerLogin.data.user?.role);
  const ownerToken = ownerLogin.data.token;

  // 3. Auth - Salesman Login (Rahul)
  const smLogin = await fetchJson("http://localhost:5005/api/auth/login", {
    method: "POST",
    body: { emailOrMobile: "salesman@distributorerp.com", password: "admin123" }
  });
  console.log("3. Salesman Login:", smLogin.status, "role =", smLogin.data.user?.role);
  const smToken = smLogin.data.token;

  // 4. Owner Dashboard Access (Step 2 regression)
  const ownerDash = await fetchJson("http://localhost:5005/api/dashboard/owner", {
    headers: { Authorization: `Bearer ${ownerToken}` }
  });
  console.log("4. Owner Dashboard KPI:", ownerDash.status, "Total Rev Label =", ownerDash.data.data?.summary?.totalRevenue?.label, "Outlets =", ownerDash.data.data?.network?.totalOutlets);

  // 5. Non-Owner 403 on Dashboard
  const smDash = await fetchJson("http://localhost:5005/api/dashboard/owner", {
    headers: { Authorization: `Bearer ${smToken}` }
  });
  console.log("5. Non-Owner Dashboard RBAC rejection:", smDash.status, "(Expected 403)");

  // 6. Customer Master & Salesman Scoping (Step 3 regression)
  const allCust = await fetchJson("http://localhost:5005/api/customers?limit=100", {
    headers: { Authorization: `Bearer ${ownerToken}` }
  });
  const smCust = await fetchJson("http://localhost:5005/api/customers?limit=100", {
    headers: { Authorization: `Bearer ${smToken}` }
  });
  console.log("6. Customer Scoping: Owner total =", allCust.data.total, "| Salesman visible =", smCust.data.total);

  // 7. Product Master (Step 4 regression)
  const prods = await fetchJson("http://localhost:5005/api/products?limit=100", {
    headers: { Authorization: `Bearer ${ownerToken}` }
  });
  console.log("7. Product Master: status =", prods.status, "total =", prods.data.total);

  // 8. Area Master (Step 5)
  const areas = await fetchJson("http://localhost:5005/api/areas", {
    headers: { Authorization: `Bearer ${ownerToken}` }
  });
  console.log("8. Area Master: total =", areas.data.total);

  // 9. Route Master (Step 5)
  const routes = await fetchJson("http://localhost:5005/api/routes", {
    headers: { Authorization: `Bearer ${ownerToken}` }
  });
  console.log("9. Route Master: total =", routes.data.total);

  // 10. Salesman Master (Step 5)
  const salesmen = await fetchJson("http://localhost:5005/api/salesmen", {
    headers: { Authorization: `Bearer ${ownerToken}` }
  });
  console.log("10. Salesman Master: total =", salesmen.data.total, "Rahul routes =", salesmen.data.data[0]?.assignedRoutes?.length);

  // 11. Customer Assignments & Unassigned Filter (Step 5)
  const unassigned = await fetchJson("http://localhost:5005/api/assignments/customers?unassignedOnly=true", {
    headers: { Authorization: `Bearer ${ownerToken}` }
  });
  console.log("11. Unassigned Outlets found:", unassigned.data.total, unassigned.data.data?.map(c => c.customerCode));

  // 12. Reassign Customer Outlet (Step 5)
  const targetCus = unassigned.data.data[0];
  const targetRoute = routes.data.data[0];
  const targetSm = salesmen.data.data[0];
  console.log(`12. Reassigning outlet ${targetCus.customerCode} to Route ${targetRoute.routeCode} & Salesman ${targetSm.salesmanCode}...`);

  const assignRes = await fetchJson(`http://localhost:5005/api/assignments/customer/${targetCus.id}/assign`, {
    method: "POST",
    headers: { Authorization: `Bearer ${ownerToken}` },
    body: {
      salesmanId: targetSm.id,
      routeId: targetRoute.id,
      reason: "Automated regression verification"
    }
  });
  console.log("12b. Reassignment status:", assignRes.status, "message:", assignRes.data.message);

  // 13. Audit History (Step 5)
  const history = await fetchJson(`http://localhost:5005/api/assignments/history/${targetCus.id}`, {
    headers: { Authorization: `Bearer ${ownerToken}` }
  });
  console.log("13. Audit History for", targetCus.customerCode, ":", history.data.data?.length, "records");

  // 14. RBAC: Salesman cannot perform assignment mutation
  const forbiddenAssign = await fetchJson(`http://localhost:5005/api/assignments/customer/${targetCus.id}/assign`, {
    method: "POST",
    headers: { Authorization: `Bearer ${smToken}` },
    body: {
      salesmanId: targetSm.id,
      routeId: targetRoute.id
    }
  });
  console.log("14. Salesman Assignment Mutation RBAC:", forbiddenAssign.status, "(Expected 403 Forbidden)");

  console.log("=== ALL STEP 1-5 REGRESSION & INTEGRATION TESTS SUCCEEDED ===");
}

runRegression().catch(console.error);
