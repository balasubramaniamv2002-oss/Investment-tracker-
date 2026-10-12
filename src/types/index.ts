export type UserRole = 'investor' | 'admin' | 'guest';

export type AssetType =
  | 'stocks'
  | 'etfs'
  | 'mutual_funds'
  | 'crypto'
  | 'fixed_deposits'
  | 'gold'
  | 'real_estate'
  | 'cash';

export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'INR'
  | 'JPY'
  | 'CAD'
  | 'AUD'
  | 'SGD'
  | 'CHF';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  baseCurrency: CurrencyCode;
  theme: 'dark' | 'light';
  emailVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
  notificationSettings: {
    email: boolean;
    webPush: boolean;
    weeklyDigest: boolean;
    priceAlerts: boolean;
  };
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  currency: CurrencyCode;
  exchange: string;
  sector: string;
  isCustom?: boolean;
}

export interface PriceData {
  assetId: string;
  price: number;
  previousClose: number;
  dayChangePct: number;
  dayChangeAmount: number;
  updatedAt: string;
  isManual?: boolean;
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  description: string;
  archived: boolean;
  createdAt: string;
}

export type TransactionType =
  | 'buy'
  | 'sell'
  | 'dividend'
  | 'deposit'
  | 'withdrawal';

export interface Transaction {
  id: string;
  portfolioId: string;
  assetId: string;
  type: TransactionType;
  date: string;
  quantity: number;
  price: number;
  fees: number;
  currency: CurrencyCode;
  notes?: string;
}

export interface Holding {
  assetId: string;
  symbol: string;
  name: string;
  type: AssetType;
  currency: CurrencyCode;
  sector: string;
  quantity: number;
  avgCost: number;
  investedAmount: number;
  currentPrice: number;
  currentValue: number;
  unrealisedGain: number;
  unrealisedGainPct: number;
  dayGain: number;
  dayGainPct: number;
  realisedGain: number;
  dividendsTotal: number;
  feesTotal: number;
  allocationPct: number;
  isManual?: boolean;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  portfolioIds: string[]; // empty means all portfolios
  createdAt: string;
}

export type AlertCondition = 'above' | 'below' | 'change_up_pct' | 'change_down_pct';

export interface Alert {
  id: string;
  userId: string;
  assetId: string;
  condition: AlertCondition;
  threshold: number;
  channel: 'email' | 'push' | 'both';
  active: boolean;
  createdAt: string;
  triggeredAt?: string;
  lastTriggeredValue?: number;
}

export interface DailySnapshot {
  date: string;
  totalValue: number;
  invested: number;
  pnl: number;
}

export interface FeedbackSubmission {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  category: string;
  message: string;
  createdAt: string;
}
