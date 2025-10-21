/**
 * Assessment Logic - Scientifically Valid Scoring System
 *
 * Based on MaxDiff (Maximum Difference Scaling) methodology
 * with psychometric validation principles
 *
 * Key improvements:
 * 1. Win-rate normalization (wins / appearances)
 * 2. Balanced exposure (equal comparisons per value)
 * 3. Cumulative scoring (preserves all data)
 * 4. Wilson confidence intervals
 * 5. Fisher-Yates shuffling
 * 6. Reliability metrics
 *
 * Scientific References:
 * - MaxDiff methodology (Marketing Letters, 2024)
 * - Bradley-Terry-Luce model (Statistical Science)
 * - Schwartz Values Survey psychometrics (Psychometrika, 2022)
 */

import { CoreValue, AssessmentPhase, ReliabilityMetrics } from '@/types';
import { createBalancedGroups } from '@/utils/assessmentHelpers';
import {
  initializeValueStatistics,
  updateValueStatistics,
  sortByWilsonScore,
  calculateReliabilityMetrics,
  calculateConfidenceInterval
} from '@/utils/statisticalHelpers';

/**
 * Handle category selection and initialize filtering phase
 * Sets up balanced groups with equal exposure for all values
 */
export function handleCategorySelection(
  categories: string[],
  coreValues: CoreValue[],
  setters: {
    setSelectedCategories: (categories: string[]) => void;
    setAvailableValues: (values: CoreValue[]) => void;
    setValueGroups: (groups: CoreValue[][]) => void;
    setCurrentGroupIndex: (index: number) => void;
    setPhase: (phase: AssessmentPhase) => void;
  }
) {
  console.log('Categories selected:', categories);
  setters.setSelectedCategories(categories);

  // Filter values by selected categories and initialize statistics
  const filteredValues = coreValues
    .filter(v => categories.includes(v.category))
    .map(initializeValueStatistics);

  setters.setAvailableValues(filteredValues);

  // Create balanced groups for filtering phase
  // - Groups of 4 values each
  // - Each value appears 7 times (minimum for reliability)
  const groups = createBalancedGroups(filteredValues, 4, 7);

  setters.setValueGroups(groups);
  setters.setCurrentGroupIndex(0);
  setters.setPhase('filtering');

  console.log('Starting with', filteredValues.length, 'values in', groups.length, 'balanced groups');
  console.log('Each value will appear in ~7 comparisons for statistical reliability');
}

/**
 * Handle value selection in either filtering or tournament phase
 * Uses scientific scoring with win-rate normalization
 */
export function handleValueSelection(
  selectedId: string,
  state: {
    phase: AssessmentPhase;
    availableValues: CoreValue[];
    currentGroupIndex: number;
    valueGroups: CoreValue[][];
  },
  setters: {
    setAvailableValues: (values: CoreValue[]) => void;
    setCurrentGroupIndex: (index: number) => void;
    setValueGroups: (groups: CoreValue[][]) => void;
    setPhase: (phase: AssessmentPhase) => void;
    setTopValues: (values: CoreValue[]) => void;
    navigateToStep: (step: any) => void;
  }
) {
  console.log('Value selected:', selectedId, 'in phase:', state.phase);

  // Get IDs of all values in current group
  const currentGroup = state.valueGroups[state.currentGroupIndex];
  const shownIds = currentGroup.map(v => v.id);

  // Update statistics: increment wins for selected, appearances for all shown
  const updatedValues = updateValueStatistics(
    state.availableValues,
    selectedId,
    shownIds
  );

  setters.setAvailableValues(updatedValues);

  // Log updated statistics for transparency
  const selectedValue = updatedValues.find(v => v.id === selectedId);
  if (selectedValue) {
    console.log(`  ${selectedValue.name}: ${selectedValue.wins}/${selectedValue.appearances} wins (${((selectedValue.winRate || 0) * 100).toFixed(1)}% win rate, Wilson: ${((selectedValue.wilsonScore || 0) * 100).toFixed(1)}%)`);
  }

  // Move to next group
  const nextGroupIndex = state.currentGroupIndex + 1;

  if (nextGroupIndex >= state.valueGroups.length) {
    // Phase complete
    if (state.phase === 'filtering') {
      console.log('Filtering phase complete, starting tournament');
      startTournamentPhase(updatedValues, setters);
    } else if (state.phase === 'tournament') {
      console.log('Tournament phase complete');
      completeAssessment(updatedValues, setters);
    }
  } else {
    // Continue to next group
    setters.setCurrentGroupIndex(nextGroupIndex);
    console.log(`Moving to group ${nextGroupIndex + 1} of ${state.valueGroups.length}`);
  }
}

/**
 * Start tournament phase with top-performing values
 * PRESERVES all filtering data (no score reset)
 */
export function startTournamentPhase(
  values: CoreValue[],
  setters: {
    setAvailableValues: (values: CoreValue[]) => void;
    setValueGroups: (groups: CoreValue[][]) => void;
    setCurrentGroupIndex: (index: number) => void;
    setPhase: (phase: AssessmentPhase) => void;
  }
) {
  // Sort by Wilson score (most scientifically reliable ranking)
  const sortedValues = sortByWilsonScore(values);

  // Select top 12 values for tournament
  const topScoredValues = sortedValues.slice(0, 12);

  console.log('Tournament starting with top 12 values:');
  topScoredValues.forEach((v, idx) => {
    console.log(`  ${idx + 1}. ${v.name}: ${v.wins}/${v.appearances} (win rate: ${((v.winRate || 0) * 100).toFixed(1)}%, Wilson: ${((v.wilsonScore || 0) * 100).toFixed(1)}%)`);
  });

  // Create balanced tournament groups of 3
  // Each value appears 5 more times for additional data
  const tournamentGroups = createBalancedGroups(topScoredValues, 3, 5);

  console.log(`Created ${tournamentGroups.length} tournament groups with balanced exposure`);

  // DO NOT reset scores - preserve cumulative data
  setters.setAvailableValues(topScoredValues);
  setters.setValueGroups(tournamentGroups);
  setters.setCurrentGroupIndex(0);
  setters.setPhase('tournament');
}

/**
 * Complete assessment and calculate final top 3 values
 * Includes confidence intervals and reliability metrics
 */
export function completeAssessment(
  values: CoreValue[],
  setters: {
    setTopValues: (values: CoreValue[]) => void;
    setPhase: (phase: AssessmentPhase) => void;
    navigateToStep: (step: any) => void;
  }
) {
  // Sort by Wilson score for final ranking
  const sortedValues = sortByWilsonScore(values);

  // Get final top 3 values
  const finalTop3 = sortedValues.slice(0, 3);

  // Calculate confidence intervals for top 3
  const top3WithConfidence = finalTop3.map(v => {
    const confidenceInterval = calculateConfidenceInterval(
      v.wins || 0,
      v.appearances || 0,
      0.95
    );
    return {
      ...v,
      confidenceInterval
    };
  });

  // Calculate reliability metrics
  const metrics = calculateReliabilityMetrics(values);

  console.log('========================================');
  console.log('ASSESSMENT COMPLETE - FINAL RESULTS');
  console.log('========================================');
  console.log('');
  console.log('Top 3 Core Values:');
  top3WithConfidence.forEach((v, idx) => {
    const ciLower = ((v.confidenceInterval?.lower || 0) * 100).toFixed(1);
    const ciUpper = ((v.confidenceInterval?.upper || 0) * 100).toFixed(1);
    console.log(`  ${idx + 1}. ${v.name}`);
    console.log(`     Wins: ${v.wins}/${v.appearances}`);
    console.log(`     Win Rate: ${((v.winRate || 0) * 100).toFixed(1)}%`);
    console.log(`     Wilson Score: ${((v.wilsonScore || 0) * 100).toFixed(1)}%`);
    console.log(`     95% CI: [${ciLower}%, ${ciUpper}%]`);
    console.log('');
  });

  console.log('Reliability Metrics:');
  console.log(`  Total Comparisons: ${metrics.totalComparisons}`);
  console.log(`  Avg Comparisons/Value: ${metrics.averageComparisonsPerValue.toFixed(1)}`);
  console.log(`  Balanced Exposure: ${metrics.balancedExposure ? 'Yes ✓' : 'No ✗'}`);
  console.log(`  Methodology: ${metrics.methodology}`);
  console.log(`  Confidence Level: ${(metrics.confidenceLevel * 100)}%`);
  console.log('========================================');

  setters.setTopValues(top3WithConfidence);
  setters.setPhase('complete');
  setters.navigateToStep('results');
}

/**
 * Get reliability metrics for current assessment state
 * Can be called at any point to check data quality
 */
export function getAssessmentMetrics(values: CoreValue[]): ReliabilityMetrics {
  return calculateReliabilityMetrics(values);
}
