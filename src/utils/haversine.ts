/**
 * Haversine formula to compute geodesic distance between two coordinates in kilometers.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Format a distance in kilometers into a human-readable string.
 */
export function formatDistance(distanceKm?: number): string {
  if (distanceKm === undefined || distanceKm === null || isNaN(distanceKm)) {
    return '';
  }
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}

/**
 * Generate official Google Maps directions URL for a given destination coordinate or address.
 */
export function getGoogleMapsDirectionsUrl(
  lat: number,
  lng: number,
  destinationName?: string
): string {
  if (destinationName) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}+(${encodeURIComponent(destinationName)})`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
