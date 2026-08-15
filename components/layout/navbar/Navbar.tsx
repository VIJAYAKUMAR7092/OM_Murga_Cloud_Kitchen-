"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Logo } from "./Logo";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export const Navbar = ({ settings }: { settings?: any }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      // Change state when scrolled down more than 20px
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initialize state on mount
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 w-full transition-all duration-500",
        isScrolled
          ? "bg-black/85 backdrop-blur-md shadow-card py-4 border-b border-gold-500/40"
          : "bg-transparent py-6"
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Logo settings={settings} />
          
          <DesktopNav />
          
          {/* Mobile Right Section */}
          <div className="flex items-center gap-5 lg:hidden">
            <Link href="/cart" aria-label="Cart" className="relative text-foreground hover:text-primary transition-colors duration-200">
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-glow">
                  {totalItems}
                </span>
              )}
            </Link>
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
};
