"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const HeroBadge = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="inline-flex items-center gap-2 rounded-none border border-gold-500/30 bg-gold-500/5 px-4 py-2 self-start"
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75"></span>
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold-500"></span>
      </span>
      <span className="text-xs font-bold tracking-[0.15em] text-gold-600 dark:text-gold-400 uppercase">
        Authentic Tamil Nadu Cloud Kitchen
      </span>
    </motion.div>
  );
};
