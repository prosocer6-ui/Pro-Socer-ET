import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Trophy,
  Calendar,
  Target,
  ArrowRight,
  ArrowLeft,
  Check,
  Search,
  Globe,
  Sliders,
  Layers,
  Flame,
  PlusCircle,
  CheckCircle2,
} from 'lucide-react';
import type { MarketType, PredictionInput, PredictionResult, MarketSelectionItem } from '../types.ts';
import {
  ALL_1X_MARKETS,
  WORLD_LEAGUES,
  LEAGUE_MATCHUPS,
  generatePrediction,
  formatOdds,
  calculateImpliedProbability,
  calculateComboOdds,
} from '../utils/predictionEngine.ts';

interface PredictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPredictionGenerated: (result: PredictionResult) => void;
}

type WizardStep = 1 | 2 | 3 | 4;

const QUICK_ODDS_PRESETS = [
  { label: 'Banker (1.25)', odds: 1.25, badge: 'Low Risk' },
  { label: 'Solid (1.50)', odds: 1.50, badge: 'Safe' },
  { label: 'Pro (1.85)', odds: 1.85, badge: 'Recommended' },
  { label: 'Value (2.10)', odds: 2.10, badge: 'Double' },
  { label: 'High (2.75)', odds: 2.75, badge: 'High Yield' },
  { label: 'Jackpot (3.50+)', odds: 3.50, badge: 'Mega' },
];

const DATE_OPTIONS = [
  { id: 'Today', title: 'Today', subtitle: 'Live & Imminent Fixtures', tag: 'Fast' },
  { id: 'Tomorrow', title: 'Tomorrow', subtitle: 'Prime Match Card', tag: 'Prime' },
  { id: 'Weekend', title: 'Weekend Special', subtitle: 'Saturday & Sunday Mega Round', tag: 'High Volume' },
  { id: 'Midweek', title: 'Midweek Fixtures', subtitle: 'Champions League & Cups', tag: 'Cup Night' },
];

export const PredictModal: React.FC<PredictModalProps> = ({
  isOpen,
  onClose,
  onPredictionGenerated,
}) => {
  // Wizard state: Step 1 (Odds) -> Step 2 (Date) -> Step 3 (League) -> Step 4 (Markets)
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);

  // Step 1: ODD
  const [oddsInput, setOddsInput] = useState<string>('1.85');

  // Step 2: DATE
  const [selectedDay, setSelectedDay] = useState<string>('Today');
  const [customDate, setCustomDate] = useState<string>('');

  // Step 3: LEAGUE (All World in 1X)
  const [selectedLeague, setSelectedLeague] = useState<string>('English Premier League');
  const [leagueSearch, setLeagueSearch] = useState<string>('');
  const [activeRegion, setActiveRegion] = useState<string>('All');
  const [homeTeam, setHomeTeam] = useState<string>('');
  const [awayTeam, setAwayTeam] = useState<string>('');
  const [isCustomTeams, setIsCustomTeams] = useState<boolean>(false);

  // Step 4: MARKET TYPE & OPTIONS (Over/Under, Win/Loss, 1X2, BTTS, Double Chance, or ADD ALL)
  const [selectedMarketItems, setSelectedMarketItems] = useState<MarketSelectionItem[]>([
    { id: '1x2_1', category: '1x2', label: 'Home Win (1)', odds: 1.85 },
  ]);
  const [isAddAllActive, setIsAddAllActive] = useState<boolean>(false);

  // Loading & Error States
  const [isGenerating, setIsGenerating] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);

  // Flattened World Leagues for search
  const allFlattenedLeagues = useMemo(() => {
    const list: { name: string; country: string; flag: string; region: string }[] = [];
    WORLD_LEAGUES.forEach((cat) => {
      cat.leagues.forEach((l) => {
        list.push({ ...l, region: cat.region });
      });
    });
    return list;
  }, []);

  // Filtered leagues
  const filteredLeagues = useMemo(() => {
    let result = allFlattenedLeagues;
    if (activeRegion !== 'All') {
      result = result.filter((l) => l.region.toLowerCase().includes(activeRegion.toLowerCase()));
    }
    if (leagueSearch.trim()) {
      const q = leagueSearch.toLowerCase();
      result = result.filter(
        (l) => l.name.toLowerCase().includes(q) || l.country.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allFlattenedLeagues, activeRegion, leagueSearch]);

  if (!isOpen) return null;

  // Step 1 Validation & Next
  const handleOddsNext = () => {
    const parsed = parseFloat(oddsInput);
    if (isNaN(parsed) || parsed < 1.05) {
      setStepError('Please enter a valid 1X decimal odds format (minimum 1.05, e.g. 1.85).');
      return;
    }
    if (parsed > 100) {
      setStepError('Odds limit exceeded. Maximum single odds is 100.00.');
      return;
    }
    setStepError(null);
    setCurrentStep(2);
  };

  // Step 2 Validation & Next
  const handleDateNext = () => {
    setStepError(null);
    setCurrentStep(3);
  };

  // Step 3 Validation & Next
  const handleLeagueNext = () => {
    if (!selectedLeague) {
      setStepError('Please select a league from the world competitions list.');
      return;
    }
    setStepError(null);
    setCurrentStep(4);
  };

  // Toggle a market item in Step 4
  const handleToggleMarketItem = (item: MarketSelectionItem) => {
    setIsAddAllActive(false);
    setSelectedMarketItems((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      if (exists) {
        const filtered = prev.filter((p) => p.id !== item.id);
        return filtered.length > 0 ? filtered : [item]; // keep at least one
      } else {
        return [...prev, item];
      }
    });
  };

  // Handle "ADD ALL" markets
  const handleToggleAddAll = () => {
    if (!isAddAllActive) {
      // Pick best representative pick from every category
      const allPicked: MarketSelectionItem[] = [];
      ALL_1X_MARKETS.forEach((cat) => {
        if (cat.options.length > 0) {
          allPicked.push(cat.options[0]);
        }
      });
      setSelectedMarketItems(allPicked);
      setIsAddAllActive(true);
    } else {
      // Revert to single primary 1X2 option
      setSelectedMarketItems([{ id: '1x2_1', category: '1x2', label: 'Home Win (1)', odds: 1.85 }]);
      setIsAddAllActive(false);
    }
  };

  // Final Submit
  const handleFinalPredict = () => {
    setStepError(null);
    setIsGenerating(true);

    const isCombo = selectedMarketItems.length > 1;
    const computedOdds = isCombo
      ? calculateComboOdds(selectedMarketItems)
      : parseFloat(oddsInput) || 1.85;

    const chosenDay = selectedDay === 'Custom' && customDate ? customDate : selectedDay;

    // Primary market type
    const primaryCategory = (selectedMarketItems[0]?.category as MarketType) || '1x2';

    const inputPayload: PredictionInput = {
      league: selectedLeague,
      day: chosenDay,
      marketType: isCombo ? 'all' : primaryCategory,
      marketSelection: isCombo
        ? `1X Multi-Market Accumulator (${selectedMarketItems.length} Selections)`
        : selectedMarketItems[0]?.label || 'Home Win (1)',
      selectedMarkets: selectedMarketItems,
      isCombo,
      odds: computedOdds,
      homeTeam: isCustomTeams && homeTeam ? homeTeam : undefined,
      awayTeam: isCustomTeams && awayTeam ? awayTeam : undefined,
    };

    setTimeout(() => {
      try {
        const result = generatePrediction(inputPayload);
        onPredictionGenerated(result);
        setIsGenerating(false);
        onClose();
        // Reset to Step 1 for next time
        setCurrentStep(1);
      } catch (err) {
        console.error('Prediction Generation error:', err);
        setStepError('Failed to generate prediction analysis. Please try again.');
        setIsGenerating(false);
      }
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0a0d15] border border-amber-500/30 rounded-3xl shadow-[0_0_60px_rgba(255,215,0,0.25)] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-[#0e121c]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(255,215,0,0.3)]">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                <span>PRO SOCER ET</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-black font-bold">
                  1X ENGINE
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Step-by-Step Predictive Configuration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators (ODD -> DATE -> LEAGUE -> MARKET) */}
        <div className="px-6 py-3 bg-[#07090f] border-b border-slate-800/60">
          <div className="grid grid-cols-4 gap-2">
            {[
              { num: 1, label: '1. ODD' },
              { num: 2, label: '2. DATE' },
              { num: 3, label: '3. LEAGUE' },
              { num: 4, label: '4. MARKET & ALL' },
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => {
                    if (isPast) setCurrentStep(step.num as WizardStep);
                  }}
                  disabled={!isPast && !isActive}
                  className={`py-2 px-2 rounded-xl text-center transition-all ${
                    isActive
                      ? 'bg-amber-400 text-black font-black shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                      : isPast
                      ? 'bg-amber-500/15 text-amber-300 font-bold hover:bg-amber-500/25 cursor-pointer'
                      : 'bg-slate-900/60 text-slate-600 font-semibold cursor-not-allowed'
                  }`}
                >
                  <div className="text-[10px] sm:text-xs truncate">{step.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error message alert */}
        {stepError && (
          <div className="mx-6 mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center justify-between">
            <span>{stepError}</span>
            <button onClick={() => setStepError(null)} className="text-rose-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ================= STEP 1: ODD ================= */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-[10px] font-bold text-amber-300 uppercase tracking-widest mb-2">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Step 1: Set Target Odds</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  Enter Match Odds (1X Format)
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Type your bookmaker odds strictly in 1X decimal format (e.g., 1.85, 2.10) or choose a preset.
                </p>
              </div>

              {/* Glowing Odds Input */}
              <div className="max-w-xs mx-auto">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-300 text-center mb-2">
                  1X Target Decimal Odds
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-amber-400">
                    1X
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="1.05"
                    max="100.00"
                    value={oddsInput}
                    onChange={(e) => setOddsInput(e.target.value)}
                    placeholder="1.85"
                    className="w-full text-center text-3xl font-black text-amber-300 bg-[#121624] border-2 border-amber-500/50 focus:border-amber-400 rounded-2xl py-4 pl-12 pr-6 shadow-[0_0_25px_rgba(255,215,0,0.2)] focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                  />
                </div>
                <div className="mt-2 text-center text-[11px] text-slate-400">
                  Implied Bookmaker Probability:{' '}
                  <span className="font-bold text-amber-400">
                    {calculateImpliedProbability(parseFloat(oddsInput) || 1.85)}%
                  </span>
                </div>
              </div>

              {/* Quick Select Presets */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
                  Quick Odds Presets
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {QUICK_ODDS_PRESETS.map((p) => (
                    <button
                      key={p.odds}
                      type="button"
                      onClick={() => setOddsInput(formatOdds(p.odds))}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        parseFloat(oddsInput) === p.odds
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                          : 'bg-[#0f131f] border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-black text-amber-300">
                          {formatOdds(p.odds)}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                          {p.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">{p.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: DATE ================= */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-[10px] font-bold text-amber-300 uppercase tracking-widest mb-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Step 2: Match Schedule</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  Choose Match Date
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Select match schedule timeframe for optimal tactical and form modeling.
                </p>
              </div>

              {/* Date Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DATE_OPTIONS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDay(d.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      selectedDay === d.id
                        ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border-amber-400 text-white shadow-[0_0_20px_rgba(255,215,0,0.25)]'
                        : 'bg-[#0f131f] border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white uppercase">
                          {d.title}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          {d.tag}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{d.subtitle}</div>
                    </div>
                    {selectedDay === d.id && (
                      <div className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Date Input Option */}
              <div className="p-4 rounded-2xl bg-[#0f131f] border border-slate-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                  Or Specify Exact Calendar Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => {
                      setCustomDate(e.target.value);
                      setSelectedDay('Custom');
                    }}
                    className="w-full bg-[#141926] border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: LEAGUE (All in World in 1X) ================= */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-[10px] font-bold text-amber-300 uppercase tracking-widest mb-2">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>Step 3: World League Selection</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  All World Leagues in 1X
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Select any league worldwide, including Ethiopia, European majors, and international tournaments.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={leagueSearch}
                  onChange={(e) => setLeagueSearch(e.target.value)}
                  placeholder="Search any world league or country (e.g. Ethiopian, Premier, Spain, Serie A)..."
                  className="w-full bg-[#121624] border border-slate-700 focus:border-amber-400 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Region Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {['All', 'Europe', 'Africa', 'Americas', 'Asia', 'International'].map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => setActiveRegion(region)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                      activeRegion === region
                        ? 'bg-amber-400 text-black shadow-[0_0_10px_rgba(255,215,0,0.4)]'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>

              {/* League Grid */}
              <div className="max-h-56 overflow-y-auto pr-1 space-y-2">
                {filteredLeagues.map((l) => {
                  const isSelected = selectedLeague === l.name;
                  return (
                    <button
                      key={l.name}
                      type="button"
                      onClick={() => setSelectedLeague(l.name)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_15px_rgba(255,215,0,0.25)]'
                          : 'bg-[#0e121c] border-slate-800/80 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{l.flag}</span>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white">
                            {l.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {l.country} • {l.region}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Optional Team Matchup Customizer */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsCustomTeams(!isCustomTeams)}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1.5 font-bold"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>
                    {isCustomTeams ? 'Use Auto Top League Matchups' : 'Specify Custom Home vs Away Teams (Optional)'}
                  </span>
                </button>

                {isCustomTeams && (
                  <div className="grid grid-cols-2 gap-3 mt-3 animate-in fade-in">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                        Home Team
                      </label>
                      <input
                        type="text"
                        value={homeTeam}
                        onChange={(e) => setHomeTeam(e.target.value)}
                        placeholder="e.g. Arsenal"
                        className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                        Away Team
                      </label>
                      <input
                        type="text"
                        value={awayTeam}
                        onChange={(e) => setAwayTeam(e.target.value)}
                        placeholder="e.g. Chelsea"
                        className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 4: MARKET TYPE & ADD ALL ================= */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-[10px] font-bold text-amber-300 uppercase tracking-widest mb-2">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  <span>Step 4: 1X Market Selection</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  Over / Under, Win / Loss & 1X
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Pick single or multiple correlated 1X markets, or tap &ldquo;ADD ALL&rdquo; for master slip.
                </p>
              </div>

              {/* HERO "ADD ALL" BUTTON */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={handleToggleAddAll}
                  className={`w-full p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isAddAllActive
                      ? 'bg-gradient-to-r from-amber-500/30 via-yellow-400/20 to-amber-500/30 border-amber-400 shadow-[0_0_25px_rgba(255,215,0,0.5)]'
                      : 'bg-gradient-to-r from-amber-950/30 via-slate-900 to-amber-950/30 border-amber-500/40 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-400 text-black flex items-center justify-center font-black">
                      <Flame className="w-5 h-5 fill-current" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-black text-white uppercase tracking-wide">
                          ADD ALL MARKETS
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase">
                          Master 1X Combo
                        </span>
                      </div>
                      <div className="text-xs text-amber-200/80">
                        {isAddAllActive
                          ? '✓ All 5 primary 1X categories loaded in multi-accumulator ticket'
                          : 'One-click: Combine Over/Under + Win/Loss + 1X2 + BTTS + Double Chance'}
                      </div>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                    isAddAllActive
                      ? 'bg-amber-400 border-amber-300 text-black'
                      : 'border-slate-600 bg-slate-800'
                  }`}>
                    {isAddAllActive && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </button>
              </div>

              {/* Categorized Market Sections */}
              <div className="space-y-4">
                {ALL_1X_MARKETS.map((category) => (
                  <div
                    key={category.category}
                    className="p-4 rounded-2xl bg-[#0d101a] border border-slate-800/80"
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <div>
                        <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                          {category.name}
                        </span>
                        <p className="text-[10px] text-slate-400">{category.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {category.options.map((option) => {
                        const isSelected = selectedMarketItems.some((s) => s.id === option.id);
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handleToggleMarketItem(option)}
                            className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-400 text-white shadow-[0_0_12px_rgba(255,215,0,0.2)]'
                                : 'bg-[#121622] border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <span className="text-xs font-semibold">{option.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-amber-400">
                                @{formatOdds(option.odds)}
                              </span>
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center ${
                                  isSelected
                                    ? 'bg-amber-400 border-amber-400 text-black'
                                    : 'border-slate-600'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic Accumulated Slip Summary */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-amber-500/10 border border-amber-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black text-white uppercase">
                      Current Selection Slip
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black">
                      {selectedMarketItems.length} {selectedMarketItems.length === 1 ? 'Market' : 'Markets'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Total 1X Odds
                    </span>
                    <span className="text-lg font-black text-amber-300">
                      @{formatOdds(
                        selectedMarketItems.length > 1
                          ? calculateComboOdds(selectedMarketItems)
                          : parseFloat(oddsInput) || 1.85
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#0e121c] flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep - 1) as WizardStep)}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {/* Forward / Next Actions */}
          {currentStep === 1 && (
            <button
              type="button"
              onClick={handleOddsNext}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.5)] hover:shadow-[0_0_25px_rgba(255,215,0,0.7)] cursor-pointer transition-all"
            >
              <span>Next: Select Date</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 2 && (
            <button
              type="button"
              onClick={handleDateNext}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.5)] hover:shadow-[0_0_25px_rgba(255,215,0,0.7)] cursor-pointer transition-all"
            >
              <span>Next: Select League</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 3 && (
            <button
              type="button"
              onClick={handleLeagueNext}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.5)] hover:shadow-[0_0_25px_rgba(255,215,0,0.7)] cursor-pointer transition-all"
            >
              <span>Next: Select Markets</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 4 && (
            <button
              type="button"
              onClick={handleFinalPredict}
              disabled={isGenerating || selectedMarketItems.length === 0}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(255,215,0,0.6)] hover:shadow-[0_0_35px_rgba(255,215,0,0.8)] cursor-pointer transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Computing 1X Analysis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>
                    Generate Prediction {selectedMarketItems.length > 1 ? `(${selectedMarketItems.length} Legs)` : ''}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
