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
  LogIn,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  UserCheck,
} from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { BlenderCoins } from '../common/Blender3DIcons';
import { CurrencyCode } from '../../types';
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
    loginAs,
    signOut,
    updateProfile,
    toastMessage,
    alerts,
    triggeredAlerts,
  } = useTracker();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

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

  const toggleTheme = () => {
    updateProfile({ theme: user.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <div className={`min-h-screen ${user.theme === 'dark' ? 'bg-[#0A0F1D] text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 border border-blue-500/50 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Application Bar */}
      <header className="no-print sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <button
            onClick={() => handleNavClick(isAuthenticated ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-base shadow-md group-hover:scale-105 transition-transform">
              V
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
                <span>Vestoria</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">
                  Tracker
                </span>
              </div>
              <div className="text-[10px] text-slate-400 leading-none mt-1">
                Unified Wealth &amp; Portfolios
              </div>
            </div>
          </button>
        </div>

        {/* Center / Right Quick Bar */}
        <div className="flex items-center gap-3">
          {/* Landing / App View Switcher */}
          <button
            onClick={() => handleNavClick(currentScreen === 'landing' ? 'dashboard' : 'landing')}
            className="hidden sm:flex text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700/80 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            {currentScreen === 'landing' ? 'Go to Dashboard →' : 'Public Landing Page'}
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton variant="header" />

          {/* Quick Add Transaction Button if Authenticated */}
          {isAuthenticated && (
            <button
              onClick={onOpenAddTx}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Add Trade</span>
            </button>
          )}

          {/* Base Currency Chip */}
          <div className="hidden md:flex items-center gap-1 px-2.5 py-1 bg-slate-800/80 border border-slate-700 rounded-xl text-xs font-mono text-slate-300">
            <Globe size={13} className="text-slate-400" />
            <span>{CURRENCY_SYMBOLS[user.baseCurrency]} {user.baseCurrency}</span>
          </div>

          {/* User Role Switcher Dropdown (Investor / Admin / Guest) */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition-all cursor-pointer"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  user.role === 'admin'
                    ? 'bg-amber-400'
                    : user.role === 'investor'
                    ? 'bg-emerald-400'
                    : 'bg-slate-400'
                }`}
              />
              <span className="capitalize">{user.role}: {user.name.split(' ')[0]}</span>
              <ChevronDown size={13} className="text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1 animate-fade-in"
                onMouseLeave={() => setRoleMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Switch Active Role
                </div>
                <button
                  onClick={() => { loginAs('investor'); setRoleMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between ${
                    user.role === 'investor' ? 'bg-blue-600/20 text-blue-300 font-bold' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span>Investor (Bala)</span>
                  <span className="text-[10px] text-emerald-400">Full Access</span>
                </button>
                <button
                  onClick={() => { loginAs('admin'); setRoleMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between ${
                    user.role === 'admin' ? 'bg-amber-600/20 text-amber-300 font-bold' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span>Administrator</span>
                  <span className="text-[10px] text-amber-400">Telemetry &amp; Feeds</span>
                </button>
                <button
                  onClick={() => { loginAs('guest'); setRoleMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between ${
                    user.role === 'guest' ? 'bg-slate-800 text-white font-bold' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span>Guest Visitor</span>
                  <span className="text-[10px] text-slate-400">Public Landing</span>
                </button>

                <div className="border-t border-slate-800 my-1" />

                <button
                  onClick={() => { onOpenFeedback(); setRoleMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                >
                  <MessageSquare size={14} /> Send Feedback
                </button>
              </div>
            )}
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {user.theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Sign In / Sign Out */}
          {isAuthenticated ? (
            <button
              onClick={signOut}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut size={17} />
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Desktop Sidebar (Hidden on landing page or mobile) */}
        {currentScreen !== 'landing' && (
          <aside className="no-print hidden md:flex flex-col w-60 border-r border-slate-800/80 bg-slate-900/40 p-4 space-y-6 shrink-0">
            {/* Nav Menu */}
            <nav className="space-y-1.5 flex-1">
              {navItems.map((item) => {
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Sidebar Footer Info */}
            <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
              <div className="text-white font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Price Feed Live</span>
              </div>
              <div>Scheduled updates active</div>
            </div>
          </aside>
        )}

        {/* Mobile Sidebar Modal */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-sm">
            <div className="w-72 h-full bg-slate-900 p-5 space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-lg font-bold text-white">Menu Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleNavClick('landing')}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                    currentScreen === 'landing' ? 'bg-blue-600 text-white' : 'text-slate-300'
                  }`}
                >
                  Public Landing Page
                </button>
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      currentScreen === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Workspace Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Global Disclaimer Footer */}
      <footer className="no-print border-t border-slate-800/80 px-6 py-4 text-center text-xs text-slate-500 bg-slate-950/40">
        Vestoria is a personal investment tracking application. It is not a broker, investment advisor, or financial service.
      </footer>
    </div>
  );
};
