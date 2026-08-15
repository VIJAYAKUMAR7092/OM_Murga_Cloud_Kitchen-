"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { FoodImage } from '@/components/shared/food-image/FoodImage';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartClient = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (cart.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 px-4 min-h-[60vh]">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-primary" />
        </div>
        <h2 className="font-serif text-3xl font-bold mb-4 text-foreground">Your cart is empty</h2>
        <p className="text-muted-foreground text-center max-w-md mb-8">
          Looks like you haven't added any of our authentic South Indian delicacies to your cart yet.
        </p>
        <Link 
          href="/menu" 
          className="btn btn-primary px-8 py-3 flex items-center gap-2 font-bold"
        >
          Explore Our Menu <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <div className="mb-10 text-center md:text-left">
        <h1 className="font-serif text-4xl md:text-5xl text-primary font-bold mb-4 tracking-tight">
          Your Cart
        </h1>
        <p className="text-muted-foreground">
          You have {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart Items List */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => {
              const imgSrc = item.image || "/images/placeholder.webp";
              
              return (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-card/40 border border-border/80 backdrop-blur-sm shadow-sm"
                >
                  {/* Image */}
                  <div className="relative w-full sm:w-32 aspect-video sm:aspect-square rounded-xl overflow-hidden bg-muted/20 flex-shrink-0">
                    <FoodImage 
                      src={imgSrc} 
                      alt={item.name}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-col flex-grow justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-foreground">
                          {item.name}
                        </h3>
                        <p className="text-primary font-bold mt-1">₹{item.price}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-full hover:bg-destructive/10"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4 sm:mt-0">
                      <div className="flex items-center gap-3 bg-background border border-border rounded-lg px-2 py-1 shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1.5 text-foreground hover:text-primary transition-colors disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center font-bold text-sm">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1.5 text-foreground hover:text-primary transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Item Total */}
                      <span className="font-bold text-foreground">
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-card/60 border border-border/80 rounded-2xl p-6 sticky top-28 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)] backdrop-blur-md">
            <h3 className="font-serif text-2xl font-bold mb-6 text-foreground border-b border-border/50 pb-4">
              Order Summary
            </h3>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({totalItems} items)</span>
                <span className="text-foreground font-semibold">₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                <span className="text-green-500 font-semibold text-xs uppercase">Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Taxes</span>
                <span className="text-foreground font-semibold">₹{(subtotal * 0.05).toFixed(0)}</span>
              </div>
            </div>

            <div className="border-t border-border/50 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-lg text-foreground">Total</span>
                <div className="text-right">
                  <span className="font-bold text-2xl text-primary">
                    ₹{(subtotal + (subtotal * 0.05)).toFixed(0)}
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-1">Includes 5% GST</p>
                </div>
              </div>
            </div>

            <Link href="/checkout" className="btn btn-primary w-full py-4 text-center block font-bold text-base shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              Proceed to Checkout
            </Link>

            <Link href="/menu" className="block text-center mt-4 text-sm text-muted-foreground hover:text-primary transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
