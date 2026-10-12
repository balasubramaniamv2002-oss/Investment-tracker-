import React, { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { AssetType, Holding } from '../types';
import { BlenderAssetIcon } from '../components/common/Blender3DIcons';
import { formatCurrency, formatPercent } from '../utils/currency';
import { formatAssetTypeName } from '../utils/calculations';

interface HoldingsViewProps {
  onOpenAddTx: () => void;
  onOpenManualPrice: (assetId: string) => void;
}

type SortField =
  | 'currentValue'
  | 'unrealisedGain'
  | 'symbol'
  | 'dayGain'
  | 'allocationPct';

export const HoldingsView: React.FC<HoldingsViewProps> = ({
  onOpenAddTx,
  onOpenManualPrice,
}) => {
  const { holdings, user, refreshPricesNow, isRefreshingPrices } = useTracker();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('currentValue');
  const [sortAsc, setSortAsc] = useState(false);

  const assetTypesList: { id: string; label: string }[] = [
    { id: 'all', label: 'All Assets' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'etfs', label: 'ETFs' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'mutual_funds', label: 'Mutual Funds' },
    { id: 'gold', label: 'Gold' },
    { id: 'fixed_deposits', label: 'Fixed Deposits' },
    { id: 'real_estate', label: 'Real Estate' },
    { id: 'cash', label: 'Cash' },
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filteredAndSorted = useMemo(() => {
    let list = [...holdings];

    if (selectedType !== 'all') {
      list = list.filter((h) => h.type === selectedType);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (h) =>
          h.symbol.toLowerCase().includes(q) ||
          h.name.toLowerCase().includes(q) ||
          h.sector.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let diff = 0;
      switch (sortField) {
        case 'currentValue':
          diff = a.currentValue - b.currentValue;
          break;
        case 'unrealisedGain':
          diff = a.unrealisedGain - b.unrealisedGain;
          break;
        case 'dayGain':
          diff = a.dayGain - b.dayGain;
          break;
        case 'allocationPct':
          diff = a.allocationPct - b.allocationPct;
          break;
        case 'symbol':
          diff = a.symbol.localeCompare(b.symbol);
          break;
      }
      return sortAsc ? diff : -diff;
    });

    return list;
  }, [holdings, selectedType, search, sortField, sortAsc]);

  const totalFilteredValue = filteredAndSorted.reduce((s, h) => s + h.currentValue, 0);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white">Investment Holdings</h2>
          <p className="text-xs text-slate-400">
            Total active positions: {filteredAndSorted.length} assets ({formatCurrency(totalFilteredValue, user.baseCurrency)})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={refreshPricesNow}
            disabled={isRefreshingPrices}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={14} className={isRefreshingPrices ? 'animate-spin text-blue-400' : ''} />
            <span>Refresh Prices</span>
          </button>
          <button
            onClick={onOpenAddTx}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Asset Type Filter Tabs (FR-12) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {assetTypesList.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedType(t.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedType === t.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search and Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={15} />
            <input
              type="text"
              placeholder="Search by ticker, company, or sector..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="text-xs text-slate-400 hidden sm:block">
            Click column headers to sort
          </div>
        </div>

        {filteredAndSorted.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            No holdings found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/70 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th
                    className="p-3.5 cursor-pointer hover:text-white"
                    onClick={() => handleSort('symbol')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Asset &amp; Sector</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="p-3.5 text-right">Holdings Qty</th>
                  <th className="p-3.5 text-right">Average Cost</th>
                  <th className="p-3.5 text-right">Current Price</th>
                  <th
                    className="p-3.5 text-right cursor-pointer hover:text-white"
                    onClick={() => handleSort('currentValue')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Current Value</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th
                    className="p-3.5 text-right cursor-pointer hover:text-white"
                    onClick={() => handleSort('unrealisedGain')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Unrealised P&amp;L</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th
                    className="p-3.5 text-right cursor-pointer hover:text-white"
                    onClick={() => handleSort('dayGain')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>24h Change</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th
                    className="p-3.5 text-right cursor-pointer hover:text-white"
                    onClick={() => handleSort('allocationPct')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Weight</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="p-3.5 text-center">Price Feed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredAndSorted.map((h) => {
                  const isGain = h.unrealisedGain >= 0;
                  const isDayGain = h.dayGain >= 0;

                  return (
                    <tr key={h.assetId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <BlenderAssetIcon type={h.type} size={32} />
                          <div>
                            <div className="font-bold text-white font-sans text-xs flex items-center gap-2">
                              <span>{h.symbol}</span>
                              <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700/60">
                                {formatAssetTypeName(h.type)}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-sans truncate max-w-[180px]">
                              {h.name} • <span className="text-slate-500">{h.sector}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 text-right text-slate-200">
                        {h.quantity.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                      </td>

                      <td className="p-3.5 text-right text-slate-400">
                        {formatCurrency(h.avgCost, user.baseCurrency)}
                      </td>

                      <td className="p-3.5 text-right font-semibold text-slate-100">
                        {formatCurrency(h.currentPrice, user.baseCurrency)}
                      </td>

                      <td className="p-3.5 text-right font-bold text-white text-sm">
                        {formatCurrency(h.currentValue, user.baseCurrency)}
                      </td>

                      <td className={`p-3.5 text-right font-semibold ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isGain ? '+' : ''}
                        {formatCurrency(h.unrealisedGain, user.baseCurrency)}
                        <span className="text-[10px] block opacity-85">
                          ({formatPercent(h.unrealisedGainPct)})
                        </span>
                      </td>

                      <td className={`p-3.5 text-right text-xs font-semibold ${isDayGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isDayGain ? '+' : ''}
                        {formatCurrency(h.dayGain, user.baseCurrency)}
                        <span className="text-[10px] block opacity-85">
                          ({formatPercent(h.dayGainPct)})
                        </span>
                      </td>

                      <td className="p-3.5 text-right text-slate-300">
                        {formatPercent(h.allocationPct, false)}
                      </td>

                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => onOpenManualPrice(h.assetId)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-sans transition-colors cursor-pointer border border-slate-700"
                        >
                          {h.isManual ? 'Edit Value' : 'Override'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
