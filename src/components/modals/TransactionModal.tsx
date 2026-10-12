import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Search, Plus, Sparkles } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { Transaction, TransactionType, CurrencyCode } from '../../types';
import { CURRENCY_SYMBOLS } from '../../utils/currency';
import { resolveIndianTicker, POPULAR_INDIAN_TICKERS } from '../../utils/indianTickerLookup';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTx?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  editTx,
}) => {
  const {
    assets,
    prices,
    portfolios,
    selectedPortfolioId,
    addTransaction,
    editTransaction,
    addCustomAsset,
    holdings,
    user,
  } = useTracker();

  const [portfolioId, setPortfolioId] = useState(
    selectedPortfolioId !== 'all' ? selectedPortfolioId : portfolios[0]?.id || ''
  );
  const [assetId, setAssetId] = useState(assets[0]?.id || 'RELIANCE');
  const [type, setType] = useState<TransactionType>('buy');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState<string>('10');
  const [price, setPrice] = useState<string>('2942.5');
  const [fees, setFees] = useState<string>('20');
  const [currency, setCurrency] = useState<CurrencyCode>(user.baseCurrency);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Ticker Quick Search / Add custom NSE ticker
  const [tickerSearch, setTickerSearch] = useState('');
  const [showTickerDirectory, setShowTickerDirectory] = useState(false);

  // Set fields on edit mode or open
  useEffect(() => {
    if (editTx) {
      setPortfolioId(editTx.portfolioId);
      setAssetId(editTx.assetId);
      setType(editTx.type);
      setDate(editTx.date);
      setQuantity(editTx.quantity.toString());
      setPrice(editTx.price.toString());
      setFees(editTx.fees.toString());
      setCurrency(editTx.currency);
      setNotes(editTx.notes || '');
      setError(null);
    } else {
      setPortfolioId(selectedPortfolioId !== 'all' ? selectedPortfolioId : portfolios[0]?.id || '');
      setDate(new Date().toISOString().split('T')[0]);
      setError(null);
      // Default to first asset price
      const first = assets[0]?.id || 'RELIANCE';
      setAssetId(first);
      const curP = prices[first]?.price;
      if (curP) setPrice(curP.toString());
    }
  }, [editTx, isOpen, selectedPortfolioId, portfolios, assets]);

  if (!isOpen) return null;

  const currentHolding = holdings.find((h) => h.assetId === assetId);
  const currentlyHeldQty = currentHolding ? currentHolding.quantity : 0;

  const handleSelectAsset = (selectedId: string) => {
    setAssetId(selectedId);
    const p = prices[selectedId]?.price;
    if (p) setPrice(p.toString());
    setShowTickerDirectory(false);
    setTickerSearch('');
  };

  const handleQuickAddCustomTicker = (tickerText: string) => {
    if (!tickerText.trim()) return;
    const resolved = resolveIndianTicker(tickerText);
    const added = addCustomAsset({
      symbol: resolved.symbol,
      name: resolved.name,
      type: resolved.type,
      currency: 'INR',
      exchange: 'NSE / BSE',
      sector: resolved.sector,
    });
    setAssetId(added.id);
    setPrice(resolved.defaultPrice.toString());
    setShowTickerDirectory(false);
    setTickerSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numQty = parseFloat(quantity);
    const numPrice = parseFloat(price);
    const numFees = parseFloat(fees) || 0;

    if (isNaN(numQty) || numQty <= 0) {
      setError('Quantity must be a positive number greater than 0.');
      return;
    }
    if (isNaN(numPrice) || numPrice < 0) {
      setError('Price cannot be negative.');
      return;
    }
    if (isNaN(numFees) || numFees < 0) {
      setError('Fees / brokerage cannot be negative.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (date > todayStr) {
      setError('Transaction date cannot be in the future.');
      return;
    }

    if (type === 'sell' && !editTx) {
      if (numQty > currentlyHeldQty) {
        setError(
          `Sell quantity (${numQty}) exceeds currently held quantity (${currentlyHeldQty}) for this asset.`
        );
        return;
      }
    }

    const payload = {
      portfolioId,
      assetId,
      type,
      date,
      quantity: numQty,
      price: numPrice,
      fees: numFees,
      currency,
      notes,
    };

    if (editTx) {
      editTransaction(editTx.id, payload);
    } else {
      addTransaction(payload);
    }

    onClose();
  };

  const totalAmount = (parseFloat(quantity) || 0) * (parseFloat(price) || 0) + (parseFloat(fees) || 0);

  const filteredAssets = assets.filter(
    (a) =>
      a.symbol.toLowerCase().includes(tickerSearch.toLowerCase()) ||
      a.name.toLowerCase().includes(tickerSearch.toLowerCase()) ||
      a.sector.toLowerCase().includes(tickerSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{editTx ? 'Edit Transaction' : 'Record New Transaction'}</span>
              <span className="text-[11px] bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded border border-blue-500/20">
                NSE / BSE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              True weighted average cost, realised P&amp;L and day change recalculate instantly
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Transaction Type Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Action Type
            </label>
            <div className="grid grid-cols-5 gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/50">
              {(['buy', 'sell', 'dividend', 'deposit', 'withdrawal'] as TransactionType[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                    type === t
                      ? t === 'buy' || t === 'deposit' || t === 'dividend'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/40'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Portfolio & Indian Asset Selection */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Portfolio
              </label>
              <select
                value={portfolioId}
                onChange={(e) => setPortfolioId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                {portfolios.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Indian Asset Picker / Universal Ticker Search */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Select or Add Any Indian Ticker (NSE / BSE / Mutual Fund / SGB)
                </label>
                <button
                  type="button"
                  onClick={() => setShowTickerDirectory(!showTickerDirectory)}
                  className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                >
                  <Search size={11} /> {showTickerDirectory ? 'Hide Search' : 'Search / Add Ticker'}
                </button>
              </div>

              {/* Universal Search & Instant Add Box */}
              {showTickerDirectory && (
                <div className="mb-2 p-3 bg-slate-800/90 border border-blue-500/30 rounded-xl space-y-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 text-slate-400" size={14} />
                    <input
                      type="text"
                      value={tickerSearch}
                      onChange={(e) => setTickerSearch(e.target.value)}
                      placeholder="Type any ticker e.g. RVNL, PAYTM, BEL, COCHINSHIP, IRCTC..."
                      className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg pl-8 pr-3 py-2 uppercase font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {tickerSearch.trim() && (
                    <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                      {filteredAssets.slice(0, 5).map((a) => (
                        <div
                          key={a.id}
                          onClick={() => handleSelectAsset(a.id)}
                          className="p-1.5 hover:bg-slate-700 rounded-lg flex items-center justify-between text-xs cursor-pointer text-slate-200"
                        >
                          <span className="font-bold text-white">{a.symbol} - {a.name}</span>
                          <span className="font-mono text-slate-300">₹{prices[a.id]?.price || 0}</span>
                        </div>
                      ))}

                      {/* Instant Add Button if user typed any custom ticker */}
                      <button
                        type="button"
                        onClick={() => handleQuickAddCustomTicker(tickerSearch)}
                        className="w-full mt-1 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors"
                      >
                        <Plus size={13} /> Add &ldquo;{tickerSearch.toUpperCase()}&rdquo; to Indian Catalog
                      </button>
                    </div>
                  )}
                </div>
              )}

              <select
                value={assetId}
                onChange={(e) => handleSelectAsset(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.symbol} — {a.name} ({a.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Held Quantity Info Note for Sells */}
          {type === 'sell' && (
            <div className="text-xs text-slate-400 bg-slate-800/40 px-3 py-2 rounded-xl border border-slate-700/40 flex justify-between">
              <span>Available to sell in portfolio:</span>
              <span className="font-semibold text-white">{currentlyHeldQty} units</span>
            </div>
          )}

          {/* Date & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Transaction Date
              </label>
              <input
                type="date"
                value={date}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>
          </div>

          {/* Quantity, Price per unit & Brokerage/Fees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Quantity (Units/Shares)
              </label>
              <input
                type="number"
                step="any"
                min="0.000001"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                placeholder="10"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Price Per Share / NAV (₹)
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="2942.5"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Brokerage / STT (₹)
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                placeholder="20"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Settlement Value Preview */}
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Settlement Value:</span>
            <span className="font-bold text-white font-mono text-sm">
              {CURRENCY_SYMBOLS[currency]} {isNaN(totalAmount) ? '0.00' : totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Notes (Broker ref, Zerodha / Groww contract note, SIP)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Zerodha monthly SIP, Groww contract note #8234, long-term buy"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg transition-colors"
            >
              {editTx ? 'Save Changes' : 'Record Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
