// Location utilities and services for the Ride screen

import * as Location from "expo-location";

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

// Default region (Galle, Sri Lanka)
export const DEFAULT_REGION = {
  latitude: 6.0329,
  longitude: 80.2168,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

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
 * Request location permissions
 * Returns object with permission status and whether to use default location
 */
export const requestLocationPermission = async (): Promise<{
  granted: boolean;
  useDefault: boolean;
  canAskAgain: boolean;
}> => {
  try {
    // First check current permission status
    const { status: existingStatus } =
      await Location.getForegroundPermissionsAsync();

    if (existingStatus === "granted") {
      return { granted: true, useDefault: false, canAskAgain: true };
    }

    // Request permission if not already granted
    const { status, canAskAgain } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return {
        granted: false,
        useDefault: true,
        canAskAgain: canAskAgain ?? false,
      };
    }

    return { granted: true, useDefault: false, canAskAgain: true };
  } catch (error) {
    return { granted: false, useDefault: true, canAskAgain: false };
  }
};

/**
 * Get current location
 */
export const getCurrentLocation =
  async (): Promise<Location.LocationObject | null> => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      return location;
    } catch (error) {
      return null;
    }
  };

/**
 * Fetch nearby fuel stations using Overpass API (OpenStreetMap)
 */
export const fetchNearbyFuelStations = async (
  lat: number,
  lon: number,
  radiusMeters: number = 10000
): Promise<Station[]> => {
  try {
    // Query for fuel stations within specified radius
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
    const data = await response.json();

    if (data.elements && data.elements.length > 0) {
      const stations: Station[] = data.elements.map((element: any) => ({
        id: element.id.toString(),
        name: element.tags.name || "Fuel Station",
        // Mock price since API doesn't provide it
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
 */
export const searchLocation = async (query: string): Promise<any[]> => {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=5&countrycodes=lk`,
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
