"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FoodImage } from '@/components/shared/food-image/FoodImage';

export const ContactVisual = () => {
  return (
    <div className="relative w-full h-[350px] sm:h-[450px] lg:h-full min-h-[400px] flex items-center justify-center">
      {/* Background glow behind image */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-70 blur-3xl pointer-events-none"></div>
      
      <motion.div 
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full max-w-xs sm:max-w-sm aspect-square rounded-full border border-primary/30 p-2 bg-card/30 backdrop-blur-sm shadow-[0_0_40px_rgba(212,175,55,0.15)]"
      >
        <div className="w-full h-full rounded-full border-2 border-dashed border-primary/40 flex flex-col items-center justify-center bg-muted/20 overflow-hidden relative group">
          
          <FoodImage
            src="/images/food/lunch/non-veg-meals.webp"
            alt="Om Murga Cloud Kitchen"
            fill
            className="w-full h-full absolute inset-0 group-hover:scale-105 transition-transform duration-700 ease-out object-cover"
          />
          
          {/* Subtle overlay effect */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-primary/5 transition-colors duration-500 z-10 pointer-events-none"></div>
        </div>
      </motion.div>
    </div>
  );
};
