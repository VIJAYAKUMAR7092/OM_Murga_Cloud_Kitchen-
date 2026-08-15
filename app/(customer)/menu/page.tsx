import React from 'react';
import { MenuClient } from '@/components/customer/menu/MenuClient';
import { getCustomerFoods, getCustomerCategories } from '@/server/queries/customer-foods';

export const metadata = {
  title: "Our Menu | OM MURGA CLOUD KITCHEN",
  description: "Explore our premium selection of authentic South Indian dishes, prepared fresh with traditional spices.",
};

export default async function MenuPage() {
  const [foods, categories] = await Promise.all([
    getCustomerFoods(),
    getCustomerCategories()
  ]);

  return (
    <div className="min-h-screen pt-32 lg:pt-40 bg-background overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <MenuClient initialFoods={foods} initialCategories={categories} />
    </div>
  );
}
