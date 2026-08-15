// Coordinates for Om Muruga Cloud Kitchen (Approximate for Kalapatty Road, Veeriyampalayam)
export const KITCHEN_COORDINATES = {
  lat: 11.0583,
  lng: 77.0371,
};

// Configurable delivery radius in kilometers
export const MAX_DELIVERY_RADIUS_KM = 7;

/**
 * Calculates the Haversine distance between two coordinates in kilometers.
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Validates if the given coordinates are within the delivery area.
 */
export function isWithinDeliveryArea(lat: number, lng: number): boolean {
  const distance = calculateDistance(
    KITCHEN_COORDINATES.lat,
    KITCHEN_COORDINATES.lng,
    lat,
    lng
  );
  
  return distance <= MAX_DELIVERY_RADIUS_KM;
}
