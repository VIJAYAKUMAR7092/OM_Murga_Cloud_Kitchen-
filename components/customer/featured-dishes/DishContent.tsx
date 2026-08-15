import React from 'react';
import { PriceTag } from './PriceTag';
import Link from 'next/link';

interface DishContentProps {
  name: string;
  description: string;
  price: string;
  isAvailable: boolean;
  reviews?: { rating: number }[];
}

export const DishContent = ({ name, description, price, isAvailable, reviews = [] }: DishContentProps) => {
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : "New";

  return (
    <div className="flex flex-col flex-grow p-5 sm:p-6">
      
      <div className="mb-2">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground tracking-tight line-clamp-1">{name}</h3>
      </div>
      
      {reviews.length > 0 && (
        <div className="flex items-center gap-1 mb-2 text-primary text-sm font-medium">
          <span className="text-yellow-400">★</span>
          <span>{averageRating}</span>
          <span className="text-muted-foreground ml-1">({reviews.length})</span>
        </div>
      )}

      <div className="flex-grow mb-6">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
        <PriceTag price={price} />
        
        <Link 
          href="/menu"
          className={`inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 rounded-sm
            ${isAvailable 
              ? 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
              : 'bg-muted/50 text-muted-foreground border border-border cursor-not-allowed opacity-50'
            }`}
          onClick={(e) => !isAvailable && e.preventDefault()}
        >
          Order Now
        </Link>
      </div>
      
    </div>
  );
};
