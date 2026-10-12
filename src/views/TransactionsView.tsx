import React, { useState, useMemo } from 'react';
import {
  Plus,
  Download,
  Upload,
  Search,
  Trash2,
  Edit2,
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  Filter,
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { Transaction, TransactionType } from '../types';
import { formatCurrency } from '../utils/currency';
import { BlenderAssetIcon } from '../components/common/Blender3DIcons';

interface TransactionsViewProps {
  onOpenAddTx: (tx?: Transaction) => void;
  onOpenCsvImport: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  onOpenAddTx,
  onOpenCsvImport,
}) => {
  const {
    transactions,
    deleteTransaction,
    exportTransactionsCsv,
    assetsMap,
    portfolios,
    user,
    showToast,
  } = useTracker();

  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [portfolioFilter, setPortfolioFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const handleExportCsv = () => {
    const csvData = exportTransactionsCsv();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vestoria_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Transactions exported to CSV successfully.');
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      if (portfolioFilter !== 'all' && tx.portfolioId !== portfolioFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const asset = assetsMap[tx.assetId];
        const matchSymbol = asset ? asset.symbol.toLowerCase().includes(q) : false;
        const matchName = asset ? asset.name.toLowerCase().includes(q) : false;
        const matchNotes = tx.notes ? tx.notes.toLowerCase().includes(q) : false;
        if (!matchSymbol && !matchName && !matchNotes) return false;
      }

      return true;
    });
  }, [transactions, typeFilter, portfolioFilter, search, assetsMap]);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white">Transactions Ledger</h2>
          <p className="text-xs text-slate-400">
            Total records: {transactions.length} transactions across all portfolios
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} className="text-blue-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenCsvImport}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Upload size={14} className="text-emerald-400" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={() => onOpenAddTx()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
            <input
              type="text"
              placeholder="Search ticker, name, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Filter by Action Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Actions (Buy, Sell, Dividend, etc.)</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
            <option value="dividend">Dividend</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Filter by Portfolio
          </label>
          <select
            value={portfolioFilter}
            onChange={(e) => setPortfolioFilter(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Portfolios</option>
            {portfolios.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            No transactions match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/70 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Asset</th>
                  <th className="p-3 text-right">Quantity</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Fees</th>
                  <th className="p-3 text-right">Total Settlement</th>
                  <th className="p-3">Portfolio</th>
                  <th className="p-3">Notes</th>
                  <th className="p-3 text-center">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredTransactions.map((tx) => {
                  const asset = assetsMap[tx.assetId];
                  const port = portfolios.find((p) => p.id === tx.portfolioId);
                  const isBuyOrDeposit = tx.type === 'buy' || tx.type === 'deposit';
                  const isDividend = tx.type === 'dividend';
                  const total = tx.quantity * tx.price + tx.fees;

                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 text-slate-300 font-sans whitespace-nowrap">
                        {tx.date}
                      </td>

                      <td className="p-3 font-sans whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            isBuyOrDeposit
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : isDividend
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {asset && <BlenderAssetIcon type={asset.type} size={22} />}
                          <span className="font-bold text-white font-sans">
                            {asset?.symbol || tx.assetId}
                          </span>
                        </div>
                      </td>

                      <td className="p-3 text-right text-slate-200">
                        {tx.quantity > 0 ? tx.quantity.toLocaleString() : '—'}
                      </td>

                      <td className="p-3 text-right text-slate-400">
                        {tx.price > 0 ? `$${tx.price.toFixed(2)}` : '—'}
                      </td>

                      <td className="p-3 text-right text-slate-400">
                        {tx.fees > 0 ? `$${tx.fees.toFixed(2)}` : '$0'}
                      </td>

                      <td className="p-3 text-right font-bold text-white">
                        ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      <td className="p-3 text-slate-400 font-sans truncate max-w-[120px]">
                        {port?.name || tx.portfolioId}
                      </td>

                      <td className="p-3 text-slate-400 font-sans truncate max-w-[160px]">
                        {tx.notes || '—'}
                      </td>

                      <td className="p-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onOpenAddTx(tx)}
                            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Edit Transaction"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => deleteTransaction(tx.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Delete Transaction"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
