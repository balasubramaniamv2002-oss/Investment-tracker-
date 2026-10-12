import React, { useState, useMemo } from 'react';
import { DailySnapshot } from '../../types';
import { useTracker } from '../../context/TrackerContext';
import { formatCurrency, formatPercent } from '../../utils/currency';

type TimeRange = '1M' | '6M' | '1Y' | 'ALL';

export const PortfolioChart: React.FC = () => {
  const { snapshots, user } = useTracker();
  const [timeRange, setTimeRange] = useState<TimeRange>('1Y');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const filteredSnapshots = useMemo(() => {
    if (!snapshots || snapshots.length === 0) return [];
    const total = snapshots.length;
    let sliceDays = 365;

    switch (timeRange) {
      case '1M':
        sliceDays = 30;
        break;
      case '6M':
        sliceDays = 180;
        break;
      case '1Y':
        sliceDays = 365;
        break;
      case 'ALL':
        sliceDays = total;
        break;
    }

    return snapshots.slice(Math.max(0, total - sliceDays));
  }, [snapshots, timeRange]);

  if (filteredSnapshots.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400">
        No historical snapshot data available
      </div>
    );
  }

  const values = filteredSnapshots.map((s) => s.totalValue);
  const invested = filteredSnapshots.map((s) => s.invested);
  const minVal = Math.min(...values, ...invested) * 0.95;
  const maxVal = Math.max(...values, ...invested) * 1.05;
  const range = maxVal - minVal || 1;

  // Chart coordinate space
  const width = 800;
  const height = 280;
  const paddingX = 20;
  const paddingTop = 25;
  const paddingBottom = 30;
  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = width - paddingX * 2;

  const getX = (idx: number) => {
    return paddingX + (idx / (filteredSnapshots.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    return paddingTop + chartHeight - ((val - minVal) / range) * chartHeight;
  };

  // Build SVG Path for Value Line
  const points = filteredSnapshots.map((s, idx) => `${getX(idx)},${getY(s.totalValue)}`);
  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `${linePath} L ${getX(filteredSnapshots.length - 1)},${height - paddingBottom} L ${getX(0)},${height - paddingBottom} Z`;

  // Build SVG Path for Invested Basis (Dashed)
  const investedPoints = filteredSnapshots.map((s, idx) => `${getX(idx)},${getY(s.invested)}`);
  const investedLinePath = `M ${investedPoints.join(' L ')}`;

  const activePoint = hoverIndex !== null ? filteredSnapshots[hoverIndex] : filteredSnapshots[filteredSnapshots.length - 1];
  const firstPoint = filteredSnapshots[0];
  const totalChange = activePoint.totalValue - firstPoint.totalValue;
  const totalChangePct = firstPoint.totalValue > 0 ? (totalChange / firstPoint.totalValue) * 100 : 0;
  const isPositive = totalChange >= 0;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Top Header & Range Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <div className="text-xs uppercase font-semibold tracking-wider text-slate-400">
            Portfolio Value Over Time
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-2xl lg:text-3xl font-extrabold text-white font-mono">
              {formatCurrency(activePoint.totalValue, user.baseCurrency)}
            </span>
            <span
              className={`text-sm font-semibold flex items-center gap-1 ${
                isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isPositive ? '▲ +' : '▼ '}
              {formatCurrency(Math.abs(totalChange), user.baseCurrency)} ({formatPercent(totalChangePct, false)})
            </span>
            <span className="text-xs text-slate-400">
              {hoverIndex !== null ? activePoint.date : `over ${timeRange}`}
            </span>
          </div>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          {(['1M', '6M', '1Y', 'ALL'] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => {
                setTimeRange(r);
                setHoverIndex(null);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                timeRange === r
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div className="relative w-full aspect-8/3 min-h-[220px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const pct = Math.max(0, Math.min(1, (mouseX - (paddingX / width) * rect.width) / ((chartWidth / width) * rect.width)));
            const index = Math.round(pct * (filteredSnapshots.length - 1));
            setHoverIndex(index);
          }}
        >
          <defs>
            <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.45" />
              <stop offset="85%" stopColor="#3B82F6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>

          {/* Grid horizontal guide lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = paddingTop + chartHeight * pct;
            const gridVal = maxVal - pct * range;
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                  opacity="0.4"
                />
                <text
                  x={width - paddingX}
                  y={y - 4}
                  textAnchor="end"
                  fill="#64748B"
                  fontSize="10"
                  fontFamily="Inter"
                >
                  {formatCurrency(gridVal, user.baseCurrency, { compact: true })}
                </text>
              </g>
            );
          })}

          {/* Invested Basis Line */}
          <path
            d={investedLinePath}
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.6"
          />

          {/* Value Area & Line */}
          <path d={areaPath} fill="url(#valueGrad)" />
          <path
            d={linePath}
            fill="none"
            stroke="url(#strokeGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Scrubbing Cursor */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={paddingTop}
                x2={getX(hoverIndex)}
                y2={height - paddingBottom}
                stroke="#60A5FA"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(activePoint.totalValue)}
                r="6"
                fill="#3B82F6"
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(activePoint.invested)}
                r="4"
                fill="#94A3B8"
                stroke="#0F172A"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-slate-400 mt-2 px-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-blue-500 rounded-full" /> Total Portfolio Value
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-b border-dashed border-slate-400" /> Invested Basis ({formatCurrency(activePoint.invested, user.baseCurrency, { compact: true })})
            </span>
          </div>
          <div>
            Unrealised P&L: <span className="font-semibold text-emerald-400">+{formatCurrency(activePoint.totalValue - activePoint.invested, user.baseCurrency, { compact: true })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
