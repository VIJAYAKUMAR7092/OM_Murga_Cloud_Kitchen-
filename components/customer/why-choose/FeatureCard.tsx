"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FeatureIcon } from './FeatureIcon';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  feature: {
    title: string;
    description: string;
    icon: LucideIcon;
  };
  index: number;
}

export const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
      className="group flex flex-col items-center text-center p-8 sm:p-10 bg-card rounded-2xl border border-border overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-luxury relative"
    >
      <FeatureIcon icon={feature.icon} />
      
      <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-4">
        {feature.title}
      </h3>
      
      <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px]">
        {feature.description}
      </p>
      
      {/* Soft inner glow active on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none ring-1 ring-inset ring-primary/20 rounded-2xl transition-opacity duration-500"></div>
    </motion.div>
  );
};
