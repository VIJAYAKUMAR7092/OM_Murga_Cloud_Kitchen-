import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureIconProps {
  icon: LucideIcon;
}

export const FeatureIcon = ({ icon: Icon }: FeatureIconProps) => {
  return (
    <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 shadow-sm">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Icon rendering */}
      <Icon className="w-10 h-10 text-primary relative z-10 transition-transform duration-500" strokeWidth={1.5} />
    </div>
  );
};
