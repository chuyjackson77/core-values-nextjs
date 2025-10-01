'use client'

import { useState, useEffect } from 'react';
import { CoreValue, UserProfile, AppStep, AssessmentPhase } from '@/types';

export function useAppState() {
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableValues, setAvailableValues] = useState<CoreValue[]>([]);
  const [valueGroups, setValueGroups] = useState<CoreValue[][]>([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [phase, setPhase] = useState<AssessmentPhase>('filtering');
  const [topValues, setTopValues] = useState<CoreValue[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: '', email: '' });
  const [selectedCoachingPackage, setSelectedCoachingPackage] = useState<string | undefined>();

  // DEBUG: Log state changes for coaching package
  useEffect(() => {
    console.log('🎯 useAppState: selectedCoachingPackage state changed to:', selectedCoachingPackage);
  }, [selectedCoachingPackage]);

  const navigateToStep = (step: AppStep) => {
    setCurrentStep(step);
  };

  const resetApp = () => {
    setCurrentStep('welcome');
    setSelectedCategories([]);
    setAvailableValues([]);
    setValueGroups([]);
    setCurrentGroupIndex(0);
    setPhase('filtering');
    setTopValues([]);
    setUserProfile({ name: '', email: '' });
    setSelectedCoachingPackage(undefined);
  };

  return {
    // State
    currentStep,
    selectedCategories,
    availableValues,
    valueGroups,
    currentGroupIndex,
    phase,
    topValues,
    userProfile,
    selectedCoachingPackage,
    // Setters
    setSelectedCategories,
    setAvailableValues,
    setValueGroups,
    setCurrentGroupIndex,
    setPhase,
    setTopValues,
    setUserProfile,
    setSelectedCoachingPackage,
    // Actions
    navigateToStep,
    resetApp,
  };
}