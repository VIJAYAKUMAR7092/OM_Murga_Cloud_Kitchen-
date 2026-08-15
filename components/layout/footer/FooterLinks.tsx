import React from 'react';
import Link from 'next/link';
import { NAV_LINKS } from '@/constants/navigation';

export const FooterLinks = () => {
  return (
    <div className="flex flex-col space-y-6">
      <h4 className="font-serif text-lg text-foreground font-bold">Quick Links</h4>
      
      <ul className="flex flex-col space-y-3.5">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link 
              href={link.href}
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
        {/* Track Order link added specifically for Footer navigation */}
        <li>
          <Link 
            href="/track-order"
            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            Track Order
          </Link>
        </li>
      </ul>
    </div>
  );
};
