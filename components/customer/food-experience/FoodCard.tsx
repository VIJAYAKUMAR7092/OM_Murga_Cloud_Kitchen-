"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FoodCardImage } from './FoodCardImage';
import { FoodCardContent } from './FoodCardContent';

interface FoodCardProps {
  meal: {
    id: string;
    title: string;
    timing: string;
    items: string[];
    link: string;
    buttonText: string;
  };
  index: number;
}

export const FoodCard = ({ meal, index }: FoodCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
      className="group flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-luxury relative"
    >
      <FoodCardImage title={meal.title} imageKey={meal.id} />
      
      <FoodCardContent 
        title={meal.title} 
        timing={meal.timing} 
        items={meal.items} 
        link={meal.link} 
        buttonText={meal.buttonText} 
      />
      
      {/* Soft inner glow active on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none rounded-2xl ring-1 ring-inset ring-primary/20 transition-opacity duration-500"></div>
    </motion.div>
  );
};
