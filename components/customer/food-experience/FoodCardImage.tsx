import React from 'react';
import { FoodImage } from '@/components/shared/food-image/FoodImage';

interface FoodCardImageProps {
  title: string;
  imageKey?: string;
}

export const FoodCardImage = ({ title, imageKey }: FoodCardImageProps) => {
  const imageMap: Record<string, string> = {
    Breakfast: "/images/food/breakfast/sambar-idly.webp",
    Lunch: "/images/food/lunch/veg-meals.webp",
    Dinner: "/images/food/breakfast/ghee-roast.webp"
  };

  const imgSrc = imageMap[title] || "/images/placeholder.webp";
  
  return (
    <div className="relative w-full aspect-[16/10] bg-muted/30 overflow-hidden border-b border-border/50 group-hover:border-primary/40 transition-colors duration-500">
      
      <FoodImage 
        src={imgSrc} 
        alt={`Premium ${title}`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="w-full h-full absolute inset-0 group-hover:scale-105 transition-transform duration-700 ease-out object-cover"
      />
      
      {/* Subtle overlay effect on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-primary/5 transition-colors duration-500 z-10 pointer-events-none"></div>
    </div>
  );
};
