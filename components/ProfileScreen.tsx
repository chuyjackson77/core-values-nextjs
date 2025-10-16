'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { UserProfile, CoreValue } from '@/types';
import { submitAssessment, generateEmailContent } from '@/utils/emailService';

interface ProfileScreenProps {
  profile: UserProfile;
  topValues: CoreValue[];
  selectedCategories: string[];
  selectedCoachingPackage?: string;
  onSubmit: (profile: UserProfile) => void;
  onBack: () => void;
}

export function ProfileScreen({ 
  profile, 
  topValues, 
  selectedCategories, 
  selectedCoachingPackage, 
  onSubmit, 
  onBack 
}: ProfileScreenProps) {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [submissionState, setSubmissionState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email is provided
    if (!formData.email.trim()) {
      setErrorMessage('Email is required to send your results to Cory.');
      return;
    }

    setSubmissionState('submitting');
    setErrorMessage('');

    try {
      const result = await submitAssessment(formData, topValues, selectedCategories, selectedCoachingPackage);
      
      if (result.success) {
        setSubmissionState('success');
        
        // Wait a moment to show success, then continue
        setTimeout(() => {
          onSubmit(formData);
        }, 1500);
        
} else {
  // Show the actual error instead of falling back
  setSubmissionState('error');
  setErrorMessage(result.error || 'Failed to send email. Please try again or contact cory@youdoyou.boo directly.');
  console.error('Email service error:', result.error);
}        
        
        // Mark as success and continue
        setSubmissionState('success');
        setTimeout(() => {
          onSubmit(formData);
        }, 1000);
      }
    } catch (error) {
      setSubmissionState('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
      console.error('Submission error:', error);
    }
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errorMessage) setErrorMessage('');
  };

  const isSubmitting = submissionState === 'submitting';
  const isSuccess = submissionState === 'success';
  const isError = submissionState === 'error';

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #ffffff 0%, var(--brand-cream) 100%)' }}>
      <Card className="w-full max-w-md p-8 space-y-6 border-0 shadow-xl">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack} 
            className="hover:bg-[var(--brand-cream)]"
            disabled={isSubmitting || isSuccess}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-medium" style={{ color: 'var(--brand-navy)' }}>Contact Information</h1>
        </div>
        
        <div className="text-center space-y-4">
          <div className="text-4xl">
            {isSuccess ? '✅' : isError ? '❌' : '📋'}
          </div>
          <p className="text-sm text-muted-foreground">
            {isSuccess 
              ? 'Your results have been sent to Cory! You\'ll hear back within 24-48 hours.'
              : isError 
              ? 'There was an issue submitting your assessment. Please try again.'
              : 'Connect with Cory for personalized coaching based on your core values'
            }
          </p>
        </div>
        
        {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" style={{ color: 'var(--brand-navy)' }}>Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="border-gray-300 focus:border-[var(--brand-pink)] focus:ring-[var(--brand-pink)]"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: 'var(--brand-navy)' }}>Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="border-gray-300 focus:border-[var(--brand-pink)] focus:ring-[var(--brand-pink)]"
                required
                disabled={isSubmitting}
              />
            </div>

            {errorMessage && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-sm text-red-700">{errorMessage}</span>
              </div>
            )}
            
            <div className="bg-[var(--brand-cream)]/30 p-3 rounded-lg text-xs">
              <p className="text-muted-foreground">
                <strong>What happens next:</strong><br/>
                • Your assessment results will be sent to Cory at <strong>cory@youdoyou.boo</strong><br/>
                {selectedCoachingPackage && (
                  <>• Your interest in <strong>{selectedCoachingPackage}</strong> will be included<br/></>
                )}
                • You'll receive a personalized follow-up within 24-48 hours<br/>
                • Your core values analysis will guide the coaching conversation
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[var(--brand-pink)] hover:bg-[var(--brand-pink)]/90 text-white disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending Results to Cory...
                </>
              ) : (
                'Send Results to Cory & Finish'
              )}
            </Button>
          </form>
        )}

        {isSuccess && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-700 font-medium">Assessment sent successfully!</span>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Redirecting to final screen...
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
