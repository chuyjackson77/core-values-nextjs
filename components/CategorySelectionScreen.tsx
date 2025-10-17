'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { CoreValue } from '@/types';

interface CategorySelectionScreenProps {
  categories: CoreValue[];
  round: number;
  totalRounds: number;
  onSelect: (categoryId: string) => void;
  onBack: () => void;
}

export function CategorySelectionScreen({ 
  categories, 
  round, 
  totalRounds, 
  onSelect, 
  onBack 
}: CategorySelectionScreenProps) {
  const progress = (round / totalRounds) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #ffffff 0%, var(--brand-cream) 100%)' }}>
      <Card className="w-full max-w-md p-8 space-y-6 border-0 shadow-xl">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-[var(--brand-cream)]">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">
              Category Selection • Round {round} of {totalRounds}
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>
        
        <div className="text-center space-y-4">
          <div className="text-4xl">🎯</div>
          <h1 className="text-xl font-medium" style={{ color: 'var(--brand-navy)' }}>
            Which category resonates with you most?
          </h1>
          <p className="text-xs text-muted-foreground">
            Choose the category that best represents your core values.
          </p>
        </div>
        
        <div className="space-y-3">
          {categories.map((category) => (
<Button
  key={category.id}
  variant="outline"
  className="w-full h-auto min-h-[80px] p-4 text-left flex items-start space-x-3 hover:bg-[var(--brand-cream)] hover:border-[var(--brand-pink)] transition-all duration-200"
  onClick={() => onSelect(category.id)}
>
  <span className="text-2xl flex-shrink-0 mt-1">{category.icon}</span>
  <div className="flex-1 space-y-1 min-w-0">
    <div className="font-medium text-base leading-snug break-words" style={{ color: 'var(--brand-navy)' }}>
      {category.name}
    </div>
    <div className="text-sm text-muted-foreground leading-snug break-words">
      {category.description}
    </div>
  </div>
</Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
