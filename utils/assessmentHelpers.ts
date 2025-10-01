import { CoreValue } from '@/types';

// Create groups of values for comparison
export function createValueGroups(values: CoreValue[], groupSize: number = 4): CoreValue[][] {
  const shuffled = [...values].sort(() => Math.random() - 0.5);
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
