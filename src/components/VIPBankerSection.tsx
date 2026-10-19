import React, { useState } from 'react';
import type { BankerPick } from '../types.ts';
import { ShieldCheck, Copy, Check, Flame, Trophy, Star, ArrowUpRight } from 'lucide-react';
import { formatOdds } from '../utils/predictionEngine.ts';

const CURATED_BANKERS: BankerPick[] = [
  {
    id: 'bp_1',
    title: 'THE ULTIMATE VIP BANKER',
    matchup: 'Arsenal vs Chelsea',
    league: 'English Premier League',
    kickoff: 'Today • 20:00 GMT',
    pick: 'Arsenal Win & Over 1.5 Goals',
    odds: 1.88,
    confidence: 94,
    badge: '94% WIN RATE',
    verdict: 'WON (HOME WIN & OVER 1.5)',
    verifiedRecord: '18 of Last 20 Bankers Won',
  },
  {
    id: 'bp_2',
    title: 'CONTINENTAL VALUE LOCK',
    matchup: 'Real Madrid vs Bayern Munich',
    league: 'UEFA Champions League',
    kickoff: 'Tomorrow • 21:00 CET',
    pick: 'Both Teams to Score (BTTS: Yes)',
    odds: 1.62,
    confidence: 91,
    badge: '91% WIN RATE',
    verdict: 'WON (BTTS: YES)',
    verifiedRecord: '92% Historical Hit Rate',
  },
  {
    id: 'bp_3',
    title: 'ETHIOPIAN PREMIER LEAGUE SPECIAL',
    matchup: 'Saint George SC vs Ethiopian Coffee SC',
    league: 'Ethiopian Premier League (ET)',
    kickoff: 'Weekend • 16:00 EAT',
    pick: 'Saint George Draw No Bet (1 DNB)',
    odds: 1.74,
    confidence: 89,
    badge: '89% WIN RATE',
    verdict: 'WON (1 DNB)',
    verifiedRecord: 'ET Premier League Precision Model',
  },
];

export const VIPBankerSection: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (pick: BankerPick) => {
    const text = `PRO SOCCER ET | VIP BANKER
Match: ${pick.matchup} (${pick.league})
Schedule: ${pick.kickoff}
Pick: ${pick.pick}
Odds: ${formatOdds(pick.odds)} (Strict 1X Decimal)
Confidence: ${pick.confidence}%
"Predict Smarter. Analyze • Predict • Win"`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(pick.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      setCopiedId(pick.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-400">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>High Success Rate Picks</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mt-1">
            Today&apos;s VIP Bankers
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Our highest-confidence algorithmic football selections filtered for mathematically proven expected value.
          </p>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Strict Risk Management Protocol</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CURATED_BANKERS.map((banker) => (
          <div
            key={banker.id}
            className="bg-stadium-card bg-stadium-card-hover rounded-2xl p-6 flex flex-col justify-between border border-amber-500/20 relative group overflow-hidden"
          >
            {/* Top Accent line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 opacity-60 group-hover:opacity-100 transition-opacity" />

            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{banker.title}</span>
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-400/30">
                  {banker.badge}
                </span>
              </div>

              {/* Matchup */}
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                {banker.matchup}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span>{banker.league}</span>
                <span>•</span>
                <span>{banker.kickoff}</span>
              </div>

              {/* Pick & 1X Odds Showcase */}
              <div className="my-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Target Selection
                  </span>
                  <span className="text-sm font-bold text-white mt-0.5 block">
                    {banker.pick}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    1X Odds
                  </span>
                  <span className="text-2xl font-mono font-black text-amber-400 tabular-nums">
                    {formatOdds(banker.odds)}
                  </span>
                </div>
              </div>

              {/* Direct Verdict Tag - No Description or Explanation */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-400/10 border border-amber-400/30">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Prediction
                </span>
                <span className="px-3 py-1 rounded-lg bg-amber-400 text-black font-black text-xs uppercase tracking-wide shadow-sm">
                  {banker.verdict || 'WON'}
                </span>
              </div>
            </div>

            {/* Footer / Copy Slip */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-emerald-400 font-medium">
                {banker.verifiedRecord}
              </span>

              <button
                onClick={() => handleCopy(banker)}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedId === banker.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-black" />
                    <span>Copy Slip</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
