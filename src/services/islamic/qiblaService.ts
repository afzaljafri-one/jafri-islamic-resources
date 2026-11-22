// ==============================================================================
// Qibla Direction & Bearing Service
// Milestone M4: Islamic Services & Tools
// Calculates spherical great-circle Qibla bearing to the Holy Kaaba (Makkah)
// ==============================================================================

import { Coordinates, Qibla as AdhanQibla } from 'adhan';
import { QiblaResult } from './types';

// Coordinates of the Holy Kaaba in Makkah al-Mukarramah
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Calculates Great-Circle distance to Makkah in kilometers via Haversine formula
 */
function calculateDistanceToKaaba(lat: number, lng: number): number {
  const R = 6371; // Earth radius in km
  const dLat = toRadians(KAABA_LAT - lat);
  const dLng = toRadians(KAABA_LNG - lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat)) *
      Math.cos(toRadians(KAABA_LAT)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Maps numerical degrees (0-360) to 16-point compass ordinal
 */
export function getCompassOrdinal(degrees: number): string {
  const ordinals = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
  ];
  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalized / 22.5) % 16;
  return ordinals[index];
}

export function calculateQibla(latitude: number, longitude: number): QiblaResult {
  const coords = new Coordinates(latitude, longitude);
  const bearing = AdhanQibla(coords);
  const normalizedBearing = parseFloat(((bearing % 360 + 360) % 360).toFixed(1));
  const distance = calculateDistanceToKaaba(latitude, longitude);
  const ordinal = getCompassOrdinal(normalizedBearing);

  // Check if browser/device supports DeviceOrientation API
  const isCompassSupported =
    typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;

  return {
    bearingDegrees: normalizedBearing,
    distanceKm: distance,
    directionCompass: ordinal,
    isCompassSupported,
  };
}
