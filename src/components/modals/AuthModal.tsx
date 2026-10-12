import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { CurrencyCode } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultMode = 'signup',
}) => {
  const { loginAs, signUpWithEmail, signInWithEmail, showToast } = useTracker();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(defaultMode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [baseCurrency, setBaseCurrency] = useState<CurrencyCode>('INR');

  if (!isOpen) return null;

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    signUpWithEmail(email, name || 'New Investor', baseCurrency);
    onSuccess?.();
    onClose();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    signInWithEmail(email);
    onSuccess?.();
    onClose();
  };

  const handleGoogleSignIn = () => {
    loginAs('investor');
    onSuccess?.();
    onClose();
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Password reset link sent to ${email || 'your email'}.`);
    setMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative p-6 pb-4 bg-gradient-to-b from-slate-800/80 to-transparent border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              V
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">Vestoria</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-2">
            {mode === 'signup'
              ? 'Create Your Investment Account'
              : mode === 'login'
              ? 'Welcome Back to Vestoria'
              : 'Reset Your Password'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'signup'
              ? 'Track multi-asset portfolios, true returns & net worth in one place.'
              : mode === 'login'
              ? 'Log in to view live holdings, goals and scheduled analytics.'
              : 'Enter your registered email to receive recovery instructions.'}
          </p>
        </div>

        {/* Quick Demo Switcher Strip */}
        <div className="bg-slate-800/40 px-6 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Quick Demo Profiles:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { loginAs('investor'); onSuccess?.(); onClose(); }}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 underline"
            >
              Investor (Bala)
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => { loginAs('admin'); onSuccess?.(); onClose(); }}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-5 space-y-4">
          {mode === 'forgot' ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-slate-500" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-colors"
              >
                Send Password Reset Email
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full text-center text-xs text-slate-400 hover:text-white"
              >
                Back to Log In
              </button>
            </form>
          ) : (
            <>
              {/* Google 1-Click Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2.5 shadow-sm transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold absolute">
                  or with email
                </span>
              </div>

              {/* Form */}
              <form
                onSubmit={mode === 'signup' ? handleSignUp : handleLogin}
                className="space-y-3"
              >
                {mode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 text-slate-500" size={16} />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Alex Morgan"
                          className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Base Currency (Onboarding Setup)
                      </label>
                      <select
                        value={baseCurrency}
                        onChange={(e) => setBaseCurrency(e.target.value as CurrencyCode)}
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="USD">USD ($) - US Dollar</option>
                        <option value="EUR">EUR (€) - Euro</option>
                        <option value="GBP">GBP (£) - British Pound</option>
                        <option value="INR">INR (₹) - Indian Rupee</option>
                        <option value="JPY">JPY (¥) - Japanese Yen</option>
                        <option value="CAD">CAD (CA$) - Canadian Dollar</option>
                        <option value="AUD">AUD (A$) - Australian Dollar</option>
                        <option value="SGD">SGD (S$) - Singapore Dollar</option>
                        <option value="CHF">CHF - Swiss Franc</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-slate-500" size={16} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] text-blue-400 hover:text-blue-300"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 text-slate-500" size={16} />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  {mode === 'signup' ? 'Complete Sign Up' : 'Sign In to Dashboard'}
                  <ArrowRight size={15} />
                </button>
              </form>

              {/* Mode Toggle Footer */}
              <div className="text-center pt-2">
                {mode === 'signup' ? (
                  <p className="text-xs text-slate-400">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="font-semibold text-blue-400 hover:text-blue-300 ml-1"
                    >
                      Sign In
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="font-semibold text-blue-400 hover:text-blue-300 ml-1"
                    >
                      Sign Up
                    </button>
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
