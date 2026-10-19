import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateImpliedProbability,
  calculateExpectedValue,
  determineRiskLevel,
  formatOdds,
  generatePrediction,
  calculateComboOdds,
  WORLD_LEAGUES,
  deriveOutcomeVerdict,
  generatePredictionsList,
  generateMultiMatchShareSlip,
} from './predictionEngine.ts';

test('calculateComboOdds correctly multiplies decimal odds', () => {
  const combo = calculateComboOdds([
    { id: '1', category: '1x2', label: 'Home Win', odds: 1.80 },
    { id: '2', category: 'over_under', label: 'Over 1.5 Goals', odds: 1.30 },
  ]);
  // 1.80 * 1.30 = 2.34
  assert.equal(combo, 2.34);
});

test('WORLD_LEAGUES contains African and global leagues', () => {
  const allLeagueNames = WORLD_LEAGUES.flatMap((c) => c.leagues.map((l) => l.name));
  assert.ok(allLeagueNames.includes('Ethiopian Premier League (ET)'));
  assert.ok(allLeagueNames.includes('UEFA Champions League'));
  assert.ok(allLeagueNames.includes('Major League Soccer (MLS)'));
  assert.ok(allLeagueNames.includes('Saudi Pro League'));
});

test('calculateImpliedProbability correctly derives percentage from decimal odds', () => {
  // 1 / 2.0 = 50%
  assert.equal(calculateImpliedProbability(2.0), 50.0);
  // 1 / 1.5 = 66.7%
  assert.equal(calculateImpliedProbability(1.5), 66.7);
  // invalid odds fallback
  assert.equal(calculateImpliedProbability(0), 0);
  assert.equal(calculateImpliedProbability(0.5), 0);
});

test('calculateExpectedValue correctly calculates EV percentage', () => {
  // Odds 2.0, Win Prob 60% => (2.0 * 0.60 - 1) * 100 = +20%
  assert.equal(calculateExpectedValue(2.0, 60), 20.0);
  // Odds 1.5, Win Prob 70% => (1.5 * 0.70 - 1) * 100 = +5%
  assert.equal(calculateExpectedValue(1.5, 70), 5.0);
  // Negative EV: Odds 1.8, Win Prob 50% => (1.8 * 0.50 - 1) * 100 = -10%
  assert.equal(calculateExpectedValue(1.8, 50), -10.0);
});

test('determineRiskLevel assigns correct risk tier', () => {
  assert.equal(determineRiskLevel(1.50, 80), 'LOW RISK');
  assert.equal(determineRiskLevel(2.50, 60), 'HIGH VALUE');
  assert.equal(determineRiskLevel(1.85, 70), 'MODERATE');
});

test('formatOdds formats strictly to 2 decimal places', () => {
  assert.equal(formatOdds(1.8), '1.80');
  assert.equal(formatOdds(2.1), '2.10');
  assert.equal(formatOdds(1.456), '1.46');
  assert.equal(formatOdds(0), '1.50');
});

test('generatePrediction outputs full analysis with confidence and tactical breakdown', () => {
  const result = generatePrediction({
    league: 'English Premier League',
    day: 'Today',
    marketType: '1x2',
    marketSelection: 'Home Win (1)',
    odds: 1.85,
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
  });

  assert.equal(result.league, 'English Premier League');
  assert.equal(result.matchTitle, 'Arsenal vs Chelsea');
  assert.equal(result.odds, 1.85);
  assert.ok(result.winProbability > 50, 'Win probability should be calculated');
  assert.ok(result.confidenceScore >= 55, 'Confidence score should be valid');
  assert.ok(result.tacticalInsight.includes('Arsenal'), 'Tactical breakdown contains home team');
  assert.ok(result.keyFactors.length >= 3, 'Key analytical factors generated');
  assert.equal(result.outcomeVerdict, 'WON (HOME WIN)');
  assert.equal(result.outcomeTag, 'WON');
});

test('deriveOutcomeVerdict correctly identifies Won, Over, and Under outcomes with no description', () => {
  assert.deepEqual(deriveOutcomeVerdict('Over 2.5 Goals', 'over_under'), { verdict: 'OVER 2.5', tag: 'OVER' });
  assert.deepEqual(deriveOutcomeVerdict('Under 2.5 Goals', 'over_under'), { verdict: 'UNDER 2.5', tag: 'UNDER' });
  assert.deepEqual(deriveOutcomeVerdict('Over 1.5 Goals', 'over_under'), { verdict: 'OVER 1.5', tag: 'OVER' });
  assert.deepEqual(deriveOutcomeVerdict('Home Win (1)', '1x2'), { verdict: 'WON (HOME WIN)', tag: 'WON' });
  assert.deepEqual(deriveOutcomeVerdict('Away Win (2)', '1x2'), { verdict: 'WON (AWAY WIN)', tag: 'WON' });
  assert.deepEqual(deriveOutcomeVerdict('Draw (X)', '1x2'), { verdict: 'DRAW (X)', tag: 'WIN' });
  assert.deepEqual(deriveOutcomeVerdict('Both Teams to Score (GG)', 'both_score'), { verdict: 'WON (BTTS: YES)', tag: 'WON' });
});

test('generatePredictionsList generates multiple matches with zero duplicates and direct predictions', () => {
  const matches = generatePredictionsList(
    {
      league: 'English Premier League',
      day: 'Today',
      marketType: '1x2',
      marketSelection: 'Home Win (1)',
      odds: 1.85,
    },
    4
  );

  // 1. "not just one match": must return multiple matches (4 matches)
  assert.equal(matches.length, 4, 'Should generate 4 matches');

  // 2. "dont dublicsate that match": strictly NO duplicate matches
  const matchTitles = matches.map((m) => m.matchTitle.toLowerCase());
  const uniqueTitles = new Set(matchTitles);
  assert.equal(uniqueTitles.size, matches.length, 'Every match title must be unique with no duplicates');

  // Strictly no team appears twice
  const allTeams = matches.flatMap((m) => [m.homeTeam.toLowerCase(), m.awayTeam.toLowerCase()]);
  const uniqueTeams = new Set(allTeams);
  assert.equal(uniqueTeams.size, allTeams.length, 'No team should play twice in the prediction list');

  // 3. "just list them with there pridcts no description or explanation"
  for (const match of matches) {
    assert.ok(match.outcomeVerdict, 'Must have a direct outcome verdict (won/loss/over/under/etc.)');
    assert.ok(match.odds >= 1.05, 'Must have strict 1X decimal odds');
    assert.ok(match.matchTitle.includes(' vs '), 'Must have match title');
  }
});

test('generatePredictionsList handles custom teams as first match without duplicating other matches', () => {
  const matches = generatePredictionsList(
    {
      league: 'English Premier League',
      day: 'Today',
      marketType: 'over_under',
      marketSelection: 'Over 2.5 Goals',
      odds: 1.95,
      homeTeam: 'Arsenal',
      awayTeam: 'Chelsea',
    },
    4
  );

  assert.equal(matches.length, 4);
  assert.equal(matches[0].matchTitle, 'Arsenal vs Chelsea');
  assert.equal(matches[0].outcomeVerdict, 'OVER 2.5');

  // Verify none of the subsequent 3 matches duplicate Arsenal or Chelsea
  for (let i = 1; i < matches.length; i++) {
    assert.notEqual(matches[i].matchTitle.toLowerCase(), 'arsenal vs chelsea');
    assert.notEqual(matches[i].homeTeam.toLowerCase(), 'arsenal');
    assert.notEqual(matches[i].awayTeam.toLowerCase(), 'arsenal');
    assert.notEqual(matches[i].homeTeam.toLowerCase(), 'chelsea');
    assert.notEqual(matches[i].awayTeam.toLowerCase(), 'chelsea');
  }
});

test('generateMultiMatchShareSlip formats multiple predictions cleanly with no descriptions', () => {
  const matches = generatePredictionsList(
    {
      league: 'Spanish La Liga',
      day: 'Today',
      marketType: '1x2',
      marketSelection: 'Home Win (1)',
      odds: 1.85,
    },
    3
  );

  const slip = generateMultiMatchShareSlip(matches);
  assert.ok(slip.includes('PRO SOCCER ET | MATCH PREDICTIONS'));
  assert.ok(slip.includes('Matches: 3'));
  assert.ok(slip.includes('Prediction:'));
  assert.ok(slip.includes('1X Odds:'));
  // Ensure no tactical long explanation paragraphs in the share slip
  assert.ok(!slip.includes('possession metrics'));
  assert.ok(!slip.includes('tactical breakdown'));
});
