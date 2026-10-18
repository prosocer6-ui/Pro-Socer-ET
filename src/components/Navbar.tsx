import React from 'react';
import type { User } from '../types.ts';
import { Lock, LogOut, ArrowLeft, KeyRound } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  pendingCount: number;
  isAdminView: boolean;
  onToggleAdminView: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  pendingCount,
  isAdminView,
  onToggleAdminView,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="w-full bg-[#05070a]/80 backdrop-blur-md border-b border-amber-500/15 py-3 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: View toggle or empty (no logo, no extra links) */}
        <div>
          {isAdminView && (
            <button
              onClick={onToggleAdminView}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Predict</span>
            </button>
          )}
        </div>

        {/* Right: ONLY Admin Portal & Auth */}
        <div className="flex items-center gap-3">
          {/* Admin Portal Only Button */}
          <button
            onClick={onToggleAdminView}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border ${
              isAdminView
                ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                : 'bg-slate-900/90 text-amber-400 border-amber-500/30 hover:border-amber-400 hover:bg-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
            {pendingCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-black bg-amber-500 text-black rounded-full tabular-nums">
                {pendingCount}
              </span>
            )}
          </button>

          {/* User Session */}
          {currentUser && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline truncate max-w-[150px]">
                {currentUser.email}
              </span>
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
