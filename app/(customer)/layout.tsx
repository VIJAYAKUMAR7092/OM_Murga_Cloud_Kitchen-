import { Navbar } from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/footer/Footer";
import { CartProvider } from "@/context/CartContext";

import { getRestaurantSettings } from "@/server/queries/settings";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getRestaurantSettings();

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col transition-colors duration-300">
        <Navbar settings={settings} />
        
        <main className="flex-grow flex flex-col relative w-full pt-20">
          {children}
        </main>
        
        <Footer settings={settings} />
      </div>
    </CartProvider>
  );
}
