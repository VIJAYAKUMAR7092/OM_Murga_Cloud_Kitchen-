"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FoodImage } from '@/components/shared/food-image/FoodImage';

export const HeroImage = () => {
  return (
    <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[700px] flex items-center justify-center">
      {/* Soft luxury background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-background to-background rounded-full opacity-60 blur-3xl"></div>
      
      {/* Main Image Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[480px] aspect-[4/5] bg-card border border-border flex items-center justify-center shadow-2xl overflow-hidden group"
      >
        <FoodImage 
          src="/images/food/lunch/veg-meals.webp"
          alt="Om Murga Special Meals"
          fill
          priority
          className="w-full h-full absolute inset-0 group-hover:scale-105 transition-transform duration-1000 ease-out object-cover"
        />

        {/* Decorative corner borders for luxury feel */}
        <div className="absolute top-4 left-4 w-10 h-10 border-t border-l border-primary/40 pointer-events-none z-20"></div>
        <div className="absolute top-4 right-4 w-10 h-10 border-t border-r border-primary/40 pointer-events-none z-20"></div>
        <div className="absolute bottom-4 left-4 w-10 h-10 border-b border-l border-primary/40 pointer-events-none z-20"></div>
        <div className="absolute bottom-4 right-4 w-10 h-10 border-b border-r border-primary/40 pointer-events-none z-20"></div>
      </motion.div>

      {/* Floating Card 1 */}
      <motion.div 
        animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -right-2 sm:-right-4 lg:-right-8 top-[15%] lg:top-[20%] z-20 bg-background/95 backdrop-blur-sm border border-primary/20 px-5 py-3 shadow-luxury"
      >
        <span className="block font-serif text-base sm:text-lg font-bold text-foreground">Sambar Idly</span>
        <span className="block text-[10px] sm:text-xs text-primary uppercase tracking-wider mt-1">Signature Dish</span>
      </motion.div>

      {/* Floating Card 2 */}
      <motion.div 
        animate={{ y: [0, 12, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -left-2 sm:-left-4 lg:-left-8 bottom-[15%] lg:bottom-[20%] z-20 bg-background/95 backdrop-blur-sm border border-primary/20 px-5 py-3 shadow-luxury"
      >
        <span className="block font-serif text-base sm:text-lg font-bold text-foreground">Ghee Roast</span>
        <span className="block text-[10px] sm:text-xs text-primary uppercase tracking-wider mt-1">Hot & Crispy</span>
      </motion.div>
    </div>
  );
};
