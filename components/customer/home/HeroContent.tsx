"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { HeroBadge } from './HeroBadge';
import { HeroActions } from './HeroActions';
import { HeroDeliveryAreas } from './HeroDeliveryAreas';

export const HeroContent = () => {
  return (
    <div className="flex flex-col justify-center h-full max-w-2xl">
      <HeroBadge />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="mt-8 space-y-5"
      >
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-foreground">
          OM MURGA <br />
          <span className="text-primary italic">CLOUD KITCHEN</span>
        </h1>
        
        <p className="text-xl sm:text-2xl font-serif text-foreground/90 leading-relaxed max-w-xl">
          Traditional South Indian flavors, prepared fresh every day with love.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="mt-6 space-y-3"
      >
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
          Enjoy authentic homemade breakfast, lunch and dinner delivered fresh across Kalapatti, Sitra and Saravanampatti.
        </p>
        <p className="text-sm font-semibold text-foreground/80 tracking-widest uppercase">
          Working Hours: 6:30 AM – 9:00 PM
        </p>
      </motion.div>

      <HeroActions />
      <HeroDeliveryAreas />
    </div>
  );
};
