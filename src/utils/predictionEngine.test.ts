import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateImpliedProbability,
  calculateExpectedValue,
  determineRiskLevel,
  formatOdds,
  generatePrediction,
} from './predictionEngine.ts';

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
});
