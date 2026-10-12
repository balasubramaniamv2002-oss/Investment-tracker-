import React, { useState } from 'react';
import { X, Target } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { CURRENCY_SYMBOLS } from '../../utils/currency';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose }) => {
  const { portfolios, addGoal, user } = useTracker();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('100000');
  const [targetDate, setTargetDate] = useState('2027-12-31');
  const [selectedPortIds, setSelectedPortIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(targetAmount);
    if (!name.trim() || isNaN(amount) || amount <= 0) return;

    addGoal({
      name: name.trim(),
      targetAmount: amount,
      targetDate,
      portfolioIds: selectedPortIds,
    });

    setName('');
    setTargetAmount('100000');
    onClose();
  };

  const togglePortfolio = (id: string) => {
    setSelectedPortIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="text-blue-400" size={18} />
              Set Financial Target Goal
            </h2>
            <p className="text-xs text-slate-400">
              Track portfolio milestone progress and estimated completion
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Goal Name / Objective
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. House Down Payment, Retirement Nest Egg"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Target Amount ({CURRENCY_SYMBOLS[user.baseCurrency]} {user.baseCurrency})
            </label>
            <input
              type="number"
              step="any"
              min="1"
              required
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Target Completion Date
            </label>
            <input
              type="date"
              required
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Include Portfolios (Empty = All Portfolios Combined)
            </label>
            <div className="flex flex-wrap gap-2">
              {portfolios.map((p) => {
                const isSelected = selectedPortIds.includes(p.id);
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => togglePortfolio(p.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
