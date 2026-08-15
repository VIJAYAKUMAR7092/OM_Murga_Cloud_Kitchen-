import React from 'react';
import { CONTACT_INFO } from '@/constants/navigation';
import { DELIVERY_AREAS_DATA } from '@/constants/delivery-areas';
import { Phone, MessageCircle } from 'lucide-react';

export const FooterContact = ({ settings }: { settings?: any }) => {
  const whatsappUrl = settings?.whatsapp 
    ? `https://wa.me/91${settings.whatsapp}` 
    : CONTACT_INFO.whatsappUrl;
  const phoneUrl = settings?.phone 
    ? `tel:+91${settings.phone}` 
    : CONTACT_INFO.phoneUrl;
  const displayPhone = settings?.phone 
    ? settings.phone.replace(/(\d{5})(\d{5})/, '$1 $2')
    : CONTACT_INFO.phone.replace(/(\d{5})(\d{5})/, '$1 $2');
  
  const addressLines = settings?.address 
    ? settings.address.split(',').map((l: string) => l.trim()) 
    : DELIVERY_AREAS_DATA.address;

  return (
    <div className="flex flex-col space-y-6">
      <h4 className="font-serif text-lg text-foreground font-bold">Contact</h4>
      
      <div className="flex flex-col space-y-5">
        
        {/* Social / Contact Actions */}
        <div className="flex items-center gap-3">
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/50 transition-colors duration-300 shadow-sm"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <a 
            href={phoneUrl}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors duration-300 shadow-sm"
            aria-label="Call Now"
          >
            <Phone className="w-4 h-4" />
          </a>
          <span className="text-sm font-semibold text-foreground ml-2 tracking-wide">
            {displayPhone}
          </span>
        </div>

        {/* Address */}
        <div className="pt-2">
          <address className="not-italic text-sm text-muted-foreground leading-loose">
            {addressLines.map((line: string, idx: number) => (
              <React.Fragment key={idx}>
                {line}{idx < addressLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </address>
        </div>
        
      </div>
    </div>
  );
};
