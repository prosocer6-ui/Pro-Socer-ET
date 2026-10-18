import React from 'react';

interface SocialLinksProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  className = '',
  size = 'md',
}) => {
  const iconClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  const buttonClass =
    size === 'sm'
      ? 'w-9 h-9'
      : size === 'lg'
      ? 'w-12 h-12'
      : 'w-10 h-10';

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* Instagram */}
      <a
        href="https://www.instagram.com/prosoceret?exln=YWFwMmM4amM5eWFh"
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonClass} rounded-full bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 flex items-center justify-center text-slate-300 hover:text-amber-400 transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(255,215,0,0.35)]`}
        aria-label="PRO SOCCER ET on Instagram"
      >
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      </a>

      {/* TikTok */}
      <a
        href="https://www.tiktok.com/@pro.socer.et?_r=1&_t=ZS-9Ae3lEaL2ay"
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonClass} rounded-full bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 flex items-center justify-center text-slate-300 hover:text-amber-400 transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(255,215,0,0.35)]`}
        aria-label="PRO SOCCER ET on TikTok"
      >
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-.88-.06A6.34 6.34 0 0 0 3 15.68a6.34 6.34 0 0 0 10.82 4.48 6.27 6.27 0 0 0 1.96-4.48V8.92a8.3 8.3 0 0 0 4.81 1.52v-3.75a4.85 4.85 0 0 1-1-.001z"/>
        </svg>
      </a>

      {/* Telegram */}
      <a
        href="https://t.me/prosocer_ethio"
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonClass} rounded-full bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 flex items-center justify-center text-slate-300 hover:text-amber-400 transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(255,215,0,0.35)]`}
        aria-label="PRO SOCCER ET on Telegram"
      >
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      </a>
    </div>
  );
};
