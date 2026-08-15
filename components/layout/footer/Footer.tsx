"use client";

import React from 'react';
import { FooterBrand } from './FooterBrand';
import { FooterLinks } from './FooterLinks';
import { FooterDelivery } from './FooterDelivery';
import { FooterContact } from './FooterContact';
import { FooterBottom } from './FooterBottom';
import { motion } from 'framer-motion';

export const Footer = ({ settings }: { settings?: any }) => {
  return (
    <footer className="relative w-full bg-background border-t-2 border-primary/20 pt-16 lg:pt-24 mt-auto overflow-hidden">
      
      {/* Very Subtle Decorative Pattern (Kolam / South Indian Motif Placeholder) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.015] dark:opacity-[0.02]">
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-[800px] h-[800px] lg:w-[1200px] lg:h-[1200px] text-foreground -translate-y-[10%]">
          <g stroke="currentColor" strokeWidth="1" fill="none">
            {/* Abstract traditional repeating mandala */}
            <circle cx="200" cy="200" r="180" strokeDasharray="4 8" />
            <circle cx="200" cy="200" r="160" />
            <path d="M 200 40 Q 240 100 200 160 Q 160 100 200 40 Z" />
            <path d="M 200 360 Q 240 300 200 240 Q 160 300 200 360 Z" />
            <path d="M 360 200 Q 300 160 240 200 Q 300 240 360 200 Z" />
            <path d="M 40 200 Q 100 160 160 200 Q 100 240 40 200 Z" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Responsive Grid: Mobile 1 col, Tablet 2 col, Desktop 4 col */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16 lg:pb-20"
        >
          {/* Brand appears first on mobile naturally by DOM order */}
          <FooterBrand settings={settings} />
          
          <FooterLinks />
          <FooterDelivery />
          <FooterContact settings={settings} />
        </motion.div>

        <FooterBottom />
      </div>
    </footer>
  );
};
