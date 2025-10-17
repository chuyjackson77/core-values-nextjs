'use client'

import React from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { InstructionsScreen } from '@/components/InstructionsScreen';
import { CategorySelectionScreen } from '@/components/CategorySelectionScreen';
import { SelectionScreen } from '@/components/SelectionScreen';
import { ResultsScreen } from '@/components/ResultsScreen';
import { CoachingScreen } from '@/components/CoachingScreen';
import { ProfileScreen } from '@/components/ProfileScreen';
import { ThankYouScreen } from '@/components/ThankYouScreen';

import { CoreValue, UserProfile, AppStep, AssessmentPhase } from '@/types';
import { CORE_VALUES } from '@/data/coreValues';
import { getCurrentGroup, getCurrentRoundNumber, getTotalRounds } from '@/utils/groupHelpers';
import { handleCategorySelection, handleValueSelection, completeAssessment } from '@/utils/assessmentLogic';

interface StepRendererProps {
  currentStep: AppStep;
  selectedCategories: string[];
  availableValues: CoreValue[];
  valueGroups: CoreValue[][];
  currentGroupIndex: number;
  phase: AssessmentPhase;
  topValues: CoreValue[];
  userProfile: UserProfile;
  selectedCoachingPackage: string | undefined;
  onNavigateToStep: (step: AppStep) => void;
  onStartSelection: () => void;
  onResetApp: () => void;
  setters: {
    setSelectedCategories: (categories: string[]) => void;
    setAvailableValues: (values: CoreValue[]) => void;
    setValueGroups: (groups: CoreValue[][]) => void;
    setCurrentGroupIndex: (index: number) => void;
    setPhase: (phase: AssessmentPhase) => void;
    setTopValues: (values: CoreValue[]) => void;
    setUserProfile: (profile: UserProfile) => void;
    setSelectedCoachingPackage: (pkg: string | undefined) => void;
  };
}

export function StepRenderer(props: StepRendererProps) {
  const {
    currentStep,
    selectedCategories,
    availableValues,
    valueGroups,
    currentGroupIndex,
    phase,
    topValues,
    userProfile,
    selectedCoachingPackage,
    onNavigateToStep,
    onStartSelection,
    onResetApp,
    setters
  } = props;

  const handleCategorySelectionWrapper = (categories: string[]) => {
    handleCategorySelection(categories, CORE_VALUES, setters);
  };

  const handleValueSelectionWrapper = (selectedId: string) => {
    handleValueSelection(
      selectedId,
      { phase, availableValues, currentGroupIndex, valueGroups },
      { ...setters, navigateToStep: onNavigateToStep }
    );
  };

  switch (currentStep) {
    case 'welcome':
      return <WelcomeScreen onStart={() => onNavigateToStep('instructions')} />;
    
    case 'instructions':
      return <InstructionsScreen onBegin={onStartSelection} onBack={() => onNavigateToStep('welcome')} />;
    
    case 'selection':
      // Show category selection first
      if (selectedCategories.length === 0) {
        // Get one representative value from each category
        const categoryRepresentatives = CORE_VALUES.filter((v, i, arr) => 
          arr.findIndex(val => val.category === v.category) === i
        );
        
        return (
          <CategorySelectionScreen 
            categories={categoryRepresentatives}
            round={1}
            totalRounds={1}
            onSelect={(categoryId) => {
              const selectedValue = CORE_VALUES.find(v => v.id === categoryId);
              if (selectedValue) {
                handleCategorySelectionWrapper([selectedValue.category]);
              }
            }}
            onBack={() => onNavigateToStep('instructions')}
          />
        );
      }
      
      // Show value selection
      const currentGroup = getCurrentGroup(currentGroupIndex, valueGroups);
      if (!currentGroup) {
        // This shouldn't happen, but handle gracefully
        console.log('No current group, completing assessment');
        completeAssessment(availableValues, { ...setters, navigateToStep: onNavigateToStep });
        return null;
      }
      
      return (
        <SelectionScreen
          values={currentGroup}
          round={getCurrentRoundNumber(currentGroupIndex)}
          totalRounds={getTotalRounds(valueGroups)}
          onSelect={handleValueSelectionWrapper}
          onBack={() => onNavigateToStep('instructions')}
          phase={phase}
        />
      );
    
    case 'results':
      return (
        <ResultsScreen
          topValues={topValues}
          onContinue={() => onNavigateToStep('coaching')}
        />
      );
    
    case 'coaching':
      return (
        <CoachingScreen
          onBookSession={(selectedPackage) => {
            console.log('🎯 StepRenderer: Setting coaching package to:', selectedPackage);
            setters.setSelectedCoachingPackage(selectedPackage);
            onNavigateToStep('profile');
          }}
          onExploreResources={() => onNavigateToStep('thankyou')}
          onBack={() => onNavigateToStep('results')}
        />
      );
    
    case 'profile':
      return (
        <ProfileScreen
          profile={userProfile}
          topValues={topValues}
          selectedCategories={selectedCategories}
          selectedCoachingPackage={selectedCoachingPackage}
          onSubmit={(profile) => {
            console.log('📋 StepRenderer: Submitting profile with coaching package:', selectedCoachingPackage);
            setters.setUserProfile(profile);
            onNavigateToStep('thankyou');
          }}
          onBack={() => onNavigateToStep('coaching')}
        />
      );
    
    case 'thankyou':
      return (
        <ThankYouScreen
          onRestart={onResetApp}
          onCoaching={() => onNavigateToStep('coaching')}
        />
      );
    
    default:
      return <WelcomeScreen onStart={() => onNavigateToStep('instructions')} />;
  }
}
