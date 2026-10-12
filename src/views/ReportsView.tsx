import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle,
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { formatCurrency, formatPercent } from '../utils/currency';

type ReportRange = 'YTD' | '30D' | '6M' | '1Y' | 'ALL';

export const ReportsView: React.FC = () => {
  const { summary, holdings, user } = useTracker();
  const [range, setRange] = useState<ReportRange>('YTD');

  const handlePrintPdf = () => {
    window.print();
  };

  // Estimate Tax basis under Indian IT Act (Budget 2024 LTCG @ 12.5% beyond ₹1.25 Lakh exemption)
  const taxableLtcg = Math.max(0, summary.realisedGain - (user.baseCurrency === 'INR' ? 125000 : 1500));
  const estimatedTax = taxableLtcg * 0.125;

  return (
    <div className="space-y-6">
      {/* Top Header - Hidden in Print */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white">Performance &amp; Tax Gains Report</h2>
          <p className="text-xs text-slate-400">
            Realised and unrealised gains analysis, dividend income, and audit-ready PDF export
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time Range Selector */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            {(['YTD', '30D', '6M', '1Y', 'ALL'] as ReportRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  range === r
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrintPdf}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Printer size={15} />
            <span>Download / Print PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Container */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8 text-white">
        {/* Document Header for PDF */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                V
              </div>
              <span className="text-xl font-black tracking-tight text-white">Vestoria</span>
            </div>
            <h1 className="text-lg font-bold text-slate-100 mt-2">
              Portfolio Gains &amp; Tax Estimate Statement
            </h1>
            <p className="text-xs text-slate-400">
              Reporting Period: <strong className="text-slate-200">{range} (As of {new Date().toLocaleDateString()})</strong>
            </p>
          </div>

          <div className="text-right text-xs text-slate-400 space-y-1 font-mono">
            <div>Investor: <strong className="text-white font-sans">{user.name}</strong></div>
            <div>Account: {user.email}</div>
            <div>Base Currency: {user.baseCurrency}</div>
          </div>
        </div>

        {/* Core Financial Totals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Realised P&amp;L</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
              +{formatCurrency(summary.realisedGain, user.baseCurrency)}
            </div>
            <span className="text-[10px] text-slate-500">From closed trades</span>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Unrealised P&amp;L</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
              +{formatCurrency(summary.unrealisedGain, user.baseCurrency)}
            </div>
            <span className="text-[10px] text-slate-500">Open market value</span>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Dividends Received</span>
            <div className="text-xl font-bold font-mono text-blue-400 mt-1">
              +{formatCurrency(summary.totalDividends, user.baseCurrency)}
            </div>
            <span className="text-[10px] text-slate-500">Cash income paid</span>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 p-4 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Est. Indian Capital Gains Tax</span>
            <div className="text-xl font-bold font-mono text-amber-400 mt-1">
              {formatCurrency(estimatedTax, user.baseCurrency)}
            </div>
            <span className="text-[10px] text-slate-500">LTCG @ 12.5% (post ₹1.25L exemption)</span>
          </div>
        </div>

        {/* Detailed Asset Performance Breakdown */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Holding-Level Return Schedule
          </h3>
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800 text-slate-400 font-semibold">
                <tr>
                  <th className="p-3">Asset</th>
                  <th className="p-3 text-right">Cost Basis</th>
                  <th className="p-3 text-right">Current Value</th>
                  <th className="p-3 text-right">Unrealised Gain</th>
                  <th className="p-3 text-right">Realised Gain</th>
                  <th className="p-3 text-right">Dividends</th>
                  <th className="p-3 text-right">Total Return %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {holdings.map((h) => {
                  const assetTotalReturn = h.unrealisedGain + h.realisedGain + h.dividendsTotal;
                  const retPct = h.investedAmount > 0 ? (assetTotalReturn / h.investedAmount) * 100 : 0;
                  return (
                    <tr key={h.assetId} className="hover:bg-slate-800/30">
                      <td className="p-3 font-sans font-bold text-white">
                        {h.symbol} <span className="text-slate-400 font-normal">({h.name})</span>
                      </td>
                      <td className="p-3 text-right text-slate-300">
                        {formatCurrency(h.investedAmount, user.baseCurrency)}
                      </td>
                      <td className="p-3 text-right font-semibold text-white">
                        {formatCurrency(h.currentValue, user.baseCurrency)}
                      </td>
                      <td className="p-3 text-right text-emerald-400">
                        +{formatCurrency(h.unrealisedGain, user.baseCurrency)}
                      </td>
                      <td className="p-3 text-right text-slate-300">
                        {h.realisedGain > 0 ? `+${formatCurrency(h.realisedGain, user.baseCurrency)}` : '$0.00'}
                      </td>
                      <td className="p-3 text-right text-blue-400">
                        {h.dividendsTotal > 0 ? `+${formatCurrency(h.dividendsTotal, user.baseCurrency)}` : '$0.00'}
                      </td>
                      <td className="p-3 text-right font-bold text-emerald-400">
                        {formatPercent(retPct)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Disclaimer on Statement */}
        <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
          <p>
            Generated on {new Date().toISOString()} via Vestoria Investment Tracker.
          </p>
          <p>
            *Tax figures are estimates based on standard rates and are provided for planning purposes only. Consult a licensed certified tax professional for official tax return filing.
          </p>
        </div>
      </div>
    </div>
  );
};
