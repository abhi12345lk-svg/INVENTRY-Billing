# Chirag Combines FMCG Distributor ERP — Client Demo Script (Step 13)

**System**: Chirag Combines FMCG Distributor ERP  
**Client Version**: Demo Version (Steps 1–13 Complete)  
**Authorized Brands**: **Nestlé India**, **Patanjali Ayurved**, **GSK Healthcare**  
**Core Value Proposition**:
> *"From Salesman Order Booking to Billing, Payment Collection, Exception Monitoring and Owner Business Control — everything is connected."*

---

## 🔑 Demo Access & Roles

The login screen (`http://localhost:5180`) provides instant **1-Click Demo Profiles**:

| Role | Demo User | Email | Password | Scope & Responsibilities |
| :--- | :--- | :--- | :--- | :--- |
| **Owner / Super Admin** | Rajesh Sharma | `owner@distributorerp.com` | `password123` | Complete Command Tower, Exceptions, Approvals & Executive Reports |
| **Finance Manager** | Amit Verma | `finance@distributorerp.com` | `password123` | Billing, Cash Denominations, Smart UPI Recon & Cheque Vault |
| **Sales Manager** | Vikas Malhotra | `salesmgr@distributorerp.com` | `password123` | 20 Salesmen Management, Beat Routes, Target vs Achievement |
| **Field Salesman** | Rahul Kumar | `salesman@distributorerp.com` | `password123` | Route A Sadar Beat, 40 Outlets, Order Booking & Collection |

---

## 🎬 Step-by-Step Demonstration Sequence

### STEP 1: Owner Login & Command Center
1. Open the ERP at `http://localhost:5180`.
2. Click the **Owner / Super Admin** card (`owner@distributorerp.com`) and log in.
3. **Show**:
   - **Executive KPI Row**: Today's Sales (**₹14,85,400**), Today's Collection (**₹11,40,200**), Total Outstanding (**₹48,90,000**), Bills Count (**684 / 700 capacity**).
   - **Network Stats**: 4,120 Outlets, 20 Active Salesmen, 11 Vehicles.
   - **Surveillance Alerts**: 12 Overdue Outlets, 7 UPI Suspense payments, 2 Held Cheques.
4. **Talking Point**:
   > *"The Owner never has to dig through different books or make ten phone calls. In five seconds, they know today's sales, collections, and whether any credit policy was breached."*

---

### STEP 2: Customer / Outlet Master
1. In the sidebar under **Sales**, click **Customers**.
2. **Show**:
   - Outlets across territories: **Sharma General Store** (`CUS-000001`), **Gupta Provision Store** (`CUS-000002`), **New Horizon Mart** (`CUS-000013`), **Sahu Kirana Store** (`CUS-000014`).
   - Credit limit enforcement, outstanding balances, and active vs blocked status.
3. **Talking Point**:
   > *"Every retail counter has predefined credit limits, payment terms, and assigned beat routes. If an outlet defaults, credit locks immediately protect your cash flow."*

---

### STEP 3: Product Master & FMCG Catalogue
1. In the sidebar, click **Products**.
2. **Show**:
   - Multi-brand catalogue across Nestlé (**Maggi 70g**, **KitKat 38g**, **Nescafé 50g**), Patanjali (**Pure Honey 500g**, **Dant Kanti 100g**), and GSK (**Horlicks 500g**).
   - MRP, purchase rates, distributor sale rates, tax slabs (5%, 12%, 18%), and stock tracking.
3. **Talking Point**:
   > *"Pricing schemes, margins, and brand categorizations are centrally controlled by the distributor office."*

---

### STEP 4: Routes, Beats & Salesman Allocation
1. In the sidebar, click **Routes & Beats** and **Beat Assignments**.
2. **Show**:
   - Geographic beats: **Route A - Sadar Bazaar**, **Route B - Model Town**, **Route C - G.T. Road**.
   - Beat mapping: Each salesman is assigned specific outlets for designated days of the week.
3. **Talking Point**:
   > *"No salesman overlaps or misses an outlet. The beat structure ensures maximum retail coverage every single day."*

---

### STEP 5: Switch to Field Salesman Flow
1. Click **Log Out** in the top right.
2. Select the **Field Salesman** card (**Rahul Kumar** - `salesman@distributorerp.com`).
3. **Show**:
   - The Salesman Beat Dashboard scoped specifically to **Route A - Sadar Bazaar** with 40 assigned outlets.
   - High-privilege Owner surveillance and executive financial reports are completely hidden (strict RBAC).
4. **Talking Point**:
   > *"The field salesman sees only what they need on their phone or tablet: their beat for the day, target outlets, and ordering tools."*

---

### STEP 6: Salesman Order Booking
1. Click **Book Fresh Order** for **Sharma General Store**.
2. Add products:
   - 20 packs of **Maggi 70g**
   - 10 jars of **Horlicks 500g**
3. Observe live stock availability verification, itemized tax calculation, and order total.
4. Finalize & Submit the order. Status moves from `DRAFT` to `CONFIRMED`.
5. **Talking Point**:
   > *"Orders are booked instantly at the retail counter with real-time stock checks, avoiding out-of-stock arguments later in the day."*

---

### STEP 7: Billing & Invoice Generation
1. In the navigation, open **Bills & Invoices**.
2. Inspect the newly generated invoice (`INV-2026-000011`).
3. Point out:
   - Locked bill status.
   - Automated stock deduction from inventory.
   - GST tax invoice voucher ready for printing or delivery dispatch.
4. **Talking Point**:
   > *"Billing is instantaneous. The moment an order is confirmed, stock is deducted in the warehouse and the bill is staged for dispatch."*

---

### STEP 8: Payment Collection & Bill Allocation
1. Open **Collections & Recon**.
2. Record a collection entry:
   - Select **Sharma General Store**.
   - Mode: **CASH** (or UPI / Cheque).
   - Amount: **₹10,000**.
3. Map the payment to invoice `INV-2026-000001`.
4. Observe the bill outstanding decreasing in real time from **₹10,505.7** to **₹505.7**.
5. **Talking Point**:
   > *"Payment collections map directly to open bills. There is zero confusion over which bill was cleared and how much remains outstanding."*

---

### STEP 9: Smart UPI Suspense & Unmatched Reconciliation
1. Switch user to **Finance Manager** (`finance@distributorerp.com`).
2. Open **UPI Suspense Queue** under Collections.
3. Show 2 unmatched bank credits (e.g. ₹25,000 received without retail outlet name).
4. Click **Identify Customer**, assign to **Gupta Provision Store**, and allocate to their pending bill.
5. **Talking Point**:
   > *"In FMCG, retailers often pay from personal UPI accounts without bill numbers. Our suspense engine captures these credits so no cash goes missing in the bank ledger."*

---

### STEP 10: Owner Exception & Approval Control Center
1. Switch back to **Owner / Super Admin** (`owner@distributorerp.com`).
2. Open **Exceptions** from the sidebar.
3. **Show**:
   - **Critical Stockout Alert**: Patanjali Honey 500g reached 0 units with 18 pending orders.
   - **Overdue Breach**: Sharma General Store exceeded 60 days credit lock policy (₹90,000).
   - **Cash Difference**: Delivery truck cash tally shortage of -₹100.
4. Open **Approvals Queue**:
   - Show side-by-side **Before vs After** rate change diff (₹82 → ₹75) and credit limit override request.
   - Owner makes the decision with an immutable audit note.
5. **Talking Point**:
   > *"The owner manages by exception. If everything is running smoothly, they don't have to intervene. If an exception occurs, it surfaces immediately for decision."*

---

### STEP 11: Executive Reports & Commercial Insights
1. In the sidebar, click **Reports & Analytics**.
2. **Show**:
   - **Preset Date Range Toggles**: Click `[ Today ]`, `[ Last 7 Days ]`, and `[ This Month ]` to see revenue and bill velocity update instantly.
   - **Sales Trend**: 7-day revenue velocity bar chart.
   - **Collections Breakdown**: Visual channel proportion meter (Cash 30%, UPI 45%, Cheque 25%) and 95.2% auto-recon rate.
   - **Receivable Ageing Spectrum**: 6 ageing buckets (0–7, 8–15, 16–30, 31–60, 61–90, 90+ days) and Top 5 Critical Overdue Retailers.
   - **Top 5 Customers & Products**: Fast-moving SKUs and top grossing accounts.
   - **Field Force Leaderboard**: Top Performer 🏆 Rahul Kumar with 95% quota achievement.
3. **Talking Point**:
   > *"One single screen gives the business owner complete clarity on revenue, collection, debt recovery, and salesman productivity."*

---

## 🏆 Final Summary Message for the Client
> **"Chirag Combines FMCG Distributor ERP solves your three biggest distributor headaches: leakage in cash/UPI collections, stockouts during peak delivery hours, and aging market credit. Everything from order to cash is monitored from a single control tower."**
