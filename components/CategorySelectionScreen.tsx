'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface CategorySelectionScreenProps {
  categories: string[];
  onSelectCategories: (categories: string[]) => void;
  onBack: () => void;
}

export function CategorySelectionScreen({ categories, onSelectCategories, onBack }: CategorySelectionScreenProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleContinue = () => {
    if (selectedCategories.length >= 2) {
      onSelectCategories(selectedCategories);
    }
  };

  const categoryDescriptions: Record<string, string> = {
    'Personal Growth': 'Self-improvement, achievement, and individual development',
    'Relationships': 'Connection, community, and interpersonal bonds', 
    'Work & Career': 'Professional success, leadership, and work excellence',
    'Values & Ethics': 'Moral principles, integrity, and doing what\'s right',
    'Lifestyle': 'How you live, personal freedom, and life balance',
    'Wisdom & Character': 'Personal virtues, wisdom, and character traits'
  };

  const categoryIcons: Record<string, string> = {
    'Personal Growth': '🌱',
    'Relationships': '🤝',
    'Work & Career': '💼',
    'Values & Ethics': '⚖️',
    'Lifestyle': '🌟',
    'Wisdom & Character': '🦉'
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, var(--brand-cream) 0%, #ffffff 100%)' }}>
      <Card className="w-full max-w-md p-8 space-y-6 border-0 shadow-xl">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-[var(--brand-cream)]">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-medium" style={{ color: 'var(--brand-navy)' }}>Choose Your Focus Areas</h1>
        </div>
        
        <div className="text-center space-y-4">
          <div className="text-4xl">🎯</div>
          <p className="text-sm text-muted-foreground">
            Select 2-4 categories that matter most to you. This helps us focus on the values most relevant to your life.
          </p>
        </div>
        
        <div className="space-y-3">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              onClick={() => toggleCategory(category)}
              className={`w-full h-auto p-4 text-left flex items-start space-x-3 transition-all duration-200 ${
                selectedCategories.includes(category)
                  ? 'border-[var(--brand-pink)] bg-[var(--brand-pink)]/10 hover:bg-[var(--brand-pink)]/20'
                  : 'hover:bg-[var(--brand-cream)] hover:border-[var(--brand-orange)]'
              }`}
            >
              <span className="text-2xl">{categoryIcons[category] || '📋'}</span>
              <div className="flex-1 space-y-1">
                <div className="font-medium" style={{ color: 'var(--brand-navy)' }}>{category}</div>
                <div className="text-xs text-muted-foreground">
                  {categoryDescriptions[category] || 'Important life values and principles'}
                </div>
              </div>
              {selectedCategories.includes(category) && (
                <div className="text-[var(--brand-pink)]">✓</div>
              )}
            </Button>
          ))}
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={handleContinue}
            disabled={selectedCategories.length < 2}
            className={`w-full transition-all duration-200 ${
              selectedCategories.length >= 2
                ? 'bg-[var(--brand-pink)] hover:bg-[var(--brand-pink)]/90 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue with {selectedCategories.length} categories
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Select at least 2 categories to continue
          </p>
        </div>
      </Card>
    </div>
  );
}