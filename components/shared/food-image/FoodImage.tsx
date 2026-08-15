"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Utensils } from 'lucide-react';

interface FoodImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  fill?: boolean;
  sizes?: string;
}

export const FoodImage = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
  fill = false,
  sizes
}: FoodImageProps) => {
  const [error, setError] = useState(false);

  // If no source is provided or image errors out, show the premium fallback
  if (!src || error) {
    return (
      <div className={`relative flex flex-col items-center justify-center bg-card/40 backdrop-blur-sm border-2 border-dashed border-primary/20 overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50"></div>
        <Utensils className="w-8 h-8 text-primary/50 mb-2 relative z-10" />
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold relative z-10 px-4 text-center">
          Image Coming Soon
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
          className="object-cover transition-opacity duration-500"
          onError={() => setError(true)}
          quality={90}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width || 500}
          height={height || 500}
          priority={priority}
          className="object-cover transition-opacity duration-500 w-full h-full"
          onError={() => setError(true)}
          quality={90}
        />
      )}
    </div>
  );
};
