import React from 'react';
import Link from 'next/link';
import { CONTACT_INFO } from '@/constants/navigation';
import { MessageCircle, Phone, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export const ContactActions = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex flex-col sm:flex-row flex-wrap items-center gap-4 sm:gap-5 mt-8"
    >
      {/* Primary CTA */}
      <Link 
        href="/menu" 
        className="btn btn-primary w-full sm:w-auto h-13 px-8 py-3.5 flex items-center justify-center gap-2.5 rounded-sm"
        aria-label="Order Now from Menu"
      >
        <ShoppingBag className="w-4 h-4" />
        Order Now
      </Link>
      
      {/* Secondary CTA */}
      <a 
        href={CONTACT_INFO.whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="btn btn-outline w-full sm:w-auto h-13 px-8 py-3.5 flex items-center justify-center gap-2.5 hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/50 transition-colors rounded-sm"
        aria-label="Chat with us on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
        WhatsApp Us
      </a>

      {/* Tertiary CTA (Call) */}
      <a 
        href={CONTACT_INFO.phoneUrl} 
        className="inline-flex items-center justify-center gap-2 h-13 px-4 py-3.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors w-full sm:w-auto"
        aria-label="Call us directly"
      >
        <Phone className="w-4 h-4" />
        Call Now
      </a>
    </motion.div>
  );
};
