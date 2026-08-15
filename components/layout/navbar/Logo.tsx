import Link from "next/link";
import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  settings?: any;
}

export const Logo = ({ className = "h-12 sm:h-16", settings }: LogoProps) => {
  const logoUrl = settings?.logo || "/images/brand/official-logo.jpg";
  const name = settings?.restaurantName || "OM MURGA CLOUD KITCHEN";

  return (
    <Link href="/" className="flex items-center group" aria-label="Home">
      <div className={`relative ${className} w-auto transition-transform duration-300 group-hover:scale-105`}>
        <Image 
          src={logoUrl} 
          alt={name}
          width={400}
          height={600}
          className="h-full w-auto object-contain rounded-md"
          priority
        />
      </div>
    </Link>
  );
};
