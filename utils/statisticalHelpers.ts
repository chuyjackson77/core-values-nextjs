/**
 * Statistical utility functions for scientifically valid assessment scoring
 * Based on MaxDiff methodology and psychometric best practices
 */

import { CoreValue, ReliabilityMetrics } from '@/types';

/**
 * Fisher-Yates shuffle algorithm
 * Provides unbiased uniform random distribution
 * Replaces the biased .sort(() => Math.random() - 0.5) approach
 *
 * @see https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 */
export function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Calculate Wilson score confidence interval (lower bound)
 * Used by Reddit, YouTube, and other platforms for ranking
 * Accounts for both win rate and sample size
 *
 * Formula penalizes items with fewer comparisons, providing conservative estimates
 *
 * @param wins - Number of times the value was selected
 * @param total - Total number of times the value was shown
 * @param confidence - Confidence level (default 0.95 for 95% CI)
 * @returns Wilson score lower bound (0.0 - 1.0)
 *
 * @see https://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval#Wilson_score_interval
 */
export function calculateWilsonScore(
  wins: number,
  total: number,
  confidence: number = 0.95
): number {
  if (total === 0) return 0;

  // Z-score for confidence level (1.96 for 95% confidence)
  const z = confidence === 0.95 ? 1.96 : 1.645; // 95% or 90%

  const phat = wins / total; // Sample proportion

  // Wilson score formula
  const numerator = phat + (z * z) / (2 * total) -
    z * Math.sqrt((phat * (1 - phat) + (z * z) / (4 * total)) / total);
  const denominator = 1 + (z * z) / total;

  return numerator / denominator;
}

/**
 * Calculate confidence interval using Wilson method
 * Returns both lower and upper bounds
 *
 * @param wins - Number of times the value was selected
 * @param total - Total number of times the value was shown
 * @param confidence - Confidence level (default 0.95)
 * @returns Object with lower and upper bounds
 */
export function calculateConfidenceInterval(
  wins: number,
  total: number,
  confidence: number = 0.95
): { lower: number; upper: number } {
  if (total === 0) return { lower: 0, upper: 0 };

  const z = confidence === 0.95 ? 1.96 : 1.645;
  const phat = wins / total;

  const center = phat + (z * z) / (2 * total);
  const margin = z * Math.sqrt((phat * (1 - phat) + (z * z) / (4 * total)) / total);
  const denominator = 1 + (z * z) / total;

  return {
    lower: (center - margin) / denominator,
    upper: (center + margin) / denominator
  };
}

/**
 * Update value statistics after a comparison
 * Increments wins for selected value, appearances for all shown values
 * Recalculates win rate and Wilson score
 *
 * @param values - Array of all values
 * @param selectedId - ID of the value that was selected
 * @param shownIds - IDs of all values that were shown in this comparison
 * @returns Updated array of values
 */
export function updateValueStatistics(
  values: CoreValue[],
  selectedId: string,
  shownIds: string[]
): CoreValue[] {
  return values.map(value => {
    // Value wasn't in this comparison
    if (!shownIds.includes(value.id)) {
      return value;
    }

    // Initialize if needed
    const wins = (value.wins || 0) + (value.id === selectedId ? 1 : 0);
    const appearances = (value.appearances || 0) + 1;
    const winRate = appearances > 0 ? wins / appearances : 0;
    const wilsonScore = calculateWilsonScore(wins, appearances);

    return {
      ...value,
      wins,
      appearances,
      winRate,
      wilsonScore,
      score: wins // Legacy compatibility
    };
  });
}

/**
 * Calculate reliability metrics for the assessment
 * Provides transparency about data quality
 *
 * @param values - All values with their statistics
 * @returns Reliability metrics object
 */
export function calculateReliabilityMetrics(values: CoreValue[]): ReliabilityMetrics {
  const valuesWithAppearances = values.filter(v => (v.appearances || 0) > 0);

  const totalComparisons = valuesWithAppearances.reduce(
    (sum, v) => sum + (v.appearances || 0),
    0
  );

  const averageComparisonsPerValue = valuesWithAppearances.length > 0
    ? totalComparisons / valuesWithAppearances.length
    : 0;

  // Check if exposure is balanced (within 1 comparison of each other)
  const appearances = valuesWithAppearances.map(v => v.appearances || 0);
  const minAppearances = Math.min(...appearances);
  const maxAppearances = Math.max(...appearances);
  const balancedExposure = (maxAppearances - minAppearances) <= 1;

  return {
    totalComparisons,
    averageComparisonsPerValue,
    balancedExposure,
    confidenceLevel: 0.95,
    methodology: 'MaxDiff-Balanced',
    timestamp: new Date().toISOString()
  };
}

/**
 * Initialize value statistics
 * Sets all statistical fields to 0
 *
 * @param value - Core value to initialize
 * @returns Value with initialized statistics
 */
export function initializeValueStatistics(value: CoreValue): CoreValue {
  return {
    ...value,
    wins: 0,
    appearances: 0,
    winRate: 0,
    wilsonScore: 0,
    score: 0
  };
}

/**
 * Sort values by Wilson score (most reliable ranking method)
 * Falls back to win rate if Wilson scores are equal
 *
 * @param values - Array of values to sort
 * @returns Sorted array (highest scores first)
 */
export function sortByWilsonScore(values: CoreValue[]): CoreValue[] {
  return [...values].sort((a, b) => {
    const wilsonDiff = (b.wilsonScore || 0) - (a.wilsonScore || 0);
    if (Math.abs(wilsonDiff) > 0.0001) return wilsonDiff;

    // Tie-breaker: use win rate
    const winRateDiff = (b.winRate || 0) - (a.winRate || 0);
    if (Math.abs(winRateDiff) > 0.0001) return winRateDiff;

    // Final tie-breaker: raw wins
    return (b.wins || 0) - (a.wins || 0);
  });
}
