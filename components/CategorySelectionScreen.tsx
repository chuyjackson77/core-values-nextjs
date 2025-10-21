'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { CoreValue } from '@/types';

interface CategorySelectionScreenProps {
  categories: CoreValue[];
  round: number;
  totalRounds: number;
  onSelect: (categoryNames: string[]) => void;
  onBack: () => void;
}

const MAX_CATEGORIES = 3;

export function CategorySelectionScreen({
  categories,
  round,
  totalRounds,
  onSelect,
  onBack
}: CategorySelectionScreenProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const progress = (round / totalRounds) * 100;

  const handleToggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryName)) {
        // Deselect if already selected
        return prev.filter(c => c !== categoryName);
      } else {
        // Only allow up to MAX_CATEGORIES selections
        if (prev.length < MAX_CATEGORIES) {
          return [...prev, categoryName];
        }
        return prev; // Don't add if max reached
      }
    });
  };

  const handleContinue = () => {
    if (selectedCategories.length > 0) {
      onSelect(selectedCategories);
    }
  };

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
            Which categories resonate with you most?
          </h1>
          <p className="text-xs text-muted-foreground">
            Select 1-{MAX_CATEGORIES} categories that best represent your core values.
          </p>
          <div className="text-sm" style={{ color: 'var(--brand-pink)' }}>
            {selectedCategories.length} of {MAX_CATEGORIES} selected
          </div>
        </div>

        <div className="space-y-3">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.category);
            const isMaxReached = selectedCategories.length >= MAX_CATEGORIES && !isSelected;

            return (
              <button
                key={category.id}
                className={`w-full h-auto min-h-[80px] p-4 text-left flex items-start space-x-3 rounded-md border-2 transition-all duration-200 whitespace-normal ${
                  isSelected
                    ? 'border-[var(--brand-pink)] bg-[var(--brand-cream)]'
                    : 'border-gray-200 hover:bg-[var(--brand-cream)] hover:border-[var(--brand-pink)]'
                } ${
                  isMaxReached ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={() => handleToggleCategory(category.category)}
                disabled={isMaxReached}
              >
                <div className="flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // Handled by button onClick
                    className="w-5 h-5 rounded border-gray-300 text-[var(--brand-pink)] focus:ring-[var(--brand-pink)] cursor-pointer"
                    style={{ accentColor: 'var(--brand-pink)' }}
                  />
                </div>
                <span className="text-2xl flex-shrink-0 mt-0.5">{category.icon}</span>
                <div className="flex-1 space-y-1 min-w-0 overflow-hidden">
                  <div className="font-medium text-base leading-snug break-words" style={{ color: 'var(--brand-navy)' }}>
                    {category.category}
                  </div>
                  <div className="text-sm text-muted-foreground leading-snug break-words">
                    {category.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <Button
          onClick={handleContinue}
          disabled={selectedCategories.length === 0}
          className="w-full bg-[var(--brand-pink)] hover:bg-[var(--brand-pink)]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue with {selectedCategories.length} {selectedCategories.length === 1 ? 'Category' : 'Categories'}
        </Button>
      </Card>
    </div>
  );
}
