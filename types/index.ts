export type CoreValue = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  score?: number;
};

export type UserProfile = {
  name: string;
  email: string;
};

export type AppStep = 'welcome' | 'instructions' | 'selection' | 'results' | 'coaching' | 'profile' | 'thankyou';

export type AssessmentPhase = 'filtering' | 'tournament' | 'complete';