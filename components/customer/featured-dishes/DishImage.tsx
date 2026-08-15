import React from 'react';
import { FoodImage } from '@/components/shared/food-image/FoodImage';

interface DishImageProps {
  name: string;
  category: string;
  imageUrl?: string;
  slug?: string;
}

export const DishImage = ({ name, category, imageUrl, slug }: DishImageProps) => {
  const originalImages: Record<string, string> = {
    "special-dosa-breakfast": "/images/food/specials/special-dosa.webp",
    "veg-meals-lunch": "/images/food/lunch/veg-meals.webp",
    "non-veg-meals-lunch": "/images/food/lunch/non-veg-meals.webp",
    "pepper-chicken-lunch": "/images/food/specials/pepper-chicken.webp",
    "pepper-chicken-dinner": "/images/food/specials/pepper-chicken.webp",
  };

  const imgSrc = (slug && originalImages[slug]) || imageUrl || "/images/placeholder.webp";
  return (
    <div className="relative w-full aspect-[4/3] bg-muted/20 overflow-hidden border-b border-border/50 group-hover:border-primary/40 transition-colors duration-500">
      
      <FoodImage 
        src={imgSrc}
        alt={`${name} - ${category}`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="w-full h-full absolute inset-0 group-hover:scale-105 transition-transform duration-700 ease-out object-cover"
      />
      
      {/* Subtle overlay effect on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-primary/5 transition-colors duration-500 z-10 pointer-events-none"></div>
    </div>
  );
};
