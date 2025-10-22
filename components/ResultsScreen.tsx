'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CoreValue } from '@/types';
import { Award, TrendingUp, Info } from 'lucide-react';

interface ResultsScreenProps {
  topValues: CoreValue[];
  onContinue: () => void;
}

export function ResultsScreen({ topValues, onContinue }: ResultsScreenProps) {
  const [showMethodology, setShowMethodology] = useState(false);

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

          {/* Backed by Science Badge */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setShowMethodology(!showMethodology)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--brand-pink) 0%, var(--brand-orange) 100%)',
                color: 'white'
              }}
            >
              <Award className="w-3.5 h-3.5" />
              Backed by Science
              <Info className="w-3 h-3 ml-0.5 opacity-75" />
            </button>
          </div>

          {/* Methodology Explanation (Expandable) */}
          {showMethodology && (
            <div className="text-left text-xs bg-gray-50 rounded-lg p-4 space-y-2 animate-in fade-in duration-200">
              <p className="font-medium" style={{ color: 'var(--brand-navy)' }}>
                MaxDiff Methodology
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Your results are based on <strong>MaxDiff (Maximum Difference Scaling)</strong>,
                a scientifically validated approach used in peer-reviewed research. This methodology
                provides superior reliability compared to traditional rating scales.
              </p>
              <div className="pt-2 space-y-1">
                <p className="text-muted-foreground">
                  <strong>Research References:</strong>
                </p>
                <ul className="text-muted-foreground space-y-0.5 ml-4 list-disc">
                  <li>MaxDiff methodology (Marketing Letters, 2024)</li>
                  <li>Bradley-Terry-Luce model (Statistical Science)</li>
                  <li>Schwartz Values Survey (Psychometrika, 2022)</li>
                </ul>
              </div>
              <a
                href="/SCORING_METHODOLOGY.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block pt-2 font-medium hover:underline"
                style={{ color: 'var(--brand-pink)' }}
              >
                Read Full Methodology →
              </a>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {topValues.map((value, index) => {
            const winRate = ((value.winRate || 0) * 100).toFixed(0);
            const ciLower = ((value.confidenceInterval?.lower || 0) * 100).toFixed(0);
            const ciUpper = ((value.confidenceInterval?.upper || 0) * 100).toFixed(0);
            const wins = value.wins || 0;
            const appearances = value.appearances || 0;

            return (
              <Card
                key={value.id}
                className="p-4 border-2 hover:border-[var(--brand-pink)] transition-all duration-200"
                style={{ borderColor: index === 0 ? 'var(--brand-pink)' : 'var(--border)' }}
              >
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
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{value.icon}</span>
                      <h3 className="font-medium" style={{ color: 'var(--brand-navy)' }}>{value.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>

                    {/* Statistical Metrics */}
                    <div className="pt-2 space-y-2 border-t border-gray-100">
                      {/* Preference Strength */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5" style={{ color: 'var(--brand-pink)' }} />
                          <span className="text-muted-foreground">Preference Strength:</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium" style={{ color: 'var(--brand-navy)' }}>
                            {winRate}%
                          </span>
                          <span className="text-muted-foreground">
                            ({wins}/{appearances})
                          </span>
                        </div>
                      </div>

                      {/* Visual Progress Bar */}
                      <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${winRate}%`,
                            background: index === 0
                              ? 'var(--brand-pink)'
                              : index === 1
                              ? 'var(--brand-orange)'
                              : 'var(--brand-navy)'
                          }}
                        />
                      </div>

                      {/* Confidence Interval */}
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">95% Confidence:</span>{' '}
                        {ciLower}% - {ciUpper}%
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Scientific Note */}
        <div className="text-center text-xs text-muted-foreground bg-gray-50 rounded-lg p-3">
          <p>
            <strong>What does this mean?</strong> Your preference strength shows how consistently
            you chose this value when presented with alternatives. The confidence interval indicates
            the reliability of this measurement (95% confidence level).
          </p>
        </div>

        <Button onClick={onContinue} className="w-full brand-gradient-accent text-white hover:opacity-90">
          Learn How These Values Relate to Your Career
        </Button>
      </Card>
    </div>
  );
}
