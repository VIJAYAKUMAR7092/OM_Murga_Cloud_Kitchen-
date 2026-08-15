import React from 'react';
import { Quote } from 'lucide-react';

export const TestimonialQuote = () => {
  return (
    <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
      <Quote className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
    </div>
  );
};
