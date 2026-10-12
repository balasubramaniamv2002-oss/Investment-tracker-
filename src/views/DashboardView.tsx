import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PlusCircle,
  FileSpreadsheet,
  RefreshCw,
  PieChart,
  ArrowUpRight,
  Target,
  Sparkles,
  Zap,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { PortfolioChart } from '../components/charts/PortfolioChart';
import { AllocationChart } from '../components/charts/AllocationChart';
import { BlenderAssetIcon } from '../components/common/Blender3DIcons';
import { formatCurrency, formatPercent } from '../utils/currency';
import { Holding } from '../types';

interface DashboardViewProps {
  onOpenAddTx: () => void;
  onOpenCsvImport: () => void;
  onOpenManualPrice: (assetId: string) => void;
  onNavigateToHoldings: () => void;
  onNavigateToGoals: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenAddTx,
  onOpenCsvImport,
  onOpenManualPrice,
  onNavigateToHoldings,
  onNavigateToGoals,
}) => {
  const {
    user,
    summary,
    holdings,
    portfolios,
    selectedPortfolioId,
    setSelectedPortfolioId,
    refreshPricesNow,
    isRefreshingPrices,
    goals,
    triggeredAlerts,
    clearTriggeredAlerts,
    loadDemoData,
  } = useTracker();

  const [searchFilter, setSearchFilter] = useState('');

  const isPositiveReturn = summary.unrealisedGain >= 0;
  const isPositiveDay = summary.dayGain >= 0;

  const currentPortfolioName =
    selectedPortfolioId === 'all'
      ? 'All Portfolios (Aggregated)'
      : portfolios.find((p) => p.id === selectedPortfolioId)?.name || 'Selected Portfolio';

  const filteredHoldings = holdings.filter(
    (h) =>
      h.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      h.symbol.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Alert Notifications Banner if any alerts triggered */}
      {triggeredAlerts.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3 text-xs text-amber-300">
            <Zap className="text-amber-400 shrink-0" size={18} />
            <span>
              <strong>Market Alert Triggered:</strong> {triggeredAlerts[0].alert.assetId} hit condition with live price of ${triggeredAlerts[0].triggeredValue}!
            </span>
          </div>
          <button
            onClick={clearTriggeredAlerts}
            className="text-xs font-semibold text-amber-400 hover:text-amber-200 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Controls & Portfolio Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Briefcase size={20} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Viewing Portfolio:</div>
            <select
              value={selectedPortfolioId}
              onChange={(e) => setSelectedPortfolioId(e.target.value)}
              className="bg-slate-800 border border-slate-700 font-bold text-white text-sm rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Portfolios ({portfolios.length} combined)</option>
              {portfolios.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.archived ? '(Archived)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={refreshPricesNow}
            disabled={isRefreshingPrices}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            title="Trigger scheduled Cloud Function price refresh"
          >
            <RefreshCw size={14} className={isRefreshingPrices ? 'animate-spin text-blue-400' : ''} />
            <span>{isRefreshingPrices ? 'Refreshing Feed...' : 'Refresh Prices'}</span>
          </button>

          <button
            onClick={onOpenCsvImport}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <FileSpreadsheet size={14} className="text-emerald-400" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={onOpenAddTx}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
          >
            <PlusCircle size={15} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Hero Metric Cards (Responsive 2-col on mobile, 4-col on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        {/* Total Net Worth */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Net Worth</span>
            <span
              className={`font-semibold flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                isPositiveDay
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {isPositiveDay ? '▲' : '▼'} {formatPercent(summary.dayGainPct, false)}
            </span>
          </div>

          <div className="text-lg sm:text-xl font-extrabold text-white font-mono tracking-tight">
            {formatCurrency(summary.totalValue, user.baseCurrency)}
          </div>

          <div className="text-[10px] text-slate-400 mt-1">
            24h: <span className={isPositiveDay ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
              {isPositiveDay ? '+' : ''}{formatCurrency(summary.dayGain, user.baseCurrency)}
            </span>
          </div>
        </div>

        {/* Total Invested Basis */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 shadow-lg">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Invested</span>
            <span className="text-[10px] text-slate-500">{holdings.length} assets</span>
          </div>

          <div className="text-lg sm:text-xl font-extrabold text-slate-200 font-mono tracking-tight">
            {formatCurrency(summary.totalInvested, user.baseCurrency)}
          </div>

          <div className="text-[10px] text-slate-400 mt-1 truncate">
            Cost Basis
          </div>
        </div>

        {/* Unrealised P&L */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 shadow-lg">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Returns</span>
            <span
              className={`font-semibold text-[10px] ${
                isPositiveReturn ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isPositiveReturn ? '+' : ''}{formatPercent(summary.unrealisedGainPct, false)}
            </span>
          </div>

          <div
            className={`text-lg sm:text-xl font-extrabold font-mono tracking-tight ${
              isPositiveReturn ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositiveReturn ? '+' : ''}{formatCurrency(summary.unrealisedGain, user.baseCurrency)}
          </div>

          <div className="text-[10px] text-slate-400 mt-1">
            Unrealised P&amp;L
          </div>
        </div>

        {/* Cash & Liquid Reserves */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 shadow-lg">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Dividends</span>
            <span className="text-[10px] font-semibold text-blue-400">Yield</span>
          </div>

          <div className="text-lg sm:text-xl font-extrabold text-white font-mono tracking-tight">
            +{formatCurrency(summary.totalDividends, user.baseCurrency)}
          </div>

          <div className="text-[10px] text-slate-400 mt-1">
            Cash payouts earned
          </div>
        </div>
      </div>

      {/* Main Charts Grid (FR-16 & FR-17) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <PortfolioChart />
        </div>
        <div className="lg:col-span-4">
          <AllocationChart />
        </div>
      </div>

      {/* Active Goals Quick Widget (FR-18) */}
      {goals.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-blue-400" />
              <h3 className="text-sm font-bold text-white">Target Milestone Goals</h3>
            </div>
            <button
              onClick={onNavigateToGoals}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              View All Goals →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {goals.slice(0, 3).map((g) => {
              const currentVal = summary.totalValue;
              const pct = Math.min(100, Math.max(0, (currentVal / g.targetAmount) * 100));
              const isAchieved = currentVal >= g.targetAmount;

              return (
                <div key={g.id} className="bg-slate-800/50 border border-slate-700/60 p-3.5 rounded-xl">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white truncate max-w-[150px]">{g.name}</span>
                    <span className="font-mono font-semibold text-slate-300">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden my-2">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isAchieved ? 'bg-emerald-400' : 'bg-blue-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Target: {formatCurrency(g.targetAmount, user.baseCurrency, { compact: true })}</span>
                    <span>Due: {g.targetDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Holdings Table Preview (FR-11, FR-12) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Holdings Snapshot</h3>
            <p className="text-xs text-slate-400">
              Live quantities, current prices, gains, and portfolio weights
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search ticker or name..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500 w-48"
            />
            <button
              onClick={onNavigateToHoldings}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold"
            >
              Detailed Table →
            </button>
          </div>
        </div>

        {holdings.length === 0 ? (
          <div className="p-10 text-center text-slate-400 space-y-4 bg-slate-900/40 rounded-2xl border border-slate-800">
            <Briefcase size={36} className="mx-auto text-blue-400" />
            <div>
              <div className="text-base font-bold text-white">Your Investment Portfolio is Clean (₹0.00)</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Record your first transaction manually, import broker trades via CSV, or explore sample Indian stock data.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <button
                onClick={onOpenAddTx}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
              >
                + Add First Investment
              </button>
              <button
                onClick={onOpenCsvImport}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                Import CSV Trades
              </button>
              <button
                onClick={loadDemoData}
                className="px-3 py-2 text-blue-400 hover:text-blue-300 text-xs font-semibold underline cursor-pointer"
              >
                Load Sample Demo Data
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Mobile Asset Cards Feed */}
            <div className="space-y-2">
              {filteredHoldings.slice(0, 8).map((h) => {
                const isGain = h.unrealisedGain >= 0;
                return (
                  <div
                    key={h.assetId}
                    className="p-3 bg-slate-800/40 hover:bg-slate-800/70 transition-colors rounded-xl border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <BlenderAssetIcon type={h.type} size={28} />
                      <div>
                        <div className="font-bold text-white font-sans text-xs flex items-center gap-1">
                          <span>{h.symbol}</span>
                          <span className="text-[10px] text-slate-400 font-mono font-normal">
                            ({h.quantity.toLocaleString()} sh)
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans truncate max-w-[130px]">
                          {h.name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-right font-mono">
                      <div>
                        <div className="font-bold text-white text-xs">
                          {formatCurrency(h.currentValue, user.baseCurrency)}
                        </div>
                        <div
                          className={`text-[10px] font-semibold flex items-center justify-end gap-0.5 ${
                            isGain ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          <span>{isGain ? '▲ +' : '▼ '}</span>
                          <span>{formatPercent(h.unrealisedGainPct, false)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onOpenManualPrice(h.assetId)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-sans border border-slate-700 cursor-pointer"
                        title="Edit Price"
                      >
                        ₹
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
