'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react';

interface CoachingScreenProps {
  onBookSession: (selectedPackage?: string) => void;
  onExploreResources: () => void;
  onBack: () => void;
}

export function CoachingScreen({ onBookSession, onExploreResources, onBack }: CoachingScreenProps) {
  const [selectedPackage, setSelectedPackage] = React.useState<string | null>(null);

  const packages = [
    {
      name: "Discovery Call",
      price: "Free",
      description: "30-minute consultation to explore your values and career goals",
      popular: false
    },
    {
      name: "Values Alignment Session",
      price: "$150",
      description: "90-minute deep dive into aligning your career with your core values",
      popular: true
    },
    {
      name: "Career Transformation Package",
      price: "$500",
      description: "3-session package for comprehensive career planning and strategy",
      popular: false
    }
  ];

  const handlePackageClick = (packageName: string) => {
    setSelectedPackage(packageName);
  };

  const handleBookSession = () => {
    onBookSession(selectedPackage || undefined);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, var(--brand-cream) 0%, #ffffff 100%)' }}>
      <Card className="w-full max-w-md p-8 space-y-6 border-0 shadow-xl">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-[var(--brand-cream)]">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-medium" style={{ color: 'var(--brand-navy)' }}>Ready to Dig Deeper?</h1>
        </div>
        
        <div className="text-center space-y-4">
          <div className="text-4xl">💼</div>
          <p className="text-sm text-muted-foreground">
            Connect with me for personalized coaching tailored to align your career with your core values.
          </p>
        </div>
        
        <div className="space-y-3">
          {packages.map((pkg, index) => (
            <Card 
              key={index} 
              className={`p-4 relative transition-all duration-200 hover:shadow-lg cursor-pointer ${
                selectedPackage === pkg.name 
                  ? 'border-[var(--brand-pink)] border-2 bg-[var(--brand-cream)]/30' 
                  : pkg.popular 
                    ? 'border-[var(--brand-pink)] border-2' 
                    : 'border hover:border-[var(--brand-orange)]'
              }`}
              onClick={() => handlePackageClick(pkg.name)}
            >
              {pkg.popular && (
                <Badge className="absolute -top-2 left-4 text-white" style={{ backgroundColor: 'var(--brand-pink)' }}>
                  Most Popular
                </Badge>
              )}
              {selectedPackage === pkg.name && (
                <Badge className="absolute -top-2 right-4 text-white" style={{ backgroundColor: 'var(--brand-orange)' }}>
                  Selected
                </Badge>
              )}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium" style={{ color: 'var(--brand-navy)' }}>{pkg.name}</h3>
                  <span className="font-medium" style={{ color: 'var(--brand-pink)' }}>{pkg.price}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {pkg.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="space-y-3">
          <Button onClick={handleBookSession} className="w-full bg-[var(--brand-pink)] hover:bg-[var(--brand-pink)]/90 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            {selectedPackage ? `Book ${selectedPackage}` : 'Book a Session'}
          </Button>
          <Button variant="outline" onClick={onExploreResources} className="w-full border-[var(--brand-orange)] text-[var(--brand-orange)] hover:bg-[var(--brand-orange)] hover:text-white">
            <ExternalLink className="w-4 h-4 mr-2" />
            Explore Digital Resources
          </Button>
        </div>
      </Card>
    </div>
  );
}