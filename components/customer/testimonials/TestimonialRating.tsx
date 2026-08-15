import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialRatingProps {
  rating: number;
}

export const TestimonialRating = ({ rating }: TestimonialRatingProps) => {
  return (
    <div className="flex items-center gap-[2px]" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-3 h-3 ${i < rating ? "text-gold-500 fill-gold-500" : "text-muted/30"}`} 
        />
      ))}
    </div>
  );
};
