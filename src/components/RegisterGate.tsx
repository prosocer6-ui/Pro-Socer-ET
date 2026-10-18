import React, { useState } from 'react';
import { Mail, Lock, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { registerUser, loginUser } from '../utils/authStorage.ts';
import type { User } from '../types.ts';
import { SocialLinks } from './SocialLinks.tsx';

interface RegisterGateProps {
  onLoginSuccess: (user: User) => void;
  onOpenAdmin: () => void;
}

export const RegisterGate: React.FC<RegisterGateProps> = ({
  onLoginSuccess,
  onOpenAdmin,
}) => {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (mode === 'register') {
      const res = registerUser(clean, password || 'password123');
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to register.');
        return;
      }
      // Registration successful! Switch to pending screen
      setPendingEmail(clean);
      setIsPending(true);
    } else {
      // Login flow
      const res = loginUser(clean, password);
      if (res.status === 'pending') {
        setPendingEmail(clean);
        setIsPending(true);
        return;
      }
      if (res.status === 'rejected') {
        setErrorMessage('Your registration request was declined by the administrator.');
        return;
      }
      if (!res.success || !res.user) {
        setErrorMessage(res.message || 'Invalid credentials.');
        return;
      }
      onLoginSuccess(res.user);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      {isPending ? (
        <div className="bg-[#0b0e17] border border-amber-500/30 rounded-3xl p-8 text-center shadow-[0_0_40px_rgba(255,215,0,0.2)] animate-in fade-in duration-300">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border-2 border-amber-400/40 flex items-center justify-center text-amber-400 mb-4 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
            <Clock className="w-8 h-8 animate-pulse text-amber-400" />
          </div>

          <h3 className="text-xl font-black text-white uppercase tracking-tight">
            Pending Admin Approval
          </h3>

          <div className="mt-3 p-4 bg-amber-500/10 border border-amber-400/20 rounded-2xl text-amber-200 text-xs sm:text-sm font-semibold leading-relaxed">
            &ldquo;Account pending admin approval. You will be notified once activated.&rdquo;
          </div>

          <p className="mt-4 text-xs text-slate-400 leading-relaxed">
            Email <span className="font-semibold text-white">{pendingEmail}</span> has been submitted. The administrator will review and approve your account.
          </p>

          <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              Follow Us While You Wait
            </span>
            <SocialLinks size="md" />

            <button
              onClick={() => {
                setIsPending(false);
                setMode('login');
              }}
              className="mt-2 text-xs text-amber-400 hover:underline"
            >
              Sign In with Another Account
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#0b0e17] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(255,215,0,0.2)] animate-in fade-in duration-300">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-[10px] font-bold text-amber-300 uppercase tracking-widest mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Private VIP Access</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              {mode === 'register' ? 'Register by Email' : 'Sign In to Account'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {mode === 'register'
                ? 'Register your email below. The administrator will review and approve your access.'
                : 'Enter your approved email and password.'}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-[#121622] border border-slate-700 focus:border-amber-400 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#121622] border border-slate-700 focus:border-amber-400 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] text-black font-black uppercase tracking-wider text-xs rounded-xl transition-all cursor-pointer mt-2"
            >
              {mode === 'register' ? 'Register for Admin Approval' : 'Sign In'}
            </button>
          </form>

          {/* Switch mode */}
          <div className="mt-5 text-center text-xs">
            {mode === 'register' ? (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className="text-slate-400 hover:text-amber-300 transition-colors"
              >
                Already registered and approved? <span className="text-amber-400 font-bold underline">Sign In</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                }}
                className="text-slate-400 hover:text-amber-300 transition-colors"
              >
                Need access? <span className="text-amber-400 font-bold underline">Register by Email</span>
              </button>
            )}
          </div>

          {/* Social Links */}
          <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col items-center gap-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              Official Channels (Direct)
            </span>
            <SocialLinks size="sm" />
          </div>
        </div>
      )}
    </div>
  );
};
