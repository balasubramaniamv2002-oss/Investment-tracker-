import React from 'react';
import confetti from 'canvas-confetti';
import { Target, Plus, CheckCircle2, Calendar, TrendingUp, Sparkles, Trash2 } from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { formatCurrency } from '../utils/currency';

interface GoalsViewProps {
  onOpenAddGoal: () => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({ onOpenAddGoal }) => {
  const { goals, deleteGoal, summary, user, portfolios } = useTracker();

  const handleCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white">Financial Milestone Goals</h2>
          <p className="text-xs text-slate-400">
            Set net worth milestones, target completion dates, and track real progress
          </p>
        </div>

        <button
          onClick={onOpenAddGoal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Plus size={15} />
          <span>New Target Goal</span>
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-16 text-center text-slate-400 space-y-4">
          <Target size={44} className="mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-slate-200">No active goals yet</h3>
          <p className="text-xs max-w-sm mx-auto">
            Set clear targets like a $50k emergency fund, down payment, or financial independence number.
          </p>
          <button
            onClick={onOpenAddGoal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((g) => {
            const currentVal = summary.totalValue;
            const pct = Math.min(100, Math.max(0, (currentVal / g.targetAmount) * 100));
            const isCompleted = currentVal >= g.targetAmount;
            const remaining = Math.max(0, g.targetAmount - currentVal);

            // Compute months until target date
            const targetDateObj = new Date(g.targetDate);
            const now = new Date();
            const diffMonths = Math.max(
              1,
              (targetDateObj.getFullYear() - now.getFullYear()) * 12 +
                (targetDateObj.getMonth() - now.getMonth())
            );
            const monthlyPace = remaining / diffMonths;

            return (
              <div
                key={g.id}
                className={`bg-slate-900/60 border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all ${
                  isCompleted
                    ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-slate-900'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-blue-500/10 text-blue-400'
                        }`}
                      >
                        <Target size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{g.name}</h3>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Calendar size={12} />
                          <span>Target: {g.targetDate}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteGoal(g.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                      title="Delete goal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Progress Numbers */}
                  <div className="my-4">
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-xl font-black text-white font-mono">
                        {formatCurrency(currentVal, user.baseCurrency, { compact: true })}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        of {formatCurrency(g.targetAmount, user.baseCurrency, { compact: true })}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isCompleted
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] mt-2 text-slate-400 font-semibold">
                      <span>{pct.toFixed(1)}% Achieved</span>
                      <span>
                        {isCompleted
                          ? '🎉 Target Reached!'
                          : `${formatCurrency(remaining, user.baseCurrency, { compact: true })} left`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Projection / Celebration Footer */}
                <div className="pt-3 border-t border-slate-800/80 text-xs">
                  {isCompleted ? (
                    <button
                      onClick={handleCelebrate}
                      className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles size={14} />
                      <span>Celebrate Milestone!</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Required Pace:</span>
                      <span className="font-mono font-bold text-white">
                        ~{formatCurrency(monthlyPace, user.baseCurrency, { compact: true })} / mo
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
