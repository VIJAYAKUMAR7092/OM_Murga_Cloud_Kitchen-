import React from "react";
import Link from "next/link";
import { NAV_LINKS, CONTACT_INFO } from "@/constants/navigation";
import { NavLink } from "./NavLink";
import { Search, ShoppingBag, PhoneCall, MessageCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";

export const DesktopNav = () => {
  const { totalItems } = useCart();

  return (
    <div className="hidden lg:flex items-center space-x-8">
      <nav className="flex items-center space-x-8">
        {NAV_LINKS.map((link) => (
          <div key={link.href} className="group">
            <NavLink href={link.href} label={link.label} />
          </div>
        ))}
      </nav>

      <div className="flex items-center space-x-5 border-l border-border/50 pl-8">
        <button aria-label="Search" className="text-foreground hover:text-primary transition-colors duration-200">
          <Search className="w-[22px] h-[22px]" />
        </button>
        
        <Link href="/cart" aria-label="Cart" className="relative text-foreground hover:text-primary transition-colors duration-200">
          <ShoppingBag className="w-[22px] h-[22px]" />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-glow">
              {totalItems}
            </span>
          )}
        </Link>

        
        <a 
          href={CONTACT_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer" 
          className="btn btn-outline flex items-center gap-2"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-[18px] h-[18px]" />
          <span>WhatsApp</span>
        </a>

        <a 
          href={CONTACT_INFO.phoneUrl}
          className="btn btn-primary flex items-center gap-2"
          aria-label="Call Now"
        >
          <PhoneCall className="w-[18px] h-[18px]" />
          <span>Call Now</span>
        </a>
      </div>
    </div>
  );
};
