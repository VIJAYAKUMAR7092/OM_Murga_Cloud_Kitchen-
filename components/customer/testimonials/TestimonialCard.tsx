"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TestimonialAvatar } from './TestimonialAvatar';
import { TestimonialRating } from './TestimonialRating';
import { TestimonialQuote } from './TestimonialQuote';

interface TestimonialCardProps {
  review: {
    name: string;
    text: string;
    category: string;
    initials: string;
    isFeatured: boolean;
    rating: number;
  };
  index: number;
}

export const TestimonialCard = ({ review, index }: TestimonialCardProps) => {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className={`group relative flex flex-col p-6 sm:p-8 bg-card/40 backdrop-blur-sm border border-border/60 transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-luxury overflow-hidden ${
        review.isFeatured ? "md:col-span-2 lg:col-span-2 bg-card/60" : "col-span-1"
      }`}
    >
      <TestimonialQuote />
      
      <blockquote className="flex-grow mb-8 relative z-10 pt-2">
        <p className={`leading-relaxed ${review.isFeatured ? "text-lg sm:text-xl font-serif text-foreground/90" : "text-sm text-muted-foreground"}`}>
          "{review.text}"
        </p>
      </blockquote>
      
      <figcaption className="flex items-center gap-4 mt-auto pt-4 border-t border-border/50 relative z-10">
        <TestimonialAvatar initials={review.initials} />
        <div className="flex flex-col">
          <cite className="font-bold text-foreground text-sm not-italic">{review.name}</cite>
          <div className="flex items-center gap-2.5 mt-1">
            <span className="text-[9px] uppercase tracking-widest text-primary font-semibold">{review.category}</span>
            <span className="w-1 h-1 rounded-full bg-border"></span>
            <TestimonialRating rating={review.rating} />
          </div>
        </div>
      </figcaption>

      {/* Soft inner glow active on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none ring-1 ring-inset ring-primary/20 transition-opacity duration-500"></div>
    </motion.figure>
  );
};
