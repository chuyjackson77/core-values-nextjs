'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { CoreValue } from '@/types';

interface SelectionScreenProps {
  values: CoreValue[];
  round: number;
  totalRounds: number;
  onSelect: (valueId: string) => void;
  onBack: () => void;
  phase?: string;
}

export function SelectionScreen({ values, round, totalRounds, onSelect, onBack, phase = 'selection' }: SelectionScreenProps) {
  const progress = (round / totalRounds) * 100;

  const getPhaseDescription = () => {
    switch (phase) {
      case 'filtering':
        return {
          title: 'Quick Filtering',
          subtitle: 'Select the value that interests you most from each group',
          icon: '🔍'
        };
      case 'tournament':
        return {
          title: 'Tournament Finals',
          subtitle: 'Choose your strongest preference from each group',
          icon: '🏆'
        };
      default:
        return {
          title: 'Value Selection',
          subtitle: 'Which value is most like you?',
          icon: '✨'
        };
    }
  };

  const phaseInfo = getPhaseDescription();

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #ffffff 0%, var(--brand-cream) 100%)' }}>
      <Card className="w-full max-w-md p-8 space-y-6 border-0 shadow-xl">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-[var(--brand-cream)]">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">
              {phaseInfo.title} • Round {round} of {totalRounds}
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>
        
        <div className="text-center space-y-4">
          <div className="text-4xl">{phaseInfo.icon}</div>
          <h1 className="text-xl font-medium" style={{ color: 'var(--brand-navy)' }}>
            {phaseInfo.subtitle}
          </h1>
          
          {phase === 'filtering' && (
            <p className="text-xs text-muted-foreground">
              We're narrowing down your values to find the ones that resonate most with you.
            </p>
          )}
          
          {phase === 'tournament' && (
            <p className="text-xs text-muted-foreground">
              Now we're finding your absolute top preferences through head-to-head comparisons.
            </p>
          )}
        </div>
        
        <div className="space-y-3">
          {values.map((value) => (
<Button
  key={value.id}
  variant="outline"
  className="w-full h-auto p-4 text-left flex items-start space-x-3 hover:bg-[var(--brand-cream)] hover:border-[var(--brand-pink)] transition-all duration-200"
  onClick={() => onSelect(value.id)}
>
  <span className="text-2xl sm:text-2xl flex-shrink-0">{value.icon}</span>
  <div className="flex-1 space-y-1 min-w-0">
    <div className="font-medium text-sm sm:text-base" style={{ color: 'var(--brand-navy)' }}>{value.name}</div>
    <div className="text-xs sm:text-sm text-muted-foreground leading-tight">
      {value.description}
    </div>
    {phase === 'tournament' && (
      <div className="text-xs" style={{ color: 'var(--brand-orange)' }}>
        {value.category}
      </div>
    )}
  </div>
</Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
