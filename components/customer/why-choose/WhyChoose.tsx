"use client";

import React from 'react';
import { WHY_CHOOSE_DATA } from '@/constants/why-choose';
import { SectionHeading } from '../food-experience/SectionHeading';
import { FeatureCard } from './FeatureCard';

export const WhyChoose = () => {
  return (
    <section className="relative w-full py-24 lg:py-32 bg-background overflow-hidden border-t border-border/30">
      
      {/* Very subtle background light effect for luxury feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-60 pointer-events-none"></div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Reusing existing SectionHeading component to prevent duplicate code */}
        <SectionHeading 
          title={WHY_CHOOSE_DATA.heading} 
          subtitle={WHY_CHOOSE_DATA.subtitle} 
        />

        {/* Grid layout: 1 col mobile, 2 cols tablet, 3 cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {WHY_CHOOSE_DATA.features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
        
      </div>
    </section>
  );
};
