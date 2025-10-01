'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface InstructionsScreenProps {
  onBegin: () => void;
  onBack: () => void;
}

export function InstructionsScreen({ onBegin, onBack }: InstructionsScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, var(--brand-cream) 0%, #ffffff 100%)' }}>
      <Card className="w-full max-w-md p-8 space-y-6 border-0 shadow-xl">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-[var(--brand-cream)]">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-medium" style={{ color: 'var(--brand-navy)' }}>How It Works</h1>
        </div>
        
        <div className="space-y-4">
          <div className="text-6xl text-center mb-4">🎯</div>
          
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium mb-2" style={{ color: 'var(--brand-navy)' }}>
                📋 Phase 1: Choose Your Focus Areas
              </h3>
              <p className="text-muted-foreground text-xs">
                Select 2-4 categories from our comprehensive list of 104 core values that matter most to you.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2" style={{ color: 'var(--brand-navy)' }}>
                🔍 Phase 2: Quick Filtering
              </h3>
              <p className="text-muted-foreground text-xs">
                From your selected categories, quickly identify the values that resonate with you most through rapid selection rounds.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2" style={{ color: 'var(--brand-navy)' }}>
                🏆 Phase 3: Tournament Finals
              </h3>
              <p className="text-muted-foreground text-xs">
                Your top values compete head-to-head in a tournament-style assessment to determine your final top 3.
              </p>
            </div>
            
            <div className="bg-[var(--brand-cream)]/30 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Total time:</strong> About 5-7 minutes<br/>
                <strong>Scientific approach:</strong> Based on proven assessment methodologies used by career coaches and psychologists.
              </p>
            </div>
          </div>
        </div>
        
        <Button onClick={onBegin} className="w-full bg-[var(--brand-pink)] hover:bg-[var(--brand-pink)]/90 text-white">
          Begin Assessment
        </Button>
      </Card>
    </div>
  );
}