import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'settings';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA on the home screen, hide
  if (isInstalled) {
    if (variant === 'settings') {
      return (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs">
          <CheckCircle size={16} />
          <span>App is installed and running in native standalone mode.</span>
        </div>
      );
    }
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'banner') {
      return (
        <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/50 border border-blue-500/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
              <Smartphone size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Install Vestoria on Your Phone</h4>
              <p className="text-xs text-slate-300">
                Install as a native application for fast 1-tap launch, offline access &amp; instant alerts.
              </p>
            </div>
          </div>
          <button
            onClick={install}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-105"
          >
            <Download size={15} />
            <span>Install App</span>
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={install}
        className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer hover:scale-105"
        title="Install Vestoria as a mobile or desktop application"
      >
        <Download size={14} />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>
    );
  }

  // iOS Safari flow (Safari WebKit does not emit beforeinstallprompt)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="px-3 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
        >
          <Smartphone size={14} />
          <span>Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-white space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="text-blue-400" size={20} />
                  <h3 className="text-sm font-bold">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5 p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <Share2 className="text-blue-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <strong>Step 1:</strong> Tap the <strong>Share</strong> button in your Safari bottom toolbar.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <PlusSquare className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <strong>Step 2:</strong> Scroll down and select <strong>&quot;Add to Home Screen&quot;</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <CheckCircle className="text-amber-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <strong>Step 3:</strong> Tap <strong>Add</strong> at the top right. Vestoria is now on your home screen!
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for browsers that don't emit prompt yet (always provide an install action button)
  return (
    <>
      <button
        onClick={() => setShowIOSGuide(true)}
        className="px-3 py-1.5 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
        title="Add Vestoria to Home Screen / Install"
      >
        <Download size={14} />
        <span>Install App</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Smartphone className="text-blue-400" size={20} />
                <h3 className="text-sm font-bold">Install as Mobile App</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>To install Vestoria on your phone or desktop:</p>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
                <div>• <strong>On Android (Chrome):</strong> Tap the 3 dots <strong>⋮</strong> menu ➔ Tap <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.</div>
                <div>• <strong>On iPhone (Safari):</strong> Tap the <strong>Share</strong> button ➔ Tap <strong>&quot;Add to Home Screen&quot;</strong>.</div>
                <div>• <strong>On PC / Mac (Chrome/Edge):</strong> Click the install icon <strong>⊕</strong> in your browser address bar.</div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
