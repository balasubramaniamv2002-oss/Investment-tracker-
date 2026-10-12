import React from 'react';
import {
  TrendingUp,
  Shield,
  ArrowRight,
  CheckCircle,
  FileSpreadsheet,
  Sparkles,
  Zap,
  Smartphone,
  Lock,
} from 'lucide-react';
import {
  BlenderCoins,
  BlenderShield,
} from '../components/common/Blender3DIcons';

interface LandingViewProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLaunchDemo: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onOpenAuth,
  onLaunchDemo,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 py-4 px-2 sm:px-4 animate-fade-in">
      {/* Mobile Header Badge */}
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Smartphone size={13} />
          <span>Vestoria Mobile App</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </div>

        {/* 3D App Emblem */}
        <div className="pt-2 pb-1 flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 p-0.5 shadow-2xl shadow-blue-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-[#0A0F1D] rounded-[22px] flex items-center justify-center">
                <span className="text-3xl font-black bg-gradient-to-tr from-blue-400 via-indigo-200 to-emerald-400 bg-clip-text text-transparent">
                  V
                </span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0A0F1D] flex items-center justify-center text-white text-[10px] font-bold">
              ₹
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
          Track Your Wealth <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            In Real Time
          </span>
        </h1>

        <p className="text-xs text-slate-300 leading-relaxed px-4">
          All your Indian stocks, mutual funds, SGBs, and deposits in a single unified pocket tracker.
        </p>
      </div>

      {/* Main Action Buttons (Mobile First) */}
      <div className="space-y-2.5 pt-1">
        <button
          onClick={() => onOpenAuth('signup')}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          <span>Create Free Account</span>
          <ArrowRight size={16} />
        </button>

        <button
          onClick={() => onOpenAuth('login')}
          className="w-full py-3.5 px-4 bg-slate-800/90 hover:bg-slate-700/90 text-white font-bold text-sm rounded-2xl border border-slate-700/80 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          <span>Sign In to Existing Account</span>
        </button>

        <button
          onClick={onLaunchDemo}
          className="w-full py-2.5 text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Zap size={14} />
          <span>Explore Sample Demo Portfolio</span>
        </button>
      </div>

      {/* Supported Assets Mobile Pills */}
      <div className="space-y-2 pt-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
          Supported Asset Classes (INR)
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-slate-800/50 rounded-xl border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="font-semibold text-slate-200">NSE &amp; BSE Stocks</span>
          </div>
          <div className="p-2.5 bg-slate-800/50 rounded-xl border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-slate-200">Mutual Funds</span>
          </div>
          <div className="p-2.5 bg-slate-800/50 rounded-xl border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-semibold text-slate-200">SGB Gold Bonds</span>
          </div>
          <div className="p-2.5 bg-slate-800/50 rounded-xl border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="font-semibold text-slate-200">Fixed Deposits</span>
          </div>
        </div>
      </div>

      {/* Key Feature Cards */}
      <div className="space-y-2.5 pt-2">
        <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-start gap-3 shadow-md">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
            <TrendingUp size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Live CMP &amp; Portfolio Returns</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Accurate weighted average cost, real-time valuation, and day P&amp;L in Indian Rupees.
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-start gap-3 shadow-md">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <FileSpreadsheet size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">1-Click CSV Broker Import</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Import Zerodha, Groww, or Upstox trades instantly with automatic column mapping.
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-start gap-3 shadow-md">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <Lock size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Private &amp; Offline Ready</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              No bank passwords needed. Works offline with PWA local caching.
            </p>
          </div>
        </div>
      </div>

      {/* Regulatory Footer Note */}
      <div className="pt-4 pb-6 text-center text-[10px] text-slate-500 space-y-1">
        <p>Vestoria is an independent personal investment tracker. Not a broker or financial advisor.</p>
        <p>© 2026 Vestoria • Mobile Application</p>
      </div>
    </div>
  );
};
