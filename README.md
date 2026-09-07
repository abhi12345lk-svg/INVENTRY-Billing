# Chirag Combines FMCG Distributor ERP

A specialized, high-performance FMCG Distributor Enterprise Resource Planning (ERP) platform built with Node.js, Express, React, and Vite.

---

## 🌟 Modules & Features

1. **Authentication & Multi-Role RBAC**:
   * Multi-role support: Super Admin (Owner), Admin (Finance), Sales Manager, and Field Salesman.
   * Secure JWT authentication with role-based access control.
   * Light & Dark themes with seamless switching.

2. **Owner Command Center**:
   * Distributor KPIs: Today's Sales, Today's Collection, Total Outstanding, Bills Count, Stock Value.
   * Visual weekly sales trend analytics.
   * Payment collection breakdown (Cash, UPI, Cheque).
   * Active alerts, credit locks, and exceptions console.

3. **Master Data Management**:
   * **Customer Master**: Outlets, owners, credit limits, beat assignments, and live search.
   * **Product Master**: SKUs across Nestlé, Patanjali, and GSK with MRP, sale rates, pack sizes, and GST rates.
   * **Salesmen & Routes**: Area, Beat/Route mapping, and salesman customer scoping.

4. **Sales Order Booking Engine**:
   * Field sales mobile/tablet interface for salesmen.
   * Scoped outlet routing (salesman sees only assigned beat outlets).
   * Fast order booking with quantity steppers and live line calculations.
   * Two-decimal backend-authoritative calculation (Gross Subtotal, Discounts, GST, Grand Total).
   * Lifecycle management: `DRAFT` $\to$ `SUBMITTED` $\to$ `CANCELLED` (with mandatory audit reason).
   * Real-time visibility on Owner Command Center under **Sales $\to$ Orders**.

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
node src/server.js
```
* Backend runs on `http://localhost:5005`
* Health Check: `http://localhost:5005/api/health`

### 2. Frontend Setup
```bash
cd frontend
npm install
node node_modules/vite/bin/vite.js --port 5180 --strictPort --host
```
* Frontend runs on `http://localhost:5180`

---

## 🔑 Demo Personas & Credentials

| Persona / Role | Email / ID | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Rajesh Sharma** (Owner / Super Admin) | `rajesh@chirag.com` | `Password123!` | Complete Command Center, Customer/Product/Route Masters, Sales Orders & Exceptions |
| **Amit Verma** (Admin / Finance) | `amit.verma@chirag.com` | `Password123!` | Finance, Collections, Receivables Ageing, Reconciliations |
| **Vikas Malhotra** (Sales Manager) | `vikas.malhotra@chirag.com` | `Password123!` | Team Tracking, Route Assignments, Sales Orders |
| **Rahul Kumar** (Field Salesman) | `rahul.kumar@chirag.com` | `Password123!` | My Route, Scoped Beat Outlets, Fast Mobile Order Booking |
