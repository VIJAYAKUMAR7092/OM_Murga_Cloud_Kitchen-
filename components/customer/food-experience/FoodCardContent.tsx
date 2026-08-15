import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

interface FoodCardContentProps {
  title: string;
  timing: string;
  items: string[];
  link: string;
  buttonText: string;
}

export const FoodCardContent = ({ title, timing, items, link, buttonText }: FoodCardContentProps) => {
  return (
    <div className="flex flex-col flex-grow p-6 sm:p-8">
      
      <div className="flex justify-between items-start mb-6 gap-2">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{title}</h3>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] sm:text-xs font-bold tracking-widest shrink-0">
          <Clock className="w-3.5 h-3.5" />
          {timing}
        </div>
      </div>
      
      <div className="flex-grow mb-8">
        <ul className="grid grid-cols-2 gap-y-3 gap-x-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2.5 text-sm text-muted-foreground font-medium">
              <span className="w-1 h-1 rounded-full bg-primary/50 shrink-0 shadow-[0_0_4px_rgba(212,175,55,0.8)]"></span>
              <span className="truncate">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-auto pt-5 border-t border-border/50">
        <Link 
          href={link}
          className="inline-flex items-center gap-2 text-foreground font-semibold text-sm hover:text-primary transition-colors duration-300 group/btn"
        >
          {buttonText}
          <ArrowRight className="w-4 h-4 text-primary group-hover/btn:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
      
    </div>
  );
};
