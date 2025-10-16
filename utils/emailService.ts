// @ts-nocheck
import { UserProfile, CoreValue } from '@/types';

interface SubmissionResult {
  success: boolean;
  error?: string;
  submissionId?: string;
}

export const submitAssessment = async (
  userProfile: UserProfile,
  topValues: CoreValue[],
  selectedCategories: string[],
  selectedCoachingPackage?: string
): Promise<SubmissionResult> => {
  try {
    const response = await fetch('/api/send-assessment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userProfile,
        topValues,
        selectedCategories,
        selectedCoachingPackage
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API error:', data);
      return { success: false, error: data.error || 'Email failed to send' };
    }

    console.log('Email sent successfully:', data);
    return { success: true, submissionId: data.submissionId };
    
  } catch (error) {
    console.error('Submission error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const generateEmailContent = (
  userProfile: UserProfile,
  topValues: CoreValue[],
  selectedCategories: string[],
  selectedCoachingPackage?: string
): string => {
  const valuesText = topValues
    .map((value, index) => `${index + 1}. ${value.name}: ${value.description}`)
    .join('\n');

  return `
NEW CORE VALUES ASSESSMENT SUBMISSION
=====================================

CONTACT INFORMATION:
-------------------
Name: ${userProfile.name || 'Not provided'}
Email: ${userProfile.email}

COACHING INTEREST:
-----------------
${selectedCoachingPackage ? `Interested in: ${selectedCoachingPackage}` : 'No coaching package selected'}

ASSESSMENT RESULTS:
------------------
Selected Categories: ${selectedCategories.join(', ')}

Top 3 Core Values:
${valuesText}

---
This email was automatically generated from youdoyou.boo/core-values-assessment
`;
};
