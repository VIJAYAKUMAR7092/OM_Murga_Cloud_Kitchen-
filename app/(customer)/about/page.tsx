import React from 'react';
import { getRestaurantSettings } from '@/server/queries/settings';
import Image from 'next/image';

export const metadata = {
  title: "About Us | OM MURGA CLOUD KITCHEN",
  description: "Learn more about our authentic Tamil Nadu flavours and history.",
};

export default async function AboutPage() {
  const settings = await getRestaurantSettings();
  
  const aboutImage = settings?.aboutImage || "/images/brand/murugan-vel.jpg";
  const restaurantName = settings?.restaurantName || "OM MURGA CLOUD KITCHEN";

  return (
    <div className="min-h-[80vh] pt-32 pb-20 bg-background text-foreground relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div>
              <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">Our Story</h2>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">{restaurantName}</span>
              </h1>
            </div>
            
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                {settings?.description || "Authentic Tamil Nadu flavours, freshly prepared with care and delivered locally across Coimbatore. We are dedicated to providing the highest quality meals with a focus on hygiene, taste, and tradition."}
              </p>
              
              <p>
                Founded with a passion for traditional South Indian cuisine, our cloud kitchen ensures that every dish is crafted using premium ingredients, authentic recipes, and a whole lot of love.
              </p>
            </div>
            
          </div>
          
          <div className="relative animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <Image 
                src={aboutImage}
                alt="About us"
                fill
                className="object-cover"
                sizes="(max-w-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            {/* Decorative Frame */}
            <div className="absolute -inset-4 border-2 border-primary/20 rounded-3xl -z-10 hidden md:block translate-x-4 translate-y-4" />
          </div>

        </div>
      </div>
    </div>
  );
}
