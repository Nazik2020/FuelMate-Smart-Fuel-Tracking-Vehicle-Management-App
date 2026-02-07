// Ride Backend Service - API calls and data fetching for the Ride screen
// This file contains all API-related functions for fuel stations, routing, and geocoding

export interface Station {
  id: string;
  name: string;
  price: number;
  latitude: number;
  longitude: number;
  distance: number;
}

export interface RouteInfo {
  distance: string;
  duration: string;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

/**
 * Convert degrees to radians
 */
export const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/**
 * Calculate distance between two coordinates in km using Haversine formula
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return parseFloat(d.toFixed(1));
};

/**
 * Fetch nearby fuel stations using Overpass API (OpenStreetMap)
 * @param lat - Latitude of the center point
 * @param lon - Longitude of the center point
 * @param radiusMeters - Search radius in meters (default: 10000 = 10km)
 * @returns Array of fuel stations sorted by distance
 */
export const fetchNearbyFuelStations = async (
  lat: number,
  lon: number,
  radiusMeters: number = 10000
): Promise<Station[]> => {
  try {
    // Query for fuel stations within specified radius using Overpass API
    const query = `
      [out:json];
      node(around:${radiusMeters},${lat},${lon})["amenity"="fuel"];
      out;
    `;

    const response = await fetch(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
        query
      )}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.elements && data.elements.length > 0) {
      const stations: Station[] = data.elements.map((element: any) => ({
        id: element.id.toString(),
        name: element.tags?.name || "Fuel Station",
        // Mock price since API doesn't provide it (Sri Lankan fuel prices)
        price: Math.floor(Math.random() * (375 - 365 + 1) + 365),
        latitude: element.lat,
        longitude: element.lon,
        distance: calculateDistance(lat, lon, element.lat, element.lon),
      }));

      // Sort by distance
      stations.sort((a, b) => a.distance - b.distance);
      return stations;
    }

    return [];
  } catch (error) {
    throw new Error("Could not fetch nearby fuel stations");
  }
};

/**
 * Search for a location using Nominatim (OpenStreetMap) geocoding
 * @param query - Search query string
 * @param countryCode - Country code to limit search (default: 'lk' for Sri Lanka)
 * @returns Array of search results
 */
export const searchLocation = async (
  query: string,
  countryCode: string = "lk"
): Promise<SearchResult[]> => {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=5&countrycodes=${countryCode}`,
      {
        headers: {
          "User-Agent": "FuelMate App/1.0",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
};

/**
 * Fetch route from OSRM (Open Source Routing Machine)
 * @param startLat - Starting latitude
 * @param startLng - Starting longitude
 * @param endLat - Destination latitude
 * @param endLng - Destination longitude
 * @returns Route coordinates and info (distance, duration)
 */
export const fetchRoute = async (
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Promise<{ coordinates: Coordinate[]; routeInfo: RouteInfo } | null> => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const coordinates: Coordinate[] = route.geometry.coordinates.map(
        (coord: number[]) => ({
          latitude: coord[1],
          longitude: coord[0],
        })
      );

      // Calculate distance and duration
      const distanceKm = (route.distance / 1000).toFixed(1);
      const durationMin = Math.round(route.duration / 60);

      return {
        coordinates,
        routeInfo: {
          distance: `${distanceKm} km`,
          duration: `${durationMin} min`,
        },
      };
    }

    return null;
  } catch (error) {
    throw new Error("Could not fetch directions");
  }
};

/**
 * Reverse geocode coordinates to get address
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns Address string or null
 */
export const reverseGeocode = async (
  lat: number,
  lon: number
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      {
        headers: {
          "User-Agent": "FuelMate App/1.0",
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.display_name || null;
  } catch (error) {
    return null;
  }
};

export default {
  fetchNearbyFuelStations,
  searchLocation,
  fetchRoute,
  reverseGeocode,
  calculateDistance,
};
