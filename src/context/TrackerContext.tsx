import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  Portfolio,
  Transaction,
  Asset,
  PriceData,
  Goal,
  Alert,
  DailySnapshot,
  CurrencyCode,
  FeedbackSubmission,
  Holding,
} from '../types';
import {
  DEMO_USER_INVESTOR,
  DEMO_USER_ADMIN,
  DEMO_USER_GUEST,
  INITIAL_PORTFOLIOS,
  INITIAL_TRANSACTIONS,
  INITIAL_GOALS,
  INITIAL_ALERTS,
  SAMPLE_DEMO_PORTFOLIOS,
  SAMPLE_DEMO_TRANSACTIONS,
  SAMPLE_DEMO_GOALS,
  SAMPLE_DEMO_ALERTS,
  generateHistoricalSnapshots,
} from '../data/seedUserData';
import { INITIAL_ASSET_CATALOG, INITIAL_PRICES } from '../data/seedAssets';
import { calculateHoldings, PortfolioSummary } from '../utils/calculations';

interface ScheduledJobStatus {
  lastRunTime: string;
  nextRunTime: string;
  status: 'idle' | 'running' | 'success' | 'error';
  assetsCheckedCount: number;
  alertsTriggeredCount: number;
  executionDurationMs: number;
}

interface TrackerContextType {
  // Auth & Profile
  user: UserProfile;
  isAuthenticated: boolean;
  loginAs: (role: 'investor' | 'admin' | 'guest') => void;
  signUpWithEmail: (email: string, name: string, baseCurrency: CurrencyCode) => void;
  signInWithEmail: (email: string) => void;
  signOut: () => void;
  loadDemoData: () => void;
  resetToZero: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  deleteAccount: () => void;

  // Portfolios
  portfolios: Portfolio[];
  selectedPortfolioId: string; // 'all' or specific pid
  setSelectedPortfolioId: (id: string) => void;
  createPortfolio: (name: string, description: string) => void;
  renamePortfolio: (id: string, name: string, description: string) => void;
  archivePortfolio: (id: string, archived: boolean) => void;
  deletePortfolio: (id: string) => void;

  // Assets & Prices
  assets: Asset[];
  assetsMap: Record<string, Asset>;
  prices: Record<string, PriceData>;
  addCustomAsset: (asset: Omit<Asset, 'id' | 'isCustom'>) => Asset;
  updateManualPrice: (assetId: string, newPrice: number) => void;
  refreshPricesNow: () => void;
  isRefreshingPrices: boolean;

  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  importTransactionsBatch: (newTxs: Omit<Transaction, 'id'>[]) => number;
  exportTransactionsCsv: () => string;

  // Derived Metrics & Holdings
  holdings: Holding[];
  summary: PortfolioSummary;
  snapshots: DailySnapshot[];

  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'userId' | 'createdAt'>) => void;
  editGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // Alerts
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'userId' | 'createdAt'>) => void;
  toggleAlert: (id: string) => void;
  deleteAlert: (id: string) => void;
  triggeredAlerts: { alert: Alert; triggeredValue: number; time: string }[];
  clearTriggeredAlerts: () => void;

  // Feedback & Admin
  feedbacks: FeedbackSubmission[];
  submitFeedback: (rating: number, category: string, message: string) => void;
  scheduledJobStatus: ScheduledJobStatus;

  // UI Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

const STORAGE_KEY = 'vestoria_investment_tracker_v1';

export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or defaults (Defaults to Guest on fresh visit)
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_USER_GUEST;
      }
    }
    return DEMO_USER_GUEST;
  });

  const [portfolios, setPortfolios] = useState<Portfolio[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_portfolios`);
    return saved ? JSON.parse(saved) : INITIAL_PORTFOLIOS;
  });

  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>('all');

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_assets`);
    return saved ? JSON.parse(saved) : INITIAL_ASSET_CATALOG;
  });

  const [prices, setPrices] = useState<Record<string, PriceData>>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_prices`);
    return saved ? JSON.parse(saved) : INITIAL_PRICES;
  });

  // Start with clean zero transactions by default!
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_transactions`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_goals`);
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_alerts`);
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [triggeredAlerts, setTriggeredAlerts] = useState<
    { alert: Alert; triggeredValue: number; time: string }[]
  >([]);

  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_feedbacks`);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'fb_1',
            userId: 'usr_bala_2026',
            userName: 'Bala Subramaniam',
            rating: 5,
            category: 'Praise',
            message: 'Incredible platform! The weighted average cost calculation and multi-asset tracking is spot on.',
            createdAt: '2026-10-09T14:22:00Z',
          },
        ];
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRefreshingPrices, setIsRefreshingPrices] = useState(false);

  const [scheduledJobStatus, setScheduledJobStatus] = useState<ScheduledJobStatus>({
    lastRunTime: '2026-10-11T09:15:00Z',
    nextRunTime: '2026-10-11T09:30:00Z',
    status: 'success',
    assetsCheckedCount: 16,
    alertsTriggeredCount: 1,
    executionDurationMs: 384,
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_portfolios`, JSON.stringify(portfolios));
  }, [portfolios]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_assets`, JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_prices`, JSON.stringify(prices));
  }, [prices]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_transactions`, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_goals`, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_alerts`, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_feedbacks`, JSON.stringify(feedbacks));
  }, [feedbacks]);

  // Sync theme class to document body
  useEffect(() => {
    if (user.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user.theme]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  const assetsMap = useMemo(() => {
    const map: Record<string, Asset> = {};
    for (const a of assets) {
      map[a.id] = a;
    }
    return map;
  }, [assets]);

  // Derive Holdings and Summary metrics based on transactions and current prices
  const { holdings, summary } = useMemo(() => {
    return calculateHoldings(
      transactions,
      assetsMap,
      prices,
      user.baseCurrency,
      selectedPortfolioId
    );
  }, [transactions, assetsMap, prices, user.baseCurrency, selectedPortfolioId]);

  // Derived historical snapshots for value over time chart
  const snapshots = useMemo(() => {
    return generateHistoricalSnapshots(summary.totalValue, summary.totalInvested);
  }, [summary.totalValue, summary.totalInvested]);

  // Authentication Helpers
  const loginAs = (role: 'investor' | 'admin' | 'guest') => {
    if (role === 'investor') {
      setUser(DEMO_USER_INVESTOR);
      showToast('Switched to Investor account (Bala Subramaniam)');
    } else if (role === 'admin') {
      setUser(DEMO_USER_ADMIN);
      showToast('Switched to Administrator role');
    } else {
      setUser(DEMO_USER_GUEST);
      showToast('Viewing as Guest Explorer');
    }
  };

  const signUpWithEmail = (email: string, name: string, baseCurrency: CurrencyCode) => {
    const newUid = `usr_${Date.now()}`;
    const newUser: UserProfile = {
      uid: newUid,
      name: name || 'Investor',
      email,
      role: 'investor',
      baseCurrency,
      theme: 'dark',
      emailVerified: false,
      createdAt: new Date().toISOString(),
      notificationSettings: {
        email: true,
        webPush: true,
        weeklyDigest: true,
        priceAlerts: true,
      },
    };
    setUser(newUser);

    // Create default first portfolio for new user as in PRD Workflow 1
    const defaultPortfolio: Portfolio = {
      id: `port_${Date.now()}`,
      userId: newUid,
      name: 'Primary Portfolio',
      description: 'Main investment portfolio',
      archived: false,
      createdAt: new Date().toISOString(),
    };
    setPortfolios([defaultPortfolio]);
    setSelectedPortfolioId(defaultPortfolio.id);
    setTransactions([]);
    setGoals([]);
    setAlerts([]);

    showToast('Account created successfully! Welcome to Vestoria.');
  };

  const signInWithEmail = (email: string) => {
    if (email.toLowerCase().includes('admin')) {
      setUser(DEMO_USER_ADMIN);
      showToast('Signed in as Administrator');
    } else {
      const displayName = email.split('@')[0];
      const signedInUser: UserProfile = {
        uid: `usr_${Date.now()}`,
        name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        email,
        role: 'investor',
        baseCurrency: 'INR',
        theme: 'dark',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        notificationSettings: {
          email: true,
          webPush: true,
          weeklyDigest: true,
          priceAlerts: true,
        },
      };
      setUser(signedInUser);
      showToast(`Welcome back, ${signedInUser.name}!`);
    }
  };

  const signOut = () => {
    setUser(DEMO_USER_GUEST);
    localStorage.removeItem(`${STORAGE_KEY}_user`);
    showToast('Signed out successfully.');
  };

  const loadDemoData = () => {
    setUser(DEMO_USER_INVESTOR);
    setPortfolios(SAMPLE_DEMO_PORTFOLIOS);
    setTransactions(SAMPLE_DEMO_TRANSACTIONS);
    setGoals(SAMPLE_DEMO_GOALS);
    setAlerts(SAMPLE_DEMO_ALERTS);
    setSelectedPortfolioId('all');
    showToast('Loaded sample Indian stock market demo portfolio!');
  };

  const resetToZero = () => {
    setTransactions([]);
    setGoals([]);
    setAlerts([]);
    showToast('Portfolio cleared! All values reset to ₹0.00.');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
    showToast('Profile settings updated.');
  };

  const deleteAccount = () => {
    localStorage.removeItem(`${STORAGE_KEY}_user`);
    localStorage.removeItem(`${STORAGE_KEY}_portfolios`);
    localStorage.removeItem(`${STORAGE_KEY}_transactions`);
    localStorage.removeItem(`${STORAGE_KEY}_goals`);
    localStorage.removeItem(`${STORAGE_KEY}_alerts`);
    setUser(DEMO_USER_GUEST);
    setPortfolios([]);
    setTransactions([]);
    setGoals([]);
    setAlerts([]);
    showToast('Account and all associated records deleted permanently.');
  };

  // Portfolios
  const createPortfolio = (name: string, description: string) => {
    const newPort: Portfolio = {
      id: `port_${Date.now()}`,
      userId: user.uid,
      name,
      description,
      archived: false,
      createdAt: new Date().toISOString(),
    };
    setPortfolios((prev) => [...prev, newPort]);
    setSelectedPortfolioId(newPort.id);
    showToast(`Portfolio "${name}" created.`);
  };

  const renamePortfolio = (id: string, name: string, description: string) => {
    setPortfolios((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name, description } : p))
    );
    showToast('Portfolio details updated.');
  };

  const archivePortfolio = (id: string, archived: boolean) => {
    setPortfolios((prev) =>
      prev.map((p) => (p.id === id ? { ...p, archived } : p))
    );
    showToast(archived ? 'Portfolio archived.' : 'Portfolio unarchived.');
  };

  const deletePortfolio = (id: string) => {
    setPortfolios((prev) => prev.filter((p) => p.id !== id));
    // Also remove transactions in that portfolio
    setTransactions((prev) => prev.filter((tx) => tx.portfolioId !== id));
    if (selectedPortfolioId === id) {
      setSelectedPortfolioId('all');
    }
    showToast('Portfolio and its holdings deleted.');
  };

  // Custom Assets & Price Engine
  const addCustomAsset = (assetData: Omit<Asset, 'id' | 'isCustom'>): Asset => {
    const id = assetData.symbol.toUpperCase().replace(/\s+/g, '-');
    const newAsset: Asset = {
      ...assetData,
      id,
      symbol: assetData.symbol.toUpperCase(),
      isCustom: true,
    };

    setAssets((prev) => [...prev, newAsset]);

    // Initial price record
    setPrices((prev) => ({
      ...prev,
      [id]: {
        assetId: id,
        price: 100.0,
        previousClose: 100.0,
        dayChangePct: 0,
        dayChangeAmount: 0,
        updatedAt: new Date().toISOString(),
        isManual: true,
      },
    }));

    showToast(`Added "${newAsset.name}" to asset catalog.`);
    return newAsset;
  };

  const updateManualPrice = (assetId: string, newPrice: number) => {
    setPrices((prev) => {
      const existing = prev[assetId];
      const prevPrice = existing ? existing.price : newPrice;
      const changeAmount = newPrice - prevPrice;
      const changePct = prevPrice > 0 ? (changeAmount / prevPrice) * 100 : 0;

      return {
        ...prev,
        [assetId]: {
          assetId,
          price: newPrice,
          previousClose: prevPrice,
          dayChangeAmount: changeAmount,
          dayChangePct: changePct,
          updatedAt: new Date().toISOString(),
          isManual: true,
        },
      };
    });
    showToast('Manual price updated and holdings recalculated.');
  };

  // Scheduled Cloud Function Simulation (FR-13, Workflow 4)
  const refreshPricesNow = () => {
    setIsRefreshingPrices(true);
    const startTime = Date.now();

    setTimeout(() => {
      const updated: Record<string, PriceData> = { ...prices };
      const newlyTriggered: { alert: Alert; triggeredValue: number; time: string }[] = [];

      for (const [id, p] of Object.entries(prices)) {
        // Do not auto-fluctuate manual physical assets unless requested
        if (p.isManual && id.startsWith('PROP-')) continue;

        // Small random market movement (-2.5% to +2.5%)
        const deltaPct = (Math.random() - 0.47) * 4.0;
        const newPrice = Math.max(0.01, +(p.price * (1 + deltaPct / 100)).toFixed(2));
        const dayChangeAmt = +(newPrice - p.previousClose).toFixed(2);
        const dayChangePct = +((dayChangeAmt / p.previousClose) * 100).toFixed(2);

        updated[id] = {
          ...p,
          price: newPrice,
          dayChangeAmount: dayChangeAmt,
          dayChangePct: dayChangePct,
          updatedAt: new Date().toISOString(),
        };

        // Check active alerts (Workflow 5)
        for (const alert of alerts) {
          if (alert.active && alert.assetId === id) {
            let hit = false;
            if (alert.condition === 'above' && newPrice >= alert.threshold) hit = true;
            if (alert.condition === 'below' && newPrice <= alert.threshold) hit = true;
            if (alert.condition === 'change_up_pct' && dayChangePct >= alert.threshold) hit = true;
            if (alert.condition === 'change_down_pct' && dayChangePct <= -alert.threshold) hit = true;

            if (hit) {
              newlyTriggered.push({
                alert,
                triggeredValue: newPrice,
                time: new Date().toLocaleTimeString(),
              });
            }
          }
        }
      }

      setPrices(updated);
      setIsRefreshingPrices(false);

      if (newlyTriggered.length > 0) {
        setTriggeredAlerts((prev) => [...newlyTriggered, ...prev]);
        showToast(`⚡ Price alert triggered: ${newlyTriggered[0].alert.assetId} hit condition!`);
      } else {
        showToast('✓ Prices updated successfully from market data feed.');
      }

      setScheduledJobStatus({
        lastRunTime: new Date().toISOString(),
        nextRunTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        status: 'success',
        assetsCheckedCount: Object.keys(updated).length,
        alertsTriggeredCount: newlyTriggered.length,
        executionDurationMs: Date.now() - startTime,
      });
    }, 700);
  };

  // Transactions
  const addTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast('Transaction recorded & portfolio recalculated.');
  };

  const editTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx))
    );
    showToast('Transaction updated.');
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    showToast('Transaction removed.');
  };

  const importTransactionsBatch = (newTxs: Omit<Transaction, 'id'>[]): number => {
    const formatted: Transaction[] = newTxs.map((t, idx) => ({
      ...t,
      id: `tx_import_${Date.now()}_${idx}`,
    }));
    setTransactions((prev) => [...formatted, ...prev]);
    showToast(`Successfully imported ${formatted.length} transactions!`);
    return formatted.length;
  };

  const exportTransactionsCsv = (): string => {
    const header = 'ID,Date,Portfolio,Asset,Type,Quantity,Price,Fees,Currency,Notes\n';
    const rows = transactions
      .map((tx) => {
        const portName = portfolios.find((p) => p.id === tx.portfolioId)?.name || tx.portfolioId;
        const assetSym = assetsMap[tx.assetId]?.symbol || tx.assetId;
        return `"${tx.id}","${tx.date}","${portName}","${assetSym}","${tx.type}",${tx.quantity},${tx.price},${tx.fees},"${tx.currency}","${(tx.notes || '').replace(/"/g, '""')}"`;
      })
      .join('\n');
    return header + rows;
  };

  // Goals
  const addGoal = (goalData: Omit<Goal, 'id' | 'userId' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: `goal_${Date.now()}`,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, newGoal]);
    showToast(`Financial goal "${goalData.name}" created!`);

    // Check if already completed
    if (summary.totalValue >= goalData.targetAmount) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const editGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
    showToast('Goal updated.');
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    showToast('Goal removed.');
  };

  // Alerts
  const addAlert = (alertData: Omit<Alert, 'id' | 'userId' | 'createdAt'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: `alert_${Date.now()}`,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };
    setAlerts((prev) => [...prev, newAlert]);
    showToast(`Price alert activated for ${alertData.assetId}.`);
  };

  const toggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast('Alert removed.');
  };

  const clearTriggeredAlerts = () => {
    setTriggeredAlerts([]);
  };

  // In-app Feedback (FR-27)
  const submitFeedback = (rating: number, category: string, message: string) => {
    const newFb: FeedbackSubmission = {
      id: `fb_${Date.now()}`,
      userId: user.uid,
      userName: user.name,
      rating,
      category,
      message,
      createdAt: new Date().toISOString(),
    };
    setFeedbacks((prev) => [newFb, ...prev]);
    showToast('Thank you! Your feedback has been received.');
  };

  return (
    <TrackerContext.Provider
      value={{
        user,
        isAuthenticated: user.role !== 'guest',
        loginAs,
        signUpWithEmail,
        signInWithEmail,
        signOut,
        loadDemoData,
        resetToZero,
        updateProfile,
        deleteAccount,

        portfolios,
        selectedPortfolioId,
        setSelectedPortfolioId,
        createPortfolio,
        renamePortfolio,
        archivePortfolio,
        deletePortfolio,

        assets,
        assetsMap,
        prices,
        addCustomAsset,
        updateManualPrice,
        refreshPricesNow,
        isRefreshingPrices,

        transactions,
        addTransaction,
        editTransaction,
        deleteTransaction,
        importTransactionsBatch,
        exportTransactionsCsv,

        holdings,
        summary,
        snapshots,

        goals,
        addGoal,
        editGoal,
        deleteGoal,

        alerts,
        addAlert,
        toggleAlert,
        deleteAlert,
        triggeredAlerts,
        clearTriggeredAlerts,

        feedbacks,
        submitFeedback,
        scheduledJobStatus,

        toastMessage,
        showToast,
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
};

export const useTracker = () => {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
};
