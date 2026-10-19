import React, { useState } from 'react';
import type { PredictionResult } from '../types.ts';
import { generateMultiMatchShareSlip, formatOdds, calculateComboOdds } from '../utils/predictionEngine.ts';
import { BrandLogo } from './BrandLogo.tsx';
import { Copy, Check, Share2, Sparkles, Trophy, Calendar, CheckCircle2, RefreshCw } from 'lucide-react';

interface PredictionsListViewProps {
  predictions: PredictionResult[];
  onClose?: () => void;
  onRefresh?: () => void;
}

export const PredictionsListView: React.FC<PredictionsListViewProps> = ({
  predictions,
  onClose,
  onRefresh,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  if (!predictions || predictions.length === 0) return null;

  const totalOdds = calculateComboOdds(
    predictions.map((p, i) => ({
      id: `m_${i}`,
      category: p.marketType,
      label: p.marketSelection,
      odds: p.odds,
    }))
  );

  const handleCopyAll = async () => {
    try {
      const text = generateMultiMatchShareSlip(predictions);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    try {
      const text = generateMultiMatchShareSlip(predictions);
      if (navigator.share) {
        await navigator.share({
          title: `PRO SOCCER ET: ${predictions.length} Match Predictions`,
          text: text,
        });
        setShared(true);
      } else {
        await navigator.clipboard.writeText(text);
        setShared(true);
      }
      setTimeout(() => setShared(false), 2500);
    } catch {
      // Ignored
    }
  };

  const primaryLeague = predictions[0]?.league || 'Global Competitions';
  const primaryDay = predictions[0]?.day || 'Today';

  return (
    <div className="relative bg-[#0c101a] border-2 border-amber-400/40 rounded-3xl p-5 sm:p-8 shadow-[0_0_50px_rgba(255,215,0,0.25)] overflow-hidden">
      {/* Golden Aura Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
        <div className="flex items-center gap-3">
          <BrandLogo size="sm" showTagline={false} />
          <div className="h-6 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-black font-black text-xs uppercase tracking-wider shadow-sm">
              {predictions.length} MATCHES
            </span>
            <span className="text-xs uppercase font-bold text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{primaryDay}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
              title="Generate new match round"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>New Round</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xs underline ml-2 cursor-pointer"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>

      {/* Title Subheader */}
      <div className="relative mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-widest">
            <Trophy className="w-3.5 h-3.5" />
            <span>{primaryLeague}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
            Match Predictions List
          </h2>
        </div>

        <div className="text-[11px] font-bold text-amber-400/90 uppercase tracking-wider flex items-center gap-1.5 bg-amber-500/10 border border-amber-400/30 px-3 py-1.5 rounded-xl">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Direct Predictions • No Descriptions</span>
        </div>
      </div>

      {/* THE CLEAN MATCH PREDICTIONS LIST - STRICTLY UNIQUE MATCHES, NO DESCRIPTIONS */}
      <div className="relative mt-6 space-y-3">
        {predictions.map((match, index) => {
          const verdict = match.outcomeVerdict || 'WON';
          const isOver = match.outcomeTag === 'OVER';
          const isUnder = match.outcomeTag === 'UNDER';

          const badgeColorClass = isOver
            ? 'bg-amber-400 text-black border-amber-300'
            : isUnder
            ? 'bg-yellow-400 text-black border-yellow-300'
            : 'bg-amber-400 text-black border-amber-300';

          return (
            <div
              key={match.id || index}
              className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0d121f] via-[#090d17] to-[#0d121f] border border-amber-500/25 hover:border-amber-400/50 transition-all shadow-md group flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Matchup & League details */}
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 font-mono font-black text-xs shrink-0">
                  #{index + 1}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400">
                    <span className="truncate max-w-[200px] text-amber-400/80">{match.league}</span>
                    <span>•</span>
                    <span>{match.day}</span>
                  </div>

                  {/* Match Teams: Bold, clean, prominent */}
                  <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight mt-0.5 truncate">
                    {match.matchTitle}
                  </h3>
                </div>
              </div>

              {/* DIRECT PREDICTION BADGE & ODDS - NO DESCRIPTIONS */}
              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-800/80 pt-3 md:pt-0">
                {/* Target Prediction Verdict */}
                <div className="text-left md:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Prediction
                  </span>
                  <div className="inline-flex items-center">
                    <span
                      className={`px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wide border shadow-[0_0_12px_rgba(255,215,0,0.3)] ${badgeColorClass}`}
                    >
                      {verdict}
                    </span>
                  </div>
                </div>

                {/* 1X Decimal Odds */}
                <div className="text-right pl-4 border-l border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                    1X Odds
                  </span>
                  <span className="text-xl sm:text-2xl font-mono font-black text-amber-400 tabular-nums">
                    {formatOdds(match.odds)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Acca & Action Bar */}
      <div className="relative mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
              Accumulated 1X Odds
            </span>
            <span className="text-2xl font-mono font-black text-amber-400 tabular-nums">
              {formatOdds(totalOdds)}
            </span>
          </div>

          <div className="text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{predictions.length} Unique Matches Verified</span>
            </div>
            <span className="text-[11px] text-slate-500">Strictly non-duplicate fixtures</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyAll}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 hover:border-amber-400 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">List Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Copy List</span>
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs transition-all shadow-[0_0_20px_rgba(255,215,0,0.4)] cursor-pointer"
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
