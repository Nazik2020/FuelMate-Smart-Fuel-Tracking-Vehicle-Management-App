// Custom Hook for Location Management

import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import { Linking, Platform } from "react-native";
import {
  calculateDistance,
  DEFAULT_REGION,
  fetchNearbyFuelStations,
  requestLocationPermission,
  Station,
} from "./LocationService";

interface UseLocationResult {
  location: Location.LocationObject | null;
  loading: boolean;
  fuelStations: Station[];
  selectedStation: Station | null;
  isFetchingStations: boolean;
  permissionDenied: boolean;
  setSelectedStation: (station: Station | null) => void;
  refreshStations: () => Promise<void>;
  openSettings: () => void;
}

export const useLocation = (): UseLocationResult => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [fuelStations, setFuelStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isFetchingStations, setIsFetchingStations] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const lastFetchLocation = useRef<{ lat: number; lon: number } | null>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(
    null
  );
  const isMounted = useRef(true);
  const isFetchingRef = useRef(false);

  // Open device settings
  const openSettings = useCallback(() => {
    if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    } else {
      Linking.openSettings();
    }
  }, []);

  // Fetch nearby stations
  const fetchStations = async (lat: number, lon: number) => {
    // Prevent multiple simultaneous fetches
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setIsFetchingStations(true);

    try {
      const stations = await fetchNearbyFuelStations(lat, lon, 10000);

      if (isMounted.current) {
        setFuelStations(stations);
        lastFetchLocation.current = { lat, lon };

        // Select nearest station if none selected
        if (stations.length > 0 && !selectedStation) {
          setSelectedStation(stations[0]);
        }
      }
    } catch (error) {
      // Error fetching stations
      // Don't show alert, just log
    } finally {
      isFetchingRef.current = false;
      if (isMounted.current) {
        setIsFetchingStations(false);
      }
    }
  };

  // Refresh stations manually
  const refreshStations = useCallback(async () => {
    if (location) {
      await fetchStations(location.coords.latitude, location.coords.longitude);
    } else {
      // Use default location if no current location
      await fetchStations(DEFAULT_REGION.latitude, DEFAULT_REGION.longitude);
    }
  }, [location]);

  // Initialize location watching
  useEffect(() => {
    isMounted.current = true;

    const initLocation = async () => {
      // Skip location on web platform
      if (Platform.OS === "web") {
        setLoading(false);
        // Fetch stations for default location on web
        fetchStations(DEFAULT_REGION.latitude, DEFAULT_REGION.longitude);
        return;
      }

      try {
        const permissionResult = await requestLocationPermission();

        if (!permissionResult.granted) {
          setPermissionDenied(true);

          if (isMounted.current) {
            setLoading(false);
            // Still fetch stations for default location
            fetchStations(DEFAULT_REGION.latitude, DEFAULT_REGION.longitude);
          }
          return;
        }

        // Start watching position
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 50,
          },
          (newLocation) => {
            if (!isMounted.current) return;

            setLocation(newLocation);
            setLoading(false);

            const lat = newLocation.coords.latitude;
            const lon = newLocation.coords.longitude;

            // Fetch stations if first time or moved > 2km
            if (!lastFetchLocation.current) {
              fetchStations(lat, lon);
            } else {
              const dist = calculateDistance(
                lastFetchLocation.current.lat,
                lastFetchLocation.current.lon,
                lat,
                lon
              );
              if (dist > 2.0) {
                fetchStations(lat, lon);
              }
            }
          }
        );

        locationSubscription.current = subscription;
      } catch (error) {
        if (isMounted.current) {
          setLoading(false);
          // Fetch stations for default location on error
          fetchStations(DEFAULT_REGION.latitude, DEFAULT_REGION.longitude);
        }
      }
    };

    initLocation();

    // Cleanup
    return () => {
      isMounted.current = false;

      if (locationSubscription.current) {
        try {
          locationSubscription.current.remove();
        } catch (error) {
          // Cleanup error
        }
        locationSubscription.current = null;
      }
    };
  }, []);

  // Update selected station when fuelStations updates
  useEffect(() => {
    if (fuelStations.length > 0 && !selectedStation) {
      setSelectedStation(fuelStations[0]);
    }
  }, [fuelStations, selectedStation]);

  return {
    location,
    loading,
    fuelStations,
    selectedStation,
    isFetchingStations,
    permissionDenied,
    setSelectedStation,
    refreshStations,
    openSettings,
  };
};

export default useLocation;
