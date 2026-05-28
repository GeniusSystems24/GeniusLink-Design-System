# GeniusLink — Screens Build Checklist

ملف تتبّع لكل شاشات Figma التي سنُعيد إنشاءها داخل `ui_kits/genius_link/`. مرتبة على مراحل لتسهيل المتابعة. كل شاشة تشمل نسختي Desktop + Mobile حيث وُجدتا في Figma الأصلي.

> ⚠️ **ملاحظة:** ملف Figma لم يعد مرتبطاً بالجلسة الحالية. القائمة أدناه مبنية على الاستكشاف الأولي (81 frame على Page-1). الرجاء إعادة إرفاق ملف Figma لو وُجدت شاشات إضافية لم تُذكر هنا، أو لإثراء الـ pseudocode الأصلي عند تنفيذ كل مرحلة.

---

## Stage 0 — Foundations  ✅  (مكتمل)

- [x] `colors_and_type.css` — tokens (ألوان + خطوط + spacing + radii + shadows)
- [x] `components.jsx` — مكتبة المكونات المشتركة (Card, SectionHeader, Field, Button, Table, …)
- [x] `app.jsx` — الـ shell + sidebar + theme toggle + watermark + toast
- [x] `index.html` — الـ demo container

---

## Stage 1 — Account Management (إدارة الحسابات)

شاشات الحسابات ومجموعات الحسابات الأساسية.

### Create Account  (إنشاء حساب)
- [x] `Create-Account-screen` — Desktop ✅ (وُسّعت بالكامل)  →  `ui_kits/genius_link/AccountsExtra.jsx`
- [x] `Create-Account---Mobile` ✅  →  `ui_kits/genius_link/MobileScreens.jsx`

### Account Groups  (مجموعات الحسابات)
- [x] `Create-Account-Group---Desktop` ✅
- [x] `Create-Account-Group---Mobile` ✅  →  `ui_kits/genius_link/MobileScreens.jsx`
- [x] `Account-Group-Details---Desktop` ✅
- [x] `Account-Group-Details---Mobile` ✅  →  `ui_kits/genius_link/MobileScreens.jsx`

### Account Details  (تفاصيل الحساب)
- [x] `Account-Details---Desktop` ✅  →  `ui_kits/genius_link/AccountDetails.jsx`
- [ ] `Account-Details---Mobile`

### Account Tree / Hierarchy  (شجرة الحسابات)
- [x] `Account-Tree---Desktop` ✅  →  `ui_kits/genius_link/AccountsExtra.jsx`
- [x] `Accounts-List---Desktop` ✅  →  `ui_kits/genius_link/AccountsList.jsx`

---

## Stage 2 — Stores & Inventory (المخازن والمخزون)

### Stores
- [x] `Create-Store---Desktop` ✅
- [x] `Create-Store---Mobile` ✅  →  `ui_kits/genius_link/MobileScreens.jsx` (mobile.html)
- [x] `Store-Details---Desktop` ✅  →  `ui_kits/genius_link/StoreDetails.jsx`
- [x] `Store-Details---Mobile` ✅  →  `ui_kits/genius_link/MobileScreens.jsx`
- [x] `Stores-List---Desktop` ✅  →  `ui_kits/genius_link/StoresList.jsx`

### Products
- [x] `Create-Product---Desktop` ✅  →  `ui_kits/genius_link/Products.jsx`
- [x] `Product-Details---Desktop` ✅  →  `ui_kits/genius_link/Products.jsx`
- [x] `Products-List---Desktop` ✅  →  `ui_kits/genius_link/Products.jsx`

### Inventory Operations
- [x] `Issue-Inventory---Create---Desktop` ✅
- [x] `Issue-Inventory---Mobile` ✅  →  `ui_kits/genius_link/MobileScreens.jsx`
- [ ] `Issue-Inventory---Details`
- [x] `Receive-Inventory---Create---Desktop` ✅  →  `ui_kits/genius_link/ReceiveInventory.jsx`
- [ ] `Receive-Inventory---Details`
- [x] `Transfer-Inventory---Create---Desktop` ✅  →  `ui_kits/genius_link/TransferInventory.jsx`
- [ ] `Transfer-Inventory---Details`
- [x] `Inventory-Adjustment---Desktop` ✅  →  `ui_kits/genius_link/InventoryAdjustment.jsx`

---

## Stage 3 — Banking & Transfers (البنوك والتحويلات)

### Deposits & Withdrawals
- [x] `Create-Deposit---Desktop` ✅  →  `ui_kits/genius_link/CashMovement.jsx`
- [ ] `Create-Deposit---Mobile`
- [x] `Deposit-Details---Desktop` ✅  →  `ui_kits/genius_link/CashMovement.jsx`
- [x] `Create-Withdrawal---Desktop` ✅  →  `ui_kits/genius_link/CashMovement.jsx`
- [x] `Withdrawal-Details---Desktop` ✅  →  `ui_kits/genius_link/CashMovement.jsx`

### Local Transfers (تحويلات محلية)
- [x] `Create-Local-Transfer---Desktop` ✅  →  `ui_kits/genius_link/Transfers.jsx`
- [x] `Local-Transfer-Details---Desktop` (Inter-Account Settlement TR-9042) ✅  →  `ui_kits/genius_link/Transfers.jsx`

### External Transfers (تحويلات خارجية)
- [x] `Create-External-Transfer---Desktop` ✅  →  `ui_kits/genius_link/Transfers.jsx`
- [x] `External-Transfer-Details---Desktop` ✅  →  `ui_kits/genius_link/Transfers.jsx`

---

## Stage 4 — Ledger & Journal (الدفاتر والقيود)

- [x] `Opening-Journal-Entry---Desktop` ✅
- [x] `Opening-Journal-Entry---Mobile` ✅  →  `ui_kits/genius_link/MobileScreens.jsx`
- [x] `Create-Journal-Entry---Desktop` (قيد يومية عادي) ✅  →  `ui_kits/genius_link/CreateJournalEntry.jsx`
- [x] `Journal-Entry-Details---Desktop` ✅  →  `ui_kits/genius_link/JournalDetails.jsx`
- [x] `Journal-List---Desktop` ✅  →  `ui_kits/genius_link/JournalList.jsx`
- [x] `Financial-Operation-Details---Master-Template---Large-Desktop` ✅  →  `ui_kits/genius_link/JournalDetails.jsx`
- [x] `Financial-Operation-Details---Mobile` ✅  →  `ui_kits/genius_link/MobileScreens.jsx`

---

## Stage 5 — Currencies & Configuration (العملات والإعدادات)

- [x] `Create-Currency---Desktop` ✅  →  `ui_kits/genius_link/Currencies.jsx`
- [x] `Currency-Details---Desktop` ✅  →  `ui_kits/genius_link/Currencies.jsx`
- [x] `Currencies-List---Desktop` ✅  →  `ui_kits/genius_link/Currencies.jsx`
- [x] `Exchange-Rate-Setup---Desktop` ✅  →  `ui_kits/genius_link/Configuration.jsx`
- [x] `Fiscal-Year-Setup---Desktop` ✅  →  `ui_kits/genius_link/Configuration.jsx`

---

## Stage 6 — Users & Authentication (المستخدمون والمصادقة)

- [x] `Login---Desktop` ✅  →  `ui_kits/genius_link/Login.jsx`
- [x] `Login---Mobile` ✅  →  `ui_kits/genius_link/MobileScreens.jsx`
- [x] `Sign-Up---Desktop` ✅  →  `ui_kits/genius_link/Auth.jsx`
- [x] `Forgot-Password---Desktop` ✅  →  `ui_kits/genius_link/Auth.jsx`
- [x] `Users-List---Desktop` ✅  →  `ui_kits/genius_link/Users.jsx`
- [x] `User-Details---Desktop` ✅  →  `ui_kits/genius_link/Users.jsx`
- [x] `Create-User---Desktop` ✅  →  `ui_kits/genius_link/Users.jsx`
- [x] `Permissions / Roles---Desktop` ✅  →  `ui_kits/genius_link/Users.jsx`

---

## Stage 7 — Reports & Dashboards (التقارير ولوحات التحكم)

> ⚠️ هذه الشاشات بُنيت كامتداد منطقي للنظام (لم تُؤكَّد في Figma بعد).

- [x] `Dashboard---Desktop` ✅  →  `ui_kits/genius_link/Dashboard.jsx`
- [x] `Trial-Balance-Report---Desktop` ✅  →  `ui_kits/genius_link/Reports.jsx`
- [x] `Income-Statement---Desktop` ✅  →  `ui_kits/genius_link/Reports.jsx`
- [x] `Balance-Sheet---Desktop` ✅  →  `ui_kits/genius_link/Reports.jsx`
- [x] `Inventory-Valuation-Report---Desktop` ✅  →  `ui_kits/genius_link/Reports.jsx`
- [x] `Audit-Log---Desktop` ✅  →  `ui_kits/genius_link/Reports.jsx`

---

## Stage 8 — Customers & Suppliers (العملاء والموردون)

> ⚠️ هذه الشاشات بُنيت كامتداد منطقي للنظام (لم تُؤكَّد في Figma بعد).

- [x] `Create-Customer---Desktop` ✅  →  `ui_kits/genius_link/Contacts.jsx`
- [x] `Customer-Details---Desktop` ✅  →  `ui_kits/genius_link/Contacts.jsx`
- [x] `Customers-List---Desktop` ✅  →  `ui_kits/genius_link/Contacts.jsx`
- [x] `Create-Supplier---Desktop` ✅  →  `ui_kits/genius_link/Contacts.jsx`
- [x] `Supplier-Details---Desktop` ✅  →  `ui_kits/genius_link/Contacts.jsx`
- [x] `Suppliers-List---Desktop` ✅  →  `ui_kits/genius_link/Contacts.jsx`

---

## كيف نعمل على هذه القائمة

في كل مرحلة:

1. أقوم بقراءة الـ JSX الأصلي من Figma لكل شاشة في المرحلة (`fig_read`).
2. أُنشئ ملف `.jsx` لكل شاشة داخل `ui_kits/genius_link/` (مع تقسيم منطقي للمكونات).
3. أُسجّل الشاشة في الـ sidebar في `app.jsx` ليتم الوصول إليها من الـ demo.
4. أقوم بتحديث هذا الـ checklist بوضع علامة `[x]` بجانب كل شاشة مكتملة، مع ذكر مسار الملف.
5. عند الانتهاء من المرحلة، أعرض لقطة عامة (screenshot) لكل الشاشات الجديدة.

> **ملاحظة:** قد تكون بعض الشاشات في القائمة أعلاه غير موجودة فعلياً في ملف Figma (خصوصاً Stage 7 و 8 — Dashboards و Reports). سيتم تعديل القائمة عند إعادة إرفاق ملف Figma بناءً على ما هو موجود فعلاً.

---

## الحالة الإجمالية

- **مكتمل (Desktop):** 53 شاشة عبر كل المراحل الثماني
- **مكتمل (Mobile):** تطبيق iOS كامل (`mobile.html`) — Login، Dashboard، Accounts (+ detail)، Create Account، Create Account Group، Account Group Details، Stores (+ detail)، Create Store، Issue Inventory، Opening Journal، Financial Operation Details، More — مع bottom-tab nav داخل إطار iPhone (تُفتح شاشات More عبر قائمة More)

اختر المرحلة التي تريد البدء بها أولاً (مثلاً: *Stage 2 — Stores & Inventory* لإكمال شاشات المخازن، أو *Stage 6 — Login* لبدء شاشات المصادقة).

---
---

# 🟦 Version 2 — Design System Architecture & Advanced Components

> **الهدف:** تحويل GeniusLink من «مجموعة شاشات» إلى **Design System كامل قابل لإعادة الاستخدام والتوسّع**: foundations + tokens + components موثّقة + patterns + motion + advanced data components، جاهز للاستهلاك من Flutter.
>
> **المخرجات لكل مكوّن (V2):** عرض HTML/JSX حيّ داخل `ui_kits/genius_link/` + بطاقة في تبويب Design System + توثيق (الغرض / متى يُستخدم / Anatomy / Variants / States / Props / مثال Flutter / Accessibility / Do & Don't).
>
> **قواعد إلزامية لكل مرحلة V2 (تُطبَّق على *كل* مكوّن):**
> - ✅ Light + Dark theme — كل الألوان من tokens، لا قيم ثابتة (hardcoded).
> - ✅ RTL + LTR — تخطيط معكوس صحيح للعربية والإنجليزية.
> - ✅ Accessibility — تباين ألوان، semantic labels، touch targets ≥ 44px، focus order، تكبير الخط، رسائل خطأ واضحة، reduced-motion.
> - ✅ States — المكونات الثقيلة بالبيانات (Charts / Tables) تشمل **Loading + Empty + Error + Interactive**.
> - ✅ Responsive — سلوك موبايل/ديسكتوب (الجداول تتحوّل لبطاقات على الشاشات الصغيرة).
> - ✅ مكونات صغيرة قابلة للتركيب، typed props، لا اعتماد على business models.

---

## V2 — Stage A · Foundations & Tokens (الأساسيات والتوكنز)  ✅

- [x] `design_system/tokens.css` — يضيف motion (durations/curves) + z-index/overlay + breakpoints فوق `colors_and_type.css` (+ reduced-motion)
- [x] `design_system/tokens.dart` — Flutter token classes (GLColors/GLType/GLSpace/GLRadius/GLShadows/GLDur/GLCurves/GLZ/GLBreak)
- [x] `design_system/app_theme.dart` — light + dark ThemeData من التوكنز (touch target 44px، focus، transitions)
- [x] `design_system/FOUNDATIONS.md` — توثيق 11 محور أساسي + جدول مرجع التوكنز
- [x] بطاقات معاينة جديدة: Motion Tokens · Elevation Layers (z-index) · Grid & Breakpoints — مُسجّلة في تبويب Design System
- [x] (موجود مسبقاً) بطاقات Colors / Type / Spacing / Radii / Shadows

## V2 — Stage B · Core UI Components (المكونات الأساسية)  ✅

> كل مكوّن: Variants + States (Default/Hover/Pressed/Focused/Disabled/Loading/Error/Empty…) — dark/light + RTL + a11y.

- [x] Buttons · Icon buttons (+ كل الحالات + loading)
- [x] Text fields · Search fields (default/focused/error/disabled + RTL عربي)
- [x] Cards · List tiles · Dividers
- [x] Avatars · Badges (count/dot) · Chips (filter/selected/removable)
- [x] Dialogs · Bottom sheets · Snackbars
- [x] App bars · Bottom nav bars · Toolbars · Menus
- [x] Empty / Error / Loading / NotAllowed / NotFound state views
- [x] **Deliverables:** `design_system/ds-kit.jsx` (primitives) + `design_system/components-core.html` (gallery, مُسجّلة)

## V2 — Stage C · Domain Components (مكونات خاصة بالتطبيق)  ✅

> generic بلا ربط بنماذج بيانات.

- [x] Chat bubble (+ states: Sending/Sent/Delivered/Read/Failed)
- [x] Message composer · Attachment menu · Pinned message bar
- [x] Audio / Video message bubble · Poll bubble · Media preview card
- [x] Notification tile · File attachment card (Uploading/Paused/Failed/Completed)
- [x] Club card · Member tile · Task card · Room card
- [x] **Deliverable:** `design_system/components-domain.html` (gallery, مُسجّلة)

## V2 — Stage D · Browser-Style Tabs (BrowserStyleTabBar)  ✅

- [x] `BrowserStyleTabBar` — تبويبات بنمط المتصفح: active يندمج بالسطح، inactive مكتوم بفواصل + favicon/أيقونة + عنوان + close ×
- [x] States: Active / Inactive / Hover / Pressed · add (+) · overflow scroll · unsaved dot · truncation + tooltip · keyboard ←/→ · LTR+RTL · dark/light
- [x] **Deliverables:** `design_system/BrowserTabs.jsx` + `components-browsertabs.html` (مُسجّلة) + `BrowserStyleTabBar.dart` (مثال Flutter كامل)

## V2 — Stage E · Charts (الرسوم البيانية)  ✅

- [x] Line · Area · Bar · Donut · Progress (rings) · KPI + mini sparkline
- [x] Tooltip + Legend + Axis labels + responsive (viewBox) + tokens للألوان/التوقيت
- [x] حالات: Loading (shimmer) / Empty / Error
- [x] **Deliverable:** `design_system/components-charts.html` (مُسجّلة)

## V2 — Stage F · Skeleton Loaders (هياكل التحميل)  ✅

- [x] Text · Avatar · Card · List item · Table row · Chat bubble · Dashboard card · Chart skeletons + Bone container
- [x] Shimmer + static toggle · rounded · أبعاد قابلة للضبط · light/dark · `prefers-reduced-motion`
- [x] **Deliverable:** `design_system/components-skeletons.html` (مُسجّلة)

## V2 — Stage G · Combo Box (صندوق اختيار بحثي)  ✅

- [x] Single + Multi selection · searchable · async loading
- [x] States: Empty results / Disabled / Error + validation · leading icons · option descriptions · chips للـ multi
- [x] Overlay dropdown · keyboard nav · RTL/LTR
- [x] **Deliverable:** `design_system/components-combobox.html` (مُسجّلة)

## V2 — Stage H · Editable Table (جدول قابل للتحرير)  ✅

- [x] Read-only + inline editing · **Excel-style spreadsheet grid** (cell select + blue outline, formula bar w/ cell ref, type-to-overwrite, Enter↓/Tab→/Esc/Del, auto-add row) · sorting · pagination · add/delete row · validation per cell
- [x] States: Loading / Empty / Error
- [x] Responsive: يتحوّل إلى **بطاقات مكدّسة** على الموبايل · RTL/LTR
- [x] **Deliverable:** `design_system/components-table.html` (مُسجّلة)

## V2 — Stage I · Patterns (الأنماط)  ✅

- [x] Search · Filter · Pagination · Notification → navigation
- [x] Confirmation · Delete confirmation · Permission handling
- [x] Media upload · Message/posting status · Offline-first sync
- [x] Loading/Empty/Error → canonical `StateView` (reused من Core gallery)
- [x] **Deliverable:** `design_system/patterns.html` (مُسجّلة)

## V2 — Stage J · Motion & Animation System (نظام الحركة)  ✅

- [x] animation tokens (duration / curve / stagger / page / overlay) موثّقة + جدول مرجعي حيّ
- [x] Fade · Slide · Scale · Expand/Collapse · Shimmer · Stagger (lists/messages) · Button press · Bottom sheet
- [x] **reduced-motion strategy** (يتطابق مع `prefers-reduced-motion` في tokens.css)
- [x] **Deliverable:** `design_system/motion.html` (عروض حيّة قابلة للإعادة، مُسجّلة)

## V2 — Stage K · Content, Accessibility & Documentation  ✅

- [x] Content guidelines (button labels · error/empty/confirmation/notification/validation · tone · EN/AR)
- [x] Accessibility checklist لكل مكوّن (contrast · targets · focus · semantics · scaling · reduced-motion · errors)
- [x] قالب توثيق موحّد + مثال مُنفَّذ (DSButton)
- [x] **Deliverable:** `design_system/DESIGN_SYSTEM.md` (الدليل الرئيسي + القالب)

## V2 — Stage L · Flutter Implementation Structure  ✅

- [x] هيكل مجلدات `lib/design_system/{foundations,tokens,themes,components,patterns,motion,accessibility,documentation_examples}/`
- [x] Component API design (enums, typed params, generic بلا business models، stateless، RTL via Directionality)
- [x] أمثلة توقيعات (GLButton/GLComboBox/GLEditableTable) + GLDataState switch + التنفيذ الكامل في `BrowserStyleTabBar.dart`
- [x] توصيات الصيانة طويلة المدى + test matrix
- [x] **Deliverable:** `design_system/flutter-structure.md`

---

> ✅ **Version 2 مكتمل بالكامل (Stages A–L).** نظام تصميم كامل: foundations + tokens (CSS + Flutter) + 9 معارض مكونات حيّة + patterns + motion + توثيق + هيكل Flutter — كلها dark/light + RTL/LTR + accessibility + states.

---

### كيف ننفّذ Version 2

- ننفّذ مرحلة-مرحلة (A → L)، ونعرض معاينة + نحدّث هذا الـ checklist بعد كل مرحلة.
- مخرجاتنا المرئية HTML/JSX (وسيطنا)؛ وأمثلة Flutter + هياكل المجلدات تُسلَّم كـ **توثيق** يقابل التوكنز نفسها.
- أخبرني بأي مرحلة V2 نبدأ (المقترح: **Stage A — Foundations & Tokens** ثم **Stage D — BrowserStyleTabBar** و **Stage E — Charts**).

---
---

# 🟩 Version 3 — Mobile Parity (تكافؤ الموبايل)

> **الهدف:** **إضافة كل الشاشات الموجودة في Desktop وليست موجودة في Mobile** — أي إنشاء نسخة موبايل لكل شاشة سطح-مكتب لا تملك حالياً مقابلاً في تطبيق iOS (`mobile.html` / `MobileScreens.jsx`)، حتى يصبح التطبيق المحمول مكتمل الميزات مثل نسخة الديسكتوب.
>
> **مصدر التصميم (إلزامي بهذا الترتيب):**
> 1. **إن وُجد تصميم موبايل لهذه الشاشة في ملف Figma** → نلتزم به حرفياً (تخطيط/مكوّنات/سلوك).
> 2. **إن لم يوجد** → نُنشئها وفق **نظام التصميم** (Version 2): tokens + `ds-kit.jsx` + أنماط الموبايل القائمة (AppBar, TabBar, MCard, Scroll, bottom sheets) — بحيث تبدو وكأنها جزء أصيل من تطبيق الموبايل.
>
> ⚠️ **تذكير:** ملف Figma غير مرتبط بالجلسة الحالية. الرجاء إعادة إرفاقه لاعتماد تصاميم الموبايل الأصلية؛ وإلا سنبني الشاشات الناقصة وفق نظام التصميم.
>
> **قواعد إلزامية لكل شاشة V3:**
> - ✅ تعمل داخل إطار iPhone القائم مع AppBar (مع زر رجوع) + التنقّل عبر التبويبات/قائمة More.
> - ✅ Light + Dark + RTL/LTR — كل الألوان من tokens، touch targets ≥ 44px.
> - ✅ الجداول الطويلة تتحوّل إلى **بطاقات مكدّسة** (list/cards) بدل التمرير الأفقي.
> - ✅ النماذج (Create/Edit) تستخدم أنماط الموبايل: حقول كاملة العرض، أزرار ثابتة أسفل الشاشة، bottom sheets للاختيار.
> - ✅ شاشات التفاصيل تستخدم رأس ملخّص + أقسام قابلة للطيّ + قائمة حركات/عناصر.

---

## V3 — الشاشات الموجودة في Mobile حالياً (مرجع — لا تُعاد)

Login · Dashboard · Accounts (+ detail) · Create Account · Create Account Group · Account Group Details · Stores (+ detail) · Create Store · Issue Inventory · Opening Journal · Financial Operation Details · More

---

## V3 — Stage A · Banking & Transfers Mobile (البنوك والتحويلات) — كلها ناقصة

- [ ] `Create-Deposit---Mobile`
- [ ] `Deposit-Details---Mobile`
- [ ] `Create-Withdrawal---Mobile`
- [ ] `Withdrawal-Details---Mobile`
- [ ] `Create-Local-Transfer---Mobile`
- [ ] `Local-Transfer-Details---Mobile`
- [ ] `Create-External-Transfer---Mobile`
- [ ] `External-Transfer-Details---Mobile`

## V3 — Stage B · Products & Inventory Operations Mobile (المنتجات وعمليات المخزون)

- [ ] `Create-Product---Mobile`
- [ ] `Product-Details---Mobile`
- [ ] `Products-List---Mobile`
- [ ] `Issue-Inventory---Details---Mobile`
- [ ] `Receive-Inventory---Create---Mobile`
- [ ] `Receive-Inventory---Details---Mobile`
- [ ] `Transfer-Inventory---Create---Mobile`
- [ ] `Transfer-Inventory---Details---Mobile`
- [ ] `Inventory-Adjustment---Mobile`

## V3 — Stage C · Ledger & Journal Mobile (الدفاتر والقيود)

- [ ] `Create-Journal-Entry---Mobile`
- [ ] `Journal-Entry-Details---Mobile`
- [ ] `Journal-List---Mobile`

## V3 — Stage D · Currencies & Configuration Mobile (العملات والإعدادات) — كلها ناقصة

- [ ] `Create-Currency---Mobile`
- [ ] `Currency-Details---Mobile`
- [ ] `Currencies-List---Mobile`
- [ ] `Exchange-Rate-Setup---Mobile`
- [ ] `Fiscal-Year-Setup---Mobile`

## V3 — Stage E · Users & Authentication Mobile (المستخدمون والمصادقة)

- [ ] `Sign-Up---Mobile`
- [ ] `Forgot-Password---Mobile`
- [ ] `Users-List---Mobile`
- [ ] `User-Details---Mobile`
- [ ] `Create-User---Mobile`
- [ ] `Permissions / Roles---Mobile`

## V3 — Stage F · Reports & Dashboards Mobile (التقارير) — كلها ناقصة

> ⚠️ التقارير على الموبايل: عرض مبسّط (KPI cards + جداول مكدّسة + فلاتر فترة) — لا تمرير أفقي.

- [ ] `Trial-Balance-Report---Mobile`
- [ ] `Income-Statement---Mobile`
- [ ] `Balance-Sheet---Mobile`
- [ ] `Inventory-Valuation-Report---Mobile`
- [ ] `Audit-Log---Mobile`

## V3 — Stage G · Customers & Suppliers Mobile (العملاء والموردون) — كلها ناقصة

- [ ] `Create-Customer---Mobile`
- [ ] `Customer-Details---Mobile`
- [ ] `Customers-List---Mobile`
- [ ] `Create-Supplier---Mobile`
- [ ] `Supplier-Details---Mobile`
- [ ] `Suppliers-List---Mobile`

## V3 — Stage H · Accounts Parity Mobile (إكمال شاشات الحسابات)

- [ ] `Account-Details---Mobile` — رفع التكافؤ مع نسخة الديسكتوب الكاملة (حالياً يوجد عرض «Cash Box» مبسّط فقط)
- [ ] `Account-Tree / Hierarchy---Mobile`

---

> **الإجمالي المطلوب في V3:** ~37 شاشة موبايل ناقصة عبر 8 مراحل (A–H) — تُضاف إلى تطبيق iOS القائم عبر قائمة More + تبويبات جديدة عند الحاجة.

### كيف ننفّذ Version 3

1. لكل شاشة: إن وُجد تصميم موبايل في Figma نقرؤه ونلتزم به؛ وإلا نبنيها وفق نظام التصميم وأنماط الموبايل القائمة.
2. نُضيف الشاشة إلى `MobileScreens.jsx` ونُسجّلها في التنقّل (تبويب أو عنصر داخل More + `SUB_TITLES`).
3. نحدّث هذا الـ checklist بوضع `[x]` بعد كل شاشة، ونعرض لقطة داخل إطار iPhone.
4. ننفّذ مرحلة-مرحلة (المقترح أن نبدأ بـ **Stage A — Banking & Transfers** لأنها كاملة الغياب، ثم **Stage G — Customers & Suppliers**).

> أخبرني بأي مرحلة V3 نبدأ، أو أعد إرفاق ملف Figma لاعتماد تصاميم الموبايل الأصلية قبل البناء.
