import React from 'react';
import { Lock } from 'lucide-react';
import { SocialLinks } from './SocialLinks.tsx';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="w-full bg-[#030508] border-t border-amber-500/15 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="font-medium text-center sm:text-left">
          © {new Date().getFullYear()} <span className="text-amber-400 font-bold">PRO SOCER ET</span>. All rights reserved.
        </div>

        {/* Official Social Channels (Instagram, TikTok, Telegram) */}
        <div className="flex items-center">
          <SocialLinks size="sm" />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer font-semibold"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Portal</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
