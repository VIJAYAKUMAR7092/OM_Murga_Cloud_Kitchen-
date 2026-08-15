"use client";

import React from 'react';
import { FOOD_EXPERIENCE_DATA } from '@/constants/food-experience';
import { SectionHeading } from './SectionHeading';
import { FoodCard } from './FoodCard';

export const FoodExperience = () => {
  return (
    <section className="relative w-full py-24 lg:py-32 bg-background overflow-hidden border-t border-border/30">
      
      {/* Tamil Kolam Watermark Background (3-4% opacity) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] dark:opacity-[0.04] overflow-hidden">
        {/* SVG representing a minimalist traditional mandala/kolam */}
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-[800px] h-[800px] sm:w-[1200px] sm:h-[1200px] text-foreground">
          <g stroke="currentColor" strokeWidth="1" fill="none">
            {/* Center */}
            <circle cx="200" cy="200" r="20" />
            <circle cx="200" cy="200" r="40" />
            
            {/* Petals layer 1 */}
            <path d="M 200 160 Q 240 100 200 40 Q 160 100 200 160 Z" />
            <path d="M 200 240 Q 240 300 200 360 Q 160 300 200 240 Z" />
            <path d="M 240 200 Q 300 160 360 200 Q 300 240 240 200 Z" />
            <path d="M 160 200 Q 100 160 40 200 Q 100 240 160 200 Z" />
            
            {/* Petals layer 2 (diagonals) */}
            <path d="M 228 172 Q 280 120 313 87 Q 280 140 228 172 Z" />
            <path d="M 172 228 Q 120 280 87 313 Q 120 260 172 228 Z" />
            <path d="M 228 228 Q 280 280 313 313 Q 260 280 228 228 Z" />
            <path d="M 172 172 Q 120 120 87 87 Q 140 120 172 172 Z" />

            {/* Outer rings */}
            <circle cx="200" cy="200" r="160" strokeDasharray="4 8" />
            <circle cx="200" cy="200" r="170" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <SectionHeading 
          title={FOOD_EXPERIENCE_DATA.heading} 
          subtitle={FOOD_EXPERIENCE_DATA.subtitle} 
        />

        {/* Grid layout: 1 col mobile, 2 cols tablet, 3 cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {FOOD_EXPERIENCE_DATA.meals.map((meal, index) => (
            <FoodCard key={meal.id} meal={meal} index={index} />
          ))}
        </div>
        
      </div>
    </section>
  );
};
