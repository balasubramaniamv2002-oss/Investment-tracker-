import React, { useState } from 'react';
import { useTracker } from '../../context/TrackerContext';
import {
  getAssetTypeAllocation,
  getSectorAllocation,
  getCurrencyAllocation,
} from '../../utils/calculations';
import { formatCurrency, formatPercent } from '../../utils/currency';

type AllocationTab = 'asset_type' | 'sector' | 'currency';

const PALETTE = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#64748B', // Slate
  '#14B8A6', // Teal
  '#E11D48', // Rose
];

export const AllocationChart: React.FC = () => {
  const { holdings, user, summary } = useTracker();
  const [tab, setTab] = useState<AllocationTab>('asset_type');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const data = React.useMemo(() => {
    if (tab === 'asset_type') return getAssetTypeAllocation(holdings);
    if (tab === 'sector') return getSectorAllocation(holdings);
    return getCurrencyAllocation(holdings);
  }, [tab, holdings]);

  const totalValue = summary.totalValue || 1;

  // Compute donut chart segments
  const size = 200;
  const radius = 70;
  const innerRadius = 46;
  const cx = size / 2;
  const cy = size / 2;

  let cumulativeAngle = -Math.PI / 2;
  const segments = data.map((item, idx) => {
    const fraction = item.percentage / 100;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + fraction * Math.PI * 2;
    cumulativeAngle = endAngle;

    // SVG arc coordinates
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const ix1 = cx + innerRadius * Math.cos(endAngle);
    const iy1 = cy + innerRadius * Math.sin(endAngle);
    const ix2 = cx + innerRadius * Math.cos(startAngle);
    const iy2 = cy + innerRadius * Math.sin(startAngle);

    const largeArc = fraction > 0.5 ? 1 : 0;
    const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;

    return {
      name: item.name,
      value: item.value,
      percentage: item.percentage,
      color: PALETTE[idx % PALETTE.length],
      path: pathData,
    };
  });

  const activeSegment = hoverIndex !== null ? segments[hoverIndex] : null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-full">
      {/* Header and Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-xs uppercase font-semibold tracking-wider text-slate-400">
            Portfolio Diversification
          </h3>
          <p className="text-sm font-bold text-white mt-0.5">Asset Allocation</p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
          <button
            onClick={() => { setTab('asset_type'); setHoverIndex(null); }}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              tab === 'asset_type' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Asset Type
          </button>
          <button
            onClick={() => { setTab('sector'); setHoverIndex(null); }}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              tab === 'sector' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sector
          </button>
          <button
            onClick={() => { setTab('currency'); setHoverIndex(null); }}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              tab === 'currency' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Currency
          </button>
        </div>
      </div>

      {holdings.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm py-8">
          No holdings in this portfolio yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center flex-1">
          {/* Donut graphic */}
          <div className="md:col-span-5 flex items-center justify-center relative">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-44 h-44 drop-shadow-md">
              {segments.map((seg, idx) => (
                <path
                  key={idx}
                  d={seg.path}
                  fill={seg.color}
                  opacity={hoverIndex === null || hoverIndex === idx ? 1 : 0.4}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoverIndex(idx)}
                  onMouseLeave={() => setHoverIndex(null)}
                />
              ))}
            </svg>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              {activeSegment ? (
                <>
                  <span className="text-xs font-medium text-slate-300 truncate max-w-[100px]">
                    {activeSegment.name}
                  </span>
                  <span className="text-sm font-bold text-white font-mono">
                    {formatPercent(activeSegment.percentage, false)}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[11px] font-medium text-slate-400">Total</span>
                  <span className="text-xs font-bold text-white font-mono">
                    {formatCurrency(totalValue, user.baseCurrency, { compact: true })}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Breakdown List */}
          <div className="md:col-span-7 flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
            {segments.map((seg, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
                className={`flex items-center justify-between text-xs p-1.5 rounded-lg transition-colors cursor-pointer ${
                  hoverIndex === idx ? 'bg-slate-800' : 'hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="font-medium text-slate-200 truncate">{seg.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono shrink-0">
                  <span className="text-slate-400 font-semibold">{formatPercent(seg.percentage, false)}</span>
                  <span className="text-slate-200 font-medium">
                    {formatCurrency(seg.value, user.baseCurrency, { compact: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
