import { Asset, AssetType } from '../types';

export interface KnownIndianTicker {
  symbol: string;
  name: string;
  type: AssetType;
  sector: string;
  defaultPrice: number;
}

export const POPULAR_INDIAN_TICKERS: KnownIndianTicker[] = [
  // Nifty 50 & Heavyweights
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', type: 'stocks', sector: 'Oil, Retail & Telecom', defaultPrice: 2942.5 },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', type: 'stocks', sector: 'IT Services', defaultPrice: 4125.0 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', type: 'stocks', sector: 'Banking & Financials', defaultPrice: 1678.4 },
  { symbol: 'INFY', name: 'Infosys Ltd.', type: 'stocks', sector: 'IT Services', defaultPrice: 1895.0 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', type: 'stocks', sector: 'Banking', defaultPrice: 1248.5 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', type: 'stocks', sector: 'Telecom', defaultPrice: 1682.0 },
  { symbol: 'SBIN', name: 'State Bank of India', type: 'stocks', sector: 'PSU Banking', defaultPrice: 812.0 },
  { symbol: 'ITC', name: 'ITC Ltd.', type: 'stocks', sector: 'FMCG & Hotels', defaultPrice: 489.6 },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.', type: 'stocks', sector: 'Infrastructure', defaultPrice: 3620.0 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', type: 'stocks', sector: 'FMCG', defaultPrice: 2735.0 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', type: 'stocks', sector: 'NBFC & Lending', defaultPrice: 7280.0 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', type: 'stocks', sector: 'Automotive & EV', defaultPrice: 938.5 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', type: 'stocks', sector: 'Automotive', defaultPrice: 12450.0 },
  { symbol: 'TITAN', name: 'Titan Company Ltd.', type: 'stocks', sector: 'Jewellery & Watches', defaultPrice: 3520.0 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd.', type: 'stocks', sector: 'Pharma', defaultPrice: 1890.0 },
  { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd.', type: 'stocks', sector: 'Conglomerate', defaultPrice: 3120.0 },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', type: 'stocks', sector: 'Banking', defaultPrice: 1215.0 },
  { symbol: 'WIPRO', name: 'Wipro Ltd.', type: 'stocks', sector: 'IT Services', defaultPrice: 540.0 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.', type: 'stocks', sector: 'Banking', defaultPrice: 1820.0 },
  { symbol: 'TATASTEEL', name: 'Tata Steel Ltd.', type: 'stocks', sector: 'Metals & Mining', defaultPrice: 158.0 },
  { symbol: 'POWERGRID', name: 'Power Grid Corp. of India Ltd.', type: 'stocks', sector: 'Utilities & Power', defaultPrice: 342.0 },
  { symbol: 'NTPC', name: 'NTPC Ltd.', type: 'stocks', sector: 'Power Generation', defaultPrice: 422.0 },
  { symbol: 'COALINDIA', name: 'Coal India Ltd.', type: 'stocks', sector: 'Energy & Mining', defaultPrice: 512.0 },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corp. Ltd.', type: 'stocks', sector: 'Energy', defaultPrice: 298.0 },

  // High-Growth, Defense, Railways & Tech
  { symbol: 'TRENT', name: 'Trent Ltd. (Westside & Zudio)', type: 'stocks', sector: 'Retail & Fashion', defaultPrice: 7850.0 },
  { symbol: 'HAL', name: 'Hindustan Aeronautics Ltd.', type: 'stocks', sector: 'Aerospace & Defence', defaultPrice: 4520.0 },
  { symbol: 'BEL', name: 'Bharat Electronics Ltd.', type: 'stocks', sector: 'Defence Electronics', defaultPrice: 295.5 },
  { symbol: 'MAZDOCK', name: 'Mazagon Dock Shipbuilders Ltd.', type: 'stocks', sector: 'Defence Shipyard', defaultPrice: 4320.0 },
  { symbol: 'COCHINSHIP', name: 'Cochin Shipyard Ltd.', type: 'stocks', sector: 'Shipbuilding & Marine', defaultPrice: 1720.0 },
  { symbol: 'BDL', name: 'Bharat Dynamics Ltd.', type: 'stocks', sector: 'Missile Systems & Defence', defaultPrice: 1140.0 },
  { symbol: 'IRFC', name: 'Indian Railway Finance Corp.', type: 'stocks', sector: 'Railway Infrastructure', defaultPrice: 158.4 },
  { symbol: 'RVNL', name: 'Rail Vikas Nigam Ltd.', type: 'stocks', sector: 'Railways Construction', defaultPrice: 512.0 },
  { symbol: 'IRCTC', name: 'Indian Railway Catering & Tourism', type: 'stocks', sector: 'Tourism & Ticketing', defaultPrice: 890.0 },
  { symbol: 'ZOMATO', name: 'Zomato Ltd. (Blinkit)', type: 'stocks', sector: 'Quick Commerce & Food', defaultPrice: 278.2 },
  { symbol: 'JIOFIN', name: 'Jio Financial Services Ltd.', type: 'stocks', sector: 'Financial Services', defaultPrice: 342.8 },
  { symbol: 'CDSL', name: 'Central Depository Services India', type: 'stocks', sector: 'Capital Market Infrastructure', defaultPrice: 1520.0 },
  { symbol: 'BSE', name: 'BSE Ltd. (Stock Exchange)', type: 'stocks', sector: 'Financial Exchanges', defaultPrice: 3950.0 },
  { symbol: 'SUZLON', name: 'Suzlon Energy Ltd.', type: 'stocks', sector: 'Renewable Wind Energy', defaultPrice: 76.5 },
  { symbol: 'TATACHEM', name: 'Tata Chemicals Ltd.', type: 'stocks', sector: 'Specialty Chemicals', defaultPrice: 1045.0 },
  { symbol: 'POLYCAB', name: 'Polycab India Ltd.', type: 'stocks', sector: 'Cables & Electricals', defaultPrice: 6850.0 },
  { symbol: 'DIXON', name: 'Dixon Technologies (India) Ltd.', type: 'stocks', sector: 'Electronics Manufacturing', defaultPrice: 13200.0 },
  { symbol: 'KALYANKJIL', name: 'Kalyan Jewellers India Ltd.', type: 'stocks', sector: 'Jewellery Retail', defaultPrice: 685.0 },
  { symbol: 'PAYTM', name: 'One97 Communications Ltd. (Paytm)', type: 'stocks', sector: 'Fintech & Digital Payments', defaultPrice: 680.0 },
  { symbol: 'NYKAA', name: 'FSN E-Commerce Ventures (Nykaa)', type: 'stocks', sector: 'Beauty & E-Commerce', defaultPrice: 198.0 },
  { symbol: 'VBL', name: 'Varun Beverages Ltd.', type: 'stocks', sector: 'Beverages & Bottling', defaultPrice: 585.0 },
  { symbol: 'DLF', name: 'DLF Limited', type: 'stocks', sector: 'Real Estate Developer', defaultPrice: 865.0 },
  { symbol: 'LODHA', name: 'Macrotech Developers (Lodha)', type: 'stocks', sector: 'Real Estate', defaultPrice: 1180.0 },
  { symbol: 'ANGELONE', name: 'Angel One Ltd.', type: 'stocks', sector: 'Discount Broking & Fintech', defaultPrice: 2840.0 },
  { symbol: 'MOTILALOFS', name: 'Motilal Oswal Financial Services', type: 'stocks', sector: 'Wealth Management', defaultPrice: 780.0 },
  { symbol: 'YESBANK', name: 'Yes Bank Ltd.', type: 'stocks', sector: 'Private Banking', defaultPrice: 21.8 },
  { symbol: 'IDEA', name: 'Vodafone Idea Ltd.', type: 'stocks', sector: 'Telecom', defaultPrice: 9.4 },

  // Indian ETFs
  { symbol: 'NIFTYBEES', name: 'Nippon India ETF Nifty 50 BeES', type: 'etfs', sector: 'Nifty 50 Index', defaultPrice: 278.4 },
  { symbol: 'BANKBEES', name: 'Nippon India ETF Bank BeES', type: 'etfs', sector: 'Bank Nifty Index', defaultPrice: 532.0 },
  { symbol: 'GOLDBEES', name: 'Nippon India ETF Gold BeES', type: 'etfs', sector: 'Gold ETF', defaultPrice: 68.2 },
  { symbol: 'SILVERBEES', name: 'Nippon India ETF Silver', type: 'etfs', sector: 'Silver ETF', defaultPrice: 88.5 },
  { symbol: 'ITBEES', name: 'Nippon India ETF Nifty IT', type: 'etfs', sector: 'Nifty IT Index', defaultPrice: 43.8 },
  { symbol: 'JUNIORBEES', name: 'Nippon India ETF Nifty Next 50', type: 'etfs', sector: 'Nifty Next 50', defaultPrice: 765.0 },
  { symbol: 'MON100', name: 'Motilal Oswal Nasdaq 100 ETF', type: 'etfs', sector: 'US Tech in INR', defaultPrice: 184.2 },
  { symbol: 'LIQUIDBEES', name: 'Nippon India ETF Nifty 1D Liquid', type: 'etfs', sector: 'Overnight Liquid Debt', defaultPrice: 1000.0 },

  // Mutual Funds (Direct NAVs)
  { symbol: 'PPFAS-FLEXI', name: 'Parag Parikh Flexi Cap Direct-Growth', type: 'mutual_funds', sector: 'Flexi Cap', defaultPrice: 84.62 },
  { symbol: 'MIRAE-LARGEMID', name: 'Mirae Asset Large & Midcap Direct-Growth', type: 'mutual_funds', sector: 'Large & Midcap', defaultPrice: 148.5 },
  { symbol: 'QUANT-SMALL', name: 'Quant Small Cap Direct-Growth', type: 'mutual_funds', sector: 'Small Cap', defaultPrice: 268.4 },
  { symbol: 'HDFC-MIDCAP', name: 'HDFC Mid-Cap Opportunities Direct-Growth', type: 'mutual_funds', sector: 'Mid Cap', defaultPrice: 184.2 },
  { symbol: 'SBI-BLUECHIP', name: 'SBI Bluechip Fund Direct-Growth', type: 'mutual_funds', sector: 'Large Cap', defaultPrice: 98.4 },
  { symbol: 'NIPPON-SMALL', name: 'Nippon India Small Cap Direct-Growth', type: 'mutual_funds', sector: 'Small Cap', defaultPrice: 172.5 },

  // Gold & SGBs
  { symbol: 'SGB-2024', name: 'Sovereign Gold Bond (RBI Issue)', type: 'gold', sector: 'Govt Sovereign Gold', defaultPrice: 7650.0 },
  { symbol: 'MCX-GOLD', name: 'Physical 24K Gold 10g (MCX Spot)', type: 'gold', sector: 'Physical Bullion', defaultPrice: 76800.0 },

  // Fixed Deposits & PPF
  { symbol: 'SBI-FD-1Y', name: 'SBI 1-Year Term FD (6.80%)', type: 'fixed_deposits', sector: 'State Bank of India', defaultPrice: 100000.0 },
  { symbol: 'HDFC-FD-3Y', name: 'HDFC Bank 3-Year FD (7.10%)', type: 'fixed_deposits', sector: 'HDFC Bank', defaultPrice: 250000.0 },
  { symbol: 'PPF-INDIA', name: 'Public Provident Fund (PPF 7.10%)', type: 'fixed_deposits', sector: 'Govt Small Savings', defaultPrice: 150000.0 },

  // REITs
  { symbol: 'EMBASSY', name: 'Embassy Office Parks REIT', type: 'real_estate', sector: 'Office Parks REIT', defaultPrice: 395.2 },
  { symbol: 'NEXUS', name: 'Nexus Select Trust REIT', type: 'real_estate', sector: 'Retail Malls REIT', defaultPrice: 142.5 },
  { symbol: 'BIRET', name: 'Brookfield India Real Estate Trust', type: 'real_estate', sector: 'Commercial IT REIT', defaultPrice: 258.0 },
  { symbol: 'MINDSPACE', name: 'Mindspace Business Parks REIT', type: 'real_estate', sector: 'Commercial Office REIT', defaultPrice: 360.0 },
];

/**
 * Searches or dynamically generates an Indian asset definition for ANY ticker entered by the user.
 */
export function resolveIndianTicker(query: string): KnownIndianTicker {
  const clean = query.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');

  const matched = POPULAR_INDIAN_TICKERS.find(
    (t) => t.symbol === clean || clean.includes(t.symbol)
  );

  if (matched) return matched;

  // If user entered a custom/unlisted Indian ticker, intelligently classify it:
  let type: AssetType = 'stocks';
  let sector = 'Indian Listed Equity';
  let defaultPrice = 250.0;

  if (clean.endsWith('BEES') || clean.endsWith('ETF')) {
    type = 'etfs';
    sector = 'Indian Exchange Traded Fund';
    defaultPrice = 150.0;
  } else if (clean.includes('MUTUAL') || clean.includes('FUND') || clean.includes('CAP') || clean.includes('GROWTH')) {
    type = 'mutual_funds';
    sector = 'Direct Mutual Fund Scheme';
    defaultPrice = 85.0;
  } else if (clean.includes('GOLD') || clean.includes('SGB')) {
    type = 'gold';
    sector = 'Gold & Sovereign Commodities';
    defaultPrice = 7500.0;
  } else if (clean.includes('FD') || clean.includes('DEPOSIT')) {
    type = 'fixed_deposits';
    sector = 'Bank Fixed Deposit';
    defaultPrice = 50000.0;
  } else if (clean.includes('REIT')) {
    type = 'real_estate';
    sector = 'Real Estate Investment Trust';
    defaultPrice = 300.0;
  }

  // Format clean human name
  const formattedName = `${clean} Limited (NSE / BSE)`;

  return {
    symbol: clean,
    name: formattedName,
    type,
    sector,
    defaultPrice,
  };
}
