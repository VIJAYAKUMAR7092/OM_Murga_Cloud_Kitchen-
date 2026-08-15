"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { DishImage } from './DishImage';
import { DishContent } from './DishContent';
import { AvailabilityBadge } from './AvailabilityBadge';

interface Food {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  isVegetarian: boolean;
  isAvailable: boolean;
  image: string;
  reviews?: { rating: number }[];
}

interface DishCardProps {
  dish: Food;
  index: number;
}

export const DishCard = ({ dish, index }: DishCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
      className="group flex flex-col h-full bg-card/40 backdrop-blur-sm rounded-2xl border border-border/80 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-primary/50 hover:shadow-[0_10px_40px_-15px_rgba(212,175,55,0.3)] relative"
    >
      <AvailabilityBadge isAvailable={dish.isAvailable} />
      
      <DishImage name={dish.name} category={dish.category} imageUrl={dish.image} slug={dish.slug} />
      
      <DishContent 
        name={dish.name} 
        description={dish.description} 
        price={`₹${dish.price}`} 
        isAvailable={dish.isAvailable}
        reviews={dish.reviews} 
      />
      
      {/* Soft inner glow active on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none rounded-2xl ring-1 ring-inset ring-primary/20 transition-opacity duration-500"></div>
    </motion.div>
  );
};
