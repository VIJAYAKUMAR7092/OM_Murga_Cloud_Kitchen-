"use client";

import React from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export const DeliveryVisual = () => {
  return (
    <div className="relative w-full h-[400px] md:h-full min-h-[400px] lg:min-h-[600px] bg-card/40 rounded-3xl border border-border/80 overflow-hidden group">
      
      {/* Subtle Map Background Pattern (Premium Tamil Architectural / Geometric Motif Feel) */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="map-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary"/>
              <circle cx="60" cy="60" r="2" fill="currentColor" className="text-primary" />
              <circle cx="0" cy="0" r="2" fill="currentColor" className="text-primary" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#map-grid)" />
        </svg>
      </div>

      {/* Luxury Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-transparent to-background/50 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none"></div>

      {/* Animated Map Nodes Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-[80%] h-[80%] max-w-sm max-h-sm">
          
          {/* Connected Routes */}
          <svg className="absolute inset-0 w-full h-full opacity-40 text-primary" viewBox="0 0 300 300">
            <motion.path 
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              d="M150,150 L220,70" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
            <motion.path 
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
              d="M150,150 L60,200" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
            <motion.path 
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1, ease: "easeOut" }}
              d="M150,150 L240,240" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
          </svg>

          {/* Kitchen Node (Center) */}
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
          >
            <div className="w-14 h-14 bg-background rounded-full flex items-center justify-center border-2 border-primary shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              <MapPin className="w-6 h-6 text-primary fill-primary/20" />
            </div>
            <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary bg-background/80 px-2.5 py-1 rounded border border-primary/20 backdrop-blur-sm">Our Kitchen</span>
          </motion.div>

          {/* Delivery Nodes */}
          
          {/* Kalapatti */}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute top-[20%] right-[10%] flex items-center gap-2 z-10"
          >
            <div className="w-4 h-4 rounded-full bg-background border border-emerald-500/50 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.5)]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 relative">
                <span className="absolute inset-0 rounded-full animate-ping bg-emerald-400 opacity-75"></span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-foreground tracking-wide bg-background/70 px-1.5 py-0.5 rounded shadow-sm">Kalapatti</span>
          </motion.div>

          {/* Sitra */}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="absolute bottom-[30%] left-[5%] flex items-center gap-2 z-10"
          >
            <span className="text-[11px] font-semibold text-foreground tracking-wide bg-background/70 px-1.5 py-0.5 rounded shadow-sm">Sitra</span>
            <div className="w-4 h-4 rounded-full bg-background border border-emerald-500/50 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.5)]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 relative">
                <span className="absolute inset-0 rounded-full animate-ping bg-emerald-400 opacity-75"></span>
              </div>
            </div>
          </motion.div>

          {/* Saravanampatty */}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="absolute bottom-[10%] right-[10%] flex items-center gap-2 z-10"
          >
            <div className="w-4 h-4 rounded-full bg-background border border-emerald-500/50 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.5)]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 relative">
                <span className="absolute inset-0 rounded-full animate-ping bg-emerald-400 opacity-75"></span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-foreground tracking-wide bg-background/70 px-1.5 py-0.5 rounded shadow-sm">Saravanampatty</span>
          </motion.div>

        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="px-6 py-5 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/80 text-center shadow-lg">
          <span className="block font-serif text-xl sm:text-2xl text-primary font-bold">Local Delivery Zone</span>
          <span className="block text-xs text-muted-foreground uppercase tracking-[0.2em] mt-2 font-medium">Coimbatore, Tamil Nadu</span>
        </div>
      </div>
    </div>
  );
};
