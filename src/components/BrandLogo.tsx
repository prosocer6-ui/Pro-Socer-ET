import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const iconSize = size === 'sm' ? 28 : size === 'md' ? 38 : size === 'lg' ? 48 : 64;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Stylized "P" with Football & Motion Streaks */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_0_12px_rgba(255,215,0,0.5)]"
        >
          {/* Background subtle radial aura */}
          <circle cx="50" cy="50" r="46" fill="url(#goldAura)" fillOpacity="0.12" />

          {/* Dynamic Speed Streaks (Gold & White) */}
          <path
            d="M8 38 C 22 36, 38 42, 48 46"
            stroke="url(#goldGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M4 48 C 20 46, 36 50, 46 54"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M12 58 C 24 57, 36 60, 44 64"
            stroke="url(#goldGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Main "P" Body Structure */}
          <path
            d="M38 18 H 68 C 82 18, 92 28, 92 42 C 92 56, 82 66, 68 66 H 54 V 86 H 38 V 18 Z"
            fill="#FFFFFF"
          />

          {/* Inner Golden Accent Cut on P Stem */}
          <path
            d="M38 18 L 48 18 L 48 86 L 38 86 Z"
            fill="url(#goldGradient)"
          />

          {/* The Football in the Loop of P */}
          <circle cx="68" cy="42" r="16" fill="#0A0D14" stroke="url(#goldGradient)" strokeWidth="2.5" />
          {/* Football Pentagons */}
          <polygon points="68,36 73,39 71,45 65,45 63,39" fill="#FFD700" />
          <line x1="68" y1="36" x2="68" y2="30" stroke="#FFF" strokeWidth="1.2" />
          <line x1="73" y1="39" x2="79" y2="37" stroke="#FFF" strokeWidth="1.2" />
          <line x1="71" y1="45" x2="76" y2="50" stroke="#FFF" strokeWidth="1.2" />
          <line x1="65" y1="45" x2="60" y2="50" stroke="#FFF" strokeWidth="1.2" />
          <line x1="63" y1="39" x2="57" y2="37" stroke="#FFF" strokeWidth="1.2" />

          {/* SVG Gradients */}
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF59D" />
              <stop offset="45%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#D49B00" />
            </linearGradient>
            <radialGradient id="goldAura" cx="50" cy="50" r="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#05070A" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Typography Block */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight text-white ${
              size === 'sm'
                ? 'text-lg'
                : size === 'md'
                ? 'text-xl md:text-2xl'
                : size === 'lg'
                ? 'text-2xl md:text-3xl'
                : 'text-3xl md:text-5xl'
            }`}
          >
            PRO SOCCER
          </span>
          <span
            className={`font-black tracking-wider text-gold-gradient ${
              size === 'sm'
                ? 'text-lg'
                : size === 'md'
                ? 'text-xl md:text-2xl'
                : size === 'lg'
                ? 'text-2xl md:text-3xl'
                : 'text-3xl md:text-5xl'
            }`}
          >
            ET
          </span>
        </div>

        {/* Subtitle with gold line indicators */}
        <div className="flex items-center gap-2 mt-0.5">
          <div className="h-[1px] w-3 bg-amber-400/80"></div>
          <span
            className={`font-semibold tracking-[0.2em] uppercase text-amber-300/90 whitespace-nowrap ${
              size === 'sm' ? 'text-[9px]' : size === 'md' ? 'text-[10px]' : 'text-xs'
            }`}
          >
            FOOTBALL PREDICTIONS
          </span>
          <div className="h-[1px] w-3 bg-amber-400/80"></div>
        </div>

        {showTagline && (
          <span className="text-[11px] font-medium tracking-widest text-slate-400 mt-1 uppercase">
            Analyze <span className="text-amber-400 mx-1">/</span> Predict{' '}
            <span className="text-amber-400 mx-1">/</span> Win
          </span>
        )}
      </div>
    </div>
  );
};
