# Investment Tracker Website – Project Requirement Document (PRD)

**Date:** Oct 11, 2026  
**Author:** @Bala Subramaniam

---

## 1. Project Overview
The Investment Tracker is a responsive web application where individuals record every investment in one place and see its current value, profit and loss, and asset allocation at a glance. Visual assets and styling are designed in a Blender-inspired 3D aesthetic.

### Problem
Investors keep holdings across multiple brokers (Zerodha, Groww, Angel One), banks, crypto wallets, and spreadsheets, preventing them from viewing total consolidated net worth, true weighted returns, or concentration risk.

### Vision
One secure dashboard where a user adds holdings manually or by CSV import, views live-priced portfolio value in INR (₹) across NSE & BSE, tracks financial goals, and receives volatility alerts.

---

## 2. Goals and Scope
- **Track multiple asset types:** Indian stocks, ETFs, mutual funds, crypto, fixed deposits, gold/SGB, real estate/REITs, cash reserves.
- **Metrics:** Total value, invested amount, absolute and percentage return, day change, and allocation weights.
- **Privacy:** Isolated per-user state with full data export and account deletion.

---

## 3. User Roles
- **Investor:** Registered end-user managing own portfolios, transactions, goals, alerts, and reports.
- **Admin:** Product owner viewing usage metrics, managing global asset catalog, and monitoring background function health.
- **Guest:** Visitor exploring public landing page with interactive demo sandbox.

---

## 4. Functional Requirements (FR-01 to FR-27)
- **FR-01 to FR-03:** Email/password authentication, Google sign-in simulation, session persistence, secure logout.
- **FR-04:** Profile settings: name, base currency (INR default), theme (dark/light), notification channels.
- **FR-05:** Portfolios: create, rename, archive multiple portfolios.
- **FR-06:** Assets: search Indian catalog by name or ticker; dynamic lookup and custom asset addition.
- **FR-07 & FR-08:** Transactions: Buy, Sell, Dividend, Deposit, Withdrawal with validation and automatic holding recalculations.
- **FR-09 & FR-10:** CSV import wizard with column mapping preview & error reports; formatted CSV export.
- **FR-11 & FR-12:** Holdings table with quantity, avg cost, current price, value, P&L, sort, and asset class filters.
- **FR-13 & FR-14:** Scheduled price refresh simulation and manual valuation entry for unlisted assets.
- **FR-15 to FR-17:** Dashboard summary cards, allocation donut chart, interactive portfolio value over time chart (1M, 6M, 1Y, ALL).
- **FR-18:** Financial goals with target amount, completion countdown, and milestone celebration confetti.
- **FR-19:** Price and volatility alerts with Web Push and Email delivery simulation.
- **FR-20 & FR-21:** Realised & unrealised capital gains report with Union Budget 2024 LTCG tax estimator and print/PDF export.
- **FR-22:** Multi-currency daily FX conversion.
- **FR-23:** Permanent account and data deletion.
- **FR-24 & FR-25:** Admin console with telemetry, error logs, and catalog management.
- **FR-26:** Public landing page with 3D Blender hero composition, feature matrix, and pricing.
- **FR-27:** In-app feedback form.
