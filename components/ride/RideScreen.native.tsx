// Native Ride Screen (Android/iOS) - uses react-native-maps

import DrawerMenu from "@/components/DrawerMenu";
import {
  MapView as MapViewComponent,
  Polyline as PolylineComponent,
  PROVIDER_GOOGLE,
} from "@/components/Map";
import { Colors } from "@/constants/theme";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, Platform, StyleSheet, View } from "react-native";

// Type assertions for platform-specific components
const MapView = MapViewComponent as unknown as React.ComponentType<any>;
const Polyline = PolylineComponent as unknown as React.ComponentType<any>;

// Import modular components from ride folder
import { LoadingView } from "@/components/ride/LoadingView";
import {
  Coordinate,
  DEFAULT_REGION,
  fetchRoute,
  RouteInfo,
  searchLocation,
} from "@/components/ride/LocationService";
import {
  MenuButton,
  MyLocationButton,
  RefreshStationsButton,
  ZoomControls,
} from "@/components/ride/MapControls";
import { SearchBar } from "@/components/ride/SearchBar";
import { StationCard } from "@/components/ride/StationCard";
// Use native marker implementation on mobile
import {
  SearchMarker,
  StationMarker,
} from "@/components/ride/StationMarker.native";
import { useLocation } from "@/components/ride/useLocation";

const { width, height } = Dimensions.get("window");

export default function RideScreen() {
  // Drawer state
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Location and stations from custom hook
  const {
    location,
    loading,
    fuelStations,
    selectedStation,
    isFetchingStations,
    setSelectedStation,
    refreshStations,
  } = useLocation();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMarker, setSearchMarker] = useState<{
    latitude: number;
    longitude: number;
    name: string;
  } | null>(null);

  // Route state
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [showingDirections, setShowingDirections] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  // Marker optimization
  const [markersReady, setMarkersReady] = useState(false);

  // Map reference
  const mapRef = useRef<any>(null);

  // Stop marker blinking after icons have rendered
  useEffect(() => {
    const timer = setTimeout(() => {
      setMarkersReady(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [fuelStations]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search for location
  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const results = await searchLocation(query);
      setSearchResults(results);
      setShowSearchResults(results.length > 0);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle selecting a search result
  const handleSelectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    setSearchMarker({
      latitude: lat,
      longitude: lon,
      name: result.display_name.split(",")[0],
    });

    setShowSearchResults(false);
    setSearchQuery(result.display_name.split(",")[0]);

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

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
    setSearchMarker(null);
  };

  // Center map on user location
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

  // Zoom controls
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

  // Fetch and show route to station
  const handleShowDirections = async () => {
    if (!selectedStation) {
      return;
    }

    // Use current location or default region
    const startLat = location?.coords?.latitude ?? DEFAULT_REGION.latitude;
    const startLon = location?.coords?.longitude ?? DEFAULT_REGION.longitude;

    setIsSearching(true);
    try {
      const result = await fetchRoute(
        startLat,
        startLon,
        selectedStation.latitude,
        selectedStation.longitude
      );

      if (result) {
        setRouteCoordinates(result.coordinates);
        setShowingDirections(true);
        setRouteInfo(result.routeInfo);

        // Fit map to show the entire route
        if (mapRef.current && result.coordinates.length > 0) {
          mapRef.current.fitToCoordinates(result.coordinates, {
            edgePadding: { top: 100, right: 50, bottom: 350, left: 50 },
            animated: true,
          });
        }
      }
    } catch (error) {
      Alert.alert(
        "Route Error",
        "Could not fetch directions. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
  };

  // Clear directions
  const clearDirections = () => {
    setRouteCoordinates([]);
    setShowingDirections(false);
    setRouteInfo(null);
  };

  // Show direction from current location to selected station
  const showDirectionToStation = () => {
    if (!mapRef.current || !selectedStation) return;

    const coordinates = [
      {
        latitude: selectedStation.latitude,
        longitude: selectedStation.longitude,
      },
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

  // Loading state
  if (loading) {
    return <LoadingView message="Loading map..." />;
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
            : DEFAULT_REGION
        }
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={false}
        userLocationPriority="high"
        showsCompass={true}
        loadingEnabled={true}
      >
        {/* Fuel Station Markers */}
        {fuelStations.map((station, index) => (
          <StationMarker
            key={station.id}
            station={station}
            isNearest={index === 0}
            isSelected={selectedStation?.id === station.id}
            markersReady={markersReady}
            onPress={setSelectedStation}
          />
        ))}

        {/* Search Result Marker */}
        {searchMarker && (
          <SearchMarker
            latitude={searchMarker.latitude}
            longitude={searchMarker.longitude}
            name={searchMarker.name}
          />
        )}

        {/* Route Polyline */}
        {showingDirections && routeCoordinates.length > 0 && Polyline && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={Colors.secondary}
            strokeWidth={5}
            lineDashPattern={[0]}
          />
        )}
      </MapView>

      {/* Menu Button */}
      <MenuButton onPress={() => setDrawerVisible(true)} />

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchResults={searchResults}
        showSearchResults={showSearchResults}
        isSearching={isSearching}
        onSelectResult={handleSelectSearchResult}
        onClear={handleClearSearch}
      />

      {/* Zoom Controls */}
      <ZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} />

      {/* Refresh Stations Button */}
      <RefreshStationsButton
        onPress={refreshStations}
        isLoading={isFetchingStations}
      />

      {/* My Location Button */}
      <MyLocationButton onPress={centerOnUser} />

      {/* Station Info Card */}
      {selectedStation && (
        <StationCard
          station={selectedStation}
          routeInfo={routeInfo}
          showingDirections={showingDirections}
          isLoading={isSearching}
          onShowDirections={handleShowDirections}
          onCloseDirections={clearDirections}
          onStationPress={showDirectionToStation}
        />
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
  map: {
    width: width,
    height: height,
  },
});
