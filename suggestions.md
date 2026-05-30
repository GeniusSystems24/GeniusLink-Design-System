# GeniusLink UI Kit — Screen Suggestions

A structured list of screens that are missing from the current kit, grouped by module and priority. Each entry notes the screen type, its purpose, and the key UI patterns it would exercise.

---

## 1. Sales Module *(high priority — largely missing)*

The Sales hub exists but only has Customer list/create/view. These transactional screens are core to any ERP.

| Screen | ID suggestion | Key patterns |
|---|---|---|
| **Sales Orders — List** | `salesOrders` | Filterable table, status pills (Draft / Confirmed / Delivered / Invoiced / Cancelled), bulk actions |
| **Create Sales Order** | `createSalesOrder` | Line-item editor (product, qty, unit price, discount, tax), customer picker, delivery date, totals strip |
| **Sales Order — View** | `salesOrderDetail` | Read-only detail, fulfilment progress bar, linked invoices + deliveries, approve/confirm action |
| **Quotations — List** | `quotations` | Same table pattern, status: Draft / Sent / Accepted / Expired |
| **Create Quotation** | `createQuotation` | Like Sales Order but with expiry date and "Convert to Order" action |
| **Sales Invoices — List** | `salesInvoices` | Aged indicator column, overdue highlighting, bulk send |
| **Create Sales Invoice** | `createSalesInvoice` | Line items + tax, payment terms, "Link to Order" picker |
| **Sales Invoice — View** | `salesInvoiceDetail` | Print/PDF action, payment status bar, record payment button |
| **Receive Payment** | `receivePayment` | Form: invoice reference, amount, payment method, bank account, exchange rate |
| **Sales Returns — List** | `salesReturns` | Credit-note-style list, link back to original invoice |
| **Create Sales Return** | `createSalesReturn` | Mirror of invoice form, negative line amounts, reason field |
| **Delivery Notes — List** | `deliveryNotes` | Linked to orders, status: Pending / Dispatched / Delivered |
| **Create Delivery Note** | `createDeliveryNote` | Warehouse picker, carrier field, line qty confirmation |
| **Customer Statement** | `customerStatement` | Date-range picker, running balance column, print action |

---

## 2. Procurement Module *(high priority — largely missing)*

Same gap as Sales. Only Supplier list/create/view exists.

| Screen | ID suggestion | Key patterns |
|---|---|---|
| **Purchase Orders — List** | `purchaseOrders` | Status pills (Draft / Sent / Partially Received / Closed), approval column |
| **Create Purchase Order** | `createPurchaseOrder` | Supplier picker, line-item editor, expected delivery date, attach document |
| **Purchase Order — View** | `purchaseOrderDetail` | Receiving progress, linked bills, approve/send actions |
| **Purchase Invoices (Bills) — List** | `purchaseBills` | Aged payables indicator, due-date column |
| **Create Purchase Bill** | `createPurchaseBill` | Link to PO, line items, tax, payment terms |
| **Purchase Bill — View** | `purchaseBillDetail` | Payment status, record payment action |
| **Make Payment** | `makePayment` | Bill reference, amount, payment method, bank account |
| **Purchase Returns — List** | `purchaseReturns` | Debit-note list |
| **Create Purchase Return** | `createPurchaseReturn` | Reason, line items, link to original bill |
| **Supplier Statement** | `supplierStatement` | Running balance, date range, print/export |

---

## 3. Reports Module *(medium priority — more report types needed)*

Currently only has Trial Balance, Income Statement, Balance Sheet, Inventory Valuation, Audit Log.

| Screen | ID suggestion | Key patterns |
|---|---|---|
| **Cash Flow Statement** | `cashFlowReport` | Operating / Investing / Financing sections, period selector |
| **General Ledger** | `generalLedgerReport` | Account picker, date range, opening balance + running total per line |
| **Aged Receivables** | `agedReceivables` | Customer rows × aging buckets (0–30 / 31–60 / 61–90 / 90+), drill-down |
| **Aged Payables** | `agedPayables` | Supplier rows × same buckets |
| **Bank Reconciliation Statement** | `bankReconciliationReport` | Side-by-side: book balance vs. bank balance, uncleared items |
| **Stock Movement Report** | `stockMovementReport` | Product × warehouse, in/out per period, opening/closing qty |
| **Sales Report** | `salesReport` | Pivot: by customer / product / period / salesperson; chart + table |
| **Purchases Report** | `purchasesReport` | By supplier / product / period |
| **Profit & Loss by Cost Centre** | `plByCostCentre` | Grouped income/expense rows by department tag |
| **VAT / Tax Return** | `vatReturnReport` | Output tax, input tax, net payable, filing-period selector |

---

## 4. Banking Module *(medium priority — reconciliation is missing)*

Deposit/withdrawal/transfer forms exist. Reconciliation flow is absent.

| Screen | ID suggestion | Key patterns |
|---|---|---|
| **Bank Accounts — List** | `bankAccounts` | Balance column, last-reconciled date, link to statement |
| **Bank Account — View** | `bankAccountDetail` | Transaction ledger, import statement button, reconcile action |
| **Bank Reconciliation** | `bankReconciliation` | Two-pane: imported statement lines ↔ book transactions, match / unmatch, running difference |
| **Cheques — List** | `chequesList` | Issued / received tabs, status: Pending / Cleared / Bounced |
| **Create Cheque** | `createCheque` | Payee, amount, due date, bank account |
| **Standing Orders / Recurring Payments** | `recurringPayments` | Schedule table, frequency, next-run date, active toggle |

---

## 5. Fixed Assets Module *(new module — not yet present)*

A common ERP module that would be a natural addition.

| Screen | ID suggestion | Key patterns |
|---|---|---|
| **Assets — List** | `assetsList` | Asset register table, category, book value, net book value column |
| **Create Asset** | `createAsset` | Purchase date, cost, useful life, depreciation method (straight-line / declining balance), linked GL account |
| **Asset — View** | `assetDetail` | Depreciation schedule table, disposal button, maintenance log |
| **Depreciation Run** | `depreciationRun` | Period selector, preview table, post action |
| **Asset Disposal** | `assetDisposal` | Sale price, gain/loss calculation, linked journal entry |
| **Asset Categories** | `assetCategories` | GL mapping per category, default depreciation method |

---

## 6. Payroll Module *(new module — not yet present)*

| Screen | ID suggestion | Key patterns |
|---|---|---|
| **Employees — List** | `employeesList` | Department filter, status (Active / On Leave / Terminated) |
| **Create Employee** | `createEmployee` | Personal info, bank details, job title, salary structure |
| **Employee — View** | `employeeDetail` | Tabs: Details / Payslips / Leave / Documents |
| **Salary Structures — List** | `salaryStructures` | Component rows (basic, housing, transport, deductions) |
| **Payroll Runs — List** | `payrollRuns` | Month / year, status: Draft / Confirmed / Paid |
| **Create Payroll Run** | `createPayrollRun` | Period, employee group selector, computed totals |
| **Payslip — View** | `payslipDetail` | Print-ready single-employee slip, earnings vs. deductions |
| **Leave Requests — List** | `leaveRequests` | Type (annual / sick / unpaid), approve / reject actions |

---

## 7. Global UX Patterns *(high value — platform-level)*

These are cross-cutting UI surfaces that appear in every enterprise product.

| Screen | ID suggestion | Key patterns |
|---|---|---|
| **Command Palette (⌘K)** | `commandPalette` | Overlay, fuzzy search across screens + records, keyboard-only nav, recent items |
| **Global Search Results** | `searchResults` | Grouped hits (Accounts / Transactions / Products / Contacts), highlight match |
| **Notification Centre** | `notificationCentre` | Feed of actor-verb-object entries, unread badge, mark-all-read, deep-link |
| **Activity Timeline** | `activityTimeline` | Per-record audit strip: timestamp, actor avatar, change description |
| **Inline Comment Thread** | `commentThread` | Comment input + thread attached to a record, mentions |
| **Bulk Action Bar** | `bulkActionBar` | Sticky bottom bar that appears on multi-row select: count, action buttons (delete / export / tag) |
| **Print Preview** | `printPreview` | Full-bleed preview with page breaks, header/footer, print button |
| **Export Modal** | `exportModal` | Format picker (XLSX / CSV / PDF), column selector, date range |
| **Confirmation Dialog Set** | `confirmationDialogs` | Delete / Void / Post / Reverse — each with consequence text + audit-trail note |
| **Empty State Library** | `emptyStates` | One canvas showing all empty-state variants: no data, no results, no permissions, offline |
| **Error Pages** | `errorPages` | 404 Not Found, 403 Forbidden, 500 Server Error, Maintenance mode |

---

## 8. Onboarding & First-Run *(medium priority)*

| Screen | ID suggestion | Key patterns |
|---|---|---|
| **Setup Wizard** | `setupWizard` | Multi-step: Company info → Fiscal year → Chart of accounts → Currencies → Invite team |
| **Welcome / Get Started** | `getStarted` | Checklist of setup tasks with progress, "skip" option |
| **Two-Factor Setup** | `twoFactorSetup` | QR code scan, verification code input, recovery codes |
| **Invite Team (onboarding)** | `inviteTeam` | Email input + role picker, bulk invite CSV upload |

---

## 9. User / Account Settings *(personal, not company-wide)*

Currently Settings covers company/platform config. Personal profile is absent.

| Screen | ID suggestion | Key patterns |
|---|---|---|
| **My Profile** | `myProfile` | Avatar upload, display name, email, phone, language preference |
| **Security Settings** | `securitySettings` | Change password, active sessions list, 2FA toggle |
| **Personal Notification Preferences** | `personalNotifications` | Per-event toggles (email / in-app / push) |
| **API Tokens (personal)** | `personalApiTokens` | Generate / revoke personal access tokens, scopes |

---

## 10. Mobile Screens *(gap-fill for existing mobile kit)*

The mobile kit has dashboard/accounts/inventory but is missing transactional flows.

| Screen | ID suggestion | Key patterns |
|---|---|---|
| **Mobile Sales Order — View** | `mobileSalesOrder` | iOS card, line items, status pill, approve CTA |
| **Mobile Purchase Order — View** | `mobilePurchaseOrder` | Receive items action, attachment viewer |
| **Mobile Notification Feed** | `mobileNotifications` | Full-screen feed, swipe-to-dismiss |
| **Mobile Command Search** | `mobileSearch` | Full-screen search sheet, recent + results |
| **Mobile Approval Queue** | `mobileApprovals` | Pending approvals list, approve/reject swipe actions |
| **Mobile Expense Submission** | `mobileExpense` | Camera receipt scan, amount, category, submit |
| **Mobile Profile & Settings** | `mobileProfile` | Avatar, theme toggle, biometrics toggle, sign out |

---

## Priority Order (suggested build sequence)

1. **Sales Orders + Invoices** — core revenue flow, exercises line-item editor pattern
2. **Purchase Orders + Bills** — mirrors sales, closes the procurement loop
3. **Bank Reconciliation** — high complexity, novel two-pane UI pattern
4. **Command Palette** — cross-cutting, high perceived quality uplift
5. **Reports (Aged / GL / Cash Flow)** — data-heavy, exercises table + chart patterns
6. **Fixed Assets** — standalone new module, low cross-dependency
7. **Onboarding Wizard** — good showcase of multi-step form pattern
8. **Payroll** — complex but self-contained module
9. **Personal Settings / Profile** — polish, low complexity
10. **Mobile gap-fill** — extend mobile kit to match desktop coverage
