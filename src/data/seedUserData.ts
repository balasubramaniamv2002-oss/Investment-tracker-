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

export const INITIAL_PORTFOLIOS: Portfolio[] = [
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

export const INITIAL_TRANSACTIONS: Transaction[] = [
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
    date: '2025-06-01',
    quantity: 4500,
    price: 72.4,
    fees: 0,
    currency: 'INR',
    notes: 'Direct mutual fund monthly SIP',
  },
  {
    id: 'tx_6',
    portfolioId: 'port_nifty_core',
    assetId: 'TCS',
    type: 'dividend',
    date: '2025-08-15',
    quantity: 0,
    price: 0,
    fees: 0,
    currency: 'INR',
    notes: 'Interim Cash Dividend received: ₹3,360 (credited to bank)',
  },

  // High Growth Portfolio
  {
    id: 'tx_7',
    portfolioId: 'port_growth_alpha',
    assetId: 'HAL',
    type: 'buy',
    date: '2025-01-20',
    quantity: 150,
    price: 3650.0,
    fees: 110.0,
    currency: 'INR',
    notes: 'Indigenous defence order book position',
  },
  {
    id: 'tx_8',
    portfolioId: 'port_growth_alpha',
    assetId: 'TRENT',
    type: 'buy',
    date: '2025-02-18',
    quantity: 80,
    price: 5920.0,
    fees: 95.0,
    currency: 'INR',
    notes: 'Retail & Zudio consumer growth story',
  },
  {
    id: 'tx_9',
    portfolioId: 'port_growth_alpha',
    assetId: 'ZOMATO',
    type: 'buy',
    date: '2025-03-22',
    quantity: 1800,
    price: 188.0,
    fees: 70.0,
    currency: 'INR',
    notes: 'Quick-commerce Blinkit expansion',
  },
  {
    id: 'tx_10',
    portfolioId: 'port_growth_alpha',
    assetId: 'QUANT-SMALL',
    type: 'buy',
    date: '2025-04-05',
    quantity: 2500,
    price: 232.0,
    fees: 0,
    currency: 'INR',
    notes: 'Small-cap mutual fund tranche',
  },
  {
    id: 'tx_11',
    portfolioId: 'port_growth_alpha',
    assetId: 'HAL',
    type: 'sell',
    date: '2025-09-12',
    quantity: 30,
    price: 4420.0,
    fees: 40.0,
    currency: 'INR',
    notes: 'Partial profit booking (+₹23,100 realised profit)',
  },

  // Safe Haven (SGB, Gold, FDs, Property)
  {
    id: 'tx_12',
    portfolioId: 'port_safe_haven',
    assetId: 'SGB-2024',
    type: 'buy',
    date: '2025-01-10',
    quantity: 80, // 80 grams
    price: 6650.0,
    fees: 0,
    currency: 'INR',
    notes: 'RBI Sovereign Gold Bond issue (tax-free gains)',
  },
  {
    id: 'tx_13',
    portfolioId: 'port_safe_haven',
    assetId: 'SBI-FD-1Y',
    type: 'deposit',
    date: '2025-02-01',
    quantity: 5,
    price: 100000.0, // ₹5,00,000 FD
    fees: 0,
    currency: 'INR',
    notes: 'State Bank of India 1-Year Fixed Deposit (6.80% p.a.)',
  },
  {
    id: 'tx_14',
    portfolioId: 'port_safe_haven',
    assetId: 'EMBASSY',
    type: 'buy',
    date: '2025-03-14',
    quantity: 1200,
    price: 348.0,
    fees: 80.0,
    currency: 'INR',
    notes: 'Commercial office quarterly distribution REIT',
  },
  {
    id: 'tx_15',
    portfolioId: 'port_safe_haven',
    assetId: 'INR-CASH',
    type: 'deposit',
    date: '2025-05-01',
    quantity: 450000,
    price: 1.0,
    fees: 0,
    currency: 'INR',
    notes: 'High-yield bank savings emergency buffer',
  },
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal_1',
    userId: 'usr_bala_2026',
    name: 'Milestone 1: ₹1.00 Crore Total Net Worth',
    targetAmount: 10000000, // 1 Crore INR
    targetDate: '2027-03-31',
    portfolioIds: [],
    createdAt: '2025-01-20T00:00:00Z',
  },
  {
    id: 'goal_2',
    userId: 'usr_bala_2026',
    name: 'Liquid Emergency Fund (₹15 Lakhs)',
    targetAmount: 1500000,
    targetDate: '2026-06-30',
    portfolioIds: ['port_safe_haven'],
    createdAt: '2025-02-10T00:00:00Z',
  },
  {
    id: 'goal_3',
    userId: 'usr_bala_2026',
    name: 'Financial Freedom & Early Retirement (₹3.50 Crore)',
    targetAmount: 35000000,
    targetDate: '2032-12-31',
    portfolioIds: [],
    createdAt: '2025-01-15T00:00:00Z',
  },
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alert_1',
    userId: 'usr_bala_2026',
    assetId: 'RELIANCE',
    condition: 'above',
    threshold: 3000,
    channel: 'both',
    active: true,
    createdAt: '2025-06-01T00:00:00Z',
  },
  {
    id: 'alert_2',
    userId: 'usr_bala_2026',
    assetId: 'NIFTYBEES',
    condition: 'below',
    threshold: 270,
    channel: 'push',
    active: true,
    createdAt: '2025-07-15T00:00:00Z',
  },
  {
    id: 'alert_3',
    userId: 'usr_bala_2026',
    assetId: 'HAL',
    condition: 'above',
    threshold: 4800,
    channel: 'email',
    active: true,
    createdAt: '2025-08-01T00:00:00Z',
  },
  {
    id: 'alert_4',
    userId: 'usr_bala_2026',
    assetId: 'SGB-2024',
    condition: 'above',
    threshold: 8000,
    channel: 'push',
    active: true,
    createdAt: '2025-09-01T00:00:00Z',
  },
];

// Generate daily snapshots for historical chart
export function generateHistoricalSnapshots(
  currentTotal: number,
  currentInvested: number
): DailySnapshot[] {
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
