'use client'

import { StepRenderer } from '@/components/StepRenderer'
import { useAppState } from '@/hooks/useAppState'

export default function Home() {
  const appState = useAppState()

  const startSelection = () => {
    appState.navigateToStep('selection')
  }

  return (
    <div className="min-h-screen bg-background">
      <StepRenderer
        currentStep={appState.currentStep}
        selectedCategories={appState.selectedCategories}
        availableValues={appState.availableValues}
        valueGroups={appState.valueGroups}
        currentGroupIndex={appState.currentGroupIndex}
        phase={appState.phase}
        topValues={appState.topValues}
        userProfile={appState.userProfile}
        selectedCoachingPackage={appState.selectedCoachingPackage}
        onNavigateToStep={appState.navigateToStep}
        onStartSelection={startSelection}
        onResetApp={appState.resetApp}
        setters={{
          setSelectedCategories: appState.setSelectedCategories,
          setAvailableValues: appState.setAvailableValues,
          setValueGroups: appState.setValueGroups,
          setCurrentGroupIndex: appState.setCurrentGroupIndex,
          setPhase: appState.setPhase,
          setTopValues: appState.setTopValues,
          setUserProfile: appState.setUserProfile,
          setSelectedCoachingPackage: appState.setSelectedCoachingPackage,
        }}
      />
    </div>
  )
}
