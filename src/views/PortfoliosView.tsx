import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Archive,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
  DollarSign,
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { formatCurrency } from '../utils/currency';

interface PortfoliosViewProps {
  onSelectPortfolio: (id: string) => void;
}

export const PortfoliosView: React.FC<PortfoliosViewProps> = ({ onSelectPortfolio }) => {
  const {
    portfolios,
    createPortfolio,
    renamePortfolio,
    archivePortfolio,
    deletePortfolio,
    transactions,
    holdings,
    user,
  } = useTracker();

  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createPortfolio(newName.trim(), newDesc.trim());
    setNewName('');
    setNewDesc('');
    setIsCreating(false);
  };

  const startEdit = (p: { id: string; name: string; description: string }) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditDesc(p.description);
  };

  const saveEdit = (id: string) => {
    if (!editName.trim()) return;
    renamePortfolio(id, editName.trim(), editDesc.trim());
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white">Manage Portfolios</h2>
          <p className="text-xs text-slate-400">
            Segregate assets across investment goals, tax-sheltered accounts, or asset classes
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Plus size={15} />
          <span>New Portfolio</span>
        </button>
      </div>

      {/* New Portfolio Inline Box */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="bg-slate-900 border border-blue-500/40 p-5 rounded-2xl shadow-xl space-y-3"
        >
          <h3 className="text-sm font-bold text-white">Create New Portfolio</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Portfolio Name
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Real Estate & Income, High Alpha Crypto"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description / Purpose
              </label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Strategy notes and risk horizon"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {/* Portfolios Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {portfolios.map((p) => {
          const portTxs = transactions.filter((tx) => tx.portfolioId === p.id);
          const isEditing = editingId === p.id;

          return (
            <div
              key={p.id}
              className={`bg-slate-900/60 border rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all ${
                p.archived
                  ? 'border-slate-800 opacity-60'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Briefcase size={20} />
                  </div>
                  <div className="flex items-center gap-1">
                    {p.archived && (
                      <span className="text-[10px] bg-slate-800 text-amber-400 px-2 py-0.5 rounded-full border border-slate-700 font-semibold">
                        Archived
                      </span>
                    )}
                    <button
                      onClick={() => archivePortfolio(p.id, !p.archived)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                      title={p.archived ? 'Unarchive' : 'Archive'}
                    >
                      <Archive size={14} />
                    </button>
                    <button
                      onClick={() => deletePortfolio(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Delete Portfolio"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-2 mb-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-lg px-2 py-1"
                    />
                    <input
                      type="text"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2 py-1"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => saveEdit(p.id)}
                        className="px-2 py-1 bg-emerald-600 text-white text-xs rounded flex items-center gap-1 font-semibold"
                      >
                        <Check size={12} /> Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{p.name}</h3>
                      <button
                        onClick={() => startEdit(p)}
                        className="text-slate-500 hover:text-slate-300"
                        title="Rename"
                      >
                        <Edit2 size={12} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {p.description || 'No description provided'}
                    </p>
                  </div>
                )}
              </div>

              {/* Stats Footer */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500">Activity</div>
                  <div className="text-xs font-bold text-slate-200">
                    {portTxs.length} trades recorded
                  </div>
                </div>
                <button
                  onClick={() => onSelectPortfolio(p.id)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Filter View</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
