import React from 'react';
import {
  TrendingUp,
  Shield,
  Layers,
  ArrowRight,
  CheckCircle,
  FileSpreadsheet,
  Globe,
  Bell,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  BlenderHeroComposition,
  BlenderAssetIcon,
  BlenderCoins,
  BlenderShield,
} from '../components/common/Blender3DIcons';
import { AssetType } from '../types';

interface LandingViewProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLaunchDemo: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onOpenAuth,
  onLaunchDemo,
}) => {
  const assetTypes: { type: AssetType; title: string; desc: string }[] = [
    { type: 'stocks', title: 'NSE & BSE Equities', desc: 'All Indian stocks: Nifty 50, Defense, PSU, IT, & Smallcaps' },
    { type: 'etfs', title: 'Indian Index ETFs', desc: 'Nifty BeES, Bank BeES, Gold BeES, IT BeES, & Liquid BeES' },
    { type: 'mutual_funds', title: 'Direct Mutual Funds', desc: 'AMFI Direct-Growth schemes across Flexicap, Midcap & Smallcap' },
    { type: 'gold', title: 'SGB & Gold Bullion', desc: 'Sovereign Gold Bonds (2.5% RBI interest) & MCX 24K Gold' },
    { type: 'fixed_deposits', title: 'Fixed Deposits & PPF', desc: 'SBI, HDFC Bank term deposits and tax-free Public Provident Fund' },
    { type: 'real_estate', title: 'Indian REITs & Property', desc: 'Embassy, Nexus Select, Brookfield REITs & residential property' },
    { type: 'crypto', title: 'Digital Assets (INR)', desc: 'Bitcoin, Ethereum, Polygon (POL) and Web3 in Indian Rupees' },
    { type: 'cash', title: 'Bank Savings & Liquid', desc: 'Savings bank accounts, overnight sweep & emergency liquidity' },
  ];

  return (
    <div className="space-y-24 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 p-8 lg:p-14 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles size={14} />
              <span>Engineered for Serious Wealth Tracking</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Every investment. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                One unified truth.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Stop juggling fragmented broker apps, bank logins, and fragile spreadsheets.
              Vestoria calculates your true net worth, weighted cost basis, realized gains,
              and multi-asset risk in under 2 minutes.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl shadow-xl hover:shadow-blue-600/30 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onLaunchDemo}
                className="px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 font-bold text-sm rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Try Live Demo Dashboard</span>
                <Zap size={16} className="text-amber-400" />
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-400" /> No Bank Credentials Needed
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-400" /> Per-User Data Isolation
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-400" /> 8 Global Asset Classes
              </span>
            </div>
          </div>

          {/* 3D Blender Hero Scene */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <BlenderHeroComposition />
          </div>
        </div>
      </section>

      {/* Asset Classes Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Built for Complete Portfolio Diversification
          </h2>
          <p className="text-sm text-slate-400">
            From blue-chip stocks and index funds to physical gold bullion and fixed deposits,
            every asset class has its home in Vestoria.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {assetTypes.map((item) => (
            <div
              key={item.type}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group"
            >
              <div className="mb-4">
                <BlenderAssetIcon type={item.type} size={48} className="group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Features Showcase */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
            <TrendingUp size={22} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Mathematical Accuracy</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            True weighted average cost basis (FIFO/AVCO) with full separation of realised
            capital gains, dividends received, and unrealised fluctuations.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
            <FileSpreadsheet size={22} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">CSV Import &amp; Export</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Import hundreds of historical transactions with intelligent column mapping,
            preview validation, and instant error isolation. Export anytime.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
            <Shield size={22} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Privacy &amp; Security</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Isolated per-user Firestore security model. Your holdings are private to your UID.
            Export all data or delete your account with a single click.
          </p>
        </div>
      </section>

      {/* Pricing / Transparent Model (PRD FR-26) */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-8">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-blue-400">
            Simple &amp; Fair
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-1">Start Tracking Today</h2>
          <p className="text-xs text-slate-400 mt-2">
            No forced bank syncs, no advertisements, and zero sale of user telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="bg-slate-800/60 border border-slate-700/80 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Community Edition</span>
              <div className="text-3xl font-black text-white mt-1 mb-3">Free Forever</div>
              <p className="text-xs text-slate-300 mb-4">
                Everything required for individual wealth and portfolio tracking.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">✓ Unlimited transactions &amp; holdings</li>
                <li className="flex items-center gap-2">✓ All 8 asset classes</li>
                <li className="flex items-center gap-2">✓ Multi-currency daily FX rates</li>
                <li className="flex items-center gap-2">✓ CSV import &amp; export</li>
                <li className="flex items-center gap-2">✓ Realised gains reports</li>
              </ul>
            </div>
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
            >
              Sign Up Free
            </button>
          </div>

          <div className="bg-gradient-to-b from-blue-950/40 to-slate-900 border border-blue-600/40 p-6 rounded-2xl flex flex-col justify-between relative">
            <span className="absolute -top-3 right-4 px-3 py-0.5 bg-blue-600 text-[10px] font-bold text-white rounded-full uppercase tracking-wider">
              Pro Power
            </span>
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase">Pro Wealth</span>
              <div className="text-3xl font-black text-white mt-1 mb-3">₹499 <span className="text-sm font-normal text-slate-400">/ month</span></div>
              <p className="text-xs text-slate-300 mb-4">
                Automated alerts, PDF export packs, and unlimited goal projections.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">✓ Everything in Community</li>
                <li className="flex items-center gap-2">✓ Scheduled price refresh Cloud Function</li>
                <li className="flex items-center gap-2">✓ Web Push &amp; Email alerts</li>
                <li className="flex items-center gap-2">✓ Tax estimation &amp; PDF gain reports</li>
                <li className="flex items-center gap-2">✓ Priority feature roadmap voting</li>
              </ul>
            </div>
            <button
              onClick={onLaunchDemo}
              className="w-full mt-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Try in Demo Mode
            </button>
          </div>
        </div>
      </section>

      {/* Mandatory Regulatory Disclaimer (PRD Section 5 & Section 14) */}
      <footer className="text-center pt-8 border-t border-slate-800 text-xs text-slate-500 max-w-3xl mx-auto space-y-2">
        <p className="font-semibold text-slate-400">
          Disclaimer: Vestoria is a personal investment and net worth tracking application, not a financial advisor, broker, or dealer.
        </p>
        <p>
          Information displayed within Vestoria is provided for general informational and tracking purposes only and does not constitute financial, investment, legal, or tax advice. Past performance is no guarantee of future returns.
        </p>
        <p className="pt-2 text-slate-600">
          © 2026 Vestoria Technologies. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
