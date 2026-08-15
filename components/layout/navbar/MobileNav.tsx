"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, PhoneCall, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS, CONTACT_INFO } from "@/constants/navigation";
import { NavLink } from "./NavLink";
import { Logo } from "./Logo";

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="lg:hidden flex items-center">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
        aria-label="Open Menu"
        aria-expanded={isOpen}
      >
        <Menu className="w-[26px] h-[26px]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={closeMenu}
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-50 h-[100dvh] w-[85%] max-w-sm bg-card border-l border-border shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-border/50">
                <Logo />
                <button
                  onClick={closeMenu}
                  className="p-2 text-foreground hover:text-primary transition-colors bg-muted rounded-full"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-2 p-6 overflow-y-auto flex-grow">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    onClick={closeMenu}
                    className="text-2xl font-serif block w-full py-4 border-b border-border/20 last:border-0"
                  />
                ))}
              </nav>

              <div className="p-6 border-t border-border/50 space-y-4 bg-muted/20">
                <a
                  href={CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline w-full justify-center flex gap-3 h-12 text-base"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Us
                </a>
                <a
                  href={CONTACT_INFO.phoneUrl}
                  className="btn btn-primary w-full justify-center flex gap-3 h-12 text-base"
                >
                  <PhoneCall className="w-5 h-5" />
                  Call Now
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
