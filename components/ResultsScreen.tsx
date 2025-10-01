'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CoreValue } from '@/types';

interface ResultsScreenProps {
  topValues: CoreValue[];
  onContinue: () => void;
}

export function ResultsScreen({ topValues, onContinue }: ResultsScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 brand-gradient">
      <Card className="w-full max-w-md p-8 space-y-6 border-0 shadow-2xl">
        <div className="text-center space-y-4">
          <div className="text-4xl">🏆</div>
          <h1 className="text-2xl font-medium" style={{ color: 'var(--brand-navy)' }}>
            Your Top 3 Core Values
          </h1>
          <p className="text-muted-foreground text-sm">
            These values represent what matters most to you
          </p>
        </div>
        
        <div className="space-y-4">
          {topValues.map((value, index) => (
            <Card key={value.id} className="p-4 border-2 hover:border-[var(--brand-pink)] transition-all duration-200" style={{ borderColor: index === 0 ? 'var(--brand-pink)' : 'var(--border)' }}>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                    style={{ 
                      background: index === 0 ? 'var(--brand-pink)' : index === 1 ? 'var(--brand-orange)' : 'var(--brand-navy)' 
                    }}
                  >
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{value.icon}</span>
                    <h3 className="font-medium" style={{ color: 'var(--brand-navy)' }}>{value.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <Button onClick={onContinue} className="w-full brand-gradient-accent text-white hover:opacity-90">
          Learn How These Values Relate to Your Career
        </Button>
      </Card>
    </div>
  );
}
