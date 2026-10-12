import React from 'react';
import { AssetType } from '../../types';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * 3D Soft-Gloss Gold Coins Stack
 */
export const BlenderCoins: React.FC<IconProps> = ({ className = '', size = 64 }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center filter drop-shadow-lg ${className}`}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="goldTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="goldEdge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
          <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </linearGradient>
          <filter id="shadowCoin" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0F172A" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Ambient shadow */}
        <ellipse cx="50" cy="88" rx="36" ry="7" fill="#090D1A" opacity="0.4" />

        {/* Bottom Coin */}
        <path d="M22 66 C22 75, 78 75, 78 66 L78 72 C78 81, 22 81, 22 72 Z" fill="url(#goldEdge)" />
        <ellipse cx="50" cy="66" rx="28" ry="8.5" fill="url(#goldTop)" />

        {/* Middle Coin */}
        <path d="M20 52 C20 61, 80 61, 80 52 L80 58 C80 67, 20 67, 20 58 Z" fill="url(#goldEdge)" />
        <ellipse cx="50" cy="52" rx="30" ry="9" fill="url(#goldTop)" />

        {/* Top Coin */}
        <path d="M18 36 C18 45, 82 45, 82 36 L82 43 C82 52, 18 52, 18 43 Z" fill="url(#goldEdge)" />
        <ellipse cx="50" cy="36" rx="32" ry="9.5" fill="url(#goldTop)" filter="url(#shadowCoin)" />

        {/* Coin Inner Ring */}
        <ellipse cx="50" cy="36" rx="24" ry="7" fill="none" stroke="#FEF3C7" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.8" />
        
        {/* Embossed Dollar / Currency Glyph */}
        <path
          d="M50 29 V43 M46 31.5 C46 29.5 54 29.5 54 33 C54 36.5 46 36 46 39.5 C46 43 54 43 54 40.5"
          stroke="#78350F"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Soft-gloss reflection highlight */}
        <path d="M28 34 C35 30, 48 30, 56 32" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </svg>
    </div>
  );
};

/**
 * 3D Soft-Gloss Growth Shield with Crest
 */
export const BlenderShield: React.FC<IconProps> = ({ className = '', size = 64 }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center filter drop-shadow-lg ${className}`}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="shieldBase" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>
          <linearGradient id="shieldRim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <linearGradient id="emeraldArrow" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>

        {/* Ambient shadow */}
        <ellipse cx="50" cy="90" rx="32" ry="6" fill="#090D1A" opacity="0.35" />

        {/* Shield Outer Rim */}
        <path
          d="M50 12 L82 24 C82 56, 50 82, 50 82 C50 82, 18 56, 18 24 Z"
          fill="url(#shieldRim)"
          stroke="#93C5FD"
          strokeWidth="1.5"
        />

        {/* Shield Inner Face */}
        <path
          d="M50 18 L76 28 C76 53, 50 75, 50 75 C50 75, 24 53, 24 28 Z"
          fill="url(#shieldBase)"
        />

        {/* Gloss highlight on left curve */}
        <path
          d="M28 30 C30 50, 46 68, 49 72 C47 55, 34 35, 28 30 Z"
          fill="#FFFFFF"
          opacity="0.22"
        />

        {/* 3D Ascending Growth Arrow */}
        <path
          d="M36 56 L46 44 L54 50 L64 36 M64 36 H56 M64 36 V44"
          stroke="url(#emeraldArrow)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="64" cy="36" r="3.5" fill="#34D399" />
      </svg>
    </div>
  );
};

/**
 * 3D Isometric Asset Type Badge
 */
export const BlenderAssetIcon: React.FC<{ type: AssetType; size?: number; className?: string }> = ({
  type,
  size = 40,
  className = '',
}) => {
  switch (type) {
    case 'stocks':
      return (
        <div style={{ width: size, height: size }} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
              <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            <rect x="8" y="32" width="10" height="20" rx="3" fill="url(#barGrad1)" />
            <rect x="25" y="20" width="10" height="32" rx="3" fill="#6366F1" />
            <rect x="42" y="10" width="10" height="42" rx="3" fill="url(#barGrad2)" />
            <path d="M10 26 L26 16 L44 8" stroke="#F8FAFC" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="44" cy="8" r="3" fill="#F8FAFC" />
          </svg>
        </div>
      );

    case 'etfs':
      return (
        <div style={{ width: size, height: size }} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="etfRing" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="50%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#4338CA" />
              </linearGradient>
            </defs>
            <circle cx="30" cy="30" r="22" stroke="url(#etfRing)" strokeWidth="6" strokeDasharray="90 30" strokeLinecap="round" />
            <circle cx="30" cy="30" r="12" fill="#4F46E5" opacity="0.3" />
            <path d="M22 30 H38 M30 22 V38" stroke="#E0E7FF" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'crypto':
      return (
        <div style={{ width: size, height: size }} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="cryptoGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#C2410C" />
              </linearGradient>
            </defs>
            <circle cx="30" cy="30" r="22" fill="url(#cryptoGrad)" />
            <circle cx="30" cy="30" r="18" fill="none" stroke="#FDE68A" strokeWidth="1.5" opacity="0.7" />
            <path
              d="M26 19 V41 M30 19 V41 M26 21 H33 C36 21 37 23 37 25 C37 27 35 29 32 29 H26 M26 29 H34 C37 29 38 31 38 34 C38 37 36 39 33 39 H26"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );

    case 'mutual_funds':
      return (
        <div style={{ width: size, height: size }} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="fundGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#0E7490" />
              </linearGradient>
            </defs>
            <rect x="12" y="14" width="36" height="34" rx="6" fill="url(#fundGrad)" />
            <path d="M12 24 H48" stroke="#E0F2FE" strokeWidth="1.5" opacity="0.6" />
            <circle cx="22" cy="19" r="2" fill="#E0F2FE" />
            <circle cx="28" cy="19" r="2" fill="#E0F2FE" />
            <path d="M20 38 L27 31 L33 35 L40 28" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );

    case 'gold':
      return (
        <div style={{ width: size, height: size }} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="ingotGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#A16207" />
              </linearGradient>
            </defs>
            <path d="M14 26 L22 16 H38 L46 26 L42 44 H18 L14 26 Z" fill="url(#ingotGrad)" stroke="#CA8A04" strokeWidth="1" />
            <path d="M22 16 L25 26 L18 44" stroke="#FEF08A" strokeWidth="1" opacity="0.7" />
            <text x="30" y="36" fontSize="9" fontWeight="bold" fill="#713F12" textAnchor="middle">999.9</text>
          </svg>
        </div>
      );

    case 'fixed_deposits':
      return (
        <div style={{ width: size, height: size }} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="certGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
            <rect x="14" y="10" width="32" height="40" rx="4" fill="url(#certGrad)" />
            <circle cx="30" cy="30" r="9" fill="#ECFDF5" opacity="0.25" />
            <path d="M20 18 H40 M20 23 H34 M20 37 H32 M20 42 H40" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M27 30 L29 32 L34 27" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );

    case 'real_estate':
      return (
        <div style={{ width: size, height: size }} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="bldgGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#BE185D" />
              </linearGradient>
            </defs>
            <path d="M12 48 V22 L30 10 L48 22 V48 H12 Z" fill="url(#bldgGrad)" />
            <rect x="20" y="26" width="6" height="6" rx="1" fill="#FDF2F8" />
            <rect x="34" y="26" width="6" height="6" rx="1" fill="#FDF2F8" />
            <rect x="20" y="36" width="6" height="6" rx="1" fill="#FDF2F8" />
            <rect x="34" y="36" width="6" height="6" rx="1" fill="#FDF2F8" />
            <rect x="27" y="42" width="6" height="6" rx="1" fill="#831843" />
          </svg>
        </div>
      );

    case 'cash':
    default:
      return (
        <div style={{ width: size, height: size }} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="cashGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#15803D" />
              </linearGradient>
            </defs>
            <rect x="10" y="16" width="40" height="28" rx="4" fill="url(#cashGrad)" />
            <circle cx="30" cy="30" r="8" fill="#DCFCE7" opacity="0.3" />
            <circle cx="30" cy="30" r="4" fill="#FFFFFF" />
            <circle cx="16" cy="30" r="2" fill="#FFFFFF" opacity="0.6" />
            <circle cx="44" cy="30" r="2" fill="#FFFFFF" opacity="0.6" />
          </svg>
        </div>
      );
  }
};

/**
 * 3D Hero Scene with Coins, Shield, Growth Pillars and Floating Orbs
 */
export const BlenderHeroComposition: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-4/3 flex items-center justify-center select-none">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial from-blue-500/20 via-indigo-600/10 to-transparent blur-2xl" />

      {/* Isometric Floor Grid */}
      <svg className="absolute w-full h-full opacity-20 pointer-events-none" viewBox="0 0 400 300">
        <defs>
          <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M200 60 L360 160 L200 260 L40 160 Z" fill="none" stroke="url(#gridFade)" strokeWidth="1.5" />
        <path d="M200 110 L320 185 L200 260 L80 185 Z" fill="none" stroke="url(#gridFade)" strokeWidth="1" strokeDasharray="4 4" />
      </svg>

      {/* Floating 3D Objects */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {/* Main Shield */}
        <div className="absolute -top-2 transform transition-transform hover:scale-105 duration-300">
          <BlenderShield size={140} />
        </div>

        {/* Left Stack of Coins */}
        <div className="absolute bottom-6 left-6 transform -rotate-6 hover:scale-105 transition-transform duration-300">
          <BlenderCoins size={120} />
        </div>

        {/* Right Asset Pill Bar */}
        <div className="absolute bottom-10 right-6 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 p-4 rounded-2xl shadow-2xl flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-200">NSE / BSE Real-Time Valuation</span>
          </div>
          <div className="text-xl font-bold text-white tracking-tight font-mono">
            ₹74,85,930.00
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <span>▲ +₹1,48,200 (2.02%)</span>
            <span className="text-slate-400">today</span>
          </div>
        </div>

        {/* Floating Asset Spheres */}
        <div className="absolute top-12 left-10 p-2.5 bg-slate-800/90 rounded-2xl border border-slate-700 shadow-xl flex items-center gap-2">
          <BlenderAssetIcon type="etfs" size={28} />
          <span className="text-xs font-bold text-amber-300">NIFTYBEES +1.2%</span>
        </div>

        <div className="absolute top-16 right-10 p-2.5 bg-slate-800/90 rounded-2xl border border-slate-700 shadow-xl flex items-center gap-2">
          <BlenderAssetIcon type="stocks" size={28} />
          <span className="text-xs font-bold text-sky-300">RELIANCE +1.8%</span>
        </div>
      </div>
    </div>
  );
};
