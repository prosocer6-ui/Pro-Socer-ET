import React, { useState } from 'react';
import type { PredictionResult } from '../types.ts';
import { generateShareableSlip, formatOdds } from '../utils/predictionEngine.ts';
import { BrandLogo } from './BrandLogo.tsx';
import { Copy, Check, Share2, TrendingUp, ShieldAlert, Sparkles, Trophy } from 'lucide-react';

interface PredictionResultCardProps {
  prediction: PredictionResult;
  onClose?: () => void;
}

export const PredictionResultCard: React.FC<PredictionResultCardProps> = ({
  prediction,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCopy = async () => {
    try {
      const text = generateShareableSlip(prediction);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    try {
      const text = generateShareableSlip(prediction);
      if (navigator.share) {
        await navigator.share({
          title: `PRO SOCCER ET: ${prediction.matchTitle}`,
          text: text,
        });
        setShared(true);
      } else {
        await navigator.clipboard.writeText(text);
        setShared(true);
      }
      setTimeout(() => setShared(false), 2500);
    } catch {
      // Ignored share abort
    }
  };

  return (
    <div className="relative bg-[#0c101a] border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(255,215,0,0.2)] overflow-hidden">
      {/* Golden Aura Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
        <BrandLogo size="sm" showTagline={false} />

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-amber-500/15 text-amber-300 border border-amber-400/30 rounded-full">
            {prediction.riskLevel}
          </span>
          <span className="text-xs uppercase font-semibold text-slate-400">
            {prediction.day}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xs underline ml-2"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>

      {/* Matchup & League */}
      <div className="relative mt-6">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-widest">
          <Trophy className="w-3.5 h-3.5" />
          <span>{prediction.league}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
          {prediction.matchTitle}
        </h2>
      </div>

      {/* Highlighted Pick & Odds Showcase */}
      <div className="relative mt-6 p-5 sm:p-6 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-900/60 border border-amber-400/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300/80">
            Recommended Market Pick
          </span>
          <div className="text-xl sm:text-2xl font-black text-white mt-0.5 flex items-center gap-2">
            <span>{prediction.marketSelection}</span>
          </div>
          <span className="text-xs text-slate-400 mt-0.5 block">
            Market Type: {prediction.marketType.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-amber-500/20 pt-3 sm:pt-0 sm:pl-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
              Strict 1X Odds
            </span>
            <span className="text-3xl sm:text-4xl font-mono font-black text-amber-400 tabular-nums">
              {formatOdds(prediction.odds)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
              Confidence
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-black text-white tabular-nums">
              {prediction.confidenceScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row (EV, Probability, Form, Predicted Score) */}
      <div className="relative mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Modeled Win Prob
          </span>
          <span className="text-lg sm:text-xl font-mono font-bold text-amber-300 tabular-nums mt-0.5 block">
            {prediction.winProbability}%
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Expected Value (EV)
          </span>
          <span className="text-lg sm:text-xl font-mono font-bold text-emerald-400 tabular-nums mt-0.5 block">
            {prediction.expectedValue >= 0 ? `+${prediction.expectedValue}%` : `${prediction.expectedValue}%`}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Form Rating
          </span>
          <span className="text-lg sm:text-xl font-mono font-bold text-white tabular-nums mt-0.5 block">
            {prediction.formRating} <span className="text-xs text-slate-500 font-normal">/ 10</span>
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Predicted Score
          </span>
          <span className="text-lg sm:text-xl font-mono font-bold text-white tabular-nums mt-0.5 block">
            {prediction.predictedScore}
          </span>
        </div>
      </div>

      {/* Tactical Analysis & Factors */}
      <div className="relative mt-6 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Tactical Analytical Summary</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {prediction.tacticalInsight}
        </p>

        {/* Factors Breakdown */}
        <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {prediction.keyFactors.map((factor, idx) => (
            <div key={idx} className="flex items-center justify-between text-slate-400">
              <span className="text-slate-400 font-medium">{factor.label}:</span>
              <span className="font-semibold text-slate-200">{factor.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stake & Execution Bar */}
      <div className="relative mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs">
        <div className="text-slate-400">
          <span className="text-slate-400">Recommended Allocation: </span>
          <span className="font-bold text-amber-300">{prediction.recommendedStake}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 hover:border-amber-400 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Slip Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Copy Slip</span>
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition-all cursor-pointer"
          >
            {shared ? (
              <>
                <Check className="w-3.5 h-3.5 text-black" />
                <span>Shared</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-black" />
                <span>Share Slip</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
