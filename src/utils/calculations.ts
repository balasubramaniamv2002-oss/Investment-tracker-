import {
  Asset,
  PriceData,
  Transaction,
  Holding,
  CurrencyCode,
  AssetType,
} from '../types';
import { convertCurrency } from './currency';

export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  unrealisedGain: number;
  unrealisedGainPct: number;
  realisedGain: number;
  totalDividends: number;
  totalFees: number;
  totalReturn: number;
  totalReturnPct: number;
  dayGain: number;
  dayGainPct: number;
  cashBalance: number;
}

/**
 * Calculates derived holdings from transactions using weighted average cost accounting.
 */
export function calculateHoldings(
  transactions: Transaction[],
  assetsMap: Record<string, Asset>,
  pricesMap: Record<string, PriceData>,
  baseCurrency: CurrencyCode = 'USD',
  portfolioIdFilter?: string
): { holdings: Holding[]; summary: PortfolioSummary } {
  // Filter transactions if portfolioIdFilter is provided (and not 'all')
  const filteredTxs = portfolioIdFilter && portfolioIdFilter !== 'all'
    ? transactions.filter((tx) => tx.portfolioId === portfolioIdFilter)
    : [...transactions];

  // Sort chronologically by date
  filteredTxs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Aggregate per asset
  interface AssetAccumulator {
    quantity: number;
    totalCost: number; // remaining cost basis of held shares
    investedTotalHistorical: number;
    realisedGain: number;
    dividendsTotal: number;
    feesTotal: number;
  }

  const accumulators: Record<string, AssetAccumulator> = {};

  for (const tx of filteredTxs) {
    if (!accumulators[tx.assetId]) {
      accumulators[tx.assetId] = {
        quantity: 0,
        totalCost: 0,
        investedTotalHistorical: 0,
        realisedGain: 0,
        dividendsTotal: 0,
        feesTotal: 0,
      };
    }

    const acc = accumulators[tx.assetId];
    // Convert tx price/fees into base currency for standardized accounting
    const txPriceInBase = convertCurrency(tx.price, tx.currency, baseCurrency);
    const txFeesInBase = convertCurrency(tx.fees, tx.currency, baseCurrency);
    acc.feesTotal += txFeesInBase;

    switch (tx.type) {
      case 'buy':
      case 'deposit': {
        const addedCost = tx.quantity * txPriceInBase + txFeesInBase;
        acc.totalCost += addedCost;
        acc.investedTotalHistorical += addedCost;
        acc.quantity += tx.quantity;
        break;
      }

      case 'sell':
      case 'withdrawal': {
        if (acc.quantity > 0) {
          const currentAvgCost = acc.totalCost / acc.quantity;
          const soldCostBasis = tx.quantity * currentAvgCost;
          const proceeds = tx.quantity * txPriceInBase - txFeesInBase;
          const pnl = proceeds - soldCostBasis;

          acc.realisedGain += pnl;
          acc.quantity = Math.max(0, acc.quantity - tx.quantity);
          acc.totalCost = Math.max(0, acc.totalCost - soldCostBasis);
        }
        break;
      }

      case 'dividend': {
        // Cash dividend received
        const divAmount = tx.quantity > 0 ? tx.quantity * txPriceInBase : txPriceInBase;
        acc.dividendsTotal += divAmount;
        break;
      }
    }
  }

  // Derive Holding objects for currently held assets (or those with non-zero activity)
  const holdingsList: Holding[] = [];

  for (const [assetId, acc] of Object.entries(accumulators)) {
    // Only include in active holdings if quantity > 0 or has active position
    if (acc.quantity <= 0.000001 && acc.realisedGain === 0 && acc.dividendsTotal === 0) {
      continue;
    }

    const asset = assetsMap[assetId] || {
      id: assetId,
      symbol: assetId,
      name: assetId,
      type: 'stocks' as AssetType,
      currency: 'USD' as CurrencyCode,
      exchange: 'Other',
      sector: 'General',
    };

    const priceInfo = pricesMap[assetId] || {
      assetId,
      price: acc.quantity > 0 ? acc.totalCost / acc.quantity : 0,
      previousClose: acc.quantity > 0 ? acc.totalCost / acc.quantity : 0,
      dayChangePct: 0,
      dayChangeAmount: 0,
      updatedAt: new Date().toISOString(),
    };

    const currentPriceInBase = convertCurrency(
      priceInfo.price,
      asset.currency,
      baseCurrency
    );
    const prevCloseInBase = convertCurrency(
      priceInfo.previousClose || priceInfo.price,
      asset.currency,
      baseCurrency
    );

    const avgCost = acc.quantity > 0 ? acc.totalCost / acc.quantity : 0;
    const currentValue = acc.quantity * currentPriceInBase;
    const investedAmount = acc.totalCost;
    const unrealisedGain = currentValue - investedAmount;
    const unrealisedGainPct = investedAmount > 0 ? (unrealisedGain / investedAmount) * 100 : 0;

    const dayPriceDiff = currentPriceInBase - prevCloseInBase;
    const dayGain = acc.quantity * dayPriceDiff;
    const dayGainPct = prevCloseInBase > 0 ? (dayPriceDiff / prevCloseInBase) * 100 : 0;

    holdingsList.push({
      assetId,
      symbol: asset.symbol,
      name: asset.name,
      type: asset.type,
      currency: asset.currency,
      sector: asset.sector,
      quantity: acc.quantity,
      avgCost,
      investedAmount,
      currentPrice: currentPriceInBase,
      currentValue,
      unrealisedGain,
      unrealisedGainPct,
      dayGain,
      dayGainPct,
      realisedGain: acc.realisedGain,
      dividendsTotal: acc.dividendsTotal,
      feesTotal: acc.feesTotal,
      allocationPct: 0, // calculated below
      isManual: priceInfo.isManual,
    });
  }

  // Calculate total values and allocations
  const totalValue = holdingsList.reduce((sum, h) => sum + h.currentValue, 0);
  const totalInvested = holdingsList.reduce((sum, h) => sum + h.investedAmount, 0);
  const unrealisedGain = totalValue - totalInvested;
  const unrealisedGainPct = totalInvested > 0 ? (unrealisedGain / totalInvested) * 100 : 0;
  const realisedGain = holdingsList.reduce((sum, h) => sum + h.realisedGain, 0);
  const totalDividends = holdingsList.reduce((sum, h) => sum + h.dividendsTotal, 0);
  const totalFees = holdingsList.reduce((sum, h) => sum + h.feesTotal, 0);
  const totalReturn = unrealisedGain + realisedGain + totalDividends;
  const totalReturnPct = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;
  const dayGain = holdingsList.reduce((sum, h) => sum + h.dayGain, 0);
  const prevDayValue = totalValue - dayGain;
  const dayGainPct = prevDayValue > 0 ? (dayGain / prevDayValue) * 100 : 0;

  const cashHoldings = holdingsList.filter((h) => h.type === 'cash');
  const cashBalance = cashHoldings.reduce((sum, h) => sum + h.currentValue, 0);

  // Assign allocation percentages
  holdingsList.forEach((h) => {
    h.allocationPct = totalValue > 0 ? (h.currentValue / totalValue) * 100 : 0;
  });

  // Sort holdings by total value descending
  holdingsList.sort((a, b) => b.currentValue - a.currentValue);

  return {
    holdings: holdingsList,
    summary: {
      totalValue,
      totalInvested,
      unrealisedGain,
      unrealisedGainPct,
      realisedGain,
      totalDividends,
      totalFees,
      totalReturn,
      totalReturnPct,
      dayGain,
      dayGainPct,
      cashBalance,
    },
  };
}

/**
 * Group holdings by asset type for allocation breakdown
 */
export function getAssetTypeAllocation(holdings: Holding[]) {
  const map: Record<string, { value: number; count: number }> = {};
  const total = holdings.reduce((acc, h) => acc + h.currentValue, 0);

  holdings.forEach((h) => {
    if (!map[h.type]) {
      map[h.type] = { value: 0, count: 0 };
    }
    map[h.type].value += h.currentValue;
    map[h.type].count += 1;
  });

  return Object.entries(map).map(([type, data]) => ({
    name: formatAssetTypeName(type as AssetType),
    type: type as AssetType,
    value: data.value,
    percentage: total > 0 ? (data.value / total) * 100 : 0,
    count: data.count,
  })).sort((a, b) => b.value - a.value);
}

/**
 * Group holdings by sector for sector allocation
 */
export function getSectorAllocation(holdings: Holding[]) {
  const map: Record<string, number> = {};
  const total = holdings.reduce((acc, h) => acc + h.currentValue, 0);

  holdings.forEach((h) => {
    const sector = h.sector || 'Other';
    map[sector] = (map[sector] || 0) + h.currentValue;
  });

  return Object.entries(map).map(([sector, val]) => ({
    name: sector,
    value: val,
    percentage: total > 0 ? (val / total) * 100 : 0,
  })).sort((a, b) => b.value - a.value);
}

/**
 * Group holdings by currency for FX exposure
 */
export function getCurrencyAllocation(holdings: Holding[]) {
  const map: Record<string, number> = {};
  const total = holdings.reduce((acc, h) => acc + h.currentValue, 0);

  holdings.forEach((h) => {
    map[h.currency] = (map[h.currency] || 0) + h.currentValue;
  });

  return Object.entries(map).map(([curr, val]) => ({
    name: curr,
    value: val,
    percentage: total > 0 ? (val / total) * 100 : 0,
  })).sort((a, b) => b.value - a.value);
}

export function formatAssetTypeName(type: AssetType): string {
  switch (type) {
    case 'stocks':
      return 'Stocks & Equities';
    case 'etfs':
      return 'ETFs & Index Funds';
    case 'crypto':
      return 'Cryptocurrency';
    case 'mutual_funds':
      return 'Mutual Funds';
    case 'gold':
      return 'Gold & Commodities';
    case 'fixed_deposits':
      return 'Fixed Deposits & CDs';
    case 'real_estate':
      return 'Real Estate & REITs';
    case 'cash':
      return 'Cash & Reserves';
    default:
      return type;
  }
}
