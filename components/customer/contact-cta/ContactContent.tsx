import React from 'react';
import { motion } from 'framer-motion';
import { ContactActions } from './ContactActions';
import { ContactInfo } from './ContactInfo';

export const ContactContent = () => {
  return (
    <div className="flex flex-col justify-center w-full h-full lg:pr-8 relative z-10">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
          Ready to Taste <br className="hidden sm:block" />
          <span className="text-primary italic">the Difference?</span>
        </h2>
        <p className="text-muted-foreground text-lg sm:text-xl font-medium max-w-lg leading-relaxed">
          Authentic Tamil Nadu flavours, freshly prepared and delivered with care.
        </p>
      </motion.div>

      <ContactActions />
      <ContactInfo />

    </div>
  );
};
