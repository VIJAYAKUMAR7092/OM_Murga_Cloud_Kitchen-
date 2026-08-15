"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuCard } from './MenuCard';
import { Search } from 'lucide-react';

interface Food {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  isVegetarian: boolean;
  isAvailable: boolean;
  image: string;
}

interface MenuClientProps {
  initialFoods: Food[];
  initialCategories: string[];
}

export const MenuClient = ({ initialFoods, initialCategories }: MenuClientProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = initialFoods.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const tabs = ["All", ...initialCategories];

  return (
    <div className="w-full pb-20">
      {/* Menu Header */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary font-bold mb-4 tracking-tight">
          Our Menu
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Explore our premium selection of authentic South Indian dishes, prepared fresh with traditional spices and devotion.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search dishes, ingredients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card/60 border border-border/80 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12 px-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveCategory(tab)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
              activeCategory === tab 
                ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                : 'bg-muted/30 text-foreground hover:bg-muted/50 hover:text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredData.map((item, index) => (
            <MenuCard key={item.id} item={item} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No items found matching your criteria.
        </div>
      )}
    </div>
  );
};
