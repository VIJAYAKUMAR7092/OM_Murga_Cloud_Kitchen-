import React from 'react';
import { DELIVERY_AREAS_DATA } from '@/constants/delivery-areas';

export const FooterDelivery = () => {
  return (
    <div className="flex flex-col space-y-6">
      <h4 className="font-serif text-lg text-foreground font-bold">Delivery Areas</h4>
      
      <ul className="flex flex-col space-y-3.5">
        {DELIVERY_AREAS_DATA.areas.map((area) => (
          <li key={area.id} className="text-sm text-muted-foreground">
            {area.name}
          </li>
        ))}
      </ul>
      
      <div className="pt-3">
        <span className="inline-block px-3 py-1.5 rounded bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold tracking-widest uppercase">
          {DELIVERY_AREAS_DATA.deliveryHours}
        </span>
      </div>
    </div>
  );
};
