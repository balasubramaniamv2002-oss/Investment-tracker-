import React, { useState } from 'react';
import { X, Bell, Zap } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { AlertCondition } from '../../types';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose }) => {
  const { assets, prices, addAlert } = useTracker();
  const [assetId, setAssetId] = useState(assets[0]?.id || 'BTC');
  const [condition, setCondition] = useState<AlertCondition>('above');
  const [threshold, setThreshold] = useState<string>('70000');
  const [channel, setChannel] = useState<'email' | 'push' | 'both'>('both');

  if (!isOpen) return null;

  const currentPrice = prices[assetId]?.price || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numThreshold = parseFloat(threshold);
    if (isNaN(numThreshold) || numThreshold <= 0) return;

    addAlert({
      assetId,
      condition,
      threshold: numThreshold,
      channel,
      active: true,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="text-amber-400" size={18} />
              Set Price & Movement Alert
            </h2>
            <p className="text-xs text-slate-400">
              Notified via Web Push or Email upon scheduled refresh trigger
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
              Select Asset
            </label>
            <select
              value={assetId}
              onChange={(e) => {
                setAssetId(e.target.value);
                const cur = prices[e.target.value]?.price;
                if (cur) setThreshold(cur.toString());
              }}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.symbol} - {a.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Current market price: <span className="font-mono font-semibold text-slate-200">${currentPrice.toLocaleString()}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Trigger Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as AlertCondition)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="above">Price rises above threshold (&gt;=)</option>
              <option value="below">Price drops below threshold (&lt;=)</option>
              <option value="change_up_pct">24h Gain exceeds +% threshold</option>
              <option value="change_down_pct">24h Drop exceeds -% threshold</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {condition.includes('pct') ? 'Threshold Percentage (%)' : 'Target Price Threshold ($)'}
            </label>
            <input
              type="number"
              step="any"
              min="0.01"
              required
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Notification Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'push', label: 'Web Push' },
                { id: 'email', label: 'Email' },
                { id: 'both', label: 'Both' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setChannel(c.id as 'email' | 'push' | 'both')}
                  className={`py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                    channel === c.id
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
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
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Zap size={14} /> Create Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
