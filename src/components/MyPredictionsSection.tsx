import React, { useState } from 'react';
import type { PredictionResult } from '../types.ts';
import { formatOdds, generateShareableSlip } from '../utils/predictionEngine.ts';
import { Copy, Check, Trash2, Calendar, Target, Sparkles, Trophy } from 'lucide-react';

interface MyPredictionsSectionProps {
  predictions: PredictionResult[];
  onDeletePrediction: (id: string) => void;
  onOpenPredictModal: () => void;
}

export const MyPredictionsSection: React.FC<MyPredictionsSectionProps> = ({
  predictions,
  onDeletePrediction,
  onOpenPredictModal,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (item: PredictionResult) => {
    try {
      const text = generateShareableSlip(item);
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-amber-500/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analytical Slips Archive</span>
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight mt-1">
            My Generated Predictions
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            All match analyses generated via the glowing PRO SOCCER ET engine.
          </p>
        </div>

        <button
          onClick={onOpenPredictModal}
          className="px-4 py-2.5 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-black font-black uppercase text-xs tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          + New Prediction
        </button>
      </div>

      {predictions.length === 0 ? (
        <div className="p-12 text-center bg-[#0c101a] border border-slate-800 rounded-3xl max-w-lg mx-auto">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4">
            <Target className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white uppercase">No Predictions Yet</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Hit the glowing PREDICT button on the dashboard to calculate your first match odds and expected value slip.
          </p>
          <button
            onClick={onOpenPredictModal}
            className="mt-6 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-black font-bold uppercase text-xs rounded-xl transition-all cursor-pointer"
          >
            Launch Predictor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictions.map((p) => (
            <div
              key={p.id}
              className="bg-stadium-card bg-stadium-card-hover rounded-2xl p-5 border border-slate-800 flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    <span className="truncate max-w-[170px]">{p.league}</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {p.day}
                  </span>
                </div>

                {/* Match title */}
                <h4 className="text-lg font-black text-white uppercase tracking-tight">
                  {p.matchTitle}
                </h4>

                {/* Selection & Odds with Outcome Verdict Badge */}
                <div className="my-3.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-2 py-0.5 rounded bg-amber-400 text-black text-[9px] font-black uppercase">
                        {p.outcomeVerdict || 'WON'}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-200">
                      {p.marketSelection}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">
                      1X Odds
                    </span>
                    <span className="text-xl font-mono font-black text-amber-400 tabular-nums">
                      {formatOdds(p.odds)}
                    </span>
                  </div>
                </div>

                {/* Quick stats strip */}
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] py-1">
                  <div className="p-1.5 bg-slate-900/40 rounded border border-slate-800">
                    <span className="text-slate-500 block">Win Prob</span>
                    <span className="font-bold text-white tabular-nums">{p.winProbability}%</span>
                  </div>
                  <div className="p-1.5 bg-slate-900/40 rounded border border-slate-800">
                    <span className="text-slate-500 block">EV Edge</span>
                    <span className="font-bold text-emerald-400 tabular-nums">+{p.expectedValue}%</span>
                  </div>
                  <div className="p-1.5 bg-slate-900/40 rounded border border-slate-800">
                    <span className="text-slate-500 block">Score</span>
                    <span className="font-bold text-amber-300 tabular-nums">{p.predictedScore}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => onDeletePrediction(p.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                  title="Remove slip"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleCopy(p)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId === p.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Slip</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
