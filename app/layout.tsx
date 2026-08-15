import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";

// Premium Typography setup
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

import { getRestaurantSettings } from "@/server/queries/settings";

import { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#D4AF37",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  let settings;
  try {
    settings = await getRestaurantSettings();
  } catch (error) {
    // Fallback if DB is not available during build
    settings = {
      restaurantName: "Om Muruga Cloud Kitchen",
      tagline: "Premium Food Delivery",
      description: "Experience the luxury of authentic taste delivered to your doorstep in Coimbatore.",
      favicon: "/favicon.ico"
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ommurugacloudkitchen.com";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      template: `%s | ${settings.restaurantName}`,
      default: `${settings.restaurantName} - ${settings.tagline}`,
    },
    description: settings.description,
    keywords: ["Cloud Kitchen", "Food Delivery", "Coimbatore", "South Indian", "Premium Food"],
    authors: [{ name: settings.restaurantName }],
    creator: settings.restaurantName,
    publisher: settings.restaurantName,
    manifest: "/manifest.webmanifest",
    icons: {
      icon: settings.favicon,
      apple: "/icons/icon-192x192.png",
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: siteUrl,
      title: settings.restaurantName,
      description: settings.description,
      siteName: settings.restaurantName,
      images: [{
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: settings.restaurantName,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.restaurantName,
      description: settings.description,
      images: ["/icons/icon-512x512.png"],
      creator: "@ommurugakitchen",
    },
    alternates: {
      canonical: siteUrl,
    }
  };
}

import { JsonLd } from "@/components/seo/JsonLd";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let settings;
  try {
    settings = await getRestaurantSettings();
  } catch (error) {
    settings = {};
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <JsonLd settings={settings} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
