import React from 'react';
import { HeroContent } from './HeroContent';
import { HeroImage } from './HeroImage';
import { HeroStats } from './HeroStats';

export const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-background pt-12 sm:pt-16 lg:pt-20 pb-16 lg:pb-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Mobile: Image First, Desktop: Content Left / Image Right */}
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Content Column */}
          <div className="w-full z-10">
            <HeroContent />
          </div>
          
          {/* Image Column */}
          <div className="w-full z-10">
            <HeroImage />
          </div>
          
        </div>
        
        {/* Bottom Stats */}
        <HeroStats />
        
      </div>
    </section>
  );
};
