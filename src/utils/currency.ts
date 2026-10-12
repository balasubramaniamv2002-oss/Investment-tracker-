import { CurrencyCode } from '../types';

export const FX_RATES_TO_USD: Record<CurrencyCode, number> = {
  USD: 1.0,
  EUR: 1.085,
  GBP: 1.295,
  INR: 0.0118, // 1 INR = ~0.0118 USD => 1 USD ~ 84.75 INR
  JPY: 0.0066,
  CAD: 0.725,
  AUD: 0.655,
  SGD: 0.755,
  CHF: 1.135,
};

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'A$',
  SGD: 'S$',
  CHF: 'CHF ',
};

/**
 * Convert an amount from fromCurrency to toCurrency
 */
export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): number {
  if (from === to) return amount;
  const inUsd = amount * (FX_RATES_TO_USD[from] || 1);
  const targetRate = FX_RATES_TO_USD[to] || 1;
  return inUsd / targetRate;
}

/**
 * Format currency with locale formatting, Indian numbering system for INR (Lakhs & Crores),
 * and standard international formatting for other currencies.
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'INR',
  options: { compact?: boolean; hideSymbol?: boolean; decimals?: number } = {}
): string {
  const { compact = false, hideSymbol = false, decimals } = options;
  const symbol = CURRENCY_SYMBOLS[currency] || '₹';
  const absAmount = Math.abs(amount);

  // Indian Rupee specific compact representation: Crores (Cr) and Lakhs (L)
  if (currency === 'INR') {
    if (compact) {
      if (absAmount >= 10_000_000) {
        // 1 Crore = 10,000,000
        const cr = (amount / 10_000_000).toFixed(2);
        return `${hideSymbol ? '' : symbol}${cr} Cr`;
      }
      if (absAmount >= 100_000) {
        // 1 Lakh = 100,000
        const l = (amount / 100_000).toFixed(2);
        return `${hideSymbol ? '' : symbol}${l} L`;
      }
      if (absAmount >= 1_000) {
        const k = (amount / 1_000).toFixed(1);
        return `${hideSymbol ? '' : symbol}${k} k`;
      }
    }

    const numDecimals = decimals !== undefined ? decimals : 2;
    const formatted = absAmount.toLocaleString('en-IN', {
      minimumFractionDigits: numDecimals,
      maximumFractionDigits: numDecimals,
    });
    const sign = amount < 0 ? '-' : '';
    return `${sign}${hideSymbol ? '' : symbol}${formatted}`;
  }

  // Standard Western formatting for USD, EUR, etc.
  if (compact && absAmount >= 1_000_000) {
    return `${hideSymbol ? '' : symbol}${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (compact && absAmount >= 1_000) {
    return `${hideSymbol ? '' : symbol}${(amount / 1_000).toFixed(1)}k`;
  }

  const numDecimals = decimals !== undefined ? decimals : currency === 'JPY' ? 0 : 2;
  const formatted = absAmount.toLocaleString('en-US', {
    minimumFractionDigits: numDecimals,
    maximumFractionDigits: numDecimals,
  });

  const sign = amount < 0 ? '-' : '';
  return `${sign}${hideSymbol ? '' : symbol}${formatted}`;
}

export function formatPercent(value: number, includeSign: boolean = true): string {
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
