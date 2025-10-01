// @ts-nocheck
import { UserProfile, CoreValue } from '@/types';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

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
    // Check if backend is configured
    if (!projectId || projectId === 'your-project-id' || !publicAnonKey || publicAnonKey === 'your-anon-key') {
      console.log('Backend not configured, using fallback email method');
      return { success: false, error: 'Backend configuration pending' };
    }

    // Test backend health first
    const healthUrl = `https://${projectId}.supabase.co/functions/v1/make-server-cbc66b9c/health`;
    console.log('Testing backend health at:', healthUrl);
    
    try {
      const healthResponse = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      console.log('Health check status:', healthResponse.status);
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log('Backend is healthy:', healthData);
      } else {
        console.warn('Backend health check failed:', healthResponse.status);
      }
    } catch (healthError) {
      console.error('Health check failed:', healthError);
    }

    const url = `https://${projectId}.supabase.co/functions/v1/make-server-cbc66b9c/submit-assessment`;
    console.log('Submitting assessment to:', url);
    console.log('Project ID:', projectId);
    console.log('Anon Key (first 20 chars):', publicAnonKey.substring(0, 20) + '...');
    console.log('📦 Selected Coaching Package being sent:', selectedCoachingPackage);
    console.log('📊 Full submission data:', {
      userProfile,
      topValues: topValues.map(v => v.name),
      selectedCategories,
      selectedCoachingPackage
    });

    const requestBody = {
      userProfile,
      topValues,
      selectedCategories,
      selectedCoachingPackage,
    };
    
    console.log('🔍 EXACT REQUEST BODY BEING SENT:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error details:', errorText);
      return { success: false, error: `Server error (${response.status}): ${errorText}` };
    }

    const result = await response.json();

    if (result.success) {
      console.log('Assessment submitted successfully:', result);
      return { success: true, submissionId: result.submissionId };
    } else {
      console.error('Assessment submission failed:', result);
      return { success: false, error: result.error || 'Submission failed' };
    }
  } catch (error) {
    console.error('Network error submitting assessment:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return { success: false, error: `Network error: ${error.message}. Please try again.` };
  }
};

export const generateEmailContent = (
  userProfile: UserProfile, 
  coreValues: CoreValue[], 
  categories: string[], 
  coachingPackage?: string
): string => {
  const timestamp = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `Subject: New Core Values Assessment Completion - ${userProfile.name || 'Anonymous User'}

Hi Cory,

A new user has completed the Core Values Discovery Assessment on ${timestamp}.

=== USER INFORMATION ===
Name: ${userProfile.name || 'Not provided'}
Email: ${userProfile.email || 'Not provided'}
Selected Coaching Package: ${coachingPackage || 'Not selected'}

=== ASSESSMENT RESULTS ===

Selected Focus Categories: ${categories.join(', ')}

TOP 3 CORE VALUES:
1. ${coreValues[0]?.name || 'N/A'} - ${coreValues[0]?.description || 'N/A'}
   Category: ${coreValues[0]?.category || 'N/A'}

2. ${coreValues[1]?.name || 'N/A'} - ${coreValues[1]?.description || 'N/A'}
   Category: ${coreValues[1]?.category || 'N/A'}

3. ${coreValues[2]?.name || 'N/A'} - ${coreValues[2]?.description || 'N/A'}
   Category: ${coreValues[2]?.category || 'N/A'}

=== COACHING INSIGHTS ===
This individual showed preference for values in: ${categories.join(', ')}
${coachingPackage ? `\nCOACHING PACKAGE INTEREST: Expressed specific interest in "${coachingPackage}"\n` : ''}
Their top values suggest they may benefit from coaching focused on:
${coreValues[0]?.category === 'Personal Growth' ? '• Personal development and goal achievement strategies' : ''}
${coreValues[0]?.category === 'Relationships' ? '• Interpersonal skills and team dynamics' : ''}
${coreValues[0]?.category === 'Work & Career' ? '• Career advancement and professional development' : ''}
${coreValues[0]?.category === 'Values & Ethics' ? '• Values-based decision making and integrity leadership' : ''}
${coreValues[0]?.category === 'Lifestyle' ? '• Work-life balance and personal fulfillment' : ''}
${coreValues[0]?.category === 'Wisdom & Character' ? '• Character development and wisdom-based leadership' : ''}

=== RECOMMENDED NEXT STEPS ===
1. Send personalized follow-up email highlighting how their values align with coaching services
2. ${coachingPackage ? `Follow up on their interest in "${coachingPackage}" - tailor your approach to this specific offering` : `Offer Discovery Call to explore specific challenges in their ${coreValues[0]?.category?.toLowerCase()} area`}
3. Share relevant resources that connect to their top value: ${coreValues[0]?.name}
${coachingPackage ? `4. Prepare "${coachingPackage}" discussion points based on their core values alignment` : ''}

Best regards,
You Do You Core Values Assessment System

---
This email was automatically generated from youdoyou.boo/core-values-assessment`;
};
