'use client'

import React from 'react';
import Image from 'next/image';

interface YouDoYouLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function YouDoYouLogo({ size = 'md', className = '' }: YouDoYouLogoProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg'
  };

  const [imageError, setImageError] = React.useState(false);

  if (imageError) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-white p-2 shadow-lg flex items-center justify-center relative overflow-hidden ${className}`}>
        <div className="w-full h-full rounded-full flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--brand-cream) 0%, white 100%)' }}>
          <div className="text-center">
            <div className={`${textSizes[size]} font-medium`} style={{ color: 'var(--brand-navy)', lineHeight: '1' }}>You</div>
            <div className={`${textSizes[size]} font-medium`} style={{ color: 'var(--brand-pink)', lineHeight: '1' }}>Do</div>
            <div className={`${textSizes[size]} font-medium`} style={{ color: 'var(--brand-orange)', lineHeight: '1' }}>You</div>
          </div>
          <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: 'var(--brand-pink)' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-white shadow-lg overflow-hidden ${className}`}>
      <Image 
        src="/YDY_logo.png"
        alt="You Do You Logo"
        width={96}
        height={96}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
}
