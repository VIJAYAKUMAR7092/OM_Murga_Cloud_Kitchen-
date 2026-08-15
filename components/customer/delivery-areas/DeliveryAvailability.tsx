"use client";

import React from 'react';
import { DELIVERY_AREAS_DATA } from '@/constants/delivery-areas';
import { ArrowRight, Clock, MapPin, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export const DeliveryAvailability = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="flex flex-col space-y-8 mt-10 pt-8 border-t border-border/50"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        
        {/* Address */}
        <div>
          <h4 className="text-[11px] uppercase tracking-widest text-primary font-bold mb-3 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" /> Kitchen Address
          </h4>
          <address className="not-italic text-sm text-muted-foreground leading-loose">
            {DELIVERY_AREAS_DATA.address.map((line, idx) => (
              <React.Fragment key={idx}>
                {line}<br />
              </React.Fragment>
            ))}
          </address>
        </div>

        {/* Delivery Info */}
        <div className="space-y-6">
          <div>
            <h4 className="text-[11px] uppercase tracking-widest text-primary font-bold mb-2 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Delivery Hours
            </h4>
            <p className="text-sm font-medium text-foreground">{DELIVERY_AREAS_DATA.deliveryHours}</p>
          </div>
          <div>
            <h4 className="text-[11px] uppercase tracking-widest text-primary font-bold mb-2 flex items-center gap-2">
              <Truck className="w-3.5 h-3.5" /> Service Type
            </h4>
            <p className="text-sm font-medium text-foreground">{DELIVERY_AREAS_DATA.serviceType}</p>
          </div>
        </div>
      </div>

      {/* CTA Button placeholder for distance calculation */}
      <div className="pt-2">
        <button className="group relative flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-transparent border border-primary text-primary font-semibold text-sm tracking-wide transition-all overflow-hidden rounded-md">
          <span className="absolute inset-0 w-0 bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
          <span className="relative z-10 group-hover:text-primary-foreground transition-colors duration-300">
            {DELIVERY_AREAS_DATA.ctaText}
          </span>
          <ArrowRight className="w-4 h-4 relative z-10 group-hover:text-primary-foreground transition-colors duration-300 group-hover:translate-x-1" />
        </button>
      </div>
      
    </motion.div>
  );
};
