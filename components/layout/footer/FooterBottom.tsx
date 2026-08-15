import React from 'react';
import Link from 'next/link';

export const FooterBottom = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8 border-t border-border/50">
      <p className="text-xs text-muted-foreground text-center md:text-left">
        &copy; {currentYear} OM MURGA CLOUD KITCHEN. All rights reserved.
      </p>
      
      <div className="flex flex-wrap justify-center items-center gap-6">
        <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300">
          Privacy Policy
        </Link>
        <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300">
          Terms & Conditions
        </Link>
      </div>
    </div>
  );
};
