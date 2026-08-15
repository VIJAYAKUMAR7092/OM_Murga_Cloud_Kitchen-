"use client";

import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: "100%", label: "Freshly Prepared", sub: "Homestyle Taste" },
  { value: "Daily Menu", label: "Morning • Lunch • Dinner", sub: "6:30 AM – 9:00 PM" },
  { value: "Fast", label: "Delivery", sub: "Serving Nearby Areas" },
];

export const HeroStats = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 pt-12 mt-4 sm:mt-12 border-t border-border/50"
    >
      {stats.map((stat, i) => (
        <div key={i} className="flex flex-col space-y-1">
          <span className="font-serif text-3xl sm:text-4xl text-primary">{stat.value}</span>
          <span className="font-semibold text-foreground tracking-widest uppercase text-xs sm:text-sm mt-2">{stat.label}</span>
          <span className="text-muted-foreground text-xs font-medium">{stat.sub}</span>
        </div>
      ))}
    </motion.div>
  );
};
