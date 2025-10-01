'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, Share2, MessageCircle } from 'lucide-react';
import { YouDoYouLogo } from '@/components/YouDoYouLogo';

interface ThankYouScreenProps {
  onRestart: () => void;
  onCoaching: () => void;
}

export function ThankYouScreen({ onRestart, onCoaching }: ThankYouScreenProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'You Do You - Core Values Discovery',
        text: 'I just discovered my core values! Try this assessment to find yours.',
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleEmailContact = () => {
    const mailtoLink = 'mailto:cory@youdoyou.boo?subject=Question about Core Values Coaching&body=Hi Cory,%0D%0A%0D%0AI completed the core values assessment and would like to learn more about your coaching services.%0D%0A%0D%0ABest regards,';
    window.open(mailtoLink, '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 brand-gradient">
      <Card className="w-full max-w-md p-8 space-y-6 border-0 shadow-2xl">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            {/* Your actual You Do You logo */}
            <YouDoYouLogo size="md" />
          </div>
          <div className="text-4xl">🎉</div>
          <h1 className="text-2xl font-medium" style={{ color: 'var(--brand-navy)' }}>Thank You!</h1>
          <p className="text-muted-foreground">
            Thank you for discovering your core values! Your journey toward career alignment starts now.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button onClick={onCoaching} className="w-full brand-gradient-accent text-white hover:opacity-90">
            <MessageCircle className="w-4 h-4 mr-2" />
            Explore Coaching Options
          </Button>
          
          <Button variant="outline" onClick={handleEmailContact} className="w-full border-[var(--brand-navy)] text-[var(--brand-navy)] hover:bg-[var(--brand-navy)] hover:text-white">
            <MessageCircle className="w-4 h-4 mr-2" />
            Email Cory Directly
          </Button>
          
          <Button variant="outline" onClick={handleShare} className="w-full border-[var(--brand-orange)] text-[var(--brand-orange)] hover:bg-[var(--brand-orange)] hover:text-white">
            <Share2 className="w-4 h-4 mr-2" />
            Share This Assessment
          </Button>
          
          <Button variant="outline" onClick={onRestart} className="w-full border-gray-300 text-gray-600 hover:bg-gray-100">
            <RefreshCw className="w-4 h-4 mr-2" />
            Take Assessment Again
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Ready to align your career with your values? Let's work together to create meaningful change.
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--brand-pink)' }}>
            <strong>You Do You.</strong> • <a href="mailto:cory@youdoyou.boo" className="underline hover:no-underline">cory@youdoyou.boo</a>
          </p>
        </div>
      </Card>
    </div>
  );
}