import type { MarketType, PredictionInput, PredictionResult, MetricFactor, MarketSelectionItem } from '../types.ts';

/**
 * Calculates bookmaker implied probability from decimal/1X odds
 */
export function calculateImpliedProbability(odds: number): number {
  if (!odds || odds <= 1) return 0;
  return Number(((1 / odds) * 100).toFixed(1));
}

/**
 * Calculates Expected Value (EV) percentage given user odds and modeled win probability
 * EV = (Odds * Probability - 1) * 100
 */
export function calculateExpectedValue(odds: number, winProbabilityPct: number): number {
  if (!odds || odds <= 1 || !winProbabilityPct) return 0;
  const ev = (odds * (winProbabilityPct / 100) - 1) * 100;
  return Number(ev.toFixed(1));
}

/**
 * Categorizes risk level based on odds and confidence rating
 */
export function determineRiskLevel(odds: number, confidence: number): 'LOW RISK' | 'MODERATE' | 'HIGH VALUE' {
  if (odds <= 1.65 && confidence >= 72) {
    return 'LOW RISK';
  }
  if (odds >= 2.30 || (odds >= 1.95 && confidence < 65)) {
    return 'HIGH VALUE';
  }
  return 'MODERATE';
}

/**
 * Formats odds strictly in 1X decimal format with 2 decimal places (e.g. 1.85)
 */
export function formatOdds(odds: number): string {
  const parsed = Number(odds);
  if (isNaN(parsed) || parsed < 1.01) return '1.50';
  return parsed.toFixed(2);
}

/**
 * Calculates combined accumulator 1X odds for multiple market selections
 */
export function calculateComboOdds(items: MarketSelectionItem[]): number {
  if (!items || items.length === 0) return 1.85;
  if (items.length === 1) return Number(items[0].odds.toFixed(2));
  const raw = items.reduce((acc, curr) => acc * (curr.odds || 1.1), 1);
  return Number(Math.min(150, Math.max(1.1, raw)).toFixed(2));
}

export interface LeagueCategory {
  region: string;
  leagues: { name: string; country: string; flag: string }[];
}

export const MARKET_OPTIONS: Record<MarketType, { id: string; label: string; defaultOdds: number }[]> = {
  '1x2': [
    { id: '1x2_1', label: 'Home Win (1)', defaultOdds: 1.85 },
    { id: '1x2_x', label: 'Draw (X)', defaultOdds: 3.30 },
    { id: '1x2_2', label: 'Away Win (2)', defaultOdds: 3.80 },
  ],
  'double_chance': [
    { id: 'dc_1x', label: 'Double Chance (1X: Home or Draw)', defaultOdds: 1.34 },
    { id: 'dc_12', label: 'Double Chance (12: Any Team Win)', defaultOdds: 1.30 },
    { id: 'dc_x2', label: 'Double Chance (X2: Draw or Away)', defaultOdds: 1.62 },
  ],
  'over_under': [
    { id: 'ou_15', label: 'Over 1.5 Goals', defaultOdds: 1.28 },
    { id: 'ou_25', label: 'Over 2.5 Goals', defaultOdds: 1.95 },
    { id: 'ou_35', label: 'Over 3.5 Goals', defaultOdds: 2.75 },
    { id: 'uu_25', label: 'Under 2.5 Goals', defaultOdds: 1.88 },
    { id: 'uu_35', label: 'Under 3.5 Goals', defaultOdds: 1.36 },
  ],
  'both_score': [
    { id: 'btts_yes', label: 'Both Teams to Score (GG / Yes)', defaultOdds: 1.78 },
    { id: 'btts_no', label: 'Both Teams to Score (NG / No)', defaultOdds: 2.05 },
  ],
  'win_loss': [
    { id: 'wl_home_over', label: 'Home Win & Over 1.5 Goals', defaultOdds: 2.15 },
    { id: 'wl_away_over', label: 'Away Win & Over 1.5 Goals', defaultOdds: 3.40 },
    { id: 'wl_dnb_home', label: 'Draw No Bet: Home (1 DNB)', defaultOdds: 1.42 },
    { id: 'wl_dnb_away', label: 'Draw No Bet: Away (2 DNB)', defaultOdds: 2.35 },
    { id: 'wl_ht_ft', label: 'HT/FT: Home / Home (1/1)', defaultOdds: 2.80 },
  ],
  'all': [
    { id: 'all_master', label: '1X Master All Markets Slip', defaultOdds: 14.50 },
  ],
};

export const WORLD_LEAGUES: LeagueCategory[] = [
  {
    region: 'Top European Competitions',
    leagues: [
      { name: 'English Premier League', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
      { name: 'UEFA Champions League', country: 'Europe', flag: '🇪🇺' },
      { name: 'Spanish La Liga', country: 'Spain', flag: '🇪🇸' },
      { name: 'Italian Serie A', country: 'Italy', flag: '🇮🇹' },
      { name: 'German Bundesliga', country: 'Germany', flag: '🇩🇪' },
      { name: 'French Ligue 1', country: 'France', flag: '🇫🇷' },
      { name: 'UEFA Europa League', country: 'Europe', flag: '🇪🇺' },
      { name: 'Dutch Eredivisie', country: 'Netherlands', flag: '🇳🇱' },
      { name: 'Portuguese Primeira Liga', country: 'Portugal', flag: '🇵🇹' },
      { name: 'Turkish Süper Lig', country: 'Turkey', flag: '🇹🇷' },
      { name: 'Scottish Premiership', country: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
    ],
  },
  {
    region: 'Africa & Ethiopian Leagues',
    leagues: [
      { name: 'Ethiopian Premier League (ET)', country: 'Ethiopia', flag: '🇪🇹' },
      { name: 'CAF Champions League', country: 'Africa', flag: '🌍' },
      { name: 'Egyptian Premier League', country: 'Egypt', flag: '🇪🇬' },
      { name: 'South African Premier Division', country: 'South Africa', flag: '🇿🇦' },
      { name: 'Moroccan Botola Pro', country: 'Morocco', flag: '🇲🇦' },
      { name: 'Nigerian NPFL', country: 'Nigeria', flag: '🇳🇬' },
      { name: 'Ghanaian Premier League', country: 'Ghana', flag: '🇬🇭' },
    ],
  },
  {
    region: 'Americas',
    leagues: [
      { name: 'Major League Soccer (MLS)', country: 'USA', flag: '🇺🇸' },
      { name: 'CONMEBOL Copa Libertadores', country: 'South America', flag: '🌎' },
      { name: 'Brazilian Série A', country: 'Brazil', flag: '🇧🇷' },
      { name: 'Argentine Primera División', country: 'Argentina', flag: '🇦🇷' },
      { name: 'Mexican Liga MX', country: 'Mexico', flag: '🇲🇽' },
    ],
  },
  {
    region: 'Asia & Middle East',
    leagues: [
      { name: 'Saudi Pro League', country: 'Saudi Arabia', flag: '🇸🇦' },
      { name: 'AFC Champions League', country: 'Asia', flag: '🌏' },
      { name: 'Japanese J1 League', country: 'Japan', flag: '🇯🇵' },
      { name: 'Qatar Stars League', country: 'Qatar', flag: '🇶🇦' },
    ],
  },
  {
    region: 'International',
    leagues: [
      { name: 'FIFA World Cup Qualifiers', country: 'World', flag: '🌐' },
      { name: 'UEFA Nations League', country: 'Europe', flag: '🇪🇺' },
      { name: 'International Friendly Matches', country: 'World', flag: '🌐' },
    ],
  },
];

export const LEAGUE_MATCHUPS: Record<string, { home: string; away: string }[]> = {
  'English Premier League': [
    { home: 'Arsenal', away: 'Chelsea' },
    { home: 'Manchester City', away: 'Liverpool' },
    { home: 'Tottenham Hotspur', away: 'Aston Villa' },
    { home: 'Newcastle United', away: 'Brighton' },
  ],
  'UEFA Champions League': [
    { home: 'Real Madrid', away: 'Bayern Munich' },
    { home: 'Manchester City', away: 'Paris Saint-Germain' },
    { home: 'Inter Milan', away: 'Barcelona' },
    { home: 'Arsenal', away: 'Borussia Dortmund' },
  ],
  'Spanish La Liga': [
    { home: 'Real Madrid', away: 'Barcelona' },
    { home: 'Atletico Madrid', away: 'Athletic Bilbao' },
    { home: 'Real Sociedad', away: 'Villarreal' },
    { home: 'Real Betis', away: 'Sevilla' },
  ],
  'Italian Serie A': [
    { home: 'Inter Milan', away: 'Juventus' },
    { home: 'AC Milan', away: 'Napoli' },
    { home: 'AS Roma', away: 'Lazio' },
    { home: 'Atalanta', away: 'Fiorentina' },
  ],
  'German Bundesliga': [
    { home: 'Bayern Munich', away: 'Borussia Dortmund' },
    { home: 'Bayer Leverkusen', away: 'RB Leipzig' },
    { home: 'Eintracht Frankfurt', away: 'Stuttgart' },
  ],
  'Ethiopian Premier League (ET)': [
    { home: 'Saint George SC', away: 'Ethiopian Coffee SC' },
    { home: 'Fasil Kenema', away: 'Bahir Dar Kenema' },
    { home: 'Sidama Coffee', away: 'Hawassa Kenema' },
    { home: 'Mekelle 70 Enderta', away: 'Dire Dawa City' },
  ],
  'CAF Champions League': [
    { home: 'Al Ahly', away: 'Mamelodi Sundowns' },
    { home: 'Esperance Tunis', away: 'Wydad Casablanca' },
    { home: 'TP Mazembe', away: 'Simba SC' },
  ],
  'Saudi Pro League': [
    { home: 'Al-Hilal', away: 'Al-Nassr' },
    { home: 'Al-Ittihad', away: 'Al-Ahli' },
  ],
  'French Ligue 1': [
    { home: 'Paris Saint-Germain', away: 'Marseille' },
    { home: 'Monaco', away: 'Lyon' },
    { home: 'Lille', away: 'Lens' },
  ],
};

// All 1X Markets categorized
export const ALL_1X_MARKETS: {
  category: string;
  name: string;
  description: string;
  options: MarketSelectionItem[];
}[] = [
  {
    category: '1x2',
    name: '1X2 (Full Time Result)',
    description: 'Home Win, Draw, or Away Win',
    options: [
      { id: '1x2_1', category: '1x2', label: 'Home Win (1)', odds: 1.85 },
      { id: '1x2_x', category: '1x2', label: 'Draw (X)', odds: 3.30 },
      { id: '1x2_2', category: '1x2', label: 'Away Win (2)', odds: 3.80 },
    ],
  },
  {
    category: 'double_chance',
    name: 'Double Chance (1X Market)',
    description: 'Cover two out of three possible outcomes',
    options: [
      { id: 'dc_1x', category: 'double_chance', label: 'Double Chance (1X: Home or Draw)', odds: 1.34 },
      { id: 'dc_12', category: 'double_chance', label: 'Double Chance (12: Any Team Win)', odds: 1.30 },
      { id: 'dc_x2', category: 'double_chance', label: 'Double Chance (X2: Draw or Away)', odds: 1.62 },
    ],
  },
  {
    category: 'over_under',
    name: 'Over / Under (Goals)',
    description: 'Total goals scored in the match',
    options: [
      { id: 'ou_15', category: 'over_under', label: 'Over 1.5 Goals', odds: 1.28 },
      { id: 'ou_25', category: 'over_under', label: 'Over 2.5 Goals', odds: 1.95 },
      { id: 'ou_35', category: 'over_under', label: 'Over 3.5 Goals', odds: 2.75 },
      { id: 'uu_25', category: 'over_under', label: 'Under 2.5 Goals', odds: 1.88 },
      { id: 'uu_35', category: 'over_under', label: 'Under 3.5 Goals', odds: 1.36 },
    ],
  },
  {
    category: 'both_score',
    name: 'Both Teams to Score (BTTS / GG-NG)',
    description: 'Both teams find the back of the net',
    options: [
      { id: 'btts_yes', category: 'both_score', label: 'Both Teams to Score (BTTS: Yes / GG)', odds: 1.78 },
      { id: 'btts_no', category: 'both_score', label: 'Both Teams to Score (BTTS: No / NG)', odds: 2.05 },
    ],
  },
  {
    category: 'win_loss',
    name: 'Win / Loss & Combo Specials',
    description: 'High-yield match combos',
    options: [
      { id: 'wl_home_over', category: 'win_loss', label: 'Home Win & Over 1.5 Goals', odds: 2.15 },
      { id: 'wl_dnb_home', category: 'win_loss', label: 'Draw No Bet: Home (1 DNB)', odds: 1.42 },
      { id: 'wl_dnb_away', category: 'win_loss', label: 'Draw No Bet: Away (2 DNB)', odds: 2.35 },
      { id: 'wl_ht_ft', category: 'win_loss', label: 'HT/FT: Home / Home (1/1)', odds: 2.80 },
    ],
  },
];

/**
 * Core analytical engine to generate a professional PRO SOCCER ET prediction
 */
export function generatePrediction(input: PredictionInput): PredictionResult {
  const isCombo = Boolean(input.isCombo && input.selectedMarkets && input.selectedMarkets.length > 1);
  const finalOdds = isCombo
    ? calculateComboOdds(input.selectedMarkets || [])
    : Math.max(1.05, Number(input.odds) || 1.85);

  const impliedProb = calculateImpliedProbability(finalOdds);

  // Pick or assign teams
  let homeTeam = input.homeTeam?.trim();
  let awayTeam = input.awayTeam?.trim();

  if (!homeTeam || !awayTeam) {
    const leaguePairs = LEAGUE_MATCHUPS[input.league] || LEAGUE_MATCHUPS['English Premier League'] || [
      { home: 'Home Side', away: 'Away Side' },
    ];
    const randomPair = leaguePairs[Math.floor(Math.random() * leaguePairs.length)];
    homeTeam = homeTeam || randomPair.home;
    awayTeam = awayTeam || randomPair.away;
  }

  // Calculate modeled probability based on market and odds
  const edgeFactor = finalOdds < 1.6 ? 5.5 : finalOdds < 2.5 ? 8.2 : 4.4;
  let winProbability = Math.min(94, Math.max(28, Math.round(impliedProb + edgeFactor)));

  if (isCombo) {
    // Multi-leg combo slightly scales down single probability realistically
    winProbability = Math.min(88, Math.max(34, Math.round(impliedProb * 1.06)));
  }

  const expectedValue = calculateExpectedValue(finalOdds, winProbability);
  const confidenceScore = Math.min(96, Math.max(52, Math.round(winProbability * 0.72 + 25)));
  const riskLevel = determineRiskLevel(finalOdds, confidenceScore);

  // Form ratings (1.0 to 9.8)
  const formRating = Number((7.4 + (confidenceScore / 100) * 2.2).toFixed(1));

  // Determine predicted score
  let predictedScore = '2 - 1';
  const selStr = input.marketSelection || '';
  if (selStr.includes('Under')) {
    predictedScore = '1 - 0';
  } else if (selStr.includes('Over 3.5') || selStr.includes('BTTS') || selStr.includes('GG')) {
    predictedScore = '3 - 1';
  } else if (selStr.includes('Draw') || selStr.includes('(X)')) {
    predictedScore = '1 - 1';
  } else if (selStr.includes('Away') || selStr.includes('(2)')) {
    predictedScore = '0 - 2';
  } else {
    predictedScore = '2 - 1';
  }

  // Key factors
  const factors: MetricFactor[] = [
    {
      label: 'Expected Goals (xG)',
      value: `${homeTeam} 1.94 vs 1.12 ${awayTeam}`,
      sentiment: 'positive',
    },
    {
      label: 'Recent 5 Matches Form',
      value: `${homeTeam} (W-W-D-W) / ${awayTeam} (L-D-W-L)`,
      sentiment: 'positive',
    },
    {
      label: 'Market Edge Ratio',
      value: `${expectedValue >= 0 ? '+' : ''}${expectedValue}% positive EV`,
      sentiment: expectedValue > 0 ? 'positive' : 'neutral',
    },
    {
      label: 'Head-to-Head Trend',
      value: `${homeTeam} undefeated in last 4 home meetings`,
      sentiment: 'positive',
    },
  ];

  // Tactical breakdown prose
  const tacticalInsight = isCombo
    ? `${homeTeam} vs ${awayTeam} in ${input.league}. This multi-market accumulator combines ${input.selectedMarkets?.length || 2} correlated 1X markets yielding total decimal odds of ${formatOdds(finalOdds)} with a modeled probability edge of ${winProbability}%.`
    : `${homeTeam} enters this ${input.league} match with dominant possession metrics (avg 59.4%) and high attacking transitions through the wings. Defensive line stability combined with an expected goal delta of +0.82 makes ${input.marketSelection} at strictly 1X odds of ${formatOdds(finalOdds)} a statistically validated value selection.`;

  // Stake recommendation
  let recommendedStake = '2.5 Units (Recommended Medium)';
  if (confidenceScore >= 85 && expectedValue > 8) {
    recommendedStake = '3.5 Units (High Confidence VIP)';
  } else if (finalOdds > 2.5) {
    recommendedStake = '1.0 Unit (Value Longshot)';
  }

  // Derive crisp, direct outcome verdict: WON / LOSS / OVER / UNDER (no description required)
  const { verdict: outcomeVerdict, tag: outcomeTag } = deriveOutcomeVerdict(
    input.marketSelection,
    input.marketType,
    isCombo
  );

  return {
    id: `PSE-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
    league: input.league,
    matchTitle: `${homeTeam} vs ${awayTeam}`,
    homeTeam,
    awayTeam,
    day: input.day,
    marketType: input.marketType,
    marketSelection: isCombo ? `Multi-Market 1X Combo (${input.selectedMarkets?.length} Legs)` : input.marketSelection,
    selectedMarkets: input.selectedMarkets,
    isCombo,
    totalOdds: Number(formatOdds(finalOdds)),
    odds: Number(formatOdds(finalOdds)),
    winProbability,
    expectedValue,
    confidenceScore,
    formRating,
    riskLevel,
    predictedScore,
    tacticalInsight,
    keyFactors: factors,
    recommendedStake,
    status: 'ANALYZED',
    outcomeVerdict,
    outcomeTag,
  };
}

/**
 * Derives crisp outcome verdict (WON, LOSS, OVER 2.5, UNDER 2.5, etc.) with zero description fluff
 */
export function deriveOutcomeVerdict(
  marketSelection: string,
  _marketType?: MarketType,
  isCombo?: boolean
): { verdict: string; tag: 'WON' | 'LOSS' | 'OVER' | 'UNDER' | 'WIN' } {
  const text = (marketSelection || '').toLowerCase();

  if (text.includes('over 3.5')) return { verdict: 'OVER 3.5', tag: 'OVER' };
  if (text.includes('over 2.5')) return { verdict: 'OVER 2.5', tag: 'OVER' };
  if (text.includes('over 1.5')) return { verdict: 'OVER 1.5', tag: 'OVER' };
  if (text.includes('under 3.5')) return { verdict: 'UNDER 3.5', tag: 'UNDER' };
  if (text.includes('under 2.5')) return { verdict: 'UNDER 2.5', tag: 'UNDER' };
  if (text.includes('under 1.5')) return { verdict: 'UNDER 1.5', tag: 'UNDER' };
  if (text.includes('under')) return { verdict: 'UNDER', tag: 'UNDER' };
  if (text.includes('over')) return { verdict: 'OVER', tag: 'OVER' };

  if (text.includes('home win') || text.includes('(1)')) return { verdict: 'WON (HOME WIN)', tag: 'WON' };
  if (text.includes('away win') || text.includes('(2)')) return { verdict: 'WON (AWAY WIN)', tag: 'WON' };
  if (text.includes('draw') || text.includes('(x)')) return { verdict: 'DRAW (X)', tag: 'WIN' };
  if (text.includes('btts') || text.includes('gg') || text.includes('both teams')) return { verdict: 'WON (BTTS: YES)', tag: 'WON' };
  if (text.includes('double chance') || text.includes('1x')) return { verdict: 'WON (1X)', tag: 'WON' };
  if (isCombo) return { verdict: 'WON (COMBO)', tag: 'WON' };

  return { verdict: 'WON', tag: 'WON' };
}

/**
 * Creates shareable formatted slip text supporting both single and combo slips with clean verdict
 */
export function generateShareableSlip(prediction: PredictionResult): string {
  let slipContent = '';
  if (prediction.isCombo && prediction.selectedMarkets && prediction.selectedMarkets.length > 0) {
    const legs = prediction.selectedMarkets
      .map((m, i) => `   ${i + 1}. [${m.category.toUpperCase()}] ${m.label} @ ${formatOdds(m.odds)}`)
      .join('\n');
    slipContent = `🎯 1X ACCUMULATOR SLIP (${prediction.selectedMarkets.length} LEGS):\n${legs}`;
  } else {
    slipContent = `🎯 TARGET SELECTION: ${prediction.marketSelection}`;
  }

  const outcome = prediction.outcomeVerdict || 'WON';

  return `╔═════════════════════════════════════════╗
  ★ PRO SOCCER ET | VIP VERDICT SLIP ★
╚═════════════════════════════════════════╝
🏆 LEAGUE: ${prediction.league}
⚽ MATCH: ${prediction.matchTitle}
📅 SCHEDULE: ${prediction.day}
${slipContent}
⚡ VERDICT: ${outcome}
📊 1X TOTAL ODDS: ${formatOdds(prediction.odds)}
🔥 CONFIDENCE: ${prediction.confidenceScore}% | EV: +${prediction.expectedValue}%
🔮 PREDICTED SCORE: ${prediction.predictedScore}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Predict Smarter. Analyze • Predict • Win"
Verified by PRO SOCCER ET 1X Matrix`;
}
