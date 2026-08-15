"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const areas = ["Kalapatti", "Sitra", "Saravanampatti"];

export const HeroDeliveryAreas = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="pt-8 mt-10 border-t border-border/60"
    >
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4 font-semibold">Delivery Areas</p>
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {areas.map((area, index) => (
          <div key={area} className="flex items-center gap-2 text-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{area}</span>
            {index < areas.length - 1 && (
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-primary/30 mx-2" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};
