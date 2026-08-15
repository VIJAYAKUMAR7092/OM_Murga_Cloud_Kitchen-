import React from 'react';

interface PriceTagProps {
  price: string;
}

export const PriceTag = ({ price }: PriceTagProps) => {
  return (
    <div className="flex items-end">
      <span className="font-serif text-2xl font-bold text-foreground tracking-tight">{price}</span>
    </div>
  );
};
