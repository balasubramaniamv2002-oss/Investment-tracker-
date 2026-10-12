import React, { useState } from 'react';
import {
  LayoutDashboard,
  PieChart,
  Briefcase,
  History,
  Target,
  Bell,
  FileText,
  Settings,
  ShieldAlert,
  Menu,
  X,
  Plus,
  MessageSquare,
  LogOut,
  Globe,
} from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { CURRENCY_SYMBOLS } from '../../utils/currency';
import { PWAInstallButton } from '../common/PWAInstallButton';

export type ActiveScreen =
  | 'landing'
  | 'dashboard'
  | 'holdings'
  | 'portfolios'
  | 'transactions'
  | 'goals'
  | 'alerts'
  | 'reports'
  | 'settings'
  | 'admin';

interface AppShellProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenAddTx: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenFeedback: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentScreen,
  onNavigate,
  onOpenAddTx,
  onOpenAuth,
  onOpenFeedback,
  children,
}) => {
  const {
    user,
    isAuthenticated,
    signOut,
    triggeredAlerts,
    toastMessage,
  } = useTracker();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveScreen; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'holdings', label: 'Holdings', icon: <PieChart size={18} /> },
    { id: 'portfolios', label: 'Portfolios', icon: <Briefcase size={18} /> },
    { id: 'transactions', label: 'Transactions', icon: <History size={18} /> },
    { id: 'goals', label: 'Goals', icon: <Target size={18} /> },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <Bell size={18} />,
      badge: triggeredAlerts.length > 0 ? triggeredAlerts.length : undefined,
    },
    { id: 'reports', label: 'Reports & Tax', icon: <FileText size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
    { id: 'admin', label: 'Admin Console', icon: <ShieldAlert size={18} /> },
  ];

  const handleNavClick = (screen: ActiveScreen) => {
    onNavigate(screen);
    setMobileMenuOpen(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0F1D] text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-blue-500/50 text-white text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Application Header (Full Width) */}
      <header className="no-print sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3.5 sm:px-6 py-2.5 sm:py-3">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleNavClick(isAuthenticated ? 'dashboard' : 'landing')}
              className="flex items-center gap-2 text-left group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-md">
                V
              </div>
              <div>
                <div className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
                  <span>Vestoria</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.2 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
                    NSE/BSE
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 leading-none mt-0.5">
                  Investment &amp; Net Worth Tracker
                </div>
              </div>
            </button>
          </div>

          {/* Right Header Action Icons */}
          <div className="flex items-center gap-2">
            {/* Install PWA Button */}
            <PWAInstallButton variant="header" />

            {/* Currency Chip */}
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-slate-800/80 border border-slate-700 rounded-xl text-xs font-mono text-slate-300">
              <Globe size={13} className="text-slate-400" />
              <span>{CURRENCY_SYMBOLS[user.baseCurrency]} {user.baseCurrency}</span>
            </div>

            {/* Quick Add Trade (Desktop & Tablet) */}
            {isAuthenticated && (
              <button
                onClick={onOpenAddTx}
                className="hidden sm:flex px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold items-center gap-1.5 shadow-md transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Trade</span>
              </button>
            )}

            {/* Sign In / Sign Out Button */}
            {isAuthenticated ? (
              <button
                onClick={signOut}
                className="p-1.5 sm:px-3 sm:py-1.5 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Sign In
              </button>
            )}

            {/* More Menu Drawer Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 md:hidden cursor-pointer"
              title="Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Responsive Layout (Full Width on Mobile, Max 7xl Centered on Desktop) */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex">
        {/* Desktop Sidebar (Only visible on tablet & desktop, hidden on mobile or landing) */}
        {currentScreen !== 'landing' && (
          <aside className="no-print hidden md:flex flex-col w-56 lg:w-60 border-r border-slate-800/80 bg-slate-900/30 p-4 space-y-6 shrink-0">
            <nav className="space-y-1.5 flex-1">
              {navItems.map((item) => {
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-bold text-[9px] flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Sidebar Live Feed Badge */}
            <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
              <div className="text-white font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>NSE / BSE Feeds Live</span>
              </div>
              <div className="text-[10px]">Real-time portfolio tracking</div>
            </div>
          </aside>
        )}

        {/* Mobile Drawer Menu Modal */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end md:hidden">
            <div className="w-72 h-full bg-slate-900 border-l border-slate-800 p-5 space-y-5 overflow-y-auto animate-fade-in flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                      V
                    </div>
                    <span className="text-sm font-bold text-white">Vestoria Menu</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* User Profile Strip */}
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-white truncate">{user.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                  <div className="text-[10px] text-emerald-400 uppercase font-semibold">
                    {user.role} • {CURRENCY_SYMBOLS[user.baseCurrency]} {user.baseCurrency}
                  </div>
                </div>

                {/* Navigation List */}
                <div className="space-y-1">
                  <button
                    onClick={() => handleNavClick('landing')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                      currentScreen === 'landing' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Landing &amp; Welcome
                  </button>

                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                        currentScreen === item.id
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-bold text-[9px] flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => { onOpenFeedback(); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquare size={14} /> Send App Feedback
                </button>

                {isAuthenticated ? (
                  <button
                    onClick={() => { signOut(); setMobileMenuOpen(false); }}
                    className="w-full py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area (Spans full available width on mobile) */}
        <main className="flex-1 w-full min-w-0 p-3.5 sm:p-6 lg:p-8 overflow-x-hidden pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Fixed Full-Width Mobile Bottom Navigation Bar (md:hidden, spans left-0 to right-0) */}
      {currentScreen !== 'landing' && (
        <nav className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 w-full bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl safe-area-pb">
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              currentScreen === 'dashboard' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="text-[10px]">Dashboard</span>
          </button>

          <button
            onClick={() => handleNavClick('holdings')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              currentScreen === 'holdings' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <PieChart size={20} />
            <span className="text-[10px]">Holdings</span>
          </button>

          {/* Center Floating 1-Tap Add Trade Action */}
          <button
            onClick={onOpenAddTx}
            className="flex flex-col items-center justify-center -mt-6 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-full w-12 h-12 shadow-lg shadow-blue-500/40 transition-transform active:scale-95 cursor-pointer"
            title="Add Trade"
          >
            <Plus size={24} />
          </button>

          <button
            onClick={() => handleNavClick('transactions')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              currentScreen === 'transactions' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <History size={20} />
            <span className="text-[10px]">Trades</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              ['portfolios', 'goals', 'alerts', 'reports', 'settings', 'admin'].includes(currentScreen)
                ? 'text-blue-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Menu size={20} />
            <span className="text-[10px]">More</span>
          </button>
        </nav>
      )}
    </div>
  );
};
