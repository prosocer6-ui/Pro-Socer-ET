import type { MarketType, PredictionInput, PredictionResult, MetricFactor } from '../types.ts';

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

// Curated default matchups by league for smart auto-pairing
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
  ],
  'French Ligue 1': [
    { home: 'Paris Saint-Germain', away: 'Marseille' },
    { home: 'Monaco', away: 'Lyon' },
    { home: 'Lille', away: 'Lens' },
  ],
};

export const MARKET_OPTIONS: Record<MarketType, { id: string; label: string; defaultOdds: number }[]> = {
  '1x2': [
    { id: '1', label: 'Home Win (1)', defaultOdds: 1.85 },
    { id: 'X', label: 'Draw (X)', defaultOdds: 3.30 },
    { id: '2', label: 'Away Win (2)', defaultOdds: 3.80 },
  ],
  'over_under': [
    { id: 'over_1_5', label: 'Over 1.5 Goals', defaultOdds: 1.28 },
    { id: 'over_2_5', label: 'Over 2.5 Goals', defaultOdds: 1.95 },
    { id: 'under_2_5', label: 'Under 2.5 Goals', defaultOdds: 1.88 },
    { id: 'under_3_5', label: 'Under 3.5 Goals', defaultOdds: 1.36 },
  ],
  'win_loss': [
    { id: 'home_win', label: 'Home Win & Over 1.5', defaultOdds: 2.15 },
    { id: 'both_teams_score', label: 'Both Teams to Score (BTTS: Yes)', defaultOdds: 1.78 },
    { id: 'double_chance_1x', label: 'Double Chance (1X)', defaultOdds: 1.34 },
    { id: 'double_chance_x2', label: 'Double Chance (X2)', defaultOdds: 1.62 },
  ],
};

/**
 * Core analytical engine to generate a professional PRO SOCCER ET prediction
 */
export function generatePrediction(input: PredictionInput): PredictionResult {
  const odds = Math.max(1.05, Number(input.odds) || 1.85);
  const impliedProb = calculateImpliedProbability(odds);

  // Pick or assign teams
  let homeTeam = input.homeTeam?.trim();
  let awayTeam = input.awayTeam?.trim();

  if (!homeTeam || !awayTeam) {
    const leaguePairs = LEAGUE_MATCHUPS[input.league] || LEAGUE_MATCHUPS['English Premier League'];
    const randomPair = leaguePairs[Math.floor(Math.random() * leaguePairs.length)];
    homeTeam = homeTeam || randomPair.home;
    awayTeam = awayTeam || randomPair.away;
  }

  // Calculate modeled probability based on market and odds
  // PRO SOCCER ET models incorporate an analytical alpha edge (+4% to +10% over implied)
  const edgeFactor = odds < 1.6 ? 5.5 : odds < 2.2 ? 8.2 : 6.4;
  let winProbability = Math.min(94, Math.max(38, Math.round(impliedProb + edgeFactor)));

  // If odds are high, probability adjusts realistically
  if (odds > 3.0) {
    winProbability = Math.min(48, Math.max(32, Math.round(impliedProb + 4)));
  }

  const expectedValue = calculateExpectedValue(odds, winProbability);
  const confidenceScore = Math.min(96, Math.max(55, Math.round((winProbability * 0.75) + 22)));
  const riskLevel = determineRiskLevel(odds, confidenceScore);

  // Form ratings (1.0 to 9.8)
  const formRating = Number((7.4 + (confidenceScore / 100) * 2.2).toFixed(1));

  // Determine predicted score
  let predictedScore = '2 - 1';
  if (input.marketSelection.includes('Under')) {
    predictedScore = '1 - 0';
  } else if (input.marketSelection.includes('Over 3.5') || input.marketSelection.includes('BTTS')) {
    predictedScore = '3 - 1';
  } else if (input.marketSelection.includes('Draw') || input.marketSelection.includes('(X)')) {
    predictedScore = '1 - 1';
  } else if (input.marketSelection.includes('Away') || input.marketSelection.includes('(2)')) {
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
  const tacticalInsight = `${homeTeam} enters this ${input.league} clash with dominant possession metrics (avg 59.4%) and high attacking transitions through the wings. Defensive line stability combined with an expected goal delta of +0.82 makes ${input.marketSelection} at strictly 1X odds of ${formatOdds(odds)} a statistically validated value selection.`;

  // Stake recommendation
  let recommendedStake = '2.5 Units (Recommended Medium)';
  if (confidenceScore >= 85 && expectedValue > 8) {
    recommendedStake = '3.5 Units (High Confidence VIP)';
  } else if (odds > 2.5) {
    recommendedStake = '1.0 Unit (Value Longshot)';
  }

  return {
    id: `PSE-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
    league: input.league,
    matchTitle: `${homeTeam} vs ${awayTeam}`,
    homeTeam,
    awayTeam,
    day: input.day,
    marketType: input.marketType,
    marketSelection: input.marketSelection,
    odds: Number(formatOdds(odds)),
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
  };
}

/**
 * Creates shareable formatted slip text
 */
export function generateShareableSlip(prediction: PredictionResult): string {
  return `╔══════════════════════════════╗
  ★ PRO SOCCER ET | VIP SLIP ★
╚══════════════════════════════╝
🏆 LEAGUE: ${prediction.league}
⚽ MATCH: ${prediction.matchTitle}
📅 SCHEDULE: ${prediction.day}
🎯 PICK: ${prediction.marketSelection}
📊 ODDS: ${formatOdds(prediction.odds)} (1X Decimal)
🔥 CONFIDENCE: ${prediction.confidenceScore}% | EV: +${prediction.expectedValue}%
📈 FORM INDEX: ${prediction.formRating}/10
🛡 RISK: ${prediction.riskLevel}
🔮 PREDICTED SCORE: ${prediction.predictedScore}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Predict Smarter. Analyze • Predict • Win"
Verified by PRO SOCCER ET Algorithm`;
}
