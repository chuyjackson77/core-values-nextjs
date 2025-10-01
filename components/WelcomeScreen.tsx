'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { YouDoYouLogo } from '@/components/YouDoYouLogo';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 brand-gradient">
      <Card className="w-full max-w-md p-8 text-center space-y-6 border-0 shadow-2xl">
        <div className="space-y-6">
          <div className="flex justify-center">
            {/* Your actual You Do You logo */}
            <YouDoYouLogo size="lg" />
          </div>
          <div>
            <h1 className="text-3xl font-medium mb-4" style={{ color: 'var(--brand-navy)' }}>
              Discover Your Core Values
            </h1>
            <p className="text-muted-foreground">
              Understand the values that drive your decisions and career fulfillment through our comprehensive assessment.
            </p>
          </div>
        </div>
        
        <Button onClick={onStart} className="w-full bg-[var(--brand-pink)] hover:bg-[var(--brand-pink)]/90 text-white">
          Start Your Journey
        </Button>
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Powered by <span style={{ color: 'var(--brand-pink)' }}>You Do You.</span>
          </p>
        </div>
      </Card>
    </div>
  );
}