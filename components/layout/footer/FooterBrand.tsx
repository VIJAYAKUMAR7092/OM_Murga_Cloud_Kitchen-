import React from 'react';
import { Logo } from '../navbar/Logo';

export const FooterBrand = ({ settings }: { settings?: any }) => {
  const description = settings?.description || "Authentic Tamil Nadu flavours, freshly prepared with care and delivered locally across Coimbatore.";

  return (
    <div className="flex flex-col space-y-6">
      <Logo className="h-20 sm:h-24" settings={settings} />
      
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  );
};
