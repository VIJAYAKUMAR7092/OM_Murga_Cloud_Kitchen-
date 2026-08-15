"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
}

export const NavLink = ({ href, label, onClick, className }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative text-sm font-medium transition-colors duration-300 hover:text-primary py-1",
        isActive ? "text-primary" : "text-foreground",
        className
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
      <span
        className={cn(
          "absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 ease-out",
          isActive ? "w-full" : "w-0 group-hover:w-full"
        )}
      />
    </Link>
  );
};
