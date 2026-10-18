import React, { useState } from 'react';
import { X, Sparkles, Trophy, Calendar, Target, DollarSign, ChevronRight } from 'lucide-react';
import type { MarketType, PredictionInput, PredictionResult } from '../types.ts';
import { MARKET_OPTIONS, LEAGUE_MATCHUPS, generatePrediction, formatOdds } from '../utils/predictionEngine.ts';

interface PredictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPredictionGenerated: (result: PredictionResult) => void;
}

const AVAILABLE_LEAGUES = [
  'English Premier League',
  'UEFA Champions League',
  'Spanish La Liga',
  'Italian Serie A',
  'German Bundesliga',
  'Ethiopian Premier League (ET)',
  'French Ligue 1',
];

const DAYS = ['Today', 'Tomorrow', 'Weekend'];

export const PredictModal: React.FC<PredictModalProps> = ({
  isOpen,
  onClose,
  onPredictionGenerated,
}) => {
  const [league, setLeague] = useState(AVAILABLE_LEAGUES[0]);
  const [day, setDay] = useState(DAYS[0]);
  const [marketType, setMarketType] = useState<MarketType>('1x2');
  const [marketSelection, setMarketSelection] = useState<string>('Home Win (1)');
  const [odds, setOdds] = useState<string>('1.85');
  const [isCustomMatch, setIsCustomMatch] = useState(false);
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Whenever marketType changes, reset default marketSelection
  const handleMarketTypeChange = (type: MarketType) => {
    setMarketType(type);
    const defaultOption = MARKET_OPTIONS[type][0];
    setMarketSelection(defaultOption.label);
    setOdds(formatOdds(defaultOption.defaultOdds));
  };

  const handleQuickOdds = (val: number) => {
    setOdds(formatOdds(val));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedOdds = parseFloat(odds);
    if (isNaN(parsedOdds) || parsedOdds < 1.05) {
      setError('Please input a valid 1X decimal odds format (e.g. 1.85, 2.10, min 1.05).');
      return;
    }

    if (parsedOdds > 50) {
      setError('Maximum realistic odds limit is 50.00.');
      return;
    }

    setIsGenerating(true);

    // Simulate analytical matrix crunching for 400ms for high-end feel
    setTimeout(() => {
      try {
        const input: PredictionInput = {
          league,
          day,
          marketType,
          marketSelection,
          odds: parsedOdds,
          homeTeam: isCustomMatch && homeTeam.trim() ? homeTeam.trim() : undefined,
          awayTeam: isCustomMatch && awayTeam.trim() ? awayTeam.trim() : undefined,
        };

        const result = generatePrediction(input);
        onPredictionGenerated(result);
        setIsGenerating(false);
        onClose();
      } catch (err) {
        console.error('Prediction generation error:', err);
        setError('An unexpected error occurred while generating prediction.');
        setIsGenerating(false);
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-xl bg-[#0b0e17] border border-amber-500/30 rounded-2xl shadow-[0_0_50px_rgba(255,215,0,0.25)] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="predict-modal-title"
      >
        {/* Golden Top Edge Glow */}
        <div className="h-1.5 w-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <h2 id="predict-modal-title" className="text-lg font-bold text-white uppercase tracking-wide">
                PRO SOCCER ET Predictor
              </h2>
              <p className="text-xs text-slate-400">
                1-Click Algorithmic Match Analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close prediction modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* 1. League Selection */}
          <div>
            <label htmlFor="league-select" className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>1. Select Football League</span>
            </label>
            <select
              id="league-select"
              value={league}
              onChange={(e) => setLeague(e.target.value)}
              className="w-full bg-[#121622] border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            >
              {AVAILABLE_LEAGUES.map((l) => (
                <option key={l} value={l} className="bg-[#121622] text-white">
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Match Day */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>2. Match Schedule</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DAYS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDay(d)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                    day === d
                      ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                      : 'bg-[#121622] text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Optional: Marquee Pairing / Custom Teams */}
          <div className="pt-1">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium">Fixture Selection:</span>
              <button
                type="button"
                onClick={() => setIsCustomMatch(!isCustomMatch)}
                className="text-amber-400 hover:underline"
              >
                {isCustomMatch ? 'Use Featured Marquee Derby' : 'Enter Custom Teams'}
              </button>
            </div>

            {isCustomMatch ? (
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Home Team (e.g. Arsenal)"
                  value={homeTeam}
                  onChange={(e) => setHomeTeam(e.target.value)}
                  className="bg-[#121622] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Away Team (e.g. Chelsea)"
                  value={awayTeam}
                  onChange={(e) => setAwayTeam(e.target.value)}
                  className="bg-[#121622] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>
            ) : (
              <div className="px-3.5 py-2.5 bg-[#121622] border border-slate-800/80 rounded-xl text-xs text-slate-300 flex items-center justify-between">
                <span>Featured Derby:</span>
                <span className="font-bold text-amber-300">
                  {LEAGUE_MATCHUPS[league]?.[0]?.home || 'Home'} vs{' '}
                  {LEAGUE_MATCHUPS[league]?.[0]?.away || 'Away'}
                </span>
              </div>
            )}
          </div>

          {/* 3. Prediction Market Type: 1X2, Over/Under, Win/Loss */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>3. Prediction Market Type</span>
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#121622] rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => handleMarketTypeChange('1x2')}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                  marketType === '1x2'
                    ? 'bg-amber-400 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1X2 (Result)
              </button>
              <button
                type="button"
                onClick={() => handleMarketTypeChange('over_under')}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                  marketType === 'over_under'
                    ? 'bg-amber-400 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Over / Under
              </button>
              <button
                type="button"
                onClick={() => handleMarketTypeChange('win_loss')}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                  marketType === 'win_loss'
                    ? 'bg-amber-400 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Win / Loss / DC
              </button>
            </div>

            {/* Market Sub-Options */}
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              {MARKET_OPTIONS[marketType].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setMarketSelection(opt.label);
                    setOdds(formatOdds(opt.defaultOdds));
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    marketSelection === opt.label
                      ? 'bg-amber-500/15 border-amber-400 text-white'
                      : 'bg-[#121622]/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{opt.label}</div>
                  <div className="text-[10px] text-amber-400 font-mono mt-0.5">
                    Est. Odds: {formatOdds(opt.defaultOdds)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Odds formatted strictly in 1X decimal format */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="odds-input" className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>4. Match Odds (Strictly 1X Decimal Format)</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">e.g. 1.85, 2.10, 1.45</span>
            </div>

            <div className="relative">
              <input
                id="odds-input"
                type="number"
                step="0.01"
                min="1.05"
                max="50.0"
                value={odds}
                onChange={(e) => setOdds(e.target.value)}
                placeholder="1.85"
                className="w-full bg-[#121622] border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-base text-white font-mono font-bold focus:outline-none focus:ring-1 focus:ring-amber-400"
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-amber-400">
                1X Format
              </div>
            </div>

            {/* Quick Odds Selectors */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Quick:</span>
              {[1.45, 1.65, 1.85, 2.10, 2.65, 3.20].map((quick) => (
                <button
                  key={quick}
                  type="button"
                  onClick={() => handleQuickOdds(quick)}
                  className="px-2 py-1 text-[11px] font-mono rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 hover:border-amber-500/40"
                >
                  {formatOdds(quick)}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-4 px-6 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-black font-black uppercase tracking-wider text-sm rounded-xl hover:shadow-[0_0_25px_rgba(255,215,0,0.6)] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Calculating Model Matrices...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>Generate PRO SOCCER ET Prediction</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
