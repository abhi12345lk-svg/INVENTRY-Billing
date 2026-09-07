export const getOwnerDashboardData = () => {
  return {
    company: "Chirag Combines FMCG",
    network: {
      totalOutlets: 4120,
      activeSalesmen: 20,
      deliveryVehicles: 11,
      brands: ["Nestlé", "Patanjali", "GSK"]
    },
    summary: {
      todaysSales: 1485400,
      todaysSalesTrend: "+12.4%",
      todaysCollection: 1140200,
      todaysCollectionTrend: "+8.2%",
      totalOutstanding: 4890000,
      totalOutstandingTrend: "-2.1%",
      todaysBillsCount: 684,
      todaysBillsCapacity: 700,
      totalCustomers: 4120,
      activeCustomers: 3890,
      stockValue: 8250000
    },
    sales: {
      weeklyTrend: [
        { day: "Mon", date: "01 Sep", sales: 1120000, bills: 520 },
        { day: "Tue", date: "02 Sep", sales: 1280000, bills: 590 },
        { day: "Wed", date: "03 Sep", sales: 1350000, bills: 610 },
        { day: "Thu", date: "04 Sep", sales: 1410000, bills: 640 },
        { day: "Fri", date: "05 Sep", sales: 1485400, bills: 684 },
        { day: "Sat (Proj)", date: "06 Sep", sales: 1650000, bills: 710 },
        { day: "Sun (Proj)", date: "07 Sep", sales: 980000, bills: 410 }
      ],
      topSalesmen: [
        { name: "Rahul Kumar", route: "Route A - Sadar", sales: 185000, collection: 142000, targetAchieved: 92 },
        { name: "Sanjay Gupta", route: "Route C - Model Town", sales: 168000, collection: 135000, targetAchieved: 88 },
        { name: "Amit Sharma", route: "Route B - Civil Lines", sales: 154000, collection: 120000, targetAchieved: 85 }
      ]
    },
    collections: {
      total: 1140200,
      cash: { amount: 342000, percentage: 30, verified: 341900, discrepancy: -100 },
      upi: { amount: 513000, percentage: 45, matched: 488000, suspense: 25000 },
      cheque: { amount: 285200, percentage: 25, pending: 45000, cleared: 240200 },
      breakdown: [
        { mode: "UPI / E-Payment", amount: 513000, color: "#6366f1", percentage: 45 },
        { mode: "Cash Collection", amount: 342000, color: "#10b981", percentage: 30 },
        { mode: "Cheques Deposited", amount: 285200, color: "#f59e0b", percentage: 25 }
      ]
    },
    receivables: {
      totalOutstanding: 4890000,
      ageing: [
        { range: "0–7 Days", amount: 1850000, percentage: 37.8, status: "Normal", color: "#10b981" },
        { range: "8–15 Days", amount: 1240000, percentage: 25.4, status: "Watch", color: "#3b82f6" },
        { range: "16–30 Days", amount: 890000, percentage: 18.2, status: "Attention", color: "#eab308" },
        { range: "31–60 Days", amount: 520000, percentage: 10.6, status: "Critical", color: "#f97316" },
        { range: "61–90 Days", amount: 260000, percentage: 5.3, status: "High Risk", color: "#ef4444" },
        { range: "90+ Days", amount: 130000, percentage: 2.7, status: "Severe Overdue", color: "#b91c1c" }
      ]
    },
    exceptions: [
      {
        id: "exc-01",
        title: "Customers Overdue >60 Days",
        type: "OVERDUE",
        severity: "CRITICAL",
        severityColor: "#ef4444",
        count: 12,
        amount: 390000,
        description: "Sharma General Store (₹90,000 pending for 62 days) and 11 other outlets exceeded credit lock policy.",
        actionText: "Review Credit Locks"
      },
      {
        id: "exc-02",
        title: "Unmatched UPI Suspense Queue",
        type: "UPI_SUSPENSE",
        severity: "HIGH",
        severityColor: "#f59e0b",
        count: 7,
        amount: 25000,
        description: "7 UPI payments received from personal/savings accounts without retail outlet reference.",
        actionText: "Match UPI Payments"
      },
      {
        id: "exc-03",
        title: "Pending Cheques in Salesman Bag",
        type: "CHEQUE_PENDING",
        severity: "HIGH",
        severityColor: "#f59e0b",
        count: 3,
        amount: 45000,
        description: "Salesman Rahul Kumar has 2 cheques unsubmitted to office for > 24 hours.",
        actionText: "Track Cheques"
      },
      {
        id: "exc-04",
        title: "Daily E-Cash Denomination Discrepancy",
        type: "CASH_MISMATCH",
        severity: "WARNING",
        severityColor: "#eab308",
        count: 1,
        amount: 100,
        description: "Salesman declaration ₹24,000 vs Physical office count ₹23,900 (-₹100 diff).",
        actionText: "Verify Cash Tally"
      },
      {
        id: "exc-05",
        title: "Pending Bill Amendment Requests",
        type: "AMENDMENT_APPROVAL",
        severity: "INFO",
        severityColor: "#3b82f6",
        count: 4,
        amount: 14500,
        description: "4 locked bills require Owner approval for price/damaged goods adjustments.",
        actionText: "Approve Amendments"
      },
      {
        id: "exc-06",
        title: "Stock Discrepancy Alert",
        type: "STOCK_MISMATCH",
        severity: "WARNING",
        severityColor: "#eab308",
        count: 2,
        amount: 8200,
        description: "Nestlé Maggi 100g 2 cases discrepancy detected during warehouse loading.",
        actionText: "Audit Stock"
      }
    ],
    recentActivity: [
      { id: "act-01", time: "14:10", user: "Rahul Kumar (Salesman)", action: "Booked Order #ORD-8942 for Sharma Store (₹14,500)", type: "order" },
      { id: "act-02", time: "13:45", user: "Billing Engine", action: "Generated Invoice #INV-10482 & Locked Amount", type: "bill" },
      { id: "act-03", time: "13:20", user: "Finance System", action: "Received UPI Payment ₹25,000 from Guptaji Traders", type: "payment" },
      { id: "act-04", time: "12:50", user: "Amit Verma (Finance)", action: "Auto-matched UTR #482910 to Bill #INV-10450", type: "reconcile" },
      { id: "act-05", time: "12:15", user: "Warehouse Staff", action: "Dispatched Vehicle #10 (Route C - 64 Outlets)", type: "dispatch" },
      { id: "act-06", time: "11:30", user: "Rajesh Sharma (Owner)", action: "Approved Amendment Request v2 for Bill #INV-10390", type: "approval" }
    ]
  };
};
