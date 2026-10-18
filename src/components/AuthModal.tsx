import React, { useState } from 'react';
import { X, Lock, Mail, ShieldAlert, CheckCircle2, Clock, AlertTriangle, ArrowRight, UserCheck } from 'lucide-react';
import type { User, UserStatus } from '../types.ts';
import { registerUser, loginUser } from '../utils/authStorage.ts';
import { BrandLogo } from './BrandLogo.tsx';
import { SocialLinks } from './SocialLinks.tsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onGoToAdmin: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onGoToAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pendingNotice, setPendingNotice] = useState<boolean>(false);
  const [rejectedNotice, setRejectedNotice] = useState<boolean>(false);

  React.useEffect(() => {
    if (isOpen) {
      setPendingNotice(false);
      setRejectedNotice(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPendingNotice(false);
    setRejectedNotice(false);

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    const res = registerUser(email, password);
    if (!res.success) {
      setError(res.error || 'Failed to register account.');
      return;
    }

    // Success! Show mandatory pending approval screen
    setPendingNotice(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPendingNotice(false);
    setRejectedNotice(false);

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    const res = loginUser(email, password);

    if (res.status === 'pending') {
      setPendingNotice(true);
      return;
    }

    if (res.status === 'rejected') {
      setRejectedNotice(true);
      return;
    }

    if (!res.success || !res.user) {
      setError(res.message);
      return;
    }

    // Approved!
    onLoginSuccess(res.user);
    onClose();
  };

  // Quick Demo Logins for fast testing
  const handleQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError(null);
    setPendingNotice(false);
    setRejectedNotice(false);

    const res = loginUser(demoEmail, 'password123');
    if (res.status === 'pending') {
      setPendingNotice(true);
    } else if (res.status === 'rejected') {
      setRejectedNotice(true);
    } else if (res.success && res.user) {
      onLoginSuccess(res.user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-md bg-[#0a0d15] border border-amber-500/30 rounded-2xl shadow-[0_0_50px_rgba(255,215,0,0.25)] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Gold Border */}
        <div className="h-1.5 w-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <BrandLogo size="sm" showTagline={false} />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pending Screen Notice State */}
        {pendingNotice ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border-2 border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
              <Clock className="w-8 h-8 animate-pulse text-amber-400" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                Pending Admin Approval
              </h3>
              <p className="mt-2 text-sm text-amber-200/90 font-medium leading-relaxed bg-amber-500/10 p-3 rounded-xl border border-amber-400/20">
                &ldquo;Account pending secret admin approval. You will be notified once activated.&rdquo;
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              PRO SOCCER ET maintains strict member curation. An administrator must approve your email ({email}) before prediction slips and VIP bankers can be accessed.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onClose();
                  onGoToAdmin();
                }}
                className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-black font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Switch to Secret Admin Panel to Approve</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setPendingNotice(false);
                  setActiveTab('login');
                }}
                className="text-xs text-slate-400 hover:text-white py-1 transition-colors"
              >
                Return to Login
              </button>
            </div>
          </div>
        ) : rejectedNotice ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 border-2 border-rose-500/40 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                Account Blocked
              </h3>
              <p className="mt-2 text-sm text-rose-300 font-medium leading-relaxed bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                Your registration request has been declined by the administrator. Access to PRO SOCCER ET is restricted.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onClose();
                  onGoToAdmin();
                }}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs rounded-xl border border-slate-700"
              >
                Review Status in Admin Portal
              </button>

              <button
                onClick={() => {
                  setRejectedNotice(false);
                  setActiveTab('login');
                }}
                className="text-xs text-slate-400 hover:text-white py-1"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 pt-2">
            {/* Tabs */}
            <div className="grid grid-cols-2 gap-1 bg-[#121622] p-1 rounded-xl border border-slate-800 mb-5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setError(null);
                }}
                className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  activeTab === 'login'
                    ? 'bg-amber-400 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setError(null);
                }}
                className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  activeTab === 'register'
                    ? 'bg-amber-400 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={activeTab === 'login' ? handleLogin : handleRegister}
              className="space-y-4"
            >
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
                    placeholder="e.g. member@prosoccer.et"
                    required
                    className="w-full bg-[#121622] border border-slate-700 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
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
                    className="w-full bg-[#121622] border border-slate-700 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              {activeTab === 'register' && (
                <div className="p-3 bg-amber-500/10 border border-amber-400/20 rounded-xl text-[11px] text-amber-200">
                  <span className="font-bold block mb-0.5">Admin Approval Required:</span>
                  New registrations are queued for secret administrator verification before VIP dashboard activation.
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] text-black font-black uppercase tracking-wider text-xs rounded-xl transition-all cursor-pointer"
              >
                {activeTab === 'login' ? 'Sign In to Dashboard' : 'Register for Approval'}
              </button>
            </form>

            {/* Direct Official Social Channels */}
            <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col items-center gap-2.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                Official Channels
              </span>
              <SocialLinks size="sm" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
