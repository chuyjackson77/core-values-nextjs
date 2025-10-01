import { CoreValue, AssessmentPhase } from '@/types';
import { createValueGroups } from '@/utils/assessmentHelpers';

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
  
  // Filter values by selected categories
  const filteredValues = coreValues.filter(v => categories.includes(v.category))
    .map(v => ({ ...v, score: 0 }));
  
  setters.setAvailableValues(filteredValues);
  
  // Create initial groups for filtering phase
  const groups = createValueGroups(filteredValues, 4);
  setters.setValueGroups(groups);
  setters.setCurrentGroupIndex(0);
  setters.setPhase('filtering');
  
  console.log('Starting with', filteredValues.length, 'values in', groups.length, 'groups');
}

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
  
  if (state.phase === 'filtering') {
    // Award point to selected value
    const updatedValues = state.availableValues.map(v => 
      v.id === selectedId ? { ...v, score: (v.score || 0) + 1 } : v
    );
    setters.setAvailableValues(updatedValues);
    
    // Move to next group
    const nextGroupIndex = state.currentGroupIndex + 1;
    
    if (nextGroupIndex >= state.valueGroups.length) {
      // Filtering phase complete, start tournament
      console.log('Filtering complete, starting tournament');
      startTournamentPhase(updatedValues, setters);
    } else {
      // Continue to next group
      setters.setCurrentGroupIndex(nextGroupIndex);
      console.log('Moving to group', nextGroupIndex + 1, 'of', state.valueGroups.length);
    }
  } else if (state.phase === 'tournament') {
    // Award point to selected value
    const updatedValues = state.availableValues.map(v => 
      v.id === selectedId ? { ...v, score: (v.score || 0) + 1 } : v
    );
    setters.setAvailableValues(updatedValues);
    
    // Move to next group
    const nextGroupIndex = state.currentGroupIndex + 1;
    
    if (nextGroupIndex >= state.valueGroups.length) {
      // Tournament phase complete
      console.log('Tournament complete');
      completeAssessment(updatedValues, setters);
    } else {
      // Continue to next group
      setters.setCurrentGroupIndex(nextGroupIndex);
      console.log('Tournament: Moving to group', nextGroupIndex + 1, 'of', state.valueGroups.length);
    }
  }
}

export function startTournamentPhase(
  values: CoreValue[],
  setters: {
    setAvailableValues: (values: CoreValue[]) => void;
    setValueGroups: (groups: CoreValue[][]) => void;
    setCurrentGroupIndex: (index: number) => void;
    setPhase: (phase: AssessmentPhase) => void;
  }
) {
  // Get top 12-15 values with highest scores
  const topScoredValues = [...values]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 12)
    .map(v => ({ ...v, score: 0 })); // Reset scores for tournament
  
  console.log('Tournament starting with:', topScoredValues.map(v => v.name));
  
  // Create tournament groups of 3
  const tournamentGroups = createValueGroups(topScoredValues, 3);
  
  setters.setAvailableValues(topScoredValues);
  setters.setValueGroups(tournamentGroups);
  setters.setCurrentGroupIndex(0);
  setters.setPhase('tournament');
}

export function completeAssessment(
  values: CoreValue[],
  setters: {
    setTopValues: (values: CoreValue[]) => void;
    setPhase: (phase: AssessmentPhase) => void;
    navigateToStep: (step: any) => void;
  }
) {
  // Get final top 3 values
  const finalTop3 = [...values]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 3);
  
  console.log('Assessment complete! Top 3:', finalTop3.map(v => `${v.name}(${v.score})`));
  
  setters.setTopValues(finalTop3);
  setters.setPhase('complete');
  setters.navigateToStep('results');
}