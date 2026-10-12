import React, { useState } from 'react';
import {
  User,
  Globe,
  Sun,
  Moon,
  Bell,
  Download,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { CurrencyCode } from '../types';
import { CURRENCY_SYMBOLS } from '../utils/currency';
import { PWAInstallButton } from '../components/common/PWAInstallButton';

export const SettingsView: React.FC = () => {
  const {
    user,
    updateProfile,
    deleteAccount,
    transactions,
    portfolios,
    goals,
    alerts,
    showToast,
    resetToZero,
    loadDemoData,
  } = useTracker();

  const [name, setName] = useState(user.name);
  const [baseCurrency, setBaseCurrency] = useState<CurrencyCode>(user.baseCurrency);
  const [theme, setTheme] = useState<'dark' | 'light'>(user.theme);
  const [notifications, setNotifications] = useState(user.notificationSettings);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      baseCurrency,
      theme,
      notificationSettings: notifications,
    });
  };

  const handleDownloadBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      user,
      portfolios,
      transactions,
      goals,
      alerts,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vestoria_full_backup_${user.uid}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Full user backup JSON generated & downloaded.');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmationText.trim().toLowerCase() === 'delete my account') {
      deleteAccount();
      setShowDeleteConfirm(false);
    } else {
      showToast('Please type "delete my account" to confirm deletion.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <h2 className="text-xl font-bold text-white">Account &amp; System Settings</h2>
        <p className="text-xs text-slate-400">
          Manage identity, base reporting currency, notification channels, and data privacy
        </p>
      </div>

      {/* PWA Mobile App Installation Card */}
      <PWAInstallButton variant="banner" />

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Details Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User size={16} className="text-blue-400" /> User Profile &amp; Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-slate-800/50 border border-slate-800 text-slate-400 rounded-xl px-3 py-2 text-sm cursor-not-allowed"
                />
                {user.emailVerified && (
                  <span className="shrink-0 flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                    <CheckCircle size={12} /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Currency & Theme (FR-04, FR-22) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe size={16} className="text-blue-400" /> Valuation Currency &amp; Visual Theme
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Base Reporting Currency
              </label>
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value as CurrencyCode)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="USD">USD ($) - United States Dollar</option>
                <option value="EUR">EUR (€) - Eurozone Euro</option>
                <option value="GBP">GBP (£) - British Pound Sterling</option>
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="JPY">JPY (¥) - Japanese Yen</option>
                <option value="CAD">CAD (CA$) - Canadian Dollar</option>
                <option value="AUD">AUD (A$) - Australian Dollar</option>
                <option value="SGD">SGD (S$) - Singapore Dollar</option>
                <option value="CHF">CHF - Swiss Franc</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                All portfolios, totals, and day gains recalculate instantly using live daily FX rates.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Display Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    theme === 'dark'
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Moon size={14} /> Dark Navy
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    theme === 'light'
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Sun size={14} /> Light Slate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell size={16} className="text-blue-400" /> Notifications &amp; Alerts
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 cursor-pointer">
              <span className="font-medium text-slate-200">Email Price Threshold Alerts</span>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) =>
                  setNotifications({ ...notifications, email: e.target.checked })
                }
                className="w-4 h-4 accent-blue-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 cursor-pointer">
              <span className="font-medium text-slate-200">Web Push Notifications</span>
              <input
                type="checkbox"
                checked={notifications.webPush}
                onChange={(e) =>
                  setNotifications({ ...notifications, webPush: e.target.checked })
                }
                className="w-4 h-4 accent-blue-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 cursor-pointer">
              <span className="font-medium text-slate-200">Weekly Performance Digest</span>
              <input
                type="checkbox"
                checked={notifications.weeklyDigest}
                onChange={(e) =>
                  setNotifications({ ...notifications, weeklyDigest: e.target.checked })
                }
                className="w-4 h-4 accent-blue-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 cursor-pointer">
              <span className="font-medium text-slate-200">Milestone Achievement Toasts</span>
              <input
                type="checkbox"
                checked={notifications.priceAlerts}
                onChange={(e) =>
                  setNotifications({ ...notifications, priceAlerts: e.target.checked })
                }
                className="w-4 h-4 accent-blue-600"
              />
            </label>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Data Backup & Privacy Export (Workflow 6) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Download size={16} className="text-emerald-400" /> Export Full Account Data
        </h3>
        <p className="text-xs text-slate-400">
          Download a complete machine-readable JSON archive containing all portfolios, transactions,
          historical records, goals, and alert monitors.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadBackup}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={14} className="text-emerald-400" />
            <span>Download Complete JSON Archive</span>
          </button>

          <button
            type="button"
            onClick={resetToZero}
            className="px-4 py-2 bg-slate-800 hover:bg-amber-950/40 text-amber-300 border border-amber-600/30 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Clear All Trades (Reset to ₹0.00)
          </button>

          <button
            type="button"
            onClick={loadDemoData}
            className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Load Sample Demo Portfolio
          </button>
        </div>
      </div>

      {/* Danger Zone: Account Deletion (FR-23, Workflow 6) */}
      <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
          <AlertTriangle size={18} />
          <span>Danger Zone: Account Deletion</span>
        </div>
        <p className="text-xs text-slate-400">
          Permanently delete your account, authentication credentials, and all recorded investment
          transactions. This action cannot be reversed.
        </p>

        {showDeleteConfirm ? (
          <div className="bg-slate-900/90 p-4 rounded-xl border border-rose-800 space-y-3">
            <p className="text-xs text-rose-300 font-semibold">
              Type <strong>delete my account</strong> below to proceed:
            </p>
            <input
              type="text"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder="delete my account"
              className="w-full bg-slate-800 border border-slate-700 text-rose-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-500 font-mono"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
              >
                Confirm Permanent Deletion
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-rose-900/40 hover:bg-rose-900/70 text-rose-300 border border-rose-800/80 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Delete Account and All Records</span>
          </button>
        )}
      </div>
    </div>
  );
};
