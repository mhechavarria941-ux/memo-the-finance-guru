import { LadderNode } from './curriculumData';

export const LEVELS_1_TO_8: LadderNode[] = [
  {
    id: 'level-1-business-financial-math',
    rungNumber: 1,
    title: 'Level 1 — Business and Financial Math',
    subtitle:
      'Percentages, ratios, weighted averages, revenue vs. profit, cash vs. profit, markup vs. margin, and compound interest',
    track: 'general',
    difficulty: 'Entry',
    estimatedMinutes: 12,
    subtopics: [
      'Percentages and percentage changes',
      'Ratios and proportions',
      'Weighted averages',
      'Revenue, expenses, and profit',
      'Assets, liabilities, and equity',
      'Cash versus profit',
      'Fixed versus variable costs',
      'Direct versus indirect costs',
      'Markup versus margin',
      'Simple and compound interest',
      'Inflation and purchasing power',
      'Financial terminology',
    ],
    memoVoiceNote:
      'Hoo there friend! Level 1 is the foundation of the entire financial world. Before touching ledgers or Wall Street models, let us master percentages, Revenue vs. Profit, Cash vs. Profit, Markup vs. Margin, and how interest and inflation work.',
    literalCoreRule:
      'Percentage Change = (New − Old) ÷ Old. Profit = Revenue − Expenses. Markup divides profit by Cost, whereas Margin divides profit by Selling Price. Simple interest grows only on original principal; compound interest grows on principal plus prior interest.',
    applesToApplesBreakdown: {
      itemA:
        'Markup vs. Margin (Apples): Buy a jacket for $60 Cost and sell it for $100 Price ($40 gross profit). Markup on Cost = $40 ÷ $60 = 66.7%. Gross Margin on Price = $40 ÷ $100 = 40.0%.',
      itemB:
        'Cash vs. Profit & Fixed vs. Variable (Pears): Invoiced $1,000 today (Profit recorded now, $0 Cash until paid). Rent is Fixed ($1,500/mo regardless of sales); shipping boxes are Variable ($2 per order).',
      plainTruth:
        'Confusing a 50% markup with a 50% margin—or confusing uncollected sales with cash in the bank—is the #1 math mistake made by new business owners.',
    },
    ledgerExample: {
      header: 'Level 1 Master Math & Unit Ledger — Bakery & Retail Store',
      rows: [
        { label: 'Revenue (Sales): 200 loaves sold × $10.00 price', amount: '$2,000.00', note: 'Top-line money billed to customers' },
        { label: 'Direct Variable Cost: Flour, yeast & packaging ($4/loaf)', amount: '-$800.00', note: '60% Gross Margin ($1,200 ÷ $2,000) · 150% Markup' },
        { label: 'Indirect Fixed Cost: Monthly bakery oven lease & rent', amount: '-$500.00', note: 'Does not change with loaf volume' },
        { label: 'Accounting Net Profit (Revenue − Total Expenses)', amount: '$700.00', note: '35.0% Net Profit Margin' },
        { label: 'Less: Uncollected Catering Invoice (30-day credit)', amount: '-$300.00', note: 'Earned in profit, but cash not in bank yet' },
        { label: 'Actual Net Cash Flow Added to Bank Today', amount: '$400.00', note: 'Literal cash vs. $700 accounting profit' },
      ],
    },
    takeawayChecklist: [
      'Percentage Change = (New Value − Old Value) ÷ Old Value; Weighted Average weights each number by its share of volume.',
      'Assets (what you own) = Liabilities (what you owe) + Equity (what is left for owners).',
      'Direct costs trace straight to a product; Indirect costs support the whole business; Fixed stays flat; Variable scales with volume.',
      'Compound Interest = Principal × (1 + r)^n; Inflation erodes purchasing power when price growth outpaces yield.',
    ],
    reference: {
      id: 'ref-level-1',
      sourceName: 'Principles of Finance — Ch. 1 & Time Value / Financial Math Foundations',
      organization: 'OpenStax (Rice University)',
      sectionTitle: '1.1–1.4 Financial Math, Percentages, Interest & Purchasing Power',
      url: 'https://openstax.org/details/books/principles-finance',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'Financial literacy begins with understanding percentage returns, the distinction between accounting profit and cash flow, and how compounding and inflation affect real purchasing power.',
      furtherReadingTip:
        'Always check the denominator: Margin always divides by Revenue; Markup always divides by Cost.',
    },
  },
  {
    id: 'level-2-accounting-foundations',
    rungNumber: 2,
    title: 'Level 2 — Accounting Foundations',
    subtitle:
      'The accounting equation, double-entry bookkeeping, debits & credits, accrual vs. cash basis, and CapEx vs. OpEx',
    track: 'accounting',
    difficulty: 'Entry',
    estimatedMinutes: 14,
    subtopics: [
      'The accounting equation',
      'Double-entry bookkeeping',
      'Debits and credits',
      'Account types and normal balances',
      'The chart of accounts',
      'Accounting periods',
      'Cash-basis accounting',
      'Accrual-basis accounting',
      'Revenue recognition basics',
      'Expense recognition basics',
      'Capital expenditures versus operating expenses',
      'Source documents and audit trails',
    ],
    memoVoiceNote:
      'Every dollar in accounting has two sides: where it came from and where it went. Once you know DEAD CLIC for Debits and Credits and the difference between CapEx and OpEx, no ledger can trick you.',
    literalCoreRule:
      'Assets = Liabilities + Equity. In double-entry bookkeeping, total Debits (left side) must always equal total Credits (right side). Under accrual accounting, recognize revenue when earned (delivered) and expenses when incurred (matched), regardless of when cash moves.',
    applesToApplesBreakdown: {
      itemA:
        'Debits & Normal Balances (Apples): Debits increase Expenses, Assets, and Dividends (DEAD). Their normal balance is a Debit.',
      itemB:
        'Credits & CapEx vs. OpEx (Pears): Credits increase Liabilities, Income/Revenue, and Capital/Equity (CLIC). Buying a $20,000 delivery van is a Capital Expenditure (Asset); buying $80 of gas for the van is an Operating Expense (OpEx).',
      plainTruth:
        'Debit never means "bad" and Credit never means "good"—Debit literally means Left Column, and Credit literally means Right Column.',
    },
    ledgerExample: {
      header: 'Double-Entry Foundation — Normal Balances & CapEx vs. OpEx',
      rows: [
        { label: '1010 · Cash (Asset — Normal Balance: Debit)', amount: 'Dr $25,000', note: 'Owner invests cash into company bank account' },
        { label: '3010 · Owner Common Equity (Equity — Normal: Credit)', amount: 'Cr $25,000', note: 'Balances the Accounting Equation ($25k = $0 + $25k)' },
        { label: '1500 · Delivery Truck Purchase (CapEx — Asset)', amount: 'Dr $18,000', note: 'Multi-year asset recorded on Balance Sheet' },
        { label: '5200 · Monthly Truck Fuel & Oil (OpEx — Expense)', amount: 'Dr $240', note: 'Immediate period expense on Income Statement' },
      ],
    },
    takeawayChecklist: [
      'The Chart of Accounts numbers accounts in order: 1000s Assets, 2000s Liabilities, 3000s Equity, 4000s Revenue, 5000s+ Expenses.',
      'Accrual-basis records revenue when performance obligations are satisfied and matches expenses to the same accounting period.',
      'Every accounting entry requires a verifiable Source Document (invoice, receipt, contract, bank statement) to form an Audit Trail.',
    ],
    reference: {
      id: 'ref-level-2',
      sourceName: 'Principles of Financial Accounting — Ch. 2 & Ch. 3: Analyzing and Recording Transactions',
      organization: 'OpenStax (Rice University)',
      sectionTitle: '3.1–3.3 The Accounting Equation, Double-Entry Bookkeeping, and Normal Balances',
      url: 'https://openstax.org/details/books/principles-financial-accounting',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'For every transaction, the accounting equation must remain in balance, and total debits must equal total credits across the chart of accounts.',
      furtherReadingTip:
        'Memorize DEALER or DEAD CLIC to recall instantly whether an account increases with a debit or a credit.',
    },
  },
  {
    id: 'level-3-journals-ledgers-recording',
    rungNumber: 3,
    title: 'Level 3 — Journals, Ledgers, and Transaction Recording',
    subtitle:
      'T-accounts, general & subsidiary ledgers, AR/AP ledgers, trial balances, adjusting entries, and closing entries',
    track: 'accounting',
    difficulty: 'Foundational',
    estimatedMinutes: 15,
    subtopics: [
      'T-accounts',
      'Journal entries',
      'General journals',
      'General ledgers',
      'Subsidiary ledgers',
      'Posting journal entries to ledgers',
      'Sales and purchases journals',
      'Cash receipts and cash disbursements journals',
      'Accounts receivable ledgers',
      'Accounts payable ledgers',
      'Trial balances',
      'Correcting and reversing entries',
      'Adjusting entries',
      'Closing entries',
    ],
    memoVoiceNote:
      'Think of the General Journal as a chronological diary of every transaction, and the General Ledger as the organized filing cabinet sorted by account. Let us trace how entries flow from journal to trial balance to closing!',
    literalCoreRule:
      'Transactions are first recorded chronologically in Journals (General or Special: Sales, Purchases, Cash Receipts, Cash Disbursements), then posted to T-Accounts in the General Ledger and Subsidiary Ledgers (AR/AP). At period-end, an Unadjusted Trial Balance is tested, Adjusting Entries are booked, and temporary accounts are zeroed via Closing Entries.',
    applesToApplesBreakdown: {
      itemA:
        'General Ledger vs. Subsidiary Ledger (Apples): The General Ledger shows total Accounts Receivable = $50,000. The AR Subsidiary Ledger lists the exact breakdown by customer (Customer A owes $30,000; Customer B owes $20,000).',
      itemB:
        'Adjusting vs. Closing Entries (Pears): Adjusting entries update accrued/prepaid balances before statements are printed. Closing entries reset temporary Revenue, Expense, and Dividend accounts to $0 at period-end and move Net Income into Retained Earnings.',
      plainTruth:
        'Permanent accounts (Assets, Liabilities, Equity) never close at year-end; Temporary accounts (Revenues, Expenses, Dividends) start every new year at $0.',
    },
    ledgerExample: {
      header: 'Posting Cycle — Journal Entry to Adjusted Trial Balance & Closing',
      rows: [
        { label: 'Step 1 · General Journal: Billed client for services', amount: 'Dr AR $4,500 / Cr Rev $4,500', note: 'Recorded chronologically in Sales/General Journal' },
        { label: 'Step 2 · Post to GL & AR Subsidiary Ledger', amount: 'AR Balance: $4,500', note: 'Customer #104 sub-ledger matches GL control account' },
        { label: 'Step 3 · Period-End Adjusting Entry (Supplies used)', amount: 'Dr Supplies Exp $600 / Cr Supplies $600', note: 'Brings physical count in line with book balance' },
        { label: 'Step 4 · Closing Entry to Retained Earnings', amount: 'Dr Revenue $4,500 / Cr Retained Earn.', note: 'Resets revenue & expense T-accounts to $0 for next period' },
      ],
    },
    takeawayChecklist: [
      'Special Journals (Sales, Purchases, Cash Receipts, Cash Disbursements) speed up high-volume repetitive transactions.',
      'The sum of all customer balances in the Accounts Receivable Subsidiary Ledger must equal the AR Control account in the General Ledger.',
      'A Trial Balance proves Total Debits = Total Credits, though correcting entries are still needed if an entry was posted to the wrong account.',
    ],
    reference: {
      id: 'ref-level-3',
      sourceName: 'Principles of Financial Accounting — Ch. 4 & Ch. 5: The Adjustment Process & Completing the Accounting Cycle',
      organization: 'OpenStax (Rice University)',
      sectionTitle: '4.1–5.4 Posting to Ledgers, Trial Balances, Adjusting Entries, and Closing Entries',
      url: 'https://openstax.org/details/books/principles-financial-accounting',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'The accounting cycle progresses from journalizing and posting to preparing an unadjusted trial balance, recording adjusting entries, preparing financial statements, and journalizing closing entries.',
      furtherReadingTip:
        'Never close an Asset or Liability account—only temporary Income Statement and Dividend accounts get closed into Retained Earnings.',
    },
  },
  {
    id: 'level-4-bookkeeping-accounting-close',
    rungNumber: 4,
    title: 'Level 4 — Everyday Bookkeeping and the Accounting Close',
    subtitle:
      'Invoicing, bank reconciliations, payroll, sales tax, inventory counts, prepaids, accruals, deferred revenue, depreciation & bad debt',
    track: 'accounting',
    difficulty: 'Foundational',
    estimatedMinutes: 16,
    subtopics: [
      'Customer invoicing and collections',
      'Supplier invoices and payment processing',
      'Bank and credit card reconciliations',
      'Petty cash accounting',
      'Payroll accounting',
      'Sales taxes and withholding liabilities',
      'Inventory purchases and counts',
      'Prepaid expenses',
      'Accrued expenses',
      'Deferred revenue',
      'Fixed asset registers',
      'Depreciation and amortization',
      'Bad debt allowances and write-offs',
      'Month-end and year-end close procedures',
    ],
    memoVoiceNote:
      'Hoo... Level 4 is what bookkeepers and controllers actually do every week and at month-end close! Reconciling the bank statement, handling payroll withholdings, tracking deferred revenue, and booking depreciation.',
    literalCoreRule:
      'During the Month-End Close, bookkeepers reconcile bank/card statements (matching book cash to bank cash for deposits in transit and outstanding checks), amortize Prepaid Expenses, accrue unpaid wages/bills, recognize earned portions of Deferred Revenue, and record non-cash Depreciation and Bad Debt Allowance.',
    applesToApplesBreakdown: {
      itemA:
        'Prepaid Expense vs. Deferred Revenue (Apples): Prepaid Insurance ($1,200 paid upfront by us) is our Asset until used. Deferred Revenue ($1,200 paid upfront by a customer to us) is our Liability until we deliver the service.',
      itemB:
        'Payroll Taxes & Sales Tax Collected (Pears): Sales tax collected from buyers and income tax withheld from employee paychecks are NOT company revenue or company expense—they are Current Liabilities held in trust for the government.',
      plainTruth:
        'A month-end close is not complete until every balance sheet account (bank cash, inventory, fixed asset register, AP/AR) is reconciled to supporting schedules.',
    },
    ledgerExample: {
      header: 'Month-End Close Checklist & Reconciliation Adjustments',
      rows: [
        { label: 'Bank Reconciliation: Ending Bank Statement Balance', amount: '$42,500.00', note: 'Plus $1,500 deposit in transit − $2,000 outstanding checks = $42,000 Book Cash' },
        { label: 'Deferred Revenue Earned This Month (1 of 12 months)', amount: 'Dr Def. Rev $500 / Cr Rev $500', note: 'Moves 1 month of annual software contract from Liability to Revenue' },
        { label: 'Monthly Fixed Asset Depreciation (Straight-Line)', amount: 'Dr Depr. Exp $400 / Cr Accum. Depr $400', note: 'Spreads equipment cost over useful life on Fixed Asset Register' },
        { label: 'Bad Debt Allowance (Estimated 2% uncollectible AR)', amount: 'Dr Bad Debt Exp $300 / Cr Allowance $300', note: 'Contra-asset reserve for invoices that may default' },
      ],
    },
    takeawayChecklist: [
      'Supplier payment processing uses a 3-way match: Purchase Order + Receiving Report + Vendor Invoice.',
      'Straight-Line Depreciation per year = (Asset Cost − Salvage Value) ÷ Useful Life in Years.',
      'Sales taxes collected and employee payroll withholdings sit in Liability accounts until remitted to tax authorities.',
    ],
    reference: {
      id: 'ref-level-4',
      sourceName: 'Principles of Financial Accounting — Ch. 7–10: Fraud/Cash Controls, Receivables, Inventory & Fixed Assets',
      organization: 'OpenStax (Rice University)',
      sectionTitle: 'Bank Reconciliations, Allowance for Doubtful Accounts, Payroll Liabilities & Depreciation',
      url: 'https://openstax.org/details/books/principles-financial-accounting',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'Internal control procedures require periodic bank reconciliations, physical inventory counts, fixed asset subsidiary registers, and systematic adjusting entries at month-end close.',
      furtherReadingTip:
        'When reconciling a bank account, adjust the Bank Balance for items the bank does not know about yet (deposits in transit, outstanding checks) and adjust Book Cash for bank fees or interest.',
    },
  },
  {
    id: 'level-5-financial-statements-connections',
    rungNumber: 5,
    title: 'Level 5 — Financial Statements and Their Connections',
    subtitle:
      'Income statement margins (gross, operating, net), balance sheet classifications, statement of equity, cash flow methods, and 3-statement links',
    track: 'accounting',
    difficulty: 'Foundational',
    estimatedMinutes: 16,
    subtopics: [
      'Income statement preparation',
      'Gross profit and gross margin',
      'Operating income and operating margin',
      'Net income and net margin',
      'Balance sheet preparation',
      'Current and noncurrent classifications',
      'Retained earnings and dividends',
      'Statements of changes in equity',
      'Cash flow statement preparation',
      'Operating, investing, and financing cash flows',
      'Direct and indirect cash flow methods',
      'Working capital adjustments',
      'Loan principal and interest accounting',
      'Three-statement connections',
    ],
    memoVoiceNote:
      'The Three Financial Statements are not three separate islands—they are three views of the same company wired together by Retained Earnings, Working Capital, and Ending Cash!',
    literalCoreRule:
      '1) Income Statement flows from Revenue → Gross Profit → Operating Income (EBIT) → Net Income. 2) Net Income minus Dividends adds to Retained Earnings on the Statement of Equity & Balance Sheet. 3) The Cash Flow Statement starts with Net Income (Indirect Method), adjusts for non-cash items and Working Capital changes, and reconciles Beginning Cash to Ending Cash on the Balance Sheet.',
    applesToApplesBreakdown: {
      itemA:
        'Loan Interest vs. Loan Principal (Apples): Paying $200 of loan interest is an Expense on the Income Statement (and Operating Cash Flow). Paying back $1,000 of loan principal is NOT an expense—it reduces Debt on the Balance Sheet and is a Financing Cash Outflow.',
      itemB:
        'Working Capital Cash Adjustments (Pears): When Accounts Receivable or Inventory goes UP, cash goes DOWN. When Accounts Payable goes UP, cash is conserved (goes UP).',
      plainTruth:
        'Gross Margin measures product pricing power; Operating Margin (EBIT ÷ Revenue) measures core business operations before debt/taxes; Net Margin measures the final bottom line.',
    },
    ledgerExample: {
      header: 'Three-Statement Bridge — From Gross Profit to Ending Cash',
      rows: [
        { label: 'Income Statement: Revenue ($10,000) − COGS ($4,000)', amount: '$6,000.00', note: 'Gross Profit (60.0% Gross Margin)' },
        { label: 'Less: Operating Expenses (SG&A $2,500 + Depr. $500)', amount: '$3,000.00', note: 'Operating Income / EBIT (30.0% Operating Margin)' },
        { label: 'Less: Interest Expense ($200) & Income Taxes ($700)', amount: '$2,100.00', note: 'Net Income (21.0% Net Margin)' },
        { label: 'Statement of Equity: Net Income ($2,100) − Dividends ($600)', amount: '+$1,500.00', note: 'Added to Balance Sheet Retained Earnings' },
        { label: 'Cash Flow Statement: Operating ($2,400) − CapEx ($1,000) − Debt/Div ($900)', amount: '+$500.00', note: 'Exact change in Balance Sheet Cash' },
      ],
    },
    takeawayChecklist: [
      'Current Assets and Current Liabilities are due or converted to cash within 12 months; Noncurrent items last longer than 12 months.',
      'Indirect Cash Flow Method starts with Net Income, adds back Depreciation, and subtracts increases in non-cash Working Capital.',
      'Operating Cash Flow = day-to-day business; Investing = buying/selling equipment or investments; Financing = issuing/repaying debt or equity and paying dividends.',
    ],
    reference: {
      id: 'ref-level-5',
      sourceName: 'SEC Investor.gov & OpenStax Ch. 16: Statement of Cash Flows & Financial Statements',
      organization: 'U.S. Securities and Exchange Commission / OpenStax',
      sectionTitle: 'Beginners’ Guide to Financial Statements & Indirect Cash Flow Preparation',
      url: 'https://www.investor.gov/introduction-investing/getting-started/researching-investments/financial-statements',
      licenseOrApi: 'Public Domain (SEC) & CC-BY 4.0',
      literalExcerpt:
        'Net income on the income statement links to retained earnings on the balance sheet and serves as the starting line for operating cash flows under the indirect method.',
      furtherReadingTip:
        'Always verify that Ending Cash on the Cash Flow Statement matches the top line of Cash & Equivalents on the Balance Sheet.',
    },
  },
  {
    id: 'level-6-excel-financial-data-skills',
    rungNumber: 6,
    title: 'Level 6 — Excel and Financial Data Skills',
    subtitle:
      'Absolute/mixed cell references, Excel Tables, SUMIFS/COUNTIFS, XLOOKUP & INDEX/MATCH, PivotTables, formula auditing, and Power Query',
    track: 'general',
    difficulty: 'Foundational',
    estimatedMinutes: 14,
    subtopics: [
      'Cell references and range selection',
      'Relative, absolute, and mixed references',
      'Excel Tables and structured references',
      'SUM, AVERAGE, MIN, and MAX',
      'IF, AND, OR, and nested logic',
      'SUMIFS, COUNTIFS, and AVERAGEIFS',
      'XLOOKUP, VLOOKUP, and INDEX/MATCH',
      'Date and text functions',
      'Sorting, filtering, and data validation',
      'Conditional formatting',
      'PivotTables and PivotCharts',
      'Data cleaning and duplicate detection',
      'Formula auditing and error handling',
      'Power Query fundamentals',
    ],
    memoVoiceNote:
      'Every accountant and financial analyst lives inside spreadsheets! Mastering $A$1 vs. $A1 mixed references, SUMIFS, XLOOKUP, PivotTables, and Power Query turns 4 hours of manual work into 10 seconds.',
    literalCoreRule:
      'Use Relative (A1), Absolute ($A$1), and Mixed ($A1 or A$1) references so formulas can be dragged across financial models without breaking. Use SUMIFS for multi-criteria ledger aggregation, XLOOKUP or INDEX/MATCH for dynamic table lookups, PivotTables for instant cross-tab summaries, and Power Query (Get & Transform) for repeatable data cleaning.',
    applesToApplesBreakdown: {
      itemA:
        'Absolute vs. Mixed References (Apples): $B$2 locks both Column B and Row 2 (great for a single tax rate cell). $B2 locks Column B but lets Row 2 move down; B$2 locks Row 2 (great for horizontal year headers).',
      itemB:
        'VLOOKUP vs. XLOOKUP / INDEX-MATCH (Pears): VLOOKUP breaks if someone inserts a column and cannot look left. XLOOKUP(lookup_val, lookup_array, return_array, if_not_found) looks in any direction safely.',
      plainTruth:
        'Never hardcode numbers inside a formula (like =B5*0.21). Put 21% in an input cell, lock it with F4 ($C$1), and reference it cleanly.',
    },
    ledgerExample: {
      header: 'Essential Financial Analyst Spreadsheet Formulas Cheat-Sheet',
      rows: [
        { label: 'Multi-Criteria Ledger Sum (SUMIFS)', amount: '=SUMIFS(Amt, Acct, "4010", Dept, "East")', note: 'Sums revenue only for Account 4010 in East region' },
        { label: 'Modern Dynamic Lookup (XLOOKUP)', amount: '=XLOOKUP(A5, GL[Code], GL[Name], "Missing")', note: 'Finds account name using structured Excel Table references' },
        { label: 'Two-Way Matrix Lookup (INDEX / MATCH)', amount: '=INDEX(Data, MATCH(RowID,R,0), MATCH(Yr,C,0))', note: 'Pulls exact line item and year intersection' },
        { label: 'End-of-Month Date Schedule (EOMONTH)', amount: '=EOMONTH(StartDate, 1)', note: 'Builds clean monthly close headers across 12 columns' },
      ],
    },
    takeawayChecklist: [
      'Convert raw transaction exports into Excel Tables (Ctrl+T) so formulas auto-expand with structured references.',
      'Use Trace Precedents / Trace Dependents and IFERROR() during formula auditing to isolate #REF!, #N/A, and #DIV/0! errors.',
      'Use Power Query to automate removing duplicates, trimming whitespace, unpivoting monthly columns, and merging ERP exports.',
    ],
    reference: {
      id: 'ref-level-6',
      sourceName: 'OpenStax Workplace Software & Skills + Corporate Finance Modeling Standards',
      organization: 'OpenStax (Rice University)',
      sectionTitle: 'Ch. 9 & Ch. 10: Advanced Excel Formulas, Lookup Functions, PivotTables & Data Auditing',
      url: 'https://openstax.org/details/books/workplace-software-skills',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'Mixed cell references, conditional aggregation functions (SUMIFS), dynamic lookups, and PivotTables form the technical backbone of financial data analysis.',
      furtherReadingTip:
        'Press F4 while editing a cell reference to cycle through $A$1, A$1, $A1, and A1.',
    },
  },
  {
    id: 'level-7-cost-accounting-operating-performance',
    rungNumber: 7,
    title: 'Level 7 — Cost Accounting and Operating Performance',
    subtitle:
      'COGS, FIFO/LIFO/Weighted Average, Job vs. Process Costing, ABC, Contribution Margin, Break-Even, Unit Economics, and Restaurant Prime Cost',
    track: 'accounting',
    difficulty: 'Intermediate',
    estimatedMinutes: 16,
    subtopics: [
      'Cost behavior and cost drivers',
      'Cost of goods sold',
      'Inventory costing methods',
      'Job-order and process costing',
      'Standard costing',
      'Activity-based costing',
      'Overhead allocation',
      'Contribution margin',
      'Break-even analysis',
      'Cost-volume-profit analysis',
      'Relevant costs and sunk costs',
      'Make-or-buy decisions',
      'Capacity utilization',
      'Unit economics',
      'Restaurant food cost, labor cost, and prime cost',
      'Average check, guest counts, and table turnover',
      'Menu profitability and product mix',
      'Flow-through and operating leverage',
    ],
    memoVoiceNote:
      'How many units must we sell to break even? Should we make parts in-house or buy them? And in hospitality or manufacturing, what is our Prime Cost, Contribution Margin, and Operating Leverage?',
    literalCoreRule:
      'Prime Cost = Direct Materials (or Food/Beverage Cost) + Direct Labor. Contribution Margin = Selling Price − Variable Cost per Unit. Break-Even Units = Fixed Costs ÷ Contribution Margin per Unit. Sunk costs (already spent and unrecoverable) are NEVER relevant to future make-or-buy decisions.',
    applesToApplesBreakdown: {
      itemA:
        'Contribution Margin & Break-Even (Apples): Sell a bistro meal for $25 with $10 variable food/labor cost = $15 Contribution Margin (60%). If monthly fixed rent is $15,000, Break-Even = $15,000 ÷ $15 = 1,000 meals.',
      itemB:
        'FIFO vs. LIFO & Sunk Costs (Pears): In rising prices, FIFO sells oldest/cheapest inventory first (lower COGS, higher profit). Money spent last year on a broken machine is a Sunk Cost—ignore it when deciding whether to buy a new machine.',
      plainTruth:
        'High Operating Leverage (high fixed costs, low variable costs) means once you pass break-even, almost every extra sales dollar flows straight to operating profit ("Flow-Through").',
    },
    ledgerExample: {
      header: 'Cost-Volume-Profit (CVP) & Restaurant Prime Cost Ledger',
      rows: [
        { label: 'Guest Sales (2,000 covers × $25.00 Average Check)', amount: '$50,000.00', note: '100% of Revenue' },
        { label: 'Food & Beverage Cost ($14,000) + Direct Kitchen/Server Labor ($16,000)', amount: '-$30,000.00', note: 'Prime Cost = 60.0% of Sales (Target < 60–65%)' },
        { label: 'Contribution Margin ($50,000 Sales − $30,000 Variable Prime Cost)', amount: '$20,000.00', note: '40.0% Contribution Margin Ratio ($10/guest)' },
        { label: 'Fixed Occupancy & Overhead (Rent, Insurance, Salaried Admin)', amount: '-$15,000.00', note: 'Break-Even Point = $15,000 ÷ $10 = 1,500 guests' },
        { label: 'Operating Profit (500 guests above break-even × $10 CM)', amount: '$5,000.00', note: '10.0% Operating Margin' },
      ],
    },
    takeawayChecklist: [
      'COGS = Beginning Inventory + Purchases − Ending Inventory (valued via FIFO, LIFO, or Weighted Average).',
      'Activity-Based Costing (ABC) allocates overhead using real cost drivers (machine setups, inspections) instead of one blunt rate.',
      'Menu Engineering classifies items by Popularity (Volume) and Contribution Margin (Dollars): Stars, Plowhorses, Puzzles, and Dogs.',
    ],
    reference: {
      id: 'ref-level-7',
      sourceName: 'Principles of Managerial Accounting — Ch. 2, Ch. 3 & Ch. 5: Cost-Volume-Profit & Costing Systems',
      organization: 'OpenStax (Rice University)',
      sectionTitle: 'Prime Cost, Activity-Based Costing, Contribution Margin, Break-Even & Relevant Costs',
      url: 'https://openstax.org/details/books/principles-managerial-accounting',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'Contribution margin represents the amount of revenue remaining after deducting variable costs that contributes toward covering fixed costs and generating operating income.',
      furtherReadingTip:
        'In make-or-buy decisions, only compare avoidable future costs—never include unavoidable corporate overhead allocations or sunk costs.',
    },
  },
  {
    id: 'level-8-financial-analysis-roi-performance',
    rungNumber: 8,
    title: 'Level 8 — Financial Analysis, ROI, ROIC & Performance Management',
    subtitle:
      'ROI, ROA, ROE, ROIC, DuPont Analysis, EBITDA, Free Cash Flow, Cash Conversion Cycle, Liquidity/Solvency Ratios, and Variance Analysis',
    track: 'finance',
    difficulty: 'Intermediate',
    estimatedMinutes: 18,
    subtopics: [
      'Horizontal and vertical analysis',
      'Common-size financial statements',
      'Liquidity ratios',
      'Solvency and leverage ratios',
      'Profitability ratios',
      'Efficiency and turnover ratios',
      'Accounts receivable and payable aging',
      'Cash conversion cycle',
      'EBITDA and adjusted EBITDA',
      'Operating cash flow and free cash flow',
      'Return on assets and return on equity',
      'Return on invested capital',
      'DuPont analysis',
      'Budget-versus-actual analysis',
      'Price, volume, mix, and efficiency variances',
      'Financial dashboards and management reporting',
    ],
    memoVoiceNote:
      'Here is where we master ROI (Return on Investment), ROA, ROE, ROIC (Return on Invested Capital), and the famous 3-step DuPont Analysis! This level shows you whether a business is truly compounding wealth per dollar invested.',
    literalCoreRule:
      'ROI = (Net Gain from Investment ÷ Cost of Investment) × 100. ROA = Net Income ÷ Average Total Assets. ROE = Net Income ÷ Average Shareholders’ Equity. ROIC = NOPAT (Net Operating Profit After Tax) ÷ Invested Capital (Debt + Equity − Non-operating Cash). DuPont Analysis decomposes ROE into: Net Profit Margin × Asset Turnover × Equity Multiplier (Leverage).',
    applesToApplesBreakdown: {
      itemA:
        'ROI vs. ROIC & ROE (Apples): Spend $10,000 on a machine that generates $12,500 net return → ROI = ($2,500 ÷ $10,000) = 25%. ROIC measures after-tax operating return on all debt + equity capital invested in operations. ROE measures return only on shareholders’ equity (which can be artificially boosted by heavy debt).',
      itemB:
        'Cash Conversion Cycle & Free Cash Flow (Pears): CCC = DIO (Days Inventory Outstanding) + DSO (Days Sales Outstanding) − DPO (Days Payable Outstanding). Free Cash Flow (FCF) = Operating Cash Flow − Capital Expenditures (CapEx).',
      plainTruth:
        'Two companies can both have a 20% ROE, but DuPont Analysis reveals whether Company A earned it through high margins and fast asset turnover (healthy) or whether Company B earned it by piling on dangerous debt leverage.',
    },
    ledgerExample: {
      header: 'ROI, ROIC, DuPont Decomposition & Free Cash Flow Audit Sheet',
      rows: [
        { label: 'Project ROI: $30,000 Net Profit on $120,000 Investment', amount: '25.0% ROI', note: '($150k return − $120k cost) ÷ $120k cost' },
        { label: 'ROIC: $180,000 NOPAT ÷ $1,000,000 Invested Capital', amount: '18.0% ROIC', note: 'Beats 10% WACC → Creates true economic value' },
        { label: 'DuPont Step 1 (Net Margin): $150k Net Income ÷ $1,500k Sales', amount: '10.0%', note: 'Profitability per dollar of sales' },
        { label: 'DuPont Step 2 (Asset Turnover): $1,500k Sales ÷ $1,000k Assets', amount: '1.50x', note: 'ROA = 10.0% × 1.50x = 15.0% Return on Assets' },
        { label: 'DuPont Step 3 (Leverage): $1,000k Assets ÷ $500k Equity', amount: '2.00x', note: 'ROE = 10.0% × 1.50x × 2.00x = 30.0% Return on Equity' },
        { label: 'Free Cash Flow: $240k Operating Cash Flow − $60k CapEx', amount: '$180,000', note: 'Literal cash available for debt paydown or dividends' },
      ],
    },
    takeawayChecklist: [
      'Vertical (Common-Size) analysis expresses every Income Statement line as a % of Revenue and every Balance Sheet line as a % of Total Assets; Horizontal analysis measures period-over-period % growth.',
      'Cash Conversion Cycle (DIO + DSO − DPO) measures how many days a dollar is tied up in inventory and receivables before turning back into cash.',
      'Budget-vs-Actual (BvA) variance analysis decomposes revenue/cost differences into Price Variance, Volume Variance, Mix Variance, and Efficiency Variance.',
    ],
    reference: {
      id: 'ref-level-8',
      sourceName: 'Principles of Finance — Ch. 5 & Managerial Accounting Ch. 11: Financial Ratios, ROI, ROIC & DuPont Analysis',
      organization: 'OpenStax (Rice University)',
      sectionTitle: '5.2–5.5 Profitability Ratios, ROI, Return on Invested Capital, DuPont Identity & Free Cash Flow',
      url: 'https://openstax.org/details/books/principles-finance',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'The DuPont identity breaks Return on Equity into profit margin, total asset turnover, and the equity multiplier, isolating operating performance from financing leverage.',
      furtherReadingTip:
        'Compare ROIC against WACC (Level 11): when ROIC > WACC, every dollar reinvested in the business creates compounding value.',
    },
  },
];
