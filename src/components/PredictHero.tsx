import React from 'react';
import { ChevronRight } from 'lucide-react';
import { SocialLinks } from './SocialLinks.tsx';

interface PredictHeroProps {
  onOpenPredict: () => void;
}

export const PredictHero: React.FC<PredictHeroProps> = ({ onOpenPredict }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 flex flex-col items-center justify-center min-h-[75vh]">
      {/* Background Stadium Glow & Pitch Aesthetics */}
      <div className="absolute inset-0 stadium-lighting pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-44 pitch-gradient pointer-events-none" />

      {/* Decorative Gold Light Flares */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-400/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-[350px] h-[350px] bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[350px] h-[350px] bg-amber-400/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Subtle Stadium Floodlight Beams */}
      <div className="absolute top-0 left-1/4 w-1 h-96 bg-gradient-to-b from-amber-300/20 via-transparent to-transparent rotate-[25deg] blur-sm pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-1 h-96 bg-gradient-to-b from-amber-300/20 via-transparent to-transparent -rotate-[25deg] blur-sm pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Marquee Headline */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase max-w-4xl text-balance drop-shadow-[0_4px_25px_rgba(255,215,0,0.3)]">
          <span className="text-gold-gradient">
            PRO SOCER ET
          </span>
        </h1>

        {/* THE ICONIC GLOWING PREDICT BUTTON - SINGLE ACTION HERO */}
        <div className="mt-12 sm:mt-16 flex flex-col items-center">
          <div className="relative group">
            {/* Outer animated ambient pulse ring */}
            <div className="absolute -inset-3 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 animate-pulse transition duration-500" />

            {/* The Main Glowing Predict Button */}
            <button
              onClick={onOpenPredict}
              className="glowing-predict-button relative flex items-center justify-center gap-4 px-12 py-5 sm:px-16 sm:py-6 bg-gradient-to-b from-[#161a24] to-[#0a0d14] text-white rounded-full border-2 border-amber-400 hover:border-yellow-200 transition-all duration-300 active:scale-95 cursor-pointer shadow-[0_0_35px_rgba(255,215,0,0.6)]"
              aria-label="Open Football Prediction Modal"
            >
              {/* Football Graphic Icon */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-yellow-200 via-amber-400 to-yellow-600 p-[2px] shadow-inner flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#080b11] rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 animate-[spin_12s_linear_infinite]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" stroke="#FFD700" />
                    <polygon points="12,7 16,10 14.5,15 9.5,15 8,10" fill="#FFD700" />
                    <line x1="12" y1="7" x2="12" y2="2" />
                    <line x1="16" y1="10" x2="20.5" y2="7.5" />
                    <line x1="14.5" y1="15" x2="18" y2="19.5" />
                    <line x1="9.5" y1="15" x2="6" y2="19.5" />
                    <line x1="8" y1="10" x2="3.5" y2="7.5" />
                  </svg>
                </div>
              </div>

              {/* Glowing Text */}
              <span className="text-2xl sm:text-3xl font-black tracking-wider uppercase text-white drop-shadow-[0_2px_10px_rgba(255,215,0,0.5)]">
                PREDICT
              </span>

              {/* Arrow Indicator */}
              <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Direct Social Links (Instagram, TikTok, Telegram) */}
          <div className="mt-12 flex flex-col items-center gap-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              Official Channels
            </span>
            <SocialLinks size="md" />
          </div>
        </div>
      </div>
    </section>
  );
};
