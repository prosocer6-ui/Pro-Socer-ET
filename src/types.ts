export type UserStatus = 'pending' | 'approved' | 'rejected';
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  password?: string;
  status: UserStatus;
  role: UserRole;
  createdAt: string;
  approvedAt?: string;
  reviewedBy?: string;
}

export type MarketType = '1x2' | 'over_under' | 'win_loss' | 'double_chance' | 'both_score' | 'all';

export interface MarketSelectionItem {
  id: string;
  category: string;
  label: string;
  odds: number;
}

export interface PredictionInput {
  league: string;
  day: string; // 'Today' | 'Tomorrow' | 'Weekend' | specific date
  marketType: MarketType;
  marketSelection: string; // e.g. 'Home Win (1)', 'Over 2.5 Goals'
  selectedMarkets?: MarketSelectionItem[];
  isCombo?: boolean;
  odds: number; // e.g. 1.85, strictly 1X decimal format
  homeTeam?: string;
  awayTeam?: string;
  matchTitle?: string;
}

export interface MetricFactor {
  label: string;
  value: string;
  sentiment: 'positive' | 'neutral' | 'caution';
}

export interface PredictionResult {
  id: string;
  createdAt: string;
  league: string;
  matchTitle: string;
  homeTeam: string;
  awayTeam: string;
  day: string;
  marketType: MarketType;
  marketSelection: string;
  selectedMarkets?: MarketSelectionItem[];
  isCombo?: boolean;
  totalOdds?: number;
  odds: number;
  winProbability: number; // e.g. 78%
  expectedValue: number; // e.g. +14.2%
  confidenceScore: number; // 1 - 100
  formRating: number; // 1.0 - 10.0
  riskLevel: 'LOW RISK' | 'MODERATE' | 'HIGH VALUE';
  predictedScore: string; // e.g. '2 - 1'
  tacticalInsight: string;
  keyFactors: MetricFactor[];
  recommendedStake: string; // e.g. '2.5 Units (Medium)'
  status?: 'WON' | 'PENDING' | 'ANALYZED';
  outcomeVerdict?: string; // e.g. 'WON', 'LOSS', 'OVER 2.5', 'UNDER 2.5'
  outcomeTag?: 'WON' | 'LOSS' | 'OVER' | 'UNDER' | 'WIN';
}

export interface BankerPick {
  id: string;
  title: string;
  matchup: string;
  league: string;
  kickoff: string;
  pick: string;
  odds: number;
  confidence: number;
  badge: string;
  verdict?: string;
  description?: string;
  verifiedRecord: string;
}
