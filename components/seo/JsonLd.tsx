import Script from "next/script";

interface JsonLdProps {
  settings: any;
}

export function JsonLd({ settings }: JsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": settings?.restaurantName || "Om Muruga Cloud Kitchen",
    "image": "https://ommurugacloudkitchen.com/icons/icon-512x512.png",
    "@id": "https://ommurugacloudkitchen.com",
    "url": "https://ommurugacloudkitchen.com",
    "telephone": settings?.phone || "+910000000000",
    "menu": "https://ommurugacloudkitchen.com/menu",
    "servesCuisine": "South Indian",
    "acceptsReservations": "False",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings?.address || "Kalapatti",
      "addressLocality": "Coimbatore",
      "addressRegion": "Tamil Nadu",
      "postalCode": "641048",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": settings?.latitude || 11.0500,
      "longitude": settings?.longitude || 77.0200
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "11:00",
      "closes": "23:00"
    }
  };

  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
