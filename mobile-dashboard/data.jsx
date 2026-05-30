/* global window */
// GeniusLink Mobile Dashboard — data model + bilingual strings + formatters.
// Exports to window: GL_DATA, GL_STR, glMoney, glNum, glSign

/* ── currencies (tenant's active set) ── */
const GL_CURRENCIES = [
  { code: 'SAR', label: { en: 'Saudi Riyal', ar: 'ريال سعودي' } },
  { code: 'USD', label: { en: 'US Dollar', ar: 'دولار أمريكي' } },
  { code: 'AED', label: { en: 'UAE Dirham', ar: 'درهم إماراتي' } },
];

/* a trend is {dir:'up'|'down', pct:Number} or null (data unavailable → indicator omitted) */
const up = (p) => ({ dir: 'up', pct: p });
const dn = (p) => ({ dir: 'down', pct: p });

/* ── three domain tabs, each owning its own figures / actions / recent ops ── */
const GL_DATA = {
  tenant: { name: { en: 'Al-Rashid Trading Co.', ar: 'شركة الراشد التجارية' }, tag: { en: 'Tenant 9', ar: 'المنشأة ٩' } },

  tabs: [
    {
      id: 'accounting',
      label: { en: 'Accounting', ar: 'المحاسبة' },
      cards: [
        { id: 'assets', label: { en: 'Total Assets', ar: 'إجمالي الأصول' }, marker: 'green',
          val: { SAR: 4820400, USD: 1285440, AED: 4719600 },
          trend: { day: up(0.4), week: up(3.1), month: up(8.6) } },
        { id: 'cash', label: { en: 'Cash', ar: 'النقد' }, marker: 'blue',
          val: { SAR: 962150, USD: 256570, AED: 942100 },
          trend: { day: null, week: dn(1.2), month: up(4.0) } },
        { id: 'revenue', label: { en: 'Revenue MTD', ar: 'الإيرادات (الشهر)' }, marker: 'blue',
          val: { SAR: 1340800, USD: 357550, AED: 1313000 },
          trend: { day: up(2.6), week: up(6.4), month: up(11.2) } },
        { id: 'net', label: { en: 'Net Income', ar: 'صافي الدخل' }, marker: 'green',
          val: { SAR: 388200, USD: 103520, AED: 380100 },
          trend: { day: dn(0.9), week: up(2.2), month: up(5.5) } },
      ],
      actions: [
        { id: 'journal', label: { en: 'Journal Entry', ar: 'قيد يومية' }, icon: 'edit' },
        { id: 'voucher', label: { en: 'Voucher', ar: 'سند' }, icon: 'doc' },
      ],
      ops: [
        { ref: 'JV-2024-0412', type: { en: 'Journal', ar: 'قيد' }, tone: 'info', desc: { en: 'Depreciation — Q4', ar: 'إهلاك — الربع ٤' }, amt: { SAR: 18400, USD: 4905, AED: 18020 }, dir: 'debit', time: { en: '2h ago', ar: 'قبل ٢س' } },
        { ref: 'VCH-0188', type: { en: 'Voucher', ar: 'سند' }, tone: 'neutral', desc: { en: 'Office rent payment', ar: 'دفعة إيجار المكتب' }, amt: { SAR: 45000, USD: 12000, AED: 44070 }, dir: 'debit', time: { en: '5h ago', ar: 'قبل ٥س' } },
        { ref: 'JV-2024-0411', type: { en: 'Journal', ar: 'قيد' }, tone: 'info', desc: { en: 'Revenue accrual', ar: 'استحقاق إيراد' }, amt: { SAR: 126500, USD: 33730, AED: 123880 }, dir: 'credit', time: { en: 'Yesterday', ar: 'أمس' } },
        { ref: 'VCH-0187', type: { en: 'Voucher', ar: 'سند' }, tone: 'neutral', desc: { en: 'Utilities — Nov', ar: 'مرافق — نوفمبر' }, amt: { SAR: 9320, USD: 2485, AED: 9130 }, dir: 'debit', time: { en: 'Yesterday', ar: 'أمس' } },
        { ref: 'JV-2024-0410', type: { en: 'Journal', ar: 'قيد' }, tone: 'info', desc: { en: 'FX revaluation', ar: 'إعادة تقييم العملة' }, amt: { SAR: 4110, USD: 1095, AED: 4025 }, dir: 'credit', time: { en: '2 days ago', ar: 'قبل يومين' } },
      ],
    },
    {
      id: 'banking',
      label: { en: 'Banking', ar: 'البنوك' },
      cards: [
        { id: 'balance', label: { en: 'Total Balance', ar: 'إجمالي الرصيد' }, marker: 'green',
          val: { SAR: 2680900, USD: 715000, AED: 2625000 },
          trend: { day: up(0.7), week: up(2.4), month: up(6.1) } },
        { id: 'available', label: { en: 'Available Cash', ar: 'النقد المتاح' }, marker: 'blue',
          val: { SAR: 1942300, USD: 517950, AED: 1901500 },
          trend: { day: dn(0.3), week: up(1.1), month: up(3.8) } },
        { id: 'inflow', label: { en: 'Inflow', ar: 'الوارد' }, marker: 'green',
          val: { SAR: 512400, USD: 136640, AED: 501800 },
          trend: { day: up(4.9), week: up(9.2), month: up(14.0) } },
        { id: 'outflow', label: { en: 'Outflow', ar: 'الصادر' }, marker: 'orange',
          val: { SAR: 318750, USD: 85000, AED: 312100 },
          trend: { day: null, week: dn(2.7), month: up(1.6) } },
      ],
      actions: [
        { id: 'deposit', label: { en: 'Deposit', ar: 'إيداع' }, icon: 'plus' },
        { id: 'withdraw', label: { en: 'Withdrawal', ar: 'سحب' }, icon: 'back' },
        { id: 'transfer', label: { en: 'Transfer', ar: 'تحويل' }, icon: 'send' },
      ],
      ops: [
        { ref: 'DEP-7741', type: { en: 'Deposit', ar: 'إيداع' }, tone: 'success', desc: { en: 'Cash deposit — Main', ar: 'إيداع نقدي — الرئيسي' }, amt: { SAR: 120000, USD: 32000, AED: 117500 }, dir: 'credit', time: { en: '1h ago', ar: 'قبل ١س' } },
        { ref: 'WTH-3320', type: { en: 'Withdrawal', ar: 'سحب' }, tone: 'danger', desc: { en: 'Payroll release', ar: 'صرف الرواتب' }, amt: { SAR: 215600, USD: 57500, AED: 211200 }, dir: 'debit', time: { en: '4h ago', ar: 'قبل ٤س' } },
        { ref: 'TRF-1185', type: { en: 'Transfer', ar: 'تحويل' }, tone: 'info', desc: { en: 'Riyad Bank → Main', ar: 'بنك الرياض ← الرئيسي' }, amt: { SAR: 80000, USD: 21330, AED: 78300 }, dir: 'credit', time: { en: 'Yesterday', ar: 'أمس' } },
        { ref: 'WTH-3319', type: { en: 'Withdrawal', ar: 'سحب' }, tone: 'danger', desc: { en: 'Supplier wire', ar: 'حوالة مورّد' }, amt: { SAR: 64250, USD: 17130, AED: 62900 }, dir: 'debit', time: { en: 'Yesterday', ar: 'أمس' } },
        { ref: 'DEP-7738', type: { en: 'Deposit', ar: 'إيداع' }, tone: 'success', desc: { en: 'Customer settlement', ar: 'تسوية عميل' }, amt: { SAR: 38900, USD: 10370, AED: 38080 }, dir: 'credit', time: { en: '2 days ago', ar: 'قبل يومين' } },
      ],
    },
    {
      id: 'commercial',
      label: { en: 'Commercial', ar: 'التجاري' },
      cards: [
        { id: 'sales', label: { en: 'Sales MTD', ar: 'المبيعات (الشهر)' }, marker: 'green',
          val: { SAR: 1875300, USD: 500000, AED: 1836000 },
          trend: { day: up(3.4), week: up(7.8), month: up(12.5) } },
        { id: 'purchases', label: { en: 'Purchases MTD', ar: 'المشتريات (الشهر)' }, marker: 'blue',
          val: { SAR: 1124600, USD: 299900, AED: 1101000 },
          trend: { day: up(1.0), week: up(4.2), month: up(9.0) } },
        { id: 'receivables', label: { en: 'Receivables', ar: 'الذمم المدينة' }, marker: 'orange',
          val: { SAR: 642800, USD: 171410, AED: 629400 },
          trend: { day: dn(0.6), week: dn(2.1), month: up(2.9) } },
        { id: 'payables', label: { en: 'Payables', ar: 'الذمم الدائنة' }, marker: 'blue',
          val: { SAR: 489050, USD: 130410, AED: 478800 },
          trend: { day: null, week: up(1.8), month: up(4.6) } },
      ],
      actions: [
        { id: 'sale', label: { en: 'Sale', ar: 'بيع' }, icon: 'plus' },
        { id: 'purchase', label: { en: 'Purchase', ar: 'شراء' }, icon: 'inbox' },
      ],
      ops: [
        { ref: 'INV-S-2291', type: { en: 'Sale', ar: 'بيع' }, tone: 'success', desc: { en: 'Gulf Contracting Ltd', ar: 'الخليج للمقاولات' }, amt: { SAR: 96400, USD: 25700, AED: 94380 }, dir: 'credit', time: { en: '30m ago', ar: 'قبل ٣٠د' } },
        { ref: 'INV-P-0884', type: { en: 'Purchase', ar: 'شراء' }, tone: 'info', desc: { en: 'Saudi Steel Co', ar: 'الفولاذ السعودي' }, amt: { SAR: 142800, USD: 38080, AED: 139800 }, dir: 'debit', time: { en: '3h ago', ar: 'قبل ٣س' } },
        { ref: 'INV-S-2290', type: { en: 'Sale', ar: 'بيع' }, tone: 'success', desc: { en: 'Najd Builders', ar: 'بنّاؤو نجد' }, amt: { SAR: 53200, USD: 14190, AED: 52080 }, dir: 'credit', time: { en: 'Yesterday', ar: 'أمس' } },
        { ref: 'INV-S-2289', type: { en: 'Sale', ar: 'بيع' }, tone: 'success', desc: { en: 'Coastal Cement', ar: 'أسمنت الساحل' }, amt: { SAR: 31750, USD: 8470, AED: 31080 }, dir: 'credit', time: { en: 'Yesterday', ar: 'أمس' } },
        { ref: 'INV-P-0883', type: { en: 'Purchase', ar: 'شراء' }, tone: 'info', desc: { en: 'Eastern Timber', ar: 'الأخشاب الشرقية' }, amt: { SAR: 27400, USD: 7300, AED: 26820 }, dir: 'debit', time: { en: '2 days ago', ar: 'قبل يومين' } },
      ],
    },
  ],

  /* global — independent of the active tab */
  attention: [
    { id: 'oob', tone: 'danger', icon: 'alert', count: 2, label: { en: 'Out-of-balance entries', ar: 'قيود غير متوازنة' }, desc: { en: 'Debits and credits don’t match', ar: 'المدين والدائن غير متطابقين' } },
    { id: 'approvals', tone: 'warning', icon: 'inbox', count: 5, label: { en: 'Pending approvals', ar: 'بانتظار الاعتماد' }, desc: { en: 'Vouchers awaiting your sign-off', ar: 'سندات تنتظر اعتمادك' } },
    { id: 'sync', tone: 'info', icon: 'alert', count: 1, label: { en: 'Sync conflict', ar: 'تعارض مزامنة' }, desc: { en: 'A draft edited on two devices', ar: 'مسودة عُدّلت على جهازين' } },
  ],
};

/* ── bilingual UI strings ── */
const GL_STR = {
  dashboard: { en: 'Dashboard', ar: 'الرئيسية' },
  goodMorning: { en: 'Good morning', ar: 'صباح الخير' },
  quickActions: { en: 'Quick Actions', ar: 'إجراءات سريعة' },
  recentOps: { en: 'Recent Operations', ar: 'أحدث العمليات' },
  recentSub: { en: 'Latest 5 in this domain', ar: 'آخر ٥ في هذا القسم' },
  viewAll: { en: 'View all', ar: 'عرض الكل' },
  needsAttention: { en: 'Needs Attention', ar: 'يحتاج انتباهك' },
  vsPrev: { en: 'vs prev', ar: 'مقارنة' },
  period: { en: 'Compare', ar: 'المقارنة' },
  day: { en: 'Day', ar: 'يوم' },
  week: { en: 'Week', ar: 'أسبوع' },
  month: { en: 'Month', ar: 'شهر' },
  offline: { en: 'You’re offline — showing last-known data', ar: 'أنت غير متصل — تُعرض آخر البيانات' },
  refreshing: { en: 'Refreshing…', ar: 'جارٍ التحديث…' },
  pullRefresh: { en: 'Pull to refresh', ar: 'اسحب للتحديث' },
  release: { en: 'Release to refresh', ar: 'أفلت للتحديث' },
  selectCurrency: { en: 'Display currency', ar: 'عملة العرض' },
  home: { en: 'Home', ar: 'الرئيسية' },
  accounts: { en: 'Accounts', ar: 'الحسابات' },
  journal: { en: 'Journal', ar: 'اليومية' },
  more: { en: 'More', ar: 'المزيد' },
  updated: { en: 'Updated', ar: 'حُدّث' },
  justNow: { en: 'just now', ar: 'الآن' },
};

/* ── formatters (locale + currency aware) ── */
function glMoney(value, currency, lang, opts = {}) {
  const locale = lang === 'ar' ? 'ar-SA' : 'en-US';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency', currency,
      maximumFractionDigits: opts.decimals ? 2 : 0,
      minimumFractionDigits: opts.decimals ? 2 : 0,
    }).format(value);
  } catch (e) {
    return currency + ' ' + value.toLocaleString();
  }
}
function glNum(value, lang) {
  const locale = lang === 'ar' ? 'ar-SA' : 'en-US';
  return new Intl.NumberFormat(locale).format(value);
}

window.GL_DATA = GL_DATA;
window.GL_CURRENCIES = GL_CURRENCIES;
window.GL_STR = GL_STR;
window.glMoney = glMoney;
window.glNum = glNum;
