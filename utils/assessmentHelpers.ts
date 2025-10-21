import { CoreValue } from '@/types';
import { fisherYatesShuffle } from './statisticalHelpers';

/**
 * Create balanced groups ensuring equal exposure for all values
 * This is the scientifically correct approach for MaxDiff methodology
 *
 * Algorithm ensures each value appears in exactly targetAppearances comparisons
 * This eliminates selection probability bias
 *
 * @param values - Array of values to group
 * @param groupSize - Number of values per group (default 4 for filtering, 3 for tournament)
 * @param targetAppearances - How many times each value should appear (default 7 for reliability)
 * @returns Array of balanced groups
 */
export function createBalancedGroups(
  values: CoreValue[],
  groupSize: number = 4,
  targetAppearances: number = 7
): CoreValue[][] {
  const groups: CoreValue[][] = [];
  const appearanceCounts = new Map<string, number>();

  // Initialize appearance counts
  values.forEach(v => appearanceCounts.set(v.id, 0));

  // Calculate total number of groups needed
  const totalSlots = values.length * targetAppearances;
  const numGroups = Math.ceil(totalSlots / groupSize);

  for (let groupIndex = 0; groupIndex < numGroups; groupIndex++) {
    const group: CoreValue[] = [];

    // Get values that need more appearances, shuffled
    const availableValues = values
      .filter(v => (appearanceCounts.get(v.id) || 0) < targetAppearances)
      .sort(() => Math.random() - 0.5); // Quick shuffle for selection

    // Fill the group
    for (let i = 0; i < groupSize && i < availableValues.length; i++) {
      const value = availableValues[i];
      group.push(value);
      appearanceCounts.set(value.id, (appearanceCounts.get(value.id) || 0) + 1);
    }

    // Only add groups that have at least 2 values
    if (group.length >= 2) {
      // Fisher-Yates shuffle the group for unbiased presentation
      groups.push(fisherYatesShuffle(group));
    }
  }

  // Fisher-Yates shuffle the order of groups
  return fisherYatesShuffle(groups);
}

/**
 * Legacy function - creates groups with simple shuffling
 * DEPRECATED: Use createBalancedGroups for scientific validity
 *
 * @deprecated Use createBalancedGroups instead
 */
export function createValueGroups(values: CoreValue[], groupSize: number = 4): CoreValue[][] {
  // Use Fisher-Yates instead of biased sort
  const shuffled = fisherYatesShuffle(values);
  const groups: CoreValue[][] = [];

  for (let i = 0; i < shuffled.length; i += groupSize) {
    const group = shuffled.slice(i, i + groupSize);
    if (group.length >= 2) {
      groups.push(group);
    }
  }

  return groups;
}

// Get unique categories from core values
export function getCategories(coreValues: CoreValue[]): string[] {
  return [...new Set(coreValues.map(v => v.category))].sort();
}
