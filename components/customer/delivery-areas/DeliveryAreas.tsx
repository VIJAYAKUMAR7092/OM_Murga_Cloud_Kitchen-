"use client";

import React from 'react';
import { DeliveryVisual } from './DeliveryVisual';
import { DeliveryInfo } from './DeliveryInfo';

export const DeliveryAreas = () => {
  return (
    <section className="relative w-full py-24 lg:py-32 bg-background overflow-hidden border-t border-border/30">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Responsive Grid: Mobile shows visual first, then content. Desktop side-by-side */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Visual Column */}
          <div className="w-full order-1 lg:order-1">
            <DeliveryVisual />
          </div>
          
          {/* Content Column */}
          <div className="w-full order-2 lg:order-2">
            <DeliveryInfo />
          </div>

        </div>

      </div>
    </section>
  );
};
