import React, { useState } from 'react';
import {
  ShieldAlert,
  Server,
  Users,
  Activity,
  Plus,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
  Star,
  MessageSquare,
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { Asset, AssetType, CurrencyCode } from '../types';
import { BlenderAssetIcon } from '../components/common/Blender3DIcons';
import { POPULAR_INDIAN_TICKERS } from '../utils/indianTickerLookup';

export const AdminView: React.FC = () => {
  const {
    assets,
    addCustomAsset,
    scheduledJobStatus,
    refreshPricesNow,
    isRefreshingPrices,
    feedbacks,
    prices,
    showToast,
  } = useTracker();

  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<AssetType>('stocks');
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [exchange, setExchange] = useState('NSE / BSE');
  const [sector, setSector] = useState('Indian Listed Equity');

  const handleBulkLoadAllIndianTickers = () => {
    let addedCount = 0;
    for (const t of POPULAR_INDIAN_TICKERS) {
      if (!assets.some((a) => a.symbol === t.symbol)) {
        addCustomAsset({
          symbol: t.symbol,
          name: t.name,
          type: t.type,
          currency: 'INR',
          exchange: 'NSE / BSE',
          sector: t.sector,
        });
        addedCount++;
      }
    }
    showToast(`Loaded ${addedCount} additional Indian tickers into active catalog!`);
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim() || !name.trim()) return;

    addCustomAsset({
      symbol: symbol.trim().toUpperCase(),
      name: name.trim(),
      type,
      currency,
      exchange: exchange.trim(),
      sector: sector.trim(),
    });

    setSymbol('');
    setName('');
    setIsAddingAsset(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert size={20} className="text-amber-400" />
            <h2 className="text-xl font-bold text-white">System Administration Console</h2>
          </div>
          <p className="text-xs text-slate-400">
            Real-time platform telemetry, Scheduled Cloud Function orchestrator, asset catalog, and user feedback
          </p>
        </div>

        <button
          onClick={refreshPricesNow}
          disabled={isRefreshingPrices}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
        >
          <Zap size={14} className={isRefreshingPrices ? 'animate-spin' : ''} />
          <span>{isRefreshingPrices ? 'Executing Cron...' : 'Force Cron Price Sync'}</span>
        </button>
      </div>

      {/* Usage & System Telemetry Metrics (FR-24) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Registered Investors</span>
            <Users size={16} className="text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">1,482</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">
            +48 signups this week (Blaze Free Tier OK)
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Daily Active Users (DAU)</span>
            <Activity size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">924</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Subcollection index queries: 100% hits
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Price Function Health</span>
            <Server size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">99.98%</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Avg latency: {scheduledJobStatus.executionDurationMs}ms • 0 fatal errors
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Data Provider Quota</span>
            <Zap size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">14.2%</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Batch rate limits respected • Firestore cached
          </div>
        </div>
      </div>

      {/* Cloud Function Status Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <Clock size={16} className="text-blue-400" /> Scheduled Cloud Function Telemetry (Workflow 4)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
          <div>
            <div className="text-slate-400 text-[11px]">Last Invocation:</div>
            <div className="text-white font-bold mt-0.5">{new Date(scheduledJobStatus.lastRunTime).toLocaleTimeString()}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Next Scheduled:</div>
            <div className="text-white font-bold mt-0.5">{new Date(scheduledJobStatus.nextRunTime).toLocaleTimeString()}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Assets Evaluated:</div>
            <div className="text-white font-bold mt-0.5">{scheduledJobStatus.assetsCheckedCount} feeds</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Alerts Dispatched:</div>
            <div className="text-emerald-400 font-bold mt-0.5">{scheduledJobStatus.alertsTriggeredCount} sent</div>
          </div>
        </div>
      </div>

      {/* Asset Catalog Manager (FR-25) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers size={16} className="text-blue-400" /> Global Asset Catalog ({assets.length} assets)
            </h3>
            <p className="text-xs text-slate-400">
              Manage tickers, exchanges, classifications, and price feeds
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkLoadAllIndianTickers}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Zap size={14} className="text-amber-400" /> Bulk Load All 40+ NSE/BSE Tickers
            </button>
            <button
              onClick={() => setIsAddingAsset(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Add Asset to Catalog
            </button>
          </div>
        </div>

        {/* Add Asset Inline Form */}
        {isAddingAsset && (
          <form
            onSubmit={handleAddAsset}
            className="bg-slate-800/80 p-4 rounded-xl border border-blue-500/30 space-y-3"
          >
            <h4 className="text-xs font-bold text-white">Add New Asset to Global Registry</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Ticker / Symbol</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PLTR, AMD"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Palantir Technologies"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Asset Class</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AssetType)}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5"
                >
                  <option value="stocks">Stocks &amp; Equities</option>
                  <option value="etfs">ETFs</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="mutual_funds">Mutual Funds</option>
                  <option value="gold">Gold &amp; Commodities</option>
                  <option value="fixed_deposits">Fixed Deposits</option>
                  <option value="real_estate">Real Estate &amp; REITs</option>
                  <option value="cash">Cash &amp; Sweep</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Exchange</label>
                <input
                  type="text"
                  value={exchange}
                  onChange={(e) => setExchange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Sector</label>
                <input
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingAsset(false)}
                className="px-3 py-1 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg"
              >
                Add Asset
              </button>
            </div>
          </form>
        )}

        <div className="max-h-60 overflow-y-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800 text-slate-400 font-semibold sticky top-0">
              <tr>
                <th className="p-2.5">Symbol</th>
                <th className="p-2.5">Name</th>
                <th className="p-2.5">Type</th>
                <th className="p-2.5">Exchange</th>
                <th className="p-2.5">Feed Price</th>
                <th className="p-2.5">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
              {assets.map((a) => (
                <tr key={a.id} className="hover:bg-slate-800/40">
                  <td className="p-2.5 font-bold text-white flex items-center gap-2">
                    <BlenderAssetIcon type={a.type} size={20} />
                    <span>{a.symbol}</span>
                  </td>
                  <td className="p-2.5 text-slate-300 font-sans">{a.name}</td>
                  <td className="p-2.5 uppercase text-slate-400">{a.type}</td>
                  <td className="p-2.5 text-slate-400">{a.exchange}</td>
                  <td className="p-2.5 text-white font-bold">
                    ${prices[a.id]?.price.toLocaleString() || '100.00'}
                  </td>
                  <td className="p-2.5 text-slate-400 font-sans">{a.sector}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User In-App Feedback Log (FR-27) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <MessageSquare size={16} className="text-blue-400" /> User In-App Feedback Submissions ({feedbacks.length})
        </h3>

        <div className="space-y-2">
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="bg-slate-800/40 border border-slate-700/60 p-3.5 rounded-xl text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-slate-200">
                  <span>{fb.userName}</span>
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px]">
                    {fb.category}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: fb.rating }).map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-400" />
                  ))}
                  <span className="text-[11px] text-slate-500 ml-2">
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-slate-300 font-sans leading-relaxed">
                "{fb.message}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
