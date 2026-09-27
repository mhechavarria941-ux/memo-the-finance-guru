import { LadderNode } from './curriculumData';

export const LEVELS_9_TO_16: LadderNode[] = [
  {
    id: 'level-9-market-research-competitive-analysis',
    rungNumber: 9,
    title: 'Level 9 — Market Research and Competitive Analysis',
    subtitle:
      'Primary/secondary research, sampling, TAM/SAM/SOM market sizing, price elasticity, CAC/LTV, and SWOT/PESTLE/Porter’s Five Forces',
    track: 'markets',
    difficulty: 'Intermediate',
    estimatedMinutes: 16,
    subtopics: [
      'Research objectives and hypothesis development',
      'Primary and secondary research',
      'Qualitative and quantitative research',
      'Survey design and customer interviews',
      'Sampling methods and sampling bias',
      'Descriptive statistics and data visualization',
      'Customer segmentation',
      'Customer needs and purchasing behavior',
      'Market sizing: TAM, SAM, and SOM',
      'Industry structure and competitive mapping',
      'Competitor benchmarking',
      'Pricing research and willingness to pay',
      'Price elasticity of demand',
      'Market share analysis',
      'Seasonality and market trends',
      'Location, demographic, and trade-area analysis',
      'Customer acquisition, retention, and lifetime value',
      'SWOT, PESTLE, and Porter’s Five Forces',
    ],
    memoVoiceNote:
      'Before launching a product or projecting revenue, how big is the actual market (TAM, SAM, SOM)? How sensitive are buyers to price changes (Elasticity), and does Customer Lifetime Value (LTV) beat Customer Acquisition Cost (CAC)?',
    literalCoreRule:
      'TAM (Total Addressable Market) = total global demand if you owned 100%. SAM (Serviceable Available Market) = the segment within your geographic/product reach. SOM (Serviceable Obtainable Market) = realistic near-term market share you can capture. Price Elasticity of Demand = (% Change in Quantity Demanded) ÷ (% Change in Price). LTV = (Average Order Value × Gross Margin % × Purchase Frequency) ÷ Churn Rate.',
    applesToApplesBreakdown: {
      itemA:
        'TAM vs. SAM vs. SOM (Apples): US Coffee Market = $90B (TAM). Specialty Cold Brew in California = $1.2B (SAM). Your Year-1 regional grocery rollout = $6M (SOM).',
      itemB:
        'LTV vs. CAC & Price Elasticity (Pears): If it costs $50 in ads to acquire a customer (CAC) and that customer generates $250 in gross profit over their retention life (LTV), your LTV:CAC ratio is 5.0x. If a 10% price hike causes a 20% drop in units sold, Elasticity = −2.0 (Elastic).',
      plainTruth:
        'Never build a financial forecast on "1% of a $100 billion TAM"—build bottom-up from trade-area demographics, willingness to pay, and realistic SOM.',
    },
    ledgerExample: {
      header: 'Bottom-Up Market Sizing (TAM/SAM/SOM) & LTV:CAC Cohort Sheet',
      rows: [
        { label: 'TAM: Total US B2B Accounting Software Buyers (6M firms × $1,000/yr)', amount: '$6,000,000,000', note: '100% industry universe' },
        { label: 'SAM: Independent Cafes & Retail Shops (450,000 target firms)', amount: '$450,000,000', note: 'Segment our product serves' },
        { label: 'SOM: 2.0% Realistic 3-Year Capture (9,000 paying shops)', amount: '$9,000,000', note: 'Bottom-up annual recurring revenue target' },
        { label: 'Customer Acquisition Cost (Paid Search + Sales Demo)', amount: '$200.00 / user', note: 'Upfront marketing & sales cost per new customer' },
        { label: 'Customer Lifetime Value ($800/yr Gross Margin ÷ 20% Annual Churn)', amount: '$4,000.00 LTV', note: '20.0x LTV:CAC Ratio · 3-Month CAC Payback' },
      ],
    },
    takeawayChecklist: [
      'Primary research gathers original first-hand data (surveys, interviews); Secondary research analyzes published census, SEC, or industry data.',
      'Guard against Survivorship Bias and Selection Bias by using random or stratified sampling.',
      'Use SWOT (Strengths, Weaknesses, Opportunities, Threats), PESTLE (Macro environment), and Porter’s Five Forces to test competitive moats.',
    ],
    reference: {
      id: 'ref-level-9',
      sourceName: 'OpenStax Principles of Marketing & Principles of Microeconomics (Elasticity & Market Structure)',
      organization: 'OpenStax (Rice University)',
      sectionTitle: 'Ch. 5 Marketing Research, Ch. 5 Price Elasticity of Demand & Customer Lifetime Value',
      url: 'https://openstax.org/details/books/principles-marketing',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'Market research combines qualitative discovery and quantitative sampling to estimate addressable market size, price elasticity, and customer lifetime value.',
      furtherReadingTip:
        'A healthy subscription or repeat-purchase business typically targets an LTV:CAC ratio of at least 3:1.',
    },
  },
  {
    id: 'level-10-budgeting-forecasting-modeling',
    rungNumber: 10,
    title: 'Level 10 — Budgeting, Forecasting, and Financial Modeling',
    subtitle:
      'Operating/cash/CapEx budgets, driver-based & rolling forecasts, zero-based budgeting, integrated 3-statement models, and sensitivity analysis',
    track: 'finance',
    difficulty: 'Intermediate',
    estimatedMinutes: 18,
    subtopics: [
      'Operating budgets',
      'Cash budgets',
      'Capital expenditure budgets',
      'Headcount and payroll planning',
      'Revenue and expense forecasting',
      'Driver-based forecasting',
      'Rolling forecasts',
      'Zero-based budgeting',
      'Integrated three-statement models',
      'Working capital schedules',
      'Debt and interest schedules',
      'Fixed asset and depreciation schedules',
      'Scenario and sensitivity analysis',
      'Forecast accuracy and bias',
      'Regression and time-series forecasting',
      'Model controls, documentation, and validation',
    ],
    memoVoiceNote:
      'Level 10 turns you into a forward-looking financial modeler! Instead of guessing next year’s revenue by adding 5%, we build driver-based schedules (Price × Volume, Headcount, Working Capital Days, Debt Corkscrews) wired into a self-balancing 3-statement model.',
    literalCoreRule:
      'A dynamic Integrated Three-Statement Model links operational drivers (headcount, unit volume, pricing, DSO/DIO/DPO working capital schedules, CapEx/depreciation roll-forwards, and debt/interest schedules) so that changing any assumption automatically updates the Income Statement, Cash Flow Statement, and a balanced Balance Sheet.',
    applesToApplesBreakdown: {
      itemA:
        'Static Budget vs. Rolling Forecast & Zero-Based Budgeting (Apples): A static budget locks once a year; a Rolling Forecast continuously extends 12–18 months ahead each quarter. Zero-Based Budgeting (ZBB) requires every expense to be justified from $0 rather than copying last year’s spend.',
      itemB:
        'Working Capital & Debt Schedules (Pears): Forecast Accounts Receivable using DSO: Projected AR = (Projected Revenue ÷ 365) × DSO Days. Link the Debt Schedule ending balance to the Balance Sheet and its interest to the Income Statement.',
      plainTruth:
        'Every financial model must have a Balance Check row (Total Assets − Total Liabilities & Equity = $0.00) visible on every tab.',
    },
    ledgerExample: {
      header: 'Integrated 3-Statement Model — Driver & Schedule Corkscrew',
      rows: [
        { label: 'Revenue Driver: 12,000 Active Customers × $100 ARPU', amount: '$1,200,000', note: 'Driver-based top-line forecast' },
        { label: 'Headcount Schedule: 8 Engineers + 4 Sales Reps (Fully Burdened)', amount: '-$960,000', note: 'Base salary + payroll taxes + benefits' },
        { label: 'Working Capital Schedule: AR at 30 Days DSO ($1.2M × 30/365)', amount: '$98,630', note: 'Feeds Balance Sheet AR & Cash Flow change' },
        { label: 'PP&E Roll-Forward: Beg. Net PP&E ($200k) + CapEx ($50k) − Depr. ($30k)', amount: '$220,000', note: 'Ending Net PP&E on Balance Sheet' },
        { label: 'Balance Sheet Check (Assets − Liabilities − Equity)', amount: '$0.00', note: 'Automated model validation check = PASS' },
      ],
    },
    takeawayChecklist: [
      'Separate Inputs/Assumptions (blue font), Formulas/Calculations (black font), and Cross-Sheet Links (green font) for institutional model hygiene.',
      'Run Base Case, Upside Case, and Downside Case scenario toggles alongside two-way sensitivity tables.',
      'Check forecast accuracy using MAPE (Mean Absolute Percentage Error) and test for systematic optimism bias.',
    ],
    reference: {
      id: 'ref-level-10',
      sourceName: 'Principles of Managerial Accounting — Ch. 7 Budgeting & Principles of Finance Ch. 18 Forecasting',
      organization: 'OpenStax (Rice University)',
      sectionTitle: 'Master Operating Budgets, Cash Budgets, Pro Forma Statements & Sensitivity Modeling',
      url: 'https://openstax.org/details/books/principles-finance',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'Financial forecasting integrates sales projections, operating schedules, capital expenditure plans, and cash budgets into pro forma three-statement models.',
      furtherReadingTip:
        'Never use a "plug" to force a Balance Sheet to balance—if it is off, trace the missing cash flow link in Working Capital, PP&E, Debt, or Retained Earnings.',
    },
  },
  {
    id: 'level-11-corporate-finance-fundamentals',
    rungNumber: 11,
    title: 'Level 11 — Corporate Finance Fundamentals',
    subtitle:
      'Time value of money, PV/FV, annuities/perpetuities, NPV, IRR, payback period, capital budgeting, cost of debt/equity, WACC, and capital structure',
    track: 'finance',
    difficulty: 'Intermediate',
    estimatedMinutes: 18,
    subtopics: [
      'Time value of money',
      'Present value and future value',
      'Discount rates',
      'Annuities and perpetuities',
      'Net present value',
      'Internal rate of return',
      'Payback and discounted payback periods',
      'Incremental cash flow analysis',
      'Capital budgeting',
      'Cost of debt and cost of equity',
      'Weighted average cost of capital',
      'Capital structure',
      'Debt versus equity financing',
      'Dividend and share repurchase policies',
      'Liquidity management and treasury operations',
      'Sustainable growth and financing needs',
    ],
    memoVoiceNote:
      'A dollar received today is worth more than a dollar received five years from now! Level 11 teaches you how to discount future cash flows using WACC, calculate NPV and IRR, and balance Debt vs. Equity capital structure.',
    literalCoreRule:
      'Present Value (PV) = Future Cash Flow ÷ (1 + r)^t. Net Present Value (NPV) = Sum of Present Values of future cash inflows minus Initial Upfront Investment. Internal Rate of Return (IRR) is the discount rate where NPV = $0. WACC = (E/V × Cost of Equity) + (D/V × Cost of Debt × (1 − Tax Rate)). Accept projects when NPV > $0 and IRR > WACC.',
    applesToApplesBreakdown: {
      itemA:
        'NPV vs. IRR & Payback Period (Apples): Spend $100,000 today to earn $45,000/yr for 3 years at a 10% WACC. PV of inflows = $111,908 → NPV = +$11,908 (Accept!). IRR = 16.6% (beats 10% WACC). Simple Payback = 2.22 years.',
      itemB:
        'Cost of Debt vs. Cost of Equity in WACC (Pears): Debt interest is tax-deductible, so After-Tax Cost of Debt = Pre-Tax Yield × (1 − Tax Rate). Equity dividends are not tax-deductible, and equity holders sit behind lenders, so Cost of Equity is higher.',
      plainTruth:
        'When evaluating mutually exclusive projects of different sizes, always trust NPV over IRR—you pay bills with literal dollars of value created (NPV), not percentages.',
    },
    ledgerExample: {
      header: 'Capital Budgeting Audit — WACC, NPV, IRR & Incremental Cash Flows',
      rows: [
        { label: 'WACC Calculation: 70% Equity (at 12%) + 30% Debt (at 6% × (1 − 25% tax))', amount: '9.75% WACC', note: '8.40% weighted equity + 1.35% after-tax weighted debt' },
        { label: 'Year 0 Initial Capital Outlay (Equipment + Working Capital)', amount: '-$100,000.00', note: 'Upfront cash outflow today' },
        { label: 'Year 1–3 Incremental Free Cash Flows ($45,000/yr discounted at 9.75%)', amount: '+$112,415.00', note: 'Present Value of 3-year cash inflows' },
        { label: 'Net Present Value (PV of Inflows − Upfront Cost)', amount: '+$12,415.00', note: 'NPV > $0 · Immediate shareholder value created' },
        { label: 'Internal Rate of Return (IRR) vs. 9.75% Hurdle Rate', amount: '16.65% IRR', note: 'Exceeds WACC hurdle by +690 bps' },
      ],
    },
    takeawayChecklist: [
      'Perpetuity PV = Cash Flow ÷ r; Growing Perpetuity PV = CF₁ ÷ (r − g).',
      'In Incremental Cash Flow analysis, include opportunity costs and cannibalization, but exclude sunk costs and financing interest (already in WACC).',
      'Sustainable Growth Rate (SGR) = ROE × Retention Ratio (1 − Dividend Payout Ratio).',
    ],
    reference: {
      id: 'ref-level-11',
      sourceName: 'Principles of Finance — Ch. 7–9 Time Value of Money & Ch. 16–17 Capital Budgeting & WACC',
      organization: 'OpenStax (Rice University) / MIT OCW 15.401',
      sectionTitle: 'Present Value, NPV, IRR, WACC, Modigliani-Miller Capital Structure & Payout Policy',
      url: 'https://openstax.org/details/books/principles-finance',
      licenseOrApi: 'CC-BY 4.0 OpenStax OER API',
      literalExcerpt:
        'Net present value discounts all incremental future cash flows back to the present using the firm’s weighted average cost of capital (WACC).',
      furtherReadingTip:
        'Remember why we multiply Cost of Debt by (1 − Tax Rate) in WACC: interest expense reduces taxable income, creating a tax shield.',
    },
  },
  {
    id: 'level-12-financial-markets-investment-analysis',
    rungNumber: 12,
    title: 'Level 12 — Financial Markets and Investment Analysis',
    subtitle:
      'Primary/secondary markets, stocks/bonds/ETFs, bond pricing & yield curves, credit spreads, Beta & CAPM, diversification, macro policy, FX & derivatives',
    track: 'markets',
    difficulty: 'Intermediate',
    estimatedMinutes: 17,
    subtopics: [
      'Financial institutions and market participants',
      'Primary and secondary markets',
      'Money markets and capital markets',
      'Stocks, bonds, funds, and exchange-traded funds',
      'Bond pricing and yields',
      'Interest rates and yield curves',
      'Credit ratings and credit spreads',
      'Risk and return',
      'Diversification and correlation',
      'Portfolio construction',
      'Beta and the capital asset pricing model',
      'Market efficiency and behavioral finance',
      'Inflation, monetary policy, and fiscal policy',
      'Economic indicators and business cycles',
      'Foreign exchange markets',
      'Futures, forwards, options, and swaps',
    ],
    memoVoiceNote:
      'How do central banks, yield curves, credit spreads, CAPM Beta, and derivatives actually move asset prices? Let us connect macroeconomics to stock, bond, FX, and option markets.',
    literalCoreRule:
      'Bond prices and market interest rates move in opposite directions (seesaw). CAPM Cost of Equity = Risk-Free Rate + Beta × (Expected Market Return − Risk-Free Rate). Diversification eliminates idiosyncratic (company-specific) risk when combining assets with low correlation, leaving only systematic market risk (Beta).',
    applesToApplesBreakdown: {
      itemA:
        'Primary vs. Secondary Markets & Money vs. Capital Markets (Apples): Primary market = company issues new shares/bonds for cash (IPO). Secondary market = investors trade existing shares (NYSE/Nasdaq). Money markets trade <1-year debt (T-bills); Capital markets trade long-term debt and equities.',
      itemB:
        'Forwards/Futures vs. Options & Swaps (Pears): A Forward or Future locks in a mandatory buy/sell price on a future date. An Option gives the buyer the RIGHT, but not the obligation, to buy (Call) or sell (Put) at a strike price.',
      plainTruth:
        'Credit Spread = Corporate Bond Yield − Risk-Free Treasury Yield of the same maturity. When recession fears rise, credit spreads widen.',
    },
    ledgerExample: {
      header: 'Bond Pricing, Credit Spread & CAPM Portfolio Return Table',
      rows: [
        { label: '10-Year US Treasury Yield (Risk-Free Rate R_f)', amount: '4.20%', note: 'Baseline sovereign benchmark yield' },
        { label: 'BBB Corporate Bond Yield (+180 bps Credit Spread)', amount: '6.00% YTM', note: '4.20% Treasury + 1.80% default/liquidity spread' },
        { label: 'CAPM Expected Return (Beta = 1.25, Market Risk Premium = 5.0%)', amount: '10.45%', note: '4.20% + 1.25 × 5.0% = 10.45% Cost of Equity' },
        { label: '5% Coupon Bond ($1,000 par) when Market Yields rise to 6%', amount: '$926.40', note: 'Trades at a Discount (<$1,000) because 5% < 6%' },
      ],
    },
    takeawayChecklist: [
      'A normal Yield Curve slopes upward (long-term rates > short-term rates); an inverted yield curve (2Y > 10Y) often signals incoming rate cuts or recession.',
      'Monetary Policy (Federal Reserve open market operations, fed funds rate) controls money supply and rates; Fiscal Policy (Congress taxing and spending) drives government deficits.',
      'Behavioral finance studies cognitive biases (loss aversion, anchoring, herding) that cause market prices to deviate from intrinsic value.',
    ],
    reference: {
      id: 'ref-level-12',
      sourceName: 'Federal Reserve FRED Curriculum & OpenStax Principles of Finance Ch. 10–15',
      organization: 'Federal Reserve Bank of St. Louis / OpenStax',
      sectionTitle: 'Bond Valuation, Yield Curves, CAPM, Portfolio Diversification, Monetary Policy & Derivatives',
      url: 'https://fred.stlouisfed.org/',
      licenseOrApi: 'FRED Public Domain & CC-BY 4.0',
      literalExcerpt:
        'The Capital Asset Pricing Model (CAPM) prices an asset’s required return based on the risk-free rate plus a premium proportional to its systematic risk (Beta).',
      furtherReadingTip:
        'Duration measures a bond’s price sensitivity to a 1% change in interest rates: if Duration is 7 years and rates rise 1%, the bond price drops ~7%.',
    },
  },
  {
    id: 'level-13-valuation-investment-decisions',
    rungNumber: 13,
    title: 'Level 13 — Valuation and Investment Decisions',
    subtitle:
      'Enterprise Value vs. Equity Value, DCF (FCFF & FCFE), terminal value, trading comps, precedent transactions, multiples, DDM, and startup valuation',
    track: 'finance',
    difficulty: 'Advanced Scenario',
    estimatedMinutes: 20,
    subtopics: [
      'Enterprise value versus equity value',
      'Discounted cash flow valuation',
      'Free cash flow to the firm',
      'Free cash flow to equity',
      'Terminal value',
      'Comparable-company analysis',
      'Precedent-transaction analysis',
      'Valuation multiples',
      'Dividend discount models',
      'Asset-based valuation',
      'Normalized earnings and cash flows',
      'Private-company valuation',
      'Startup valuation',
      'Valuation sensitivity and scenario analysis',
      'Investment theses and investment memoranda',
      'Valuation reconciliation and judgment',
    ],
    memoVoiceNote:
      'What is an entire business actually worth? In Level 13 we bridge Equity Value (Market Cap) to Enterprise Value (EV), build a full Discounted Cash Flow (DCF) with Terminal Value, and triangulate it against Trading Comps and Precedent M&A Multiples.',
    literalCoreRule:
      'Enterprise Value (EV) = Equity Value (Market Cap) + Total Debt + Preferred Stock + Noncontrolling Interest − Cash & Equivalents. Unlevered DCF discounts Free Cash Flow to the Firm (FCFF) at WACC to yield Enterprise Value; then subtract Net Debt to get Implied Equity Value and Implied Share Price.',
    applesToApplesBreakdown: {
      itemA:
        'Enterprise Value vs. Equity Value Multiples (Apples): Always match numerator and denominator! EV pairs with pre-debt metrics (EV/Revenue, EV/EBITDA, EV/EBIT) because EV belongs to both debt and equity holders. Equity Value pairs with post-debt metrics (P/E Ratio = Price ÷ EPS).',
      itemB:
        'Intrinsic Valuation (DCF) vs. Relative Valuation (Comps & Precedents) (Pears): DCF values a company based on its own projected cash flows and Terminal Value. Trading Comps value it based on current public peer multiples; Precedent Transactions include control/acquisition premiums.',
      plainTruth:
        'Never use an Equity Value / EBITDA multiple—EBITDA is earned before paying interest to lenders, so the numerator must include Debt (Enterprise Value).',
    },
    ledgerExample: {
      header: 'DCF Valuation & Enterprise-to-Equity Value Bridge ($ Millions)',
      rows: [
        { label: 'PV of Year 1–5 Unlevered Free Cash Flows (FCFF @ 9.5% WACC)', amount: '$320.0M', note: 'Explicit 5-year forecast period' },
        { label: 'PV of Terminal Value (Gordon Growth @ 2.5% perpetual growth)', amount: '$680.0M', note: 'Terminal CF ÷ (WACC − g), discounted to today' },
        { label: 'Implied Enterprise Value (EV = PV of FCFF + PV of Terminal Value)', amount: '$1,000.0M', note: 'Equals 10.0x Forward EBITDA ($100M)' },
        { label: 'Less: Total Debt (-$250.0M) · Plus: Cash & Equivalents (+$50.0M)', amount: '-$200.0M', note: 'Subtract Net Debt ($200M) to bridge EV to Equity' },
        { label: 'Implied Equity Value (÷ 40M diluted shares = $20.00 / share)', amount: '$800.0M', note: 'Intrinsic equity valuation for shareholders' },
      ],
    },
    takeawayChecklist: [
      'FCFF (Unlevered FCF) = EBIT × (1 − Tax Rate) + D&A − CapEx − Increase in Net Working Capital.',
      'Terminal Value is calculated using either the Perpetuity Growth Method [FCFFₙ × (1+g) ÷ (WACC − g)] or the Exit Multiple Method [Terminal EBITDA × Multiple].',
      'Summarize valuation ranges across DCF, Trading Comps, Precedent Transactions, and Asset-Based methods in a "Football Field" chart inside your Investment Memo.',
    ],
    reference: {
      id: 'ref-level-13',
      sourceName: 'MIT OpenCourseWare 15.401 & OpenStax Principles of Finance Ch. 11: Equity & Corporate Valuation',
      organization: 'MIT Sloan School of Management / OpenStax',
      sectionTitle: 'Enterprise Value, DCF Modeling, FCFF vs. FCFE, Multiples & Valuation Triangulation',
      url: 'https://ocw.mit.edu/',
      licenseOrApi: 'CC BY-NC-SA 4.0 / CC-BY 4.0',
      literalExcerpt:
        'Enterprise value represents the value of core operating assets to all capital providers, bridged to equity value by subtracting debt and adding cash.',
      furtherReadingTip:
        'Always normalize historical EBITDA for one-time non-recurring litigation, restructuring, or owner personal expenses before applying a valuation multiple.',
    },
  },
  {
    id: 'level-14-advanced-accounting-tax-controls',
    rungNumber: 14,
    title: 'Level 14 — Advanced Accounting, Tax, and Controls',
    subtitle:
      'GAAP vs. IFRS, ASC 606 revenue, ASC 842 leases, deferred tax assets/liabilities, impairment, SBC, diluted EPS, consolidations, goodwill, and forensic audit',
    track: 'accounting',
    difficulty: 'Advanced Scenario',
    estimatedMinutes: 20,
    subtopics: [
      'GAAP and IFRS differences',
      'Complex revenue recognition',
      'Lease accounting',
      'Deferred tax assets and liabilities',
      'Temporary and permanent tax differences',
      'Inventory and asset impairment',
      'Provisions and contingent liabilities',
      'Stock-based compensation',
      'Earnings per share and dilution',
      'Intercompany accounting and eliminations',
      'Consolidated financial statements',
      'Foreign currency translation',
      'Business combination accounting',
      'Goodwill and intangible assets',
      'Financial instruments and hedge accounting',
      'Internal controls and segregation of duties',
      'Audit procedures and materiality',
      'Fraud detection and forensic accounting',
    ],
    memoVoiceNote:
      'Welcome to senior controller and SEC filing mastery! Here we unpack ASC 606 5-step revenue recognition, ASC 842 lease ROU assets, Deferred Tax Assets vs. Liabilities, Stock-Based Compensation, Diluted EPS, Intercompany Eliminations, and Goodwill Impairment.',
    literalCoreRule:
      'Temporary differences between GAAP book accounting and IRS tax returns create Deferred Tax Assets (DTA, when Tax > Book income today) or Deferred Tax Liabilities (DTL, such as accelerated tax depreciation). In Consolidations (>50% ownership), combine 100% of parent and subsidiary lines, eliminate 100% of intercompany sales/receivables, and break out Noncontrolling Interest (NCI).',
    applesToApplesBreakdown: {
      itemA:
        'Deferred Tax Liability vs. Deferred Tax Asset (Apples): Using accelerated MACRS depreciation on the tax return lowers taxes today but creates a Deferred Tax Liability (future taxes owed). Booking a warranty reserve or bad-debt allowance before cash is spent creates a Deferred Tax Asset (future tax deduction).',
      itemB:
        'Basic vs. Diluted EPS & Lease Accounting (Pears): Diluted EPS uses the Treasury Stock Method to include in-the-money options and RSUs. Under ASC 842 / IFRS 16, operating leases >12 months must be capitalized on the Balance Sheet as a Right-of-Use (ROU) Asset and a Lease Liability.',
      plainTruth:
        'Goodwill is only created in an acquisition (Purchase Price minus Fair Value of Identifiable Net Assets) and is tested annually for Impairment—never amortized under public GAAP.',
    },
    ledgerExample: {
      header: 'Advanced GAAP/IFRS Audit — Leases, Deferred Taxes, Diluted EPS & Consolidation',
      rows: [
        { label: 'ASC 842 Operating Lease Capitalization (PV of lease payments)', amount: 'Dr ROU Asset $500k / Cr Lease Liab $500k', note: 'Brings multi-year store lease onto Balance Sheet' },
        { label: 'Deferred Tax Liability: $100k extra tax depreciation × 25% rate', amount: 'Cr Deferred Tax Liab. $25,000', note: 'Temporary book-vs-tax timing difference' },
        { label: 'Intercompany Elimination: Parent sold $80k inventory to Subsidiary', amount: 'Dr IC Sales $80k / Cr IC COGS $80k', note: 'Prevents double-counting revenue in consolidation' },
        { label: 'Diluted Shares (Treasury Stock Method: 10M basic + net option shares)', amount: '10.40M Diluted Shares', note: 'Option proceeds assumed to repurchase shares at market price' },
      ],
    },
    takeawayChecklist: [
      'US GAAP permits LIFO inventory and prohibits upward fixed-asset revaluation; IFRS prohibits LIFO and allows revaluation.',
      'Segregation of Duties separates 1) Authorization, 2) Custody of Assets, and 3) Recording/Reconciliation so no single person can perpetrate and conceal fraud.',
      'Contingent Liabilities (like lawsuits) are accrued on the Balance Sheet only when a loss is BOTH Probable and Reasonably Estimable.',
    ],
    reference: {
      id: 'ref-level-14',
      sourceName: 'SEC EDGAR Reporting Manual & OpenStax Advanced Accounting Topics',
      organization: 'U.S. Securities and Exchange Commission / FASB ASC',
      sectionTitle: 'ASC 606 Revenue, ASC 842 Leases, ASC 740 Income Taxes, ASC 805 Business Combinations & SOX Controls',
      url: 'https://www.sec.gov/edgar/searchedgar/companysearch',
      licenseOrApi: 'Public Domain (SEC)',
      literalExcerpt:
        'Consolidated financial statements present the financial position and results of operations for a parent and its subsidiaries as if they were a single economic entity, after eliminating intercompany balances.',
      furtherReadingTip:
        'Permanent tax differences (like municipal bond interest or non-deductible fines) change the Effective Tax Rate but never create a DTA or DTL.',
    },
  },
  {
    id: 'level-15-advanced-corporate-finance-transactions',
    rungNumber: 15,
    title: 'Level 15 — Advanced Corporate Finance and Transactions',
    subtitle:
      'M&A, quality of earnings (QoE), synergies, accretion/dilution, purchase price allocation, LBO modeling, PE/VC cap tables, IPOs, covenants, and restructuring',
    track: 'finance',
    difficulty: 'Advanced Scenario',
    estimatedMinutes: 22,
    subtopics: [
      'Mergers and acquisitions',
      'Financial due diligence',
      'Quality of earnings analysis',
      'Synergy assessment',
      'Accretion and dilution analysis',
      'Purchase price allocation',
      'Leveraged buyout modeling',
      'Private equity and venture capital',
      'Capitalization tables and ownership dilution',
      'Initial public offerings',
      'Debt covenants and credit agreements',
      'Refinancing and debt restructuring',
      'Debt versus equity financing in M&A',
      'Distressed-company analysis',
      'Corporate restructuring and divestitures',
      'Project finance',
      'Cross-border financing and acquisitions',
    ],
    memoVoiceNote:
      'In Level 15 we sit at the deal table: M&A Accretion/Dilution, Quality of Earnings (QoE) due diligence, Leveraged Buyout (LBO) returns, Venture Capital Cap Tables, Debt Covenants, and Distressed Restructuring!',
    literalCoreRule:
      'An acquisition is Accretive if Pro Forma Combined EPS > Acquirer Standalone EPS (and Dilutive if lower). In a Leveraged Buyout (LBO), a Private Equity sponsor buys a company using mostly Debt and a smaller Equity check; returns (MOIC and IRR) are driven by 1) EBITDA growth, 2) Debt paydown from free cash flow, and 3) Exit Multiple expansion.',
    applesToApplesBreakdown: {
      itemA:
        'LBO Value Creation Drivers (Apples): Buy a company for $500M (at 10x $50M EBITDA) using $350M Debt + $150M Sponsor Equity. Over 5 years, EBITDA grows to $75M and cash flow pays Debt down to $150M. Sell at 10x ($750M EV) → Exit Equity = $750M − $150M Debt = $600M (4.0x MOIC, ~32% IRR!).',
      itemB:
        'Cap Table Dilution & Debt Covenants (Pears): Raising $5M at a $20M Pre-Money Valuation gives Series A investors $5M ÷ $25M Post-Money = 20.0% ownership. Maintenance Covenants (e.g., Max Net Debt / EBITDA ≤ 4.0x) are tested every quarter.',
      plainTruth:
        'Before trusting a seller’s EBITDA in M&A, always run a Quality of Earnings (QoE) audit to strip out one-time windfalls, aggressive revenue pull-forwards, and working capital traps.',
    },
    ledgerExample: {
      header: 'LBO Sponsor Return & Purchase Price Allocation (PPA) Deal Sheet',
      rows: [
        { label: 'Entry Enterprise Value: $50M Normalized QoE EBITDA × 10.0x', amount: '$500.0M', note: 'Funded with $350M Senior/Sub Debt + $150M PE Equity' },
        { label: 'Purchase Price Allocation (PPA): Identifiable Net Assets ($320M)', amount: '$180.0M Goodwill', note: 'Excess purchase price after intangible write-ups & DTL' },
        { label: '5-Year De-leveraging: Cumulative Free Cash Flow Debt Paydown', amount: '-$200.0M Debt', note: 'Ending Debt reduced from $350M down to $150M' },
        { label: 'Exit Enterprise Value (Year 5): $75M EBITDA × 10.0x Exit Multiple', amount: '$750.0M', note: 'Minus $150M Remaining Debt = $600M Exit Equity' },
        { label: 'Sponsor Return: $600M Exit Equity ÷ $150M Initial Equity', amount: '4.00x MOIC · 32.0% IRR', note: 'Driven by $250M EBITDA growth + $200M debt paydown' },
      ],
    },
    takeawayChecklist: [
      'In an all-stock M&A deal, if the Acquirer’s P/E multiple is higher than the Target’s P/E multiple (before synergies), the deal is immediately Accretive.',
      'In Distressed Restructuring, seniority follows the Absolute Priority Rule: Senior Secured Debt → Senior Unsecured → Subordinated/Mezzanine → Preferred → Common Equity.',
      'Project Finance funds long-lived infrastructure (solar, toll roads) via a non-recourse Special Purpose Vehicle (SPV) backed by contracted cash flows and DSCR covenants.',
    ],
    reference: {
      id: 'ref-level-15',
      sourceName: 'SEC Mergers & Acquisitions Filings (S-4 / 8-K) & MIT OCW Corporate Finance Transactions',
      organization: 'U.S. Securities and Exchange Commission / MIT OCW',
      sectionTitle: 'M&A Accretion/Dilution, ASC 805 Purchase Price Allocation, LBO Modeling & Credit Covenants',
      url: 'https://ocw.mit.edu/',
      licenseOrApi: 'Public Domain & CC BY-NC-SA 4.0',
      literalExcerpt:
        'Leveraged buyouts combine financial leverage with operational cash flow generation to repay acquisition debt and amplify sponsor equity returns.',
      furtherReadingTip:
        'Always check the NWC (Net Working Capital) peg in an M&A purchase agreement so the seller cannot drain cash by delaying payables right before closing.',
    },
  },
  {
    id: 'level-16-strategic-finance-risk-advanced-markets',
    rungNumber: 16,
    title: 'Level 16 — Strategic Finance, Risk, and Advanced Market Study',
    subtitle:
      'Capital allocation, Economic Profit (EVA), Real Options, ERM, FX/rate hedging, stress testing, Monte Carlo simulation, econometrics, causal inference & board strategy',
    track: 'markets',
    difficulty: 'Advanced Scenario',
    estimatedMinutes: 24,
    subtopics: [
      'Corporate capital allocation',
      'Economic profit and value creation',
      'Real options analysis',
      'Enterprise risk management',
      'Credit, market, liquidity, and operational risk',
      'Interest rate and currency hedging',
      'Stress testing',
      'Monte Carlo simulation',
      'Advanced econometrics',
      'Causal inference and experimental design',
      'Demand modeling and conjoint analysis',
      'Competitive response modeling',
      'Market entry and expansion strategy',
      'Portfolio strategy across business units',
      'Corporate governance and executive incentives',
      'Strategic planning and board reporting',
    ],
    memoVoiceNote:
      'Hoo! You have reached the summit: Level 16! Here CFOs and Chief Strategy Officers allocate capital across business units, calculate Economic Profit (EVA), run Monte Carlo risk simulations, design causal A/B experiments and Conjoint pricing models, and report to the Board of Directors.',
    literalCoreRule:
      'Economic Profit (EVA) = Invested Capital × (ROIC − WACC), or NOPAT − (Invested Capital × WACC). A company can show positive accounting Net Income while destroying shareholder wealth if its ROIC is lower than its WACC. Strategic capital allocation directs free cash flow only toward organic projects, M&A, debt paydown, or buybacks where risk-adjusted return exceeds opportunity cost.',
    applesToApplesBreakdown: {
      itemA:
        'Accounting Profit vs. Economic Profit / EVA (Apples): Division A earns $8M NOPAT on $100M of Invested Capital (8% ROIC) when the firm’s WACC is 10%. Accounting profit is +$8M, but Capital Charge is $10M → Economic Profit = −$2M (Value Destruction!).',
      itemB:
        'Monte Carlo Simulation vs. Causal Inference & Conjoint Analysis (Pears): Monte Carlo runs 10,000+ probability distributions to quantify tail risk (VaR). Causal Inference (A/B experiments, Difference-in-Differences) isolates true cause-and-effect from correlation; Conjoint Analysis measures how customers trade off product features against price.',
      plainTruth:
        'Executive compensation tied only to revenue or raw EPS encourages empire-building; tying incentives to ROIC vs. WACC and multi-year Free Cash Flow per share aligns management with long-term owners.',
    },
    ledgerExample: {
      header: 'CFO Capital Allocation, Economic Profit (EVA) & Risk Stress-Test Matrix',
      rows: [
        { label: 'Core Software Unit: $40M NOPAT on $200M Capital (20% ROIC vs 10% WACC)', amount: '+$20.0M EVA', note: '$40M NOPAT − $20M Capital Charge = Compounding Star' },
        { label: 'Legacy Hardware Unit: $6M NOPAT on $100M Capital (6% ROIC vs 10% WACC)', amount: '-$4.0M EVA', note: '$6M NOPAT − $10M Capital Charge = Divest or Fix' },
        { label: 'FX & Rate Hedge: 5-Year Pay-Fixed Interest Rate Swap on $100M Floating Debt', amount: 'Locked at 4.50%', note: 'Eliminates SOFR interest rate spike tail risk' },
        { label: 'Monte Carlo 99% Value-at-Risk (10,000 Macro Stress Scenarios)', amount: '-$14.2M Max Loss', note: 'Liquidity buffer set at $25M to survive 99th-percentile shock' },
      ],
    },
    takeawayChecklist: [
      'The 5 levers of CEO/CFO Capital Allocation: 1) Organic Reinvestment (R&D/CapEx), 2) M&A, 3) Debt Paydown, 4) Dividends, 5) Share Repurchases (only when stock trades below intrinsic value).',
      'Real Options Analysis values management’s flexibility to Expand, Delay, or Abandon a staged project after seeing early clinical or market data.',
      'Use Difference-in-Differences, Instrumental Variables, or Randomized Controlled Trials (A/B tests) to prove whether a price change or marketing campaign truly caused incremental lift.',
    ],
    reference: {
      id: 'ref-level-16',
      sourceName: 'MIT OCW 15.402 Strategic Corporate Finance & Federal Reserve Stress Testing (CCAR) Frameworks',
      organization: 'MIT Sloan / Federal Reserve Board / OpenStax',
      sectionTitle: 'Economic Value Added (EVA), Capital Allocation, Real Options, Monte Carlo Risk & Causal Econometrics',
      url: 'https://ocw.mit.edu/',
      licenseOrApi: 'CC BY-NC-SA 4.0 / Public Domain',
      literalExcerpt:
        'Value is created only when the return on invested capital (ROIC) exceeds the opportunity cost of capital (WACC), generating positive economic profit.',
      furtherReadingTip:
        'In Board of Directors reporting, pair every strategic initiative with its required Invested Capital, expected ROIC spread over WACC, and downside stress-test trigger.',
    },
  },
];
