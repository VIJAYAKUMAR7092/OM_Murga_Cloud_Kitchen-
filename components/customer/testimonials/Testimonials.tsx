"use client";

import React from 'react';
import { TESTIMONIALS_DATA } from '@/constants/testimonials';
import { SectionHeading } from '../food-experience/SectionHeading';
import { TestimonialCard } from './TestimonialCard';

export const Testimonials = () => {
  return (
    <section className="relative w-full py-24 lg:py-32 bg-background overflow-hidden border-t border-border/30">
      
      {/* Very subtle background light effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-60 pointer-events-none"></div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Reusing existing SectionHeading component */}
        <SectionHeading 
          title={TESTIMONIALS_DATA.heading} 
          subtitle={TESTIMONIALS_DATA.subtitle} 
        />

        {/* 
          Grid layout: 
          - Mobile: 1 col
          - Tablet: 2 cols
          - Desktop: 3 cols 
          Note: The first card spans 2 columns on Tablet and Desktop if isFeatured=true.
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-8">
          {TESTIMONIALS_DATA.reviews.map((review, index) => (
            <TestimonialCard key={review.id} review={review} index={index} />
          ))}
        </div>
        
      </div>
    </section>
  );
};
