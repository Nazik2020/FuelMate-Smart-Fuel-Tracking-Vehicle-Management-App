// NAZIK - Map/Ride Screen - Find Fuel Stations
import DrawerMenu from "@/components/DrawerMenu";
import {
  MapView,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  WebMapFallback,
} from "@/components/Map";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Keyboard,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface Station {
  id: string;
  name: string;
  price: number;
  latitude: number;
  longitude: number;
  distance: number;
}

// Calculate distance between two coordinates in km
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
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

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

export default function RideScreen() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [fuelStations, setFuelStations] = useState<Station[]>([]);
  const [isFetchingStations, setIsFetchingStations] = useState(false);

  const lastFetchLocation = useRef<{ lat: number; lon: number } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchMarker, setSearchMarker] = useState<{
    latitude: number;
    longitude: number;
    name: string;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [showingDirections, setShowingDirections] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);
  // Allow markers to track changes always to fix rendering issues
  const [markersReady, setMarkersReady] = useState(false);
  const mapRef = useRef<any>(null);

  // Default location (Galle, Sri Lanka)
  const defaultRegion = {
    latitude: 6.0329,
    longitude: 80.2168,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  // Fetch nearby fuel stations using Overpass API
  const fetchNearbyStations = async (lat: number, lon: number) => {
    // Prevent multiple simultaneous fetches if already fetching
    if (isFetchingStations) return;

    setIsFetchingStations(true);
    try {
      // Query for fuel stations within 10km radius (increased from 5km)
      const query = `
        [out:json];
        node(around:10000,${lat},${lon})["amenity"="fuel"];
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
        setFuelStations(stations);

        // Update last fetch location
        lastFetchLocation.current = { lat, lon };

        // Select nearest station if none selected or if we just loaded
        if (!selectedStation) {
          setSelectedStation(stations[0]);
        }
      } else {
        console.log("No fuel stations found in this area via API");
        // Keep existing stations if any, or clear if we want transparency
        // setFuelStations([]);
      }
    } catch (error) {
      console.log("Error fetching stations:", error);
      Alert.alert("Error", "Could not fetch nearby fuel stations");
    } finally {
      setIsFetchingStations(false);
    }
  };

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLoading(false);
          Alert.alert("Permission to access location was denied");
          return;
        }

        // Start watching position
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // Update every 5 seconds
            distanceInterval: 50, // Update every 50 meters
          },
          (newLocation) => {
            setLocation(newLocation);
            setLoading(false);

            // Check if we need to refetch stations (if moved > 2km from last fetch)
            const lat = newLocation.coords.latitude;
            const lon = newLocation.coords.longitude;

            if (!lastFetchLocation.current) {
              fetchNearbyStations(lat, lon);
            } else {
              const dist = calculateDistance(
                lastFetchLocation.current.lat,
                lastFetchLocation.current.lon,
                lat,
                lon
              );
              if (dist > 2.0) {
                console.log("Moved 2km, refetching stations...");
                fetchNearbyStations(lat, lon);
              }
            }
          }
        );
      } catch (error) {
        console.log("Error getting location:", error);
        setLoading(false);
      }
    })();

    // Cleanup subscription
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // Update selected station when fuelStations updates (to ensure nearest is picked initially)
  useEffect(() => {
    if (fuelStations.length > 0 && !selectedStation) {
      setSelectedStation(fuelStations[0]);
    }
  }, [fuelStations]);

  // Stop marker blinking after icons have rendered
  useEffect(() => {
    const timer = setTimeout(() => {
      setMarkersReady(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [fuelStations]); // Reset if stations change significantly

  const centerOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const zoomIn = () => {
    mapRef.current?.getCamera().then((camera: any) => {
      if (camera.zoom !== undefined) {
        mapRef.current?.animateCamera({ zoom: camera.zoom + 1 });
      }
    });
  };

  const zoomOut = () => {
    mapRef.current?.getCamera().then((camera: any) => {
      if (camera.zoom !== undefined) {
        mapRef.current?.animateCamera({ zoom: camera.zoom - 1 });
      }
    });
  };

  // Search for a location using Nominatim (OpenStreetMap) geocoding
  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      // Using Nominatim API (free, requires User-Agent header)
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
      setSearchResults(data);
      setShowSearchResults(data.length > 0);

      if (data.length === 0) {
        // No results found - don't show error, just no dropdown
        console.log("No results found for:", query);
      }
    } catch (error) {
      console.log("Search error:", error);
      // Don't show alert for every error, just log it
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle selecting a search result
  const selectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    setSearchMarker({
      latitude: lat,
      longitude: lon,
      name: result.display_name.split(",")[0],
    });

    setShowSearchResults(false);
    setSearchQuery(result.display_name.split(",")[0]);
    Keyboard.dismiss();

    // Animate to the selected location
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        1000
      );
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3) {
        searchLocation(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Open Google Maps with directions to the station
  const openNavigationToStation = async (station: Station) => {
    const destination = `${station.latitude},${station.longitude}`;
    const label = encodeURIComponent(station.name);

    let url = "";

    if (Platform.OS === "android") {
      // Google Maps URL for Android with navigation mode
      url = `google.navigation:q=${destination}&mode=d`;
    } else {
      // Apple Maps URL for iOS, fallback to Google Maps
      url = `maps://app?daddr=${destination}&dirflg=d`;
    }

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        // Fallback to Google Maps web URL
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=${label}&travelmode=driving`;
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.log("Error opening navigation:", error);
      Alert.alert(
        "Navigation Error",
        "Could not open navigation app. Please make sure Google Maps is installed."
      );
    }
  };

  // Fetch route from OSRM (Open Source Routing Machine) - free, no API key needed
  const fetchRoute = async (station: Station) => {
    if (!location) {
      Alert.alert(
        "Location Required",
        "Please enable location to see directions."
      );
      return;
    }

    setIsSearching(true);
    try {
      const startLng = location.coords.longitude;
      const startLat = location.coords.latitude;
      const endLng = station.longitude;
      const endLat = station.latitude;

      // OSRM API for routing
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
      );

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map(
          (coord: number[]) => ({
            latitude: coord[1],
            longitude: coord[0],
          })
        );

        setRouteCoordinates(coordinates);
        setShowingDirections(true);
        setSelectedStation(station);

        // Calculate distance and duration
        const distanceKm = (route.distance / 1000).toFixed(1);
        const durationMin = Math.round(route.duration / 60);
        setRouteInfo({
          distance: `${distanceKm} km`,
          duration: `${durationMin} min`,
        });

        // Fit map to show the entire route
        if (mapRef.current && coordinates.length > 0) {
          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 100, right: 50, bottom: 350, left: 50 },
            animated: true,
          });
        }
      }
    } catch (error) {
      console.log("Route error:", error);
      Alert.alert(
        "Route Error",
        "Could not fetch directions. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
  };

  // Clear directions and go back to normal view
  const clearDirections = () => {
    setRouteCoordinates([]);
    setShowingDirections(false);
    setRouteInfo(null);
  };

  // Show direction from current location to selected station (zoom in map)
  const showDirectionToStation = (station: Station) => {
    setSelectedStation(station);

    if (!mapRef.current) return;

    // Zoom to show both user location and station
    const coordinates = [
      { latitude: station.latitude, longitude: station.longitude },
    ];

    if (location) {
      coordinates.push({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }

    mapRef.current.fitToCoordinates(coordinates, {
      edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
      animated: true,
    });
  };

  // Web fallback - show message instead of map
  if (Platform.OS === "web" || !MapView) {
    return <WebMapFallback />;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        initialRegion={
          location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            : defaultRegion
        }
        showsUserLocation
        showsMyLocationButton={false}
      >
        {/* Fuel Station Markers */}
        {fuelStations.map((station, index) => {
          const isNearest = index === 0;
          const isSelected = selectedStation?.id === station.id;

          return (
            <Marker
              key={station.id}
              coordinate={{
                latitude: station.latitude,
                longitude: station.longitude,
              }}
              onPress={() => setSelectedStation(station)}
              tracksViewChanges={!markersReady}
              style={{ zIndex: isNearest ? 10 : 1 }}
            >
              <View
                style={[
                  styles.customMarker,
                  isSelected && { transform: [{ scale: 1.2 }] },
                ]}
              >
                <View
                  style={[
                    styles.markerPin,
                    isNearest && styles.nearestMarkerPin,
                  ]}
                >
                  <Ionicons name="flame" size={18} color="#fff" />
                </View>
                <View
                  style={[
                    styles.markerTip,
                    isNearest && styles.nearestMarkerTip,
                  ]}
                />
              </View>
            </Marker>
          );
        })}

        {/* Search Result Marker */}
        {searchMarker && (
          <Marker
            coordinate={{
              latitude: searchMarker.latitude,
              longitude: searchMarker.longitude,
            }}
            title={searchMarker.name}
          >
            <View style={styles.searchMarkerContainer}>
              <Ionicons
                name="location"
                size={40}
                color={Colors.error || "#E53935"}
              />
            </View>
          </Marker>
        )}

        {/* Route Polyline */}
        {showingDirections && routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={Colors.secondary}
            strokeWidth={5}
            lineDashPattern={[0]}
          />
        )}
      </MapView>

      {/* Menu Button */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setDrawerVisible(true)}
      >
        <Ionicons name="menu-outline" size={24} color={Colors.text} />
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a location..."
            placeholderTextColor={Colors.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {isSearching && (
            <ActivityIndicator size="small" color={Colors.primary} />
          )}
          {searchQuery.length > 0 && !isSearching && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                setSearchResults([]);
                setShowSearchResults(false);
                setSearchMarker(null);
              }}
            >
              <Ionicons name="close-circle" size={20} color={Colors.gray} />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Results Dropdown */}
        {showSearchResults && (
          <View style={styles.searchResultsContainer}>
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.place_id.toString()}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.searchResultItem}
                  onPress={() => selectSearchResult(item)}
                >
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={Colors.primary}
                  />
                  <View style={styles.searchResultText}>
                    <Text style={styles.searchResultTitle} numberOfLines={1}>
                      {item.display_name.split(",")[0]}
                    </Text>
                    <Text style={styles.searchResultSubtitle} numberOfLines={1}>
                      {item.display_name.split(",").slice(1, 3).join(",")}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* Zoom Controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
          <Ionicons name="add" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.zoomDivider} />
        <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
          <Ionicons name="remove" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* My Location Button */}
      <TouchableOpacity style={styles.locationButton} onPress={centerOnUser}>
        <Ionicons name="locate" size={24} color={Colors.primary} />
      </TouchableOpacity>

      {/* Station Info Card */}
      {selectedStation && (
        <View style={styles.stationCard}>
          <TouchableOpacity
            style={styles.stationInfo}
            onPress={() => showDirectionToStation(selectedStation)}
            activeOpacity={0.8}
          >
            <Text style={styles.stationLabel}>
              {showingDirections ? "Directions to" : "Nearest Fuel Station"}
            </Text>
            <Text style={styles.stationName}>{selectedStation.name}</Text>
            <View style={styles.stationDetails}>
              <View style={styles.distanceContainer}>
                <Ionicons name="navigate" size={16} color={Colors.primary} />
                <Text style={styles.stationDistance}>
                  {routeInfo
                    ? routeInfo.distance
                    : `${selectedStation.distance} km`}
                </Text>
              </View>
              {routeInfo ? (
                <View style={styles.distanceContainer}>
                  <Ionicons name="time" size={16} color={Colors.secondary} />
                  <Text style={styles.stationDuration}>
                    {routeInfo.duration}
                  </Text>
                </View>
              ) : (
                <Text style={styles.stationPrice}>
                  Rs. {selectedStation.price.toFixed(0)}/L
                </Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            {showingDirections ? (
              /* Close Directions Button */
              <TouchableOpacity
                style={styles.closeButton}
                onPress={clearDirections}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={20} color={Colors.text} />
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            ) : (
              /* Show Directions Button */
              <TouchableOpacity
                style={styles.navigateButton}
                onPress={() => fetchRoute(selectedStation)}
                activeOpacity={0.8}
              >
                {isSearching ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <>
                    <Ionicons
                      name="navigate-circle"
                      size={20}
                      color={Colors.white}
                    />
                    <Text style={styles.navigateButtonText}>
                      Show Directions
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Drawer Menu */}
      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  loadingText: {
    marginTop: 10,
    color: Colors.textSecondary,
    fontSize: 16,
  },
  map: {
    width: width,
    height: height,
  },
  searchContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 70,
    right: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: Colors.text,
  },
  searchResultsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
    gap: 10,
  },
  searchResultText: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  searchResultSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  searchMarkerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  zoomControls: {
    position: "absolute",
    right: 16,
    top: height * 0.4,
    backgroundColor: Colors.white,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zoomButton: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  zoomDivider: {
    height: 1,
    backgroundColor: Colors.grayLight,
  },
  locationButton: {
    position: "absolute",
    right: 16,
    bottom: 220,
    backgroundColor: Colors.white,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stationCard: {
    position: "absolute",
    bottom: 80,
    left: 16,
    width: 240,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  stationInfo: {
    marginBottom: 12,
  },
  stationLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  stationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  stationDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stationDistance: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  stationDuration: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
  },
  stationPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  closeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.grayLight,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  closeButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  navigateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  navigateButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  markerWrapper: {
    width: 80,
    height: 90,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 5,
  },
  fuelIconContainer: {
    backgroundColor: Colors.secondary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  nearestFuelIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
  },
  selectedFuelIconContainer: {
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  nearestBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  nearestBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  webFallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: 32,
  },
  webFallbackTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  webFallbackText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  customMarker: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerPin: {
    backgroundColor: "#F5A623",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nearestMarkerPin: {
    backgroundColor: "#0D7377",
  },
  markerTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#F5A623",
    marginTop: -3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nearestMarkerTip: {
    borderTopColor: "#0D7377",
  },
});
