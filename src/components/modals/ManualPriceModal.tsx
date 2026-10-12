import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { CURRENCY_SYMBOLS } from '../../utils/currency';

interface ManualPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetId: string;
}

export const ManualPriceModal: React.FC<ManualPriceModalProps> = ({
  isOpen,
  onClose,
  assetId,
}) => {
  const { assetsMap, prices, updateManualPrice, user } = useTracker();
  const asset = assetsMap[assetId];
  const currentPriceData = prices[assetId];

  const [priceInput, setPriceInput] = useState<string>(
    currentPriceData ? currentPriceData.price.toString() : '100'
  );

  if (!isOpen || !asset) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(priceInput);
    if (!isNaN(val) && val >= 0) {
      updateManualPrice(assetId, val);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="text-emerald-400" size={18} />
              Manual Price Update
            </h2>
            <p className="text-xs text-slate-400">
              For illiquid or custom assets (e.g. real estate, private funds)
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
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <div className="text-xs text-slate-400">Asset:</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {asset.name} ({asset.symbol})
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Current recorded price:{' '}
              <span className="font-mono font-semibold text-white">
                {CURRENCY_SYMBOLS[asset.currency]} {currentPriceData?.price.toLocaleString() || 'N/A'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              New Unit Price ({asset.currency})
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
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
              Update Price
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
