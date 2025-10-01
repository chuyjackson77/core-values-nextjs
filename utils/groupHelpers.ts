import { CoreValue } from '@/types';

export function getCurrentGroup(currentGroupIndex: number, valueGroups: CoreValue[][]): CoreValue[] | null {
  if (currentGroupIndex >= valueGroups.length) return null;
  return valueGroups[currentGroupIndex];
}

export function getCurrentRoundNumber(currentGroupIndex: number): number {
  return currentGroupIndex + 1;
}

export function getTotalRounds(valueGroups: CoreValue[][]): number {
  return valueGroups.length;
}