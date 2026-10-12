import {
  UserProfile,
  Portfolio,
  Transaction,
  Goal,
  Alert,
  DailySnapshot,
} from '../types';

export const DEMO_USER_INVESTOR: UserProfile = {
  uid: 'usr_bala_2026',
  name: 'Bala Subramaniam',
  email: 'balasubramaniamv2002@gmail.com',
  role: 'investor',
  baseCurrency: 'INR',
  theme: 'dark',
  emailVerified: true,
  createdAt: '2025-01-15T08:00:00Z',
  notificationSettings: {
    email: true,
    webPush: true,
    weeklyDigest: true,
    priceAlerts: true,
  },
};

export const DEMO_USER_ADMIN: UserProfile = {
  uid: 'usr_admin_001',
  name: 'NSE / BSE Admin',
  email: 'admin@vestoria.in',
  role: 'admin',
  baseCurrency: 'INR',
  theme: 'dark',
  emailVerified: true,
  createdAt: '2024-11-01T00:00:00Z',
  notificationSettings: {
    email: true,
    webPush: true,
    weeklyDigest: false,
    priceAlerts: false,
  },
};

export const DEMO_USER_GUEST: UserProfile = {
  uid: 'usr_guest_demo',
  name: 'Guest Explorer',
  email: 'guest@vestoria.in',
  role: 'guest',
  baseCurrency: 'INR',
  theme: 'dark',
  emailVerified: false,
  createdAt: '2026-10-11T00:00:00Z',
  notificationSettings: {
    email: false,
    webPush: false,
    weeklyDigest: false,
    priceAlerts: false,
  },
};

// Clean initial state: 1 default portfolio, 0 transactions, 0 initial value!
export const INITIAL_PORTFOLIOS: Portfolio[] = [
  {
    id: 'port_main',
    userId: 'usr_default',
    name: 'Primary Portfolio',
    description: 'Main Indian Equity & Asset Portfolio',
    archived: false,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_GOALS: Goal[] = [];

export const INITIAL_ALERTS: Alert[] = [];

// Sample Demo Data (Loaded only when user explicitly chooses "Explore Demo Mode")
export const SAMPLE_DEMO_PORTFOLIOS: Portfolio[] = [
  {
    id: 'port_nifty_core',
    userId: 'usr_bala_2026',
    name: 'Core Wealth: Nifty 50 & Bluechips',
    description: 'Long-term index compounding, banking moats & Indian conglomerates',
    archived: false,
    createdAt: '2025-01-15T09:00:00Z',
  },
  {
    id: 'port_growth_alpha',
    userId: 'usr_bala_2026',
    name: 'High Alpha: Defense, Retail & Tech',
    description: 'Indigenous manufacturing, defense PSU, quick-commerce & smallcap',
    archived: false,
    createdAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'port_safe_haven',
    userId: 'usr_bala_2026',
    name: 'Safe Haven: SGB, Gold, FDs & Property',
    description: 'Sovereign Gold Bonds, bank fixed deposits, REIT yields & real estate',
    archived: false,
    createdAt: '2025-03-10T14:00:00Z',
  },
];

export const SAMPLE_DEMO_TRANSACTIONS: Transaction[] = [
  // Core Portfolio (Nifty 50 & Bluechips)
  {
    id: 'tx_1',
    portfolioId: 'port_nifty_core',
    assetId: 'NIFTYBEES',
    type: 'buy',
    date: '2025-02-10',
    quantity: 2500,
    price: 248.5,
    fees: 50.0,
    currency: 'INR',
    notes: 'Monthly SIP indexing into Nifty 50',
  },
  {
    id: 'tx_2',
    portfolioId: 'port_nifty_core',
    assetId: 'RELIANCE',
    type: 'buy',
    date: '2025-03-15',
    quantity: 180,
    price: 2680.0,
    fees: 120.0,
    currency: 'INR',
    notes: 'Energy & Retail leader position',
  },
  {
    id: 'tx_3',
    portfolioId: 'port_nifty_core',
    assetId: 'HDFCBANK',
    type: 'buy',
    date: '2025-04-20',
    quantity: 350,
    price: 1510.0,
    fees: 85.0,
    currency: 'INR',
    notes: 'Long-term banking accumulator tranche',
  },
  {
    id: 'tx_4',
    portfolioId: 'port_nifty_core',
    assetId: 'TCS',
    type: 'buy',
    date: '2025-05-10',
    quantity: 120,
    price: 3820.0,
    fees: 95.0,
    currency: 'INR',
    notes: 'Enterprise tech cash-cow compounder',
  },
  {
    id: 'tx_5',
    portfolioId: 'port_nifty_core',
    assetId: 'PPFAS-FLEXI',
    type: 'buy',
    date: '2025-06-05',
    quantity: 4500,
    price: 68.4,
    fees: 0,
    currency: 'INR',
    notes: 'Parag Parikh Flexi Cap Direct Mutual Fund SIP',
  },
  {
    id: 'tx_6',
    portfolioId: 'port_nifty_core',
    assetId: 'RELIANCE',
    type: 'dividend',
    date: '2025-08-25',
    quantity: 180,
    price: 10.0,
    fees: 0,
    currency: 'INR',
    notes: 'Annual equity cash dividend credited',
  },

  // Growth & High Alpha
  {
    id: 'tx_7',
    portfolioId: 'port_growth_alpha',
    assetId: 'HAL',
    type: 'buy',
    date: '2025-03-01',
    quantity: 150,
    price: 3850.0,
    fees: 110.0,
    currency: 'INR',
    notes: 'Defence orders & LCA Tejas growth allocation',
  },
  {
    id: 'tx_8',
    portfolioId: 'port_growth_alpha',
    assetId: 'TRENT',
    type: 'buy',
    date: '2025-04-12',
    quantity: 80,
    price: 6420.0,
    fees: 125.0,
    currency: 'INR',
    notes: 'Zudio & Westside retail hyper-expansion',
  },
  {
    id: 'tx_9',
    portfolioId: 'port_growth_alpha',
    assetId: 'ZOMATO',
    type: 'buy',
    date: '2025-05-18',
    quantity: 2500,
    price: 212.0,
    fees: 60.0,
    currency: 'INR',
    notes: 'Quick-commerce Blinkit monetization thesis',
  },
  {
    id: 'tx_10',
    portfolioId: 'port_growth_alpha',
    assetId: 'QUANT-SMALL',
    type: 'buy',
    date: '2025-06-22',
    quantity: 1200,
    price: 228.0,
    fees: 0,
    currency: 'INR',
    notes: 'Small-cap aggressive high alpha direct fund',
  },

  // Safe Haven & Income
  {
    id: 'tx_11',
    portfolioId: 'port_safe_haven',
    assetId: 'SGB-2024',
    type: 'buy',
    date: '2025-01-20',
    quantity: 80,
    price: 6850.0,
    fees: 0,
    currency: 'INR',
    notes: 'RBI Sovereign Gold Bond issue (tax-free gains)',
  },
  {
    id: 'tx_12',
    portfolioId: 'port_safe_haven',
    assetId: 'SBI-FD-1Y',
    type: 'buy',
    date: '2025-02-01',
    quantity: 5,
    price: 100000.0,
    fees: 0,
    currency: 'INR',
    notes: 'SBI Cumulative Fixed Deposit 6.80% p.a.',
  },
  {
    id: 'tx_13',
    portfolioId: 'port_safe_haven',
    assetId: 'EMBASSY',
    type: 'buy',
    date: '2025-03-05',
    quantity: 1200,
    price: 362.0,
    fees: 45.0,
    currency: 'INR',
    notes: 'Commercial Grade-A IT Parks REIT yield',
  },
  {
    id: 'tx_14',
    portfolioId: 'port_safe_haven',
    assetId: 'EMBASSY',
    type: 'dividend',
    date: '2025-06-15',
    quantity: 1200,
    price: 5.6,
    fees: 0,
    currency: 'INR',
    notes: 'Quarterly REIT distribution payout',
  },
  {
    id: 'tx_15',
    portfolioId: 'port_safe_haven',
    assetId: 'INR-CASH',
    type: 'deposit',
    date: '2025-01-01',
    quantity: 1,
    price: 250000.0,
    fees: 0,
    currency: 'INR',
    notes: 'Emergency liquidity fund in Indian bank',
  },
];

export const SAMPLE_DEMO_GOALS: Goal[] = [
  {
    id: 'goal_1',
    userId: 'usr_bala_2026',
    name: 'Financial Independence (1 Crore Corpus)',
    targetAmount: 10000000,
    targetDate: '2028-12-31',
    portfolioIds: [],
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'goal_2',
    userId: 'usr_bala_2026',
    name: 'Bengaluru Property Down Payment',
    targetAmount: 3000000,
    targetDate: '2026-06-30',
    portfolioIds: ['port_safe_haven'],
    createdAt: '2025-02-01T00:00:00Z',
  },
];

export const SAMPLE_DEMO_ALERTS: Alert[] = [
  {
    id: 'alert_1',
    userId: 'usr_bala_2026',
    assetId: 'RELIANCE',
    condition: 'above',
    threshold: 3050,
    channel: 'push',
    active: true,
    createdAt: '2025-06-01T00:00:00Z',
  },
  {
    id: 'alert_2',
    userId: 'usr_bala_2026',
    assetId: 'HDFCBANK',
    condition: 'below',
    threshold: 1600,
    channel: 'email',
    active: true,
    createdAt: '2025-07-01T00:00:00Z',
  },
];

// Generate daily snapshots for historical chart
export function generateHistoricalSnapshots(
  currentTotal: number,
  currentInvested: number
): DailySnapshot[] {
  if (currentTotal === 0 && currentInvested === 0) {
    return [];
  }

  const snapshots: DailySnapshot[] = [];
  const days = 365;
  const now = new Date('2026-10-11T00:00:00Z');

  const startValue = currentTotal * 0.74;
  const startInvested = currentInvested * 0.8;

  for (let i = days; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const progress = (days - i) / days;

    const trend = startValue + (currentTotal - startValue) * progress;
    const wave = Math.sin(progress * Math.PI * 4.5) * (currentTotal * 0.032);
    const microJitter = ((Math.sin(i * 1.7) * 0.5) + (Math.cos(i * 2.3) * 0.5)) * (currentTotal * 0.01);

    const val = i === 0 ? currentTotal : Math.round(trend + wave + microJitter);
    const inv = Math.round(startInvested + (currentInvested - startInvested) * progress);

    snapshots.push({
      date: d.toISOString().split('T')[0],
      totalValue: val,
      invested: inv,
      pnl: val - inv,
    });
  }

  return snapshots;
}
