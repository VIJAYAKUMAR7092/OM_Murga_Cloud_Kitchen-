import React from 'react';
import { getRestaurantSettings } from '@/server/queries/settings';
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import { ContactForm } from '@/components/customer/contact/ContactForm';
import Image from 'next/image';

export const metadata = {
  title: "Contact Us | OM MURGA CLOUD KITCHEN",
  description: "Get in touch with us for orders and support.",
};

export default async function ContactPage() {
  const settings = await getRestaurantSettings();
  
  const whatsappUrl = settings?.whatsapp 
    ? `https://wa.me/91${settings.whatsapp}` 
    : `https://wa.me/919876543210`;
    
  const phoneUrl = settings?.phone 
    ? `tel:+91${settings.phone}` 
    : `tel:+919876543210`;
    
  const addressLines = settings?.address 
    ? settings.address.split(',').map((l: string) => l.trim()) 
    : ["123 Main Street", "Coimbatore", "Tamil Nadu"];

  const contactImage = settings?.contactImage || "/images/brand/murugan-vel.jpg";

  return (
    <div className="min-h-[80vh] pt-32 pb-20 bg-background text-foreground relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">Get In Touch</h2>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-white mb-6">
            Contact Us
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We'd love to hear from you. Reach out to us for orders, catering enquiries, or any other assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column: Contact Info & Image */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            {/* Image */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <Image 
                src={contactImage}
                alt="Contact us"
                fill
                className="object-cover"
                sizes="(max-w-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href={phoneUrl} className="flex items-start gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">Phone</h3>
                  <p className="text-muted-foreground text-sm">{settings?.phone || "+91 98765 43210"}</p>
                </div>
              </a>

              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">WhatsApp</h3>
                  <p className="text-muted-foreground text-sm">{settings?.whatsapp || "+91 98765 43210"}</p>
                </div>
              </a>

              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="flex items-start gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group sm:col-span-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm mb-1">Email Address</h3>
                    <p className="text-muted-foreground text-sm">{settings.email}</p>
                  </div>
                </a>
              )}
            </div>

            {/* Address */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Kitchen Location</h3>
                </div>
              </div>
              
              <address className="not-italic text-muted-foreground text-sm leading-relaxed flex-1">
                {addressLines.map((line: string, idx: number) => (
                  <React.Fragment key={idx}>
                    {line}<br />
                  </React.Fragment>
                ))}
              </address>

              {settings?.googleMapsUrl && (
                <a 
                  href={settings.googleMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-6 w-full py-2.5 px-4 bg-primary/10 text-primary border border-primary/20 text-center font-bold rounded-xl hover:bg-primary hover:text-black transition-colors text-sm"
                >
                  Get Directions
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="p-8 bg-[#111] border border-white/10 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-8">
              <h3 className="text-2xl font-serif font-bold text-white mb-2">Send us a Message</h3>
              <p className="text-muted-foreground">Fill out the form below and our team will get back to you shortly.</p>
            </div>
            
            <ContactForm />
          </div>

        </div>
        
      </div>
    </div>
  );
}
