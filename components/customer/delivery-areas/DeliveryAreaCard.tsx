"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface DeliveryAreaCardProps {
  area: {
    name: string;
    status: string;
    description: string;
  };
  index: number;
}

export const DeliveryAreaCard = ({ area, index }: DeliveryAreaCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="group flex flex-col p-5 bg-card/30 rounded-xl border border-border/60 transition-all duration-300 hover:border-primary/50 hover:bg-card hover:-translate-y-1 hover:shadow-luxury relative overflow-hidden"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-300">
            <MapPin className="w-4 h-4" />
          </div>
          <h4 className="font-serif text-lg sm:text-xl font-bold text-foreground">{area.name}</h4>
        </div>
        
        {/* Availability Badge */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
          {area.status}
        </span>
      </div>
      
      <p className="text-sm text-muted-foreground ml-13 sm:pl-[52px] group-hover:text-foreground/80 transition-colors">
        {area.description}
      </p>

      {/* Subtle Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none ring-1 ring-inset ring-primary/20 rounded-xl transition-opacity duration-500"></div>
    </motion.div>
  );
};
