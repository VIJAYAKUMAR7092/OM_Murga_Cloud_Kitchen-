"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FoodImage } from '@/components/shared/food-image/FoodImage';
import { ShoppingCart, Leaf, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';

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

interface MenuCardProps {
  item: Food;
  index: number;
}

export const MenuCard = ({ item, index }: MenuCardProps) => {
  const imgSrc = item.image || "/images/placeholder.webp";
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (!item.isAvailable) return;
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || "/images/placeholder.webp"
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col h-full bg-card/40 backdrop-blur-sm rounded-2xl border border-border/80 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-[0_10px_40px_-15px_rgba(212,175,55,0.3)] relative"
    >
      {/* Availability Badge */}
      {!item.isAvailable && (
        <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-destructive/90 text-destructive-foreground text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md shadow-sm">
          Out of Stock
        </div>
      )}

      {/* Veg/Non-Veg Indicator */}
      <div className="absolute top-4 left-4 z-20 w-6 h-6 bg-background/80 backdrop-blur-md rounded-md flex items-center justify-center border border-border/50 shadow-sm">
        <div className={`w-3 h-3 rounded-sm border ${item.isVegetarian ? 'border-green-600' : 'border-red-600'} flex items-center justify-center`}>
           <div className={`w-1.5 h-1.5 rounded-full ${item.isVegetarian ? 'bg-green-600' : 'bg-red-600'}`}></div>
        </div>
      </div>

      {/* Image */}
      <div className="relative w-full aspect-[4/3] bg-muted/20 overflow-hidden border-b border-border/50 group-hover:border-primary/40 transition-colors duration-500">
        <FoodImage 
          src={imgSrc} 
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`w-full h-full absolute inset-0 transition-transform duration-700 ease-out ${item.isAvailable ? 'group-hover:scale-105' : 'grayscale opacity-70'}`}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-primary/5 transition-colors duration-500 z-10 pointer-events-none"></div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow relative z-10">
        <div className="flex justify-between items-start mb-2 gap-4">
          <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {item.name}
          </h3>
          <span className="font-bold text-lg text-primary whitespace-nowrap">
            ₹{item.price}
          </span>
        </div>
        
        {item.reviews && item.reviews.length > 0 && (
          <div className="flex items-center gap-1 mb-2 text-primary text-sm font-medium">
            <span className="text-yellow-400">★</span>
            <span>{(item.reviews.reduce((a, b) => a + b.rating, 0) / item.reviews.length).toFixed(1)}</span>
            <span className="text-muted-foreground ml-1">({item.reviews.length})</span>
          </div>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6 flex-grow">
          {item.description}
        </p>

        <button 
          onClick={handleAddToCart}
          disabled={!item.isAvailable || added}
          className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300 ${
            added 
              ? 'bg-green-600/20 text-green-500 border border-green-600/30'
              : item.isAvailable 
                ? 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 hover:border-primary' 
                : 'bg-muted text-muted-foreground cursor-not-allowed border border-border'
          }`}
        >
          {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          {added ? "Added" : item.isAvailable ? "Add to Cart" : "Currently Unavailable"}
        </button>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none rounded-2xl ring-1 ring-inset ring-primary/20 transition-opacity duration-500"></div>
    </motion.div>
  );
};
