"use client";

import React from 'react';
import { ContactContent } from './ContactContent';
import { ContactVisual } from './ContactVisual';

export const ContactCTA = () => {
  return (
    <section className="relative w-full py-24 lg:py-32 bg-background overflow-hidden border-t border-border/30">
      
      {/* Premium Cinematic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--tw-gradient-stops))] from-emerald-900/10 via-background to-background pointer-events-none opacity-80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none opacity-60"></div>
      
      {/* Subtle Kolam/Architectural Texture Overlay (2% opacity) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-end opacity-[0.02] dark:opacity-[0.03] overflow-hidden">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-[800px] h-[800px] lg:w-[1200px] lg:h-[1200px] text-foreground translate-x-1/4">
           <path fill="currentColor" d="M100 0 C120 40 160 20 200 60 C160 80 180 120 140 160 C120 180 80 160 40 200 C20 160 -20 140 20 100 C-20 60 20 20 60 0 C80 40 100 0 100 0 Z" />
           <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="1" fill="none" />
           <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="2 4" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Layout: Mobile shows visual first, then content. Desktop side-by-side */}
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Content Column */}
          <div className="w-full">
            <ContactContent />
          </div>
          
          {/* Visual Column */}
          <div className="w-full">
            <ContactVisual />
          </div>

        </div>

      </div>
    </section>
  );
};
