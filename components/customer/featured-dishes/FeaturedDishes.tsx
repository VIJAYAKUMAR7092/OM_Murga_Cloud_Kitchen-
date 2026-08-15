"use client";

import React from 'react';
import { SectionHeading } from '../food-experience/SectionHeading';
import { DishCard } from './DishCard';

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
}

interface FeaturedDishesProps {
  featuredDishes: Food[];
}

export const FeaturedDishes = ({ featuredDishes }: FeaturedDishesProps) => {
  return (
    <section className="relative w-full py-24 lg:py-32 bg-background overflow-hidden border-t border-border/30">
      
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <SectionHeading 
          title="Today's Specials" 
          subtitle="Freshly prepared every day with authentic Tamil Nadu flavours." 
        />

        {/* Grid layout: 1 col mobile, 2 cols tablet, 3 cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {featuredDishes.map((dish, index) => (
            <DishCard key={dish.id} dish={dish} index={index} />
          ))}
        </div>
        
      </div>
    </section>
  );
};
