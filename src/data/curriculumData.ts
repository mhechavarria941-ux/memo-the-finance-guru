import { ReferenceInfo } from '../components/MemoOwl';
import { LEVELS_1_TO_8 } from './levels1to8';
import { LEVELS_9_TO_16 } from './levels9to16';

export type LearningTrack = 'general' | 'accounting' | 'finance' | 'markets';

export interface LadderNode {
  id: string;
  rungNumber: number;
  title: string;
  subtitle: string;
  track: LearningTrack;
  difficulty: 'Entry' | 'Foundational' | 'Intermediate' | 'Advanced Scenario';
  estimatedMinutes: number;
  subtopics?: string[];
  memoVoiceNote: string;
  literalCoreRule: string;
  applesToApplesBreakdown: {
    itemA: string;
    itemB: string;
    plainTruth: string;
  };
  ledgerExample: {
    header: string;
    rows: { label: string; amount: string; note: string }[];
  };
  takeawayChecklist: string[];
  reference: ReferenceInfo;
}

export interface FlashcardItem {
  id: string;
  track: LearningTrack;
  rungId: string;
  term: string;
  frontQuestion: string;
  literalAnswer: string;
  applesToApplesExample: string;
  formula: string;
  memoWhisper: string;
  tastingStyleId: string;
  reference: ReferenceInfo;
}

export interface SM2CardState {
  cardId: string;
  interval: number; // days
  repetition: number;
  efactor: number;
  nextReviewTimestamp: number;
  lastQuality?: number;
}

export interface ScenarioQuizItem {
  id: string;
  title: string;
  track: LearningTrack;
  difficulty: string;
  tastingStyleId: string;
  memoIntro: string;
  scenarioContext: string;
  ledgerSnapshot: { lineItem: string; amount: string; note: string }[];
  question: string;
  options: string[];
  correctIndex: number;
  applesToApplesExplanation: string;
  teacherDiagnosticInsight: string;
  reference: ReferenceInfo;
}

export interface PedagogicalTastingStyle {
  id: string;
  name: string;
  shortCode: string;
  focusDomain: string;
  whatItMeasures: string;
  commonStudentBlindspot: string;
  teacherActionableFix: string;
  sampleProbe: string;
  recommendedNodeIds: string[];
}

export interface OpenEducationalSource {
  id: string;
  name: string;
  provider: string;
  apiOrLicense: string;
  url: string;
  coverage: string;
  offlinePackIncluded: boolean;
}

export const OPEN_EDUCATIONAL_SOURCES: OpenEducationalSource[] = [
  {
    id: 'src-openstax-acct',
    name: 'Principles of Financial & Managerial Accounting (Vol. 1 & 2)',
    provider: 'OpenStax (Rice University)',
    apiOrLicense: 'CC-BY 4.0 Open Textbook License · OER Content API',
    url: 'https://openstax.org/details/books/principles-financial-accounting',
    coverage: 'Levels 1–8: Accounting Equation, T-Accounts, Ledgers, Close, Three Statements, Prime Cost, ROI & DuPont',
    offlinePackIncluded: true,
  },
  {
    id: 'src-openstax-finance',
    name: 'Principles of Finance & Workplace Software Skills',
    provider: 'OpenStax (Rice University)',
    apiOrLicense: 'CC-BY 4.0 Open Textbook License · OER Content API',
    url: 'https://openstax.org/details/books/principles-finance',
    coverage: 'Levels 6, 8, 10–13: Excel Modeling, Financial Ratios, ROI/ROIC, TVM, NPV/IRR, WACC & Valuation',
    offlinePackIncluded: true,
  },
  {
    id: 'src-sec-edgar',
    name: 'SEC EDGAR & Investor.gov Financial Statements & M&A Manual',
    provider: 'U.S. Securities and Exchange Commission',
    apiOrLicense: 'Public Domain (17 CFR 200) · data.sec.gov XBRL REST API',
    url: 'https://www.investor.gov/introduction-investing/getting-started/researching-investments/financial-statements',
    coverage: 'Levels 5, 14–15: 10-K Statements, ASC 606/842, Deferred Taxes, Consolidations, Audit Controls & M&A',
    offlinePackIncluded: true,
  },
  {
    id: 'src-fred-edu',
    name: 'FRED Economic, Monetary Policy & Capital Markets Curriculum',
    provider: 'Federal Reserve Bank of St. Louis',
    apiOrLicense: 'FRED Open Data API · Public Educational Commons',
    url: 'https://fred.stlouisfed.org/',
    coverage: 'Levels 9, 12, 16: Inflation, Interest Rates, Yield Curves, Credit Spreads, FX, Derivatives & Stress Testing',
    offlinePackIncluded: true,
  },
  {
    id: 'src-mit-ocw',
    name: '15.401 Finance Theory I, 15.402 Strategic Finance & 15.501 Accounting',
    provider: 'MIT OpenCourseWare',
    apiOrLicense: 'CC BY-NC-SA 4.0 OpenCourseWare',
    url: 'https://ocw.mit.edu/',
    coverage: 'Levels 11–16: DCF Valuation, LBOs, Capital Allocation, Economic Profit (EVA), Real Options & Econometrics',
    offlinePackIncluded: true,
  },
];

export const CURRICULUM_LADDER: LadderNode[] = [
  ...LEVELS_1_TO_8,
  ...LEVELS_9_TO_16,
];

export const PEDAGOGICAL_TASTING_STYLES: PedagogicalTastingStyle[] = [
  {
    id: 'taste-ledger-audit',
    name: 'Direct vs. Overhead & Journal Classification Tasting',
    shortCode: 'TS-01',
    focusDomain: 'Levels 1–4 & 7 · Cost & Bookkeeping Precision',
    whatItMeasures:
      'Whether a student can separate Markup vs. Margin, CapEx vs. OpEx, Debits vs. Credits, and Prime Cost vs. Overhead without guessing.',
    commonStudentBlindspot:
      'Treating factory rent as Prime Cost, confusing a 40% markup with a 40% margin, or booking equipment purchases as immediate operating expenses.',
    teacherActionableFix:
      'Require students to tag every line item by behavior (Fixed/Variable), traceability (Direct/Indirect), and balance sheet vs. income statement destination.',
    sampleProbe: 'If a jacket costs $60 and sells for $100, what is the Markup % vs. the Gross Margin %?',
    recommendedNodeIds: ['level-1-business-financial-math', 'level-7-cost-accounting-operating-performance'],
  },
  {
    id: 'taste-three-statement',
    name: 'Three-Statement & Accounting Close Ripple Tasting',
    shortCode: 'TS-02',
    focusDomain: 'Levels 3–5 & 10 · 3-Statement Mechanical Links',
    whatItMeasures:
      'Whether a student can trace a single transaction (depreciation, deferred revenue, AR increase, loan principal repayment) across all three statements.',
    commonStudentBlindspot:
      'Believing that profitable companies cannot run out of cash, or treating loan principal repayment as an Income Statement expense.',
    teacherActionableFix:
      'Use side-by-side 3-column mini-sheets where students must balance Assets = Liabilities + Equity after every adjusting entry.',
    sampleProbe: 'When Accounts Receivable increases by $500, what happens to Net Income vs. Operating Cash Flow?',
    recommendedNodeIds: ['level-4-bookkeeping-accounting-close', 'level-5-financial-statements-connections'],
  },
  {
    id: 'taste-accrual-timing',
    name: 'ROI, ROIC, DuPont & Capital Returns Tasting',
    shortCode: 'TS-03',
    focusDomain: 'Levels 8, 11 & 16 · ROI, ROIC, WACC & EVA',
    whatItMeasures:
      'Whether a student can calculate ROI, decompose ROE using DuPont Analysis, and compare ROIC against WACC to judge true economic profit.',
    commonStudentBlindspot:
      'Looking only at raw Net Income or EPS without checking how much Invested Capital or Debt Leverage was required to generate it.',
    teacherActionableFix:
      'Have students compare two companies with identical $1M profit—one needing $5M capital (20% ROIC) and one needing $25M capital (4% ROIC).',
    sampleProbe: 'If a project costs $80,000 and returns $100,000 net of expenses, what is its ROI, and does an 8% ROIC beat a 10% WACC?',
    recommendedNodeIds: ['level-8-financial-analysis-roi-performance', 'level-11-corporate-finance-fundamentals'],
  },
  {
    id: 'taste-market-valuation',
    name: 'Valuation, Market Sizing & Deal Math Tasting',
    shortCode: 'TS-04',
    focusDomain: 'Levels 9, 12, 13 & 15 · Markets, DCF, EV & LBOs',
    whatItMeasures:
      'Whether a student bridges Enterprise Value to Equity Value accurately, sizes TAM/SAM/SOM bottom-up, and links interest rates to bond/DCF prices.',
    commonStudentBlindspot:
      'Forgetting to subtract Net Debt when moving from Enterprise Value to Equity Value, or pairing Equity Value with EBITDA.',
    teacherActionableFix:
      'Anchor every valuation exercise in literal per-share cash flows and explicit Enterprise-to-Equity Value bridges.',
    sampleProbe: 'If Implied Enterprise Value is $500M, Total Debt is $120M, and Cash is $20M, what is Implied Equity Value?',
    recommendedNodeIds: ['level-13-valuation-investment-decisions', 'level-15-advanced-corporate-finance-transactions'],
  },
];

export const INITIAL_FLASHCARDS: FlashcardItem[] = [
  {
    id: 'fc-roi-core',
    track: 'finance',
    rungId: 'level-8-financial-analysis-roi-performance',
    term: 'Return on Investment (ROI)',
    frontQuestion: 'What is Return on Investment (ROI) and how do you calculate it in plain numbers?',
    literalAnswer:
      'ROI measures the net profit earned on an investment relative to its upfront cost, expressed as a percentage.',
    applesToApplesExample:
      'Apples: Spend $10,000 on a new espresso machine that generates $13,000 in net cash flow ($3,000 net gain) → ROI = $3,000 ÷ $10,000 = 30.0%.',
    formula: 'ROI (%) = [(Total Return − Cost of Investment) ÷ Cost of Investment] × 100',
    memoWhisper: 'Always divide the NET gain (after subtracting the original cost) by the original cost!',
    tastingStyleId: 'taste-accrual-timing',
    reference: {
      id: 'ref-fc-roi',
      sourceName: 'Principles of Managerial Accounting — Ch. 11: Balanced Scorecard & Return on Investment (ROI)',
      organization: 'OpenStax (Rice University)',
      sectionTitle: '11.3 Evaluate Operating Segments Using Return on Investment (ROI) and Residual Income',
      url: 'https://openstax.org/details/books/principles-managerial-accounting',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'Return on investment (ROI) measures the percentage return generated by an investment or operating division relative to the capital invested.',
      furtherReadingTip: 'Pair ROI with Payback Period and NPV (Level 11) to account for the time value of money.',
    },
  },
  {
    id: 'fc-roic-dupont',
    track: 'finance',
    rungId: 'level-8-financial-analysis-roi-performance',
    term: 'ROIC & 3-Step DuPont Analysis',
    frontQuestion: 'How does ROIC differ from ROE, and what are the 3 levers in DuPont Analysis?',
    literalAnswer:
      'ROIC measures after-tax operating profit (NOPAT) generated on ALL invested capital (Debt + Equity − Cash). DuPont breaks ROE into: Net Profit Margin × Asset Turnover × Equity Multiplier.',
    applesToApplesExample:
      'Apples: 10% Net Margin × 1.5x Asset Turnover = 15% ROA. Multiply by 2.0x Equity Multiplier (Leverage) = 30% ROE.',
    formula: 'ROIC = NOPAT ÷ Invested Capital | ROE = (Net Income ÷ Sales) × (Sales ÷ Assets) × (Assets ÷ Equity)',
    memoWhisper: 'ROIC cannot be faked by adding debt leverage; ROE can!',
    tastingStyleId: 'taste-accrual-timing',
    reference: {
      id: 'ref-fc-roic-dupont',
      sourceName: 'Principles of Finance — Ch. 5: Financial Statement Analysis & The DuPont Identity',
      organization: 'OpenStax (Rice University)',
      sectionTitle: '5.3 Profitability Ratios and the DuPont Method',
      url: 'https://openstax.org/details/books/principles-finance',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'The DuPont identity decomposes Return on Equity into operating efficiency (profit margin), asset use efficiency (turnover), and financial leverage.',
      furtherReadingTip: 'When ROIC > WACC, the company is creating positive Economic Profit (EVA).',
    },
  },
  {
    id: 'fc-sales-vs-profit',
    track: 'general',
    rungId: 'level-1-business-financial-math',
    term: 'Revenue, Expenses & Profit (Cash vs. Profit)',
    frontQuestion: 'What is the literal difference between Revenue (Sales), Profit, and Cash?',
    literalAnswer:
      'Revenue is the top-line total billed to customers. Profit is Revenue minus all Expenses. Cash is the literal money sitting in the bank account today.',
    applesToApplesExample:
      'Apples: Sell $1,000 of goods on 30-day credit with $600 of expenses → Revenue = $1,000, Profit = $400, Cash collected today = $0.',
    formula: 'Profit = Revenue − Expenses | Ending Cash = Beginning Cash + Cash Inflows − Cash Outflows',
    memoWhisper: 'Profitable businesses go bankrupt if all their profit is trapped in uncollected invoices!',
    tastingStyleId: 'taste-ledger-audit',
    reference: {
      id: 'ref-fc-sales',
      sourceName: 'Principles of Financial Accounting — Ch. 1: Revenues, Expenses & Cash Flow',
      organization: 'OpenStax (Rice University)',
      sectionTitle: '1.2 Financial Math & Core Accounting Terminology',
      url: 'https://openstax.org/details/books/principles-financial-accounting',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'Revenues represent gross inflows from customer sales; net income is the residual after subtracting all expenses incurred.',
      furtherReadingTip: 'Always check both the Income Statement (for Profit) and the Cash Flow Statement (for Cash).',
    },
  },
  {
    id: 'fc-markup-vs-margin',
    track: 'general',
    rungId: 'level-1-business-financial-math',
    term: 'Markup vs. Gross Margin',
    frontQuestion: 'Why is a 50% Markup NOT the same as a 50% Gross Margin?',
    literalAnswer:
      'Markup divides gross profit by COST, whereas Gross Margin divides gross profit by SELLING PRICE.',
    applesToApplesExample:
      'Apples: Item costs $100 and sells for $150 ($50 profit). Markup = $50 ÷ $100 Cost = 50%. Gross Margin = $50 ÷ $150 Price = 33.3%.',
    formula: 'Markup % = (Price − Cost) ÷ Cost | Gross Margin % = (Price − Cost) ÷ Price',
    memoWhisper: 'Margin is ALWAYS smaller than Markup for any profitable item!',
    tastingStyleId: 'taste-ledger-audit',
    reference: {
      id: 'ref-fc-markup-margin',
      sourceName: 'Principles of Financial Accounting — Ch. 6: Merchandising & Gross Margin Math',
      organization: 'OpenStax (Rice University)',
      sectionTitle: '6.1 Markup on Cost versus Gross Margin on Revenue',
      url: 'https://openstax.org/details/books/principles-financial-accounting',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'Gross margin expresses gross profit as a percentage of net sales revenue, whereas markup expresses profit as a percentage of product cost.',
      furtherReadingTip: 'To earn a 50% Gross Margin on a $100 item, you must charge $200 (which is a 100% Markup).',
    },
  },
  {
    id: 'fc-debits-credits-deadclic',
    track: 'accounting',
    rungId: 'level-2-accounting-foundations',
    term: 'Debits, Credits & Normal Balances (DEAD CLIC)',
    frontQuestion: 'Which accounts increase with a Debit, and which increase with a Credit?',
    literalAnswer:
      'Debits (Left) increase Expenses, Assets, and Dividends (DEAD). Credits (Right) increase Liabilities, Income/Revenue, and Capital/Equity (CLIC).',
    applesToApplesExample:
      'Apples: Receive $500 cash from a customer sale → Debit Cash (Asset +$500) and Credit Sales Revenue (Income +$500).',
    formula: 'Assets = Liabilities + Equity | Total Debits = Total Credits',
    memoWhisper: 'An account’s "Normal Balance" is simply the side (Debit or Credit) that makes it go UP.',
    tastingStyleId: 'taste-ledger-audit',
    reference: {
      id: 'ref-fc-deadclic',
      sourceName: 'Principles of Financial Accounting — Ch. 3: Double-Entry Bookkeeping',
      organization: 'OpenStax (Rice University)',
      sectionTitle: '3.2 Debits, Credits, and Normal Account Balances',
      url: 'https://openstax.org/details/books/principles-financial-accounting',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'Assets, expenses, and dividends have normal debit balances; liabilities, equity, and revenues have normal credit balances.',
      furtherReadingTip: 'Contra-assets like Accumulated Depreciation and Allowance for Doubtful Accounts carry normal CREDIT balances.',
    },
  },
  {
    id: 'fc-capex-vs-opex',
    track: 'accounting',
    rungId: 'level-2-accounting-foundations',
    term: 'CapEx vs. OpEx',
    frontQuestion: 'What is the difference between a Capital Expenditure (CapEx) and an Operating Expense (OpEx)?',
    literalAnswer:
      'CapEx buys or upgrades a long-term asset lasting >1 year (recorded on the Balance Sheet and depreciated over time). OpEx is a day-to-day cost expensed immediately on the Income Statement.',
    applesToApplesExample:
      'Apples: Buying a $30,000 commercial oven is CapEx. Paying $150 to clean the oven or $200 for electricity is OpEx.',
    formula: 'CapEx → Balance Sheet PP&E (Depreciated) | OpEx → Income Statement (Immediate Expense)',
    memoWhisper: 'Improperly hiding OpEx inside CapEx (like WorldCom did) artificially inflates current-year profit!',
    tastingStyleId: 'taste-ledger-audit',
    reference: {
      id: 'ref-fc-capex',
      sourceName: 'Principles of Financial Accounting — Ch. 10: Fixed Assets & Capital vs. Revenue Expenditures',
      organization: 'OpenStax (Rice University)',
      sectionTitle: '10.1 Distinguish Between Capital Expenditures and Operating Expenses',
      url: 'https://openstax.org/details/books/principles-financial-accounting',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'Capital expenditures extend the useful life or capacity of a long-term asset and are capitalized on the balance sheet.',
      furtherReadingTip: 'On the Cash Flow Statement, CapEx sits in Investing Cash Flow, while OpEx sits in Operating Cash Flow.',
    },
  },
  {
    id: 'fc-trial-balance-closing',
    track: 'accounting',
    rungId: 'level-3-journals-ledgers-recording',
    term: 'General Ledger, Subsidiary Ledgers & Closing Entries',
    frontQuestion: 'How do Subsidiary Ledgers connect to the General Ledger, and what happens during Closing Entries?',
    literalAnswer:
      'Subsidiary ledgers track per-customer (AR) or per-vendor (AP) detail whose sum equals the General Ledger control account. Closing entries reset temporary Revenue, Expense, and Dividend accounts to $0 into Retained Earnings.',
    applesToApplesExample:
      'Apples: AR Sub-Ledger shows Alice owes $300 + Bob owes $700 = $1,000 AR Control Account on the General Ledger.',
    formula: 'Ending Retained Earnings = Beginning RE + Net Income − Dividends',
    memoWhisper: 'Never close Cash, Inventory, or Debt—permanent Balance Sheet accounts roll forward into the new year!',
    tastingStyleId: 'taste-three-statement',
    reference: {
      id: 'ref-fc-closing',
      sourceName: 'Principles of Financial Accounting — Ch. 5: Completing the Accounting Cycle',
      organization: 'OpenStax (Rice University)',
      sectionTitle: '5.1–5.3 Closing Entries and Post-Closing Trial Balance',
      url: 'https://openstax.org/details/books/principles-financial-accounting',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'Closing entries transfer the net balances of temporary revenue, expense, and dividend accounts to permanent retained earnings.',
      furtherReadingTip: 'A Post-Closing Trial Balance contains ONLY permanent Balance Sheet accounts.',
    },
  },
  {
    id: 'fc-bank-rec-deferred-rev',
    track: 'accounting',
    rungId: 'level-4-bookkeeping-accounting-close',
    term: 'Bank Reconciliation & Deferred Revenue',
    frontQuestion: 'Why is Deferred Revenue a Liability, and how does a Bank Reconciliation work?',
    literalAnswer:
      'Deferred (Unearned) Revenue is cash collected upfront before delivering the service—you owe the customer the work or a refund. A Bank Reconciliation matches the bank statement to book cash by adjusting for deposits in transit, outstanding checks, and bank fees.',
    applesToApplesExample:
      'Apples: Customer pays $1,200 upfront on Jan 1 for a 12-month subscription → Jan 31 earned revenue is $100, and $1,100 remains Deferred Revenue (Liability).',
    formula: 'Adjusted Bank Balance (Stmt + Deposits in Transit − Outstanding Checks) = Adjusted Book Cash',
    memoWhisper: 'Upfront customer cash boosts Operating Cash Flow immediately, but only enters Revenue month by month as earned!',
    tastingStyleId: 'taste-three-statement',
    reference: {
      id: 'ref-fc-bankrec',
      sourceName: 'Principles of Financial Accounting — Ch. 4 & Ch. 7: Bank Reconciliations & Unearned Revenues',
      organization: 'OpenStax (Rice University)',
      sectionTitle: '7.4 Prepare a Bank Reconciliation & 4.2 Unearned Revenue Adjustments',
      url: 'https://openstax.org/details/books/principles-financial-accounting',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'Unearned revenue represents a liability until the goods or services are delivered to the customer.',
      furtherReadingTip: 'Always book a journal entry for adjustments to the Book side (bank service fees, NSF checks, interest earned).',
    },
  },
  {
    id: 'fc-three-statement-links',
    track: 'accounting',
    rungId: 'level-5-financial-statements-connections',
    term: 'Three-Statement Connections & Working Capital',
    frontQuestion: 'How do the Income Statement, Balance Sheet, and Cash Flow Statement connect?',
    literalAnswer:
      'Net Income from the Income Statement flows into Retained Earnings on the Balance Sheet AND serves as the top line of Operating Cash Flow (Indirect Method), where non-cash D&A is added back and Working Capital changes are adjusted to arrive at Ending Cash.',
    applesToApplesExample:
      'Apples: $100 Depreciation lowers Pre-Tax Income by $100 (saving $25 in taxes at 25%), so Net Income drops $75, but Operating Cash Flow goes UP by +$25 ($100 add-back − $75 lower net income).',
    formula: 'Operating Cash Flow = Net Income + D&A − ΔAR − ΔInventory + ΔAP',
    memoWhisper: 'Rising Inventory or Accounts Receivable consumes cash; rising Accounts Payable preserves cash.',
    tastingStyleId: 'taste-three-statement',
    reference: {
      id: 'ref-fc-3stmt',
      sourceName: 'SEC Investor.gov & OpenStax Ch. 16: Statement of Cash Flows',
      organization: 'U.S. Securities and Exchange Commission',
      sectionTitle: 'Three-Statement Linkages and Indirect Operating Cash Flow',
      url: 'https://www.investor.gov/introduction-investing/getting-started/researching-investments/financial-statements',
      licenseOrApi: 'Public Domain (SEC)',
      literalExcerpt:
        'The statement of cash flows reconciles accrual net income to actual cash generated by operating, investing, and financing activities.',
      furtherReadingTip: 'Remember: Loan principal repayments go in Financing Cash Flows, while Loan interest goes in Operating Cash Flows.',
    },
  },
  {
    id: 'fc-excel-xlookup-sumifs',
    track: 'general',
    rungId: 'level-6-excel-financial-data-skills',
    term: 'Mixed References ($A1 vs A$1), SUMIFS & XLOOKUP',
    frontQuestion: 'How do Mixed Cell References ($A1 vs. A$1), SUMIFS, and XLOOKUP work in financial models?',
    literalAnswer:
      '$A1 locks Column A while allowing the row to shift; A$1 locks Row 1 while allowing the column to shift across years. SUMIFS totals numbers matching multiple criteria, and XLOOKUP retrieves values across tables safely.',
    applesToApplesExample:
      'Apples: =SUMIFS(GL[Amount], GL[Account], $A12, GL[Month], G$4) sums the exact ledger account in Column A for the exact month in Row 4 across a 12-month model.',
    formula: '=XLOOKUP(LookupValue, LookupArray, ReturnArray, IfNotFound)',
    memoWhisper: 'Mastering $A12 and G$4 lets you write ONE formula and copy it across a 100-row × 12-month P&L!',
    tastingStyleId: 'taste-ledger-audit',
    reference: {
      id: 'ref-fc-excel',
      sourceName: 'OpenStax Workplace Software and Skills — Ch. 10: Advanced Spreadsheets',
      organization: 'OpenStax (Rice University)',
      sectionTitle: '10.1–10.3 Mixed Cell References, Lookup Functions & PivotTables',
      url: 'https://openstax.org/details/books/workplace-software-skills',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'Mixed references lock either the row or column coordinate, enabling dynamic matrix formulas across multi-period financial schedules.',
      furtherReadingTip: 'Use Power Query to automate cleaning dirty CSV exports before feeding your PivotTables.',
    },
  },
  {
    id: 'fc-prime-cost',
    track: 'accounting',
    rungId: 'level-7-cost-accounting-operating-performance',
    term: 'Prime Cost, Contribution Margin & Break-Even',
    frontQuestion: 'What is Prime Cost vs. Contribution Margin, and how do you calculate Break-Even Units?',
    literalAnswer:
      'Prime Cost = Direct Materials (or Food Cost) + Direct Labor. Contribution Margin = Selling Price − All Variable Costs per unit. Break-Even Units = Total Fixed Costs ÷ Contribution Margin per unit.',
    applesToApplesExample:
      'Apples: Sell a chair for $100 with $40 variable Prime Cost ($60 Contribution Margin). If fixed factory rent is $12,000, Break-Even = $12,000 ÷ $60 = 200 chairs.',
    formula: 'Prime Cost = Direct Materials + Direct Labor | Break-Even Units = Fixed Costs ÷ (Price − Variable Cost)',
    memoWhisper: 'In restaurants, Prime Cost (Food & Beverage + Kitchen/Server Labor) should stay below 60–65% of sales!',
    tastingStyleId: 'taste-ledger-audit',
    reference: {
      id: 'ref-fc-prime',
      sourceName: 'Principles of Managerial Accounting — Ch. 2 & Ch. 3: Cost-Volume-Profit Analysis',
      organization: 'OpenStax (Rice University)',
      sectionTitle: 'Prime Cost, Contribution Margin, and Break-Even Point',
      url: 'https://openstax.org/details/books/principles-managerial-accounting',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'Prime costs combine direct materials and direct labor; break-even volume occurs where total contribution margin equals total fixed costs.',
      furtherReadingTip: 'Ignore sunk costs (already spent in the past) when making future make-or-buy or pricing decisions.',
    },
  },
  {
    id: 'fc-tam-sam-som-ltv',
    track: 'markets',
    rungId: 'level-9-market-research-competitive-analysis',
    term: 'TAM, SAM, SOM & LTV:CAC Ratio',
    frontQuestion: 'How do you size a market with TAM, SAM, and SOM, and what is the LTV:CAC ratio?',
    literalAnswer:
      'TAM is total global demand; SAM is the segment your product/geography can serve; SOM is your realistic near-term capture. LTV:CAC compares the gross profit a customer generates over their lifetime (LTV) to the cost to acquire them (CAC).',
    applesToApplesExample:
      'Apples: Spend $100 to acquire a subscriber (CAC) who pays $30/month at 80% gross margin ($24/mo) for 20 months ($480 LTV) → LTV:CAC = 4.8x.',
    formula: 'Bottom-Up SOM = Target Customer Count × Annual Price × Realistic Win Rate % | LTV = (ARPU × Gross Margin %) ÷ Churn',
    memoWhisper: 'Investors love bottom-up SOM math (actual buyers × price) and distrust top-down "1% of a trillion-dollar TAM" claims!',
    tastingStyleId: 'taste-market-valuation',
    reference: {
      id: 'ref-fc-tamsam',
      sourceName: 'OpenStax Principles of Marketing — Ch. 5: Market Sizing, Elasticity & Customer Metrics',
      organization: 'OpenStax (Rice University)',
      sectionTitle: 'Market Segmentation, Addressable Market Sizing, and Customer Lifetime Value',
      url: 'https://openstax.org/details/books/principles-marketing',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'Bottom-up market sizing estimates realistic obtainable revenue by multiplying verified customer segments by willingness to pay.',
      furtherReadingTip: 'Price Elasticity = (% Change in Quantity) ÷ (% Change in Price). If |E| > 1, demand is elastic.',
    },
  },
  {
    id: 'fc-npv-irr-wacc',
    track: 'finance',
    rungId: 'level-11-corporate-finance-fundamentals',
    term: 'NPV, IRR & WACC (Capital Budgeting)',
    frontQuestion: 'How do NPV, IRR, and WACC work together when deciding whether to approve an investment?',
    literalAnswer:
      'WACC is the blended after-tax cost of a firm’s debt and equity capital. NPV discounts future cash flows back to today at WACC and subtracts the upfront cost. IRR is the discount rate that makes NPV = $0.',
    applesToApplesExample:
      'Apples: If WACC is 10% and a project has an NPV of +$25,000 (and an IRR of 18%), the project earns more than its cost of capital and creates $25,000 of net wealth today.',
    formula: 'NPV = Σ [CF_t ÷ (1 + WACC)^t] − Initial Investment | WACC = (E/V × Re) + (D/V × Rd × (1 − Tax))',
    memoWhisper: 'Always approve when NPV > $0 (which means IRR > WACC). If two projects conflict, pick the higher NPV!',
    tastingStyleId: 'taste-accrual-timing',
    reference: {
      id: 'ref-fc-npv-wacc',
      sourceName: 'Principles of Finance — Ch. 16: Capital Budgeting & WACC',
      organization: 'OpenStax (Rice University)',
      sectionTitle: '16.1–16.5 Net Present Value, Internal Rate of Return, and WACC',
      url: 'https://openstax.org/details/books/principles-finance',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'Projects with a positive net present value when discounted at the weighted average cost of capital increase shareholder wealth.',
      furtherReadingTip: 'Interest on debt is tax-deductible, which is why we multiply Cost of Debt by (1 − Tax Rate).',
    },
  },
  {
    id: 'fc-ev-bridge-dcf',
    track: 'finance',
    rungId: 'level-13-valuation-investment-decisions',
    term: 'Enterprise Value (EV) vs. Equity Value & DCF',
    frontQuestion: 'How do you bridge Equity Value (Market Cap) to Enterprise Value (EV), and why do we subtract Cash?',
    literalAnswer:
      'Enterprise Value is the total value of the operating business to all capital providers (debt + equity). We add Debt because an acquirer must assume/repay it, and subtract Cash because the acquirer gets to keep the target’s cash.',
    applesToApplesExample:
      'Apples: Buy a house for $500k Equity that has a $100k mortgage attached, but there is $30k cash sitting in a safe inside → True net price (Enterprise Value) = $500k + $100k − $30k = $570k.',
    formula: 'Enterprise Value = Equity Value + Total Debt + Preferred Stock + Minority Interest − Cash',
    memoWhisper: 'When moving from DCF Enterprise Value to Equity Value, flip the signs: Equity Value = EV − Total Debt + Cash!',
    tastingStyleId: 'taste-market-valuation',
    reference: {
      id: 'ref-fc-evbridge',
      sourceName: 'MIT OCW 15.401 & OpenStax Corporate Valuation',
      organization: 'MIT OpenCourseWare / OpenStax',
      sectionTitle: 'Enterprise Value vs. Equity Value & Discounted Cash Flow Valuation',
      url: 'https://ocw.mit.edu/',
      licenseOrApi: 'CC BY-NC-SA 4.0',
      literalExcerpt:
        'Enterprise value equals the market value of equity plus net debt, representing the claim of all stakeholders on unlevered free cash flows.',
      furtherReadingTip: 'Pair EV with EBITDA or Revenue; pair Equity Value (Price) with Net Income or EPS (P/E).',
    },
  },
  {
    id: 'fc-lbo-accretion-eva',
    track: 'finance',
    rungId: 'level-15-advanced-corporate-finance-transactions',
    term: 'LBO Model Drivers, Accretion/Dilution & Economic Profit (EVA)',
    frontQuestion: 'What are the 3 return drivers in a Leveraged Buyout (LBO), and what is Economic Profit (EVA)?',
    literalAnswer:
      'LBO returns come from: 1) EBITDA growth, 2) Debt paydown (de-leveraging) from free cash flow, and 3) Exit Multiple expansion. Economic Profit (EVA) = Invested Capital × (ROIC − WACC).',
    applesToApplesExample:
      'Apples: Even if the valuation multiple stays flat at 10x, paying down $200M of LBO debt with the company’s own cash flow increases the PE sponsor’s equity value by +$200M!',
    formula: 'MOIC = Exit Sponsor Equity ÷ Initial Sponsor Equity | EVA = NOPAT − (Invested Capital × WACC)',
    memoWhisper: 'In M&A, if Pro Forma Combined EPS > Acquirer Standalone EPS, the deal is Accretive!',
    tastingStyleId: 'taste-market-valuation',
    reference: {
      id: 'ref-fc-lbo-eva',
      sourceName: 'MIT OCW 15.402 Strategic Corporate Finance & M&A Deal Analysis',
      organization: 'MIT Sloan School of Management',
      sectionTitle: 'Leveraged Buyouts, M&A Accretion/Dilution, and Economic Value Added',
      url: 'https://ocw.mit.edu/',
      licenseOrApi: 'CC BY-NC-SA 4.0',
      literalExcerpt:
        'Economic profit measures value creation above the opportunity cost of capital, while LBO structures utilize free cash flow to amortize acquisition debt.',
      furtherReadingTip: 'Always stress-test debt covenants (Max Net Debt/EBITDA and Min Interest Coverage) in downside scenarios.',
    },
  },
];

export const CURATED_SCENARIO_QUIZZES: ScenarioQuizItem[] = [
  {
    id: 'quiz-roi-dupont-audit',
    title: 'Level 8 Audit: ROI, ROIC, and the 3-Step DuPont Breakdown',
    track: 'finance',
    difficulty: 'Intermediate',
    tastingStyleId: 'taste-accrual-timing',
    memoIntro:
      'Hoo there friend! Let us test ROI, ROIC, and DuPont Analysis side by side so you can spot whether a company is truly efficient.',
    scenarioContext:
      'RoastCo invests $200,000 into a newautomated packaging line. In Year 1, the project generates $250,000 in total return (a net gain of $50,000 after recovering the $200,000 cost). Meanwhile, at the company level, RoastCo has a 10% Net Profit Margin, 1.5x Total Asset Turnover, and a 2.0x Equity Multiplier (Assets ÷ Equity).',
    ledgerSnapshot: [
      { lineItem: 'Packaging Line Upfront Investment Cost', amount: '$200,000', note: 'Initial capital outlay' },
      { lineItem: 'Packaging Line Net Gain (Return − Cost)', amount: '$50,000', note: '$250,000 total return − $200,000 cost' },
      { lineItem: 'Company Net Profit Margin (Net Income ÷ Sales)', amount: '10.0%', note: 'DuPont Lever 1: Profitability' },
      { lineItem: 'Company Asset Turnover (Sales ÷ Total Assets)', amount: '1.50x', note: 'DuPont Lever 2: Asset Efficiency' },
      { lineItem: 'Company Equity Multiplier (Total Assets ÷ Equity)', amount: '2.00x', note: 'DuPont Lever 3: Financial Leverage' },
    ],
    question:
      'What is the ROI on the packaging line project, and what is RoastCo’s Return on Equity (ROE) using the 3-step DuPont formula?',
    options: [
      'Project ROI is 25.0% ($50k ÷ $200k), and Company ROE is 30.0% (10% × 1.5x × 2.0x).',
      'Project ROI is 125.0% ($250k ÷ $200k), and Company ROE is 15.0% (10% × 1.5x).',
      'Project ROI is 20.0% ($50k ÷ $250k), and Company ROE is 20.0% (10% × 2.0x).',
      'Project ROI is 25.0%, and Company ROE is 13.5%.',
    ],
    correctIndex: 0,
    applesToApplesExplanation:
      '1) Project ROI = Net Gain ($50,000) ÷ Investment Cost ($200,000) = 25.0%. 2) By the 3-Step DuPont Identity: ROE = Net Profit Margin (10%) × Asset Turnover (1.5x) × Equity Multiplier (2.0x) = 15% ROA × 2.0x = 30.0% ROE.',
    teacherDiagnosticInsight:
      'Students who pick 125% forget to subtract the original $200,000 cost from the numerator; students who pick 15% calculated ROA (Margin × Turnover) and forgot the Equity Multiplier.',
    reference: {
      id: 'ref-quiz-roi-dupont',
      sourceName: 'OpenStax Principles of Finance Ch. 5 & Managerial Accounting Ch. 11',
      organization: 'OpenStax (Rice University)',
      sectionTitle: 'ROI and the 3-Step DuPont Decomposition',
      url: 'https://openstax.org/details/books/principles-finance',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'ROI divides net investment gain by initial cost; DuPont multiplies net profit margin, total asset turnover, and the equity multiplier to arrive at ROE.',
      furtherReadingTip: 'Always check whether high ROE comes from high ROA (operational strength) or high Equity Multiplier (heavy debt).',
    },
  },
  {
    id: 'quiz-level1-markup-margin',
    title: 'Level 1 Audit: Markup vs. Margin & Cash vs. Profit',
    track: 'general',
    difficulty: 'Entry',
    tastingStyleId: 'taste-ledger-audit',
    memoIntro:
      'Hoo! Let us test the two biggest Level 1 traps: Markup vs. Gross Margin, and Cash vs. Accounting Profit.',
    scenarioContext:
      'Clara buys artisan leather backpacks for $60 each (direct cost) and sells them for $100 each. In May, she sold 10 backpacks ($1,000 total revenue, $600 COGS), paid $150 in store rent, and 2 of those customers ($200) bought on 30-day invoice and have not paid cash yet.',
    ledgerSnapshot: [
      { lineItem: 'Unit Selling Price vs. Unit Cost', amount: '$100 Price / $60 Cost', note: '$40 Gross Profit per backpack' },
      { lineItem: 'May Total Revenue (10 backpacks × $100)', amount: '$1,000.00', note: '$800 collected in cash + $200 on AR invoice' },
      { lineItem: 'May Total Expenses ($600 COGS + $150 Rent)', amount: '-$750.00', note: 'Paid in full during May' },
    ],
    question:
      'What is Clara’s per-unit Markup % versus her Gross Margin %, and what is her May Accounting Net Profit?',
    options: [
      'Markup is 66.7% ($40 ÷ $60 Cost), Gross Margin is 40.0% ($40 ÷ $100 Price), and May Net Profit is $250.',
      'Markup is 40.0% ($40 ÷ $100), Gross Margin is 66.7% ($40 ÷ $60), and May Net Profit is $250.',
      'Markup and Gross Margin are both 40.0%, and May Net Profit is $50 ($800 cash − $750 expenses).',
      'Markup is 66.7%, Gross Margin is 40.0%, and May Net Profit is $400.',
    ],
    correctIndex: 0,
    applesToApplesExplanation:
      'Markup divides the $40 unit profit by the $60 Cost ($40 ÷ $60 = 66.7%). Gross Margin divides the $40 unit profit by the $100 Selling Price ($40 ÷ $100 = 40.0%). Accrual Net Profit = $1,000 Revenue − $750 Total Expenses = $250 (even though $200 is still in Accounts Receivable).',
    teacherDiagnosticInsight:
      'Separating Markup (÷ Cost) from Margin (÷ Price) prevents fatal retail pricing errors.',
    reference: {
      id: 'ref-quiz-l1',
      sourceName: 'OpenStax Principles of Financial Accounting — Ch. 1 & Ch. 6',
      organization: 'OpenStax (Rice University)',
      sectionTitle: 'Markup vs. Margin and Accrual Net Income',
      url: 'https://openstax.org/details/books/principles-financial-accounting',
      licenseOrApi: 'CC-BY 4.0',
      literalExcerpt:
        'Gross margin divides gross profit by net sales, while markup divides gross profit by cost of goods sold.',
      furtherReadingTip: 'Notice that May Net Cash Flow is $800 cash collected − $750 cash paid = +$50, while Accounting Profit is $250.',
    },
  },
  {
    id: 'quiz-prime-cost-bakery',
    title: 'Level 7 Audit: Prime Cost & Break-Even Volume in a Bistro',
    track: 'accounting',
    difficulty: 'Foundational',
    tastingStyleId: 'taste-ledger-audit',
    memoIntro:
      'Let us look at a bistro’s cost sheet. Separate direct Prime Cost from fixed overhead and find Break-Even!',
    scenarioContext:
      'Maple Street Bistro serves 1,000 dinners at $30 each ($30,000 Sales). Food ingredients cost $9,000, direct kitchen/server wages cost $9,000, and fixed monthly building rent & salaried administration cost $9,000.',
    ledgerSnapshot: [
      { lineItem: 'Guest Dinner Sales (1,000 meals × $30)', amount: '$30,000', note: '$30.00 price per meal' },
      { lineItem: 'Direct Food & Beverage Ingredients', amount: '$9,000', note: '$9.00 per meal (Direct Material)' },
      { lineItem: 'Direct Kitchen & Server Line Labor', amount: '$9,000', note: '$9.00 per meal (Direct Labor)' },
      { lineItem: 'Monthly Building Rent & Insurance (Fixed)', amount: '$9,000', note: 'Fixed overhead regardless of meal count' },
    ],
    question:
      'What is the bistro’s total Prime Cost (and Prime Cost % of sales), and how many meals must it sell to Break Even?',
    options: [
      'Prime Cost is $18,000 (60% of sales), and Break-Even is 750 meals ($9,000 Fixed Rent ÷ $12 Contribution Margin/meal).',
      'Prime Cost is $27,000 (90% of sales), and Break-Even is 900 meals.',
      'Prime Cost is $9,000 (30% of sales), and Break-Even is 300 meals.',
      'Prime Cost is $18,000 (60% of sales), and Break-Even is 500 meals.',
    ],
    correctIndex: 0,
    applesToApplesExplanation:
      'Prime Cost = Direct Food ($9,000) + Direct Labor ($9,000) = $18,000 (60% of $30,000 sales), or $18 per meal. Contribution Margin per meal = $30 price − $18 variable cost = $12. Break-Even Meals = $9,000 Fixed Cost ÷ $12 CM = 750 meals.',
    teacherDiagnosticInsight:
      'Reinforces both hospitality/manufacturing Prime Cost and Cost-Volume-Profit (CVP) break-even math.',
    reference: {
      id: 'ref-quiz-prime',
      sourceName: 'OpenStax Principles of Managerial Accounting — Ch. 2 & Ch. 3',
      organization: 'OpenStax (Rice University)',
      sectionTitle: 'Prime Cost and Break-Even Analysis',
      url: 'https://openstax.org/details/books/principles-managerial-accounting',
      licenseOrApi: 'CC-BY 4.0',
      literalExcerpt:
        'Break-even volume in units equals total fixed costs divided by unit contribution margin.',
      furtherReadingTip: 'At 750 meals, Revenue is $22,500, Variable Prime Cost is $13,500, and Fixed Cost is $9,000 → Operating Profit = $0.',
    },
  },
  {
    id: 'quiz-ev-bridge-dcf-level13',
    title: 'Level 13 & 16 Audit: Enterprise-to-Equity Value Bridge & Economic Profit (EVA)',
    track: 'finance',
    difficulty: 'Advanced Scenario',
    tastingStyleId: 'taste-market-valuation',
    memoIntro:
      'Now for an institutional valuation and capital allocation check: bridging DCF Enterprise Value to Share Price and testing Economic Profit (EVA)!',
    scenarioContext:
      'An unlevered DCF values CloudLogistics at an Implied Enterprise Value (EV) of $600M. The company has $150M of Total Debt, $50M of Cash on its Balance Sheet, and 25 million diluted shares. It earns $45M in after-tax operating profit (NOPAT) on $300M of Invested Capital (15% ROIC), and its WACC is 10%.',
    ledgerSnapshot: [
      { lineItem: 'DCF Implied Enterprise Value (EV)', amount: '$600.0M', note: 'PV of FCFF + PV of Terminal Value' },
      { lineItem: 'Total Debt on Balance Sheet', amount: '$150.0M', note: 'Must be subtracted to reach Equity Value' },
      { lineItem: 'Cash & Marketable Securities', amount: '$50.0M', note: 'Added to reach Equity Value (Net Debt = $100M)' },
      { lineItem: 'Diluted Share Count', amount: '25.0M shares', note: 'Includes in-the-money options via Treasury Stock Method' },
      { lineItem: 'NOPAT ($45M) on $300M Invested Capital (@ 10% WACC)', amount: '15.0% ROIC', note: 'Capital Charge = $300M × 10% = $30M' },
    ],
    question:
      'What is CloudLogistics’ Implied Equity Value per share, and what is its annual Economic Profit (EVA)?',
    options: [
      'Implied Equity Value is $500M ($20.00/share), and Economic Profit (EVA) is +$15.0M.',
      'Implied Equity Value is $700M ($28.00/share), and Economic Profit (EVA) is +$45.0M.',
      'Implied Equity Value is $450M ($18.00/share), and Economic Profit (EVA) is +$15.0M.',
      'Implied Equity Value is $500M ($20.00/share), and Economic Profit (EVA) is -$5.0M.',
    ],
    correctIndex: 0,
    applesToApplesExplanation:
      '1) Implied Equity Value = Enterprise Value ($600M) − Total Debt ($150M) + Cash ($50M) = $500M. Divided by 25M shares = $20.00 per share. 2) Economic Profit (EVA) = NOPAT ($45M) − Capital Charge ($300M Invested Capital × 10% WACC = $30M) = +$15.0M (or $300M × [15% ROIC − 10% WACC] = +$15.0M).',
    teacherDiagnosticInsight:
      'Tests both Level 13 EV-to-Equity Value bridge directionality and Level 16 Economic Profit (EVA = NOPAT − WACC Capital Charge).',
    reference: {
      id: 'ref-quiz-ev-eva',
      sourceName: 'MIT OCW 15.401 / 15.402 Corporate Valuation & Strategic Finance',
      organization: 'MIT OpenCourseWare',
      sectionTitle: 'Enterprise Value Bridge & Economic Value Added (EVA)',
      url: 'https://ocw.mit.edu/',
      licenseOrApi: 'CC BY-NC-SA 4.0',
      literalExcerpt:
        'Equity value equals enterprise value less net debt; economic profit equals NOPAT less the opportunity cost of invested capital.',
      furtherReadingTip: 'Whenever ROIC exceeds WACC, Economic Profit is positive and growth compounds shareholder value.',
    },
  },
];

export interface SeedForumPost {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  body: string;
  category: LearningTrack;
  conceptTag: string;
  helpfulCount: number;
  createdAtLabel: string;
}

export const INITIAL_FORUM_POSTS: SeedForumPost[] = [
  {
    id: 'seed-post-roi-roic',
    authorId: 'seed-1',
    authorName: 'Elena R. (Level 8 Study Group)',
    title: 'How I finally stopped confusing ROI, ROE, and ROIC',
    body: 'ROI is for a single project or machine: (Net Gain ÷ Cost). ROE looks only at shareholders’ equity (which debt can inflate), while ROIC = NOPAT ÷ (Debt + Equity − Cash) so you see the true operating return regardless of debt!',
    category: 'finance',
    conceptTag: 'ROI, ROIC & DuPont (Level 8)',
    helpfulCount: 31,
    createdAtLabel: 'Offline Peer Archive',
  },
  {
    id: 'seed-post-markup-margin',
    authorId: 'seed-2',
    authorName: 'Marcus T. (Level 1 & 7 Cohort)',
    title: 'Apples-to-Apples trick for Markup vs. Gross Margin & Prime Cost',
    body: 'If a coffee bag costs $10 and sells for $15 ($5 profit), Markup divides by Cost ($5/$10 = 50%), while Margin divides by Price ($5/$15 = 33.3%). And remember: Prime Cost is only Direct Material + Direct Labor—never building rent!',
    category: 'accounting',
    conceptTag: 'Markup vs. Margin & Prime Cost',
    helpfulCount: 24,
    createdAtLabel: 'Offline Peer Archive',
  },
  {
    id: 'seed-post-ev-bridge',
    authorId: 'seed-3',
    authorName: 'Priya K. (Level 13 Valuation Lab)',
    title: 'Why we ADD Debt and SUBTRACT Cash in Enterprise Value',
    body: 'Think of buying a business like buying a house: if the house has a mortgage (Debt), you have to pay it off (+Debt). If there is cash sitting in a safe inside the house, you get to keep it (-Cash), lowering your net purchase price!',
    category: 'markets',
    conceptTag: 'Enterprise Value vs. Equity Value',
    helpfulCount: 19,
    createdAtLabel: 'Offline Peer Archive',
  },
];
