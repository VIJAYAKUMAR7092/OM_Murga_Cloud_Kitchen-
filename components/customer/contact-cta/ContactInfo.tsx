import React from 'react';
import { CONTACT_INFO } from '@/constants/navigation';
import { DELIVERY_AREAS_DATA } from '@/constants/delivery-areas';
import { motion } from 'framer-motion';

export const ContactInfo = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12 pt-10 border-t border-border/50"
    >
      {/* Left side: Business info */}
      <div className="space-y-6">
        <div>
          <h4 className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1.5">Open Daily</h4>
          <p className="text-sm font-medium text-foreground">{CONTACT_INFO.workingHours}</p>
        </div>
        
        <div>
          <h4 className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1.5">Delivery Areas</h4>
          <p className="text-sm font-medium text-foreground leading-relaxed max-w-[200px]">{DELIVERY_AREAS_DATA.serviceAreasSummary}</p>
        </div>
        
        <div>
          <h4 className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1.5">Contact</h4>
          <p className="text-sm font-medium text-foreground">{CONTACT_INFO.phone.replace(/(\d{5})(\d{5})/, '$1 $2')}</p>
        </div>
      </div>
      
      {/* Right side: Address */}
      <div>
        <h4 className="text-[10px] uppercase tracking-widest text-primary font-bold mb-2.5">Address</h4>
        <address className="not-italic text-sm text-muted-foreground leading-loose">
          {DELIVERY_AREAS_DATA.address.map((line, idx) => (
            <React.Fragment key={idx}>
              {line}<br />
            </React.Fragment>
          ))}
        </address>
      </div>
    </motion.div>
  );
};
