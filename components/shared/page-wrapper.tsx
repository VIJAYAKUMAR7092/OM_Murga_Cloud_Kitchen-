"use client"

import React from "react"

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in">
      {children}
    </div>
  )
}
