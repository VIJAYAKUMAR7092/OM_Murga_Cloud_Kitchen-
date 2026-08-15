"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const HeroActions = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
      className="flex flex-col sm:flex-row items-center gap-4 pt-6"
    >
      <Link href="/menu" className="btn btn-primary w-full sm:w-auto text-base h-12 px-8 min-w-[180px]">
        Order Now
      </Link>
      <Link href="/menu" className="btn btn-outline w-full sm:w-auto text-base h-12 px-8 min-w-[180px]">
        View Menu
      </Link>
    </motion.div>
  );
};
