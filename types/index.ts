export type CoreValue = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  // Scientific scoring fields
  wins?: number;          // Number of times this value was selected
  appearances?: number;   // Number of times this value was shown in comparisons
  winRate?: number;       // Calculated as wins / appearances (0.0 - 1.0)
  wilsonScore?: number;   // Wilson score with 95% confidence (for ranking)
  confidenceInterval?: {  // 95% confidence interval for win rate
    lower: number;
    upper: number;
  };
  // Legacy field - kept for backward compatibility
  score?: number;
};

export type UserProfile = {
  name: string;
  email: string;
};

export type AppStep = 'welcome' | 'instructions' | 'selection' | 'results' | 'coaching' | 'profile' | 'thankyou';

export type AssessmentPhase = 'filtering' | 'tournament' | 'complete';

export type ReliabilityMetrics = {
  totalComparisons: number;         // Total number of comparisons made
  averageComparisonsPerValue: number; // Average exposures per value
  balancedExposure: boolean;        // Whether all values had equal exposure
  confidenceLevel: number;          // Confidence level (e.g., 0.95 for 95%)
  methodology: string;              // "MaxDiff-Balanced" or similar
  timestamp: string;                // When assessment was completed
};

export type ValueWithConfidence = CoreValue & {
  confidenceInterval?: {
    lower: number;
    upper: number;
  };
};