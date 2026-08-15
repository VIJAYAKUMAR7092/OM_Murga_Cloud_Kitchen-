"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { DELIVERY_AREAS_DATA } from '@/constants/delivery-areas';
import { DeliveryAreaCard } from './DeliveryAreaCard';
import { DeliveryAvailability } from './DeliveryAvailability';

export const DeliveryInfo = () => {
  return (
    <div className="flex flex-col justify-center w-full h-full lg:pl-4">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-10"
      >
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-[1.15]">
          {DELIVERY_AREAS_DATA.heading}
        </h2>
        <p className="text-muted-foreground text-lg sm:text-xl font-medium">
          {DELIVERY_AREAS_DATA.subtitle}
        </p>
      </motion.div>

      <div className="flex flex-col space-y-4">
        {DELIVERY_AREAS_DATA.areas.map((area, index) => (
          <DeliveryAreaCard key={area.id} area={area} index={index} />
        ))}
      </div>

      <DeliveryAvailability />

    </div>
  );
};
