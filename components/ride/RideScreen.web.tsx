// Web-specific Ride screen with browser map

import DrawerMenu from "@/components/DrawerMenu";
import { LoadingView } from "@/components/ride/LoadingView";
import {
  DEFAULT_REGION,
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
import { useLocation } from "@/components/ride/useLocation";
import { Colors } from "@/constants/theme";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

// Allow iframe element in JSX (TypeScript helper)
declare global {
  namespace JSX {
    interface IntrinsicElements {
      iframe: any;
    }
  }
}

export default function RideWebScreen() {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const {
    location,
    loading,
    fuelStations,
    selectedStation,
    isFetchingStations,
    setSelectedStation,
    refreshStations,
  } = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  const centerLat = location?.coords.latitude ?? DEFAULT_REGION.latitude;
  const centerLon = location?.coords.longitude ?? DEFAULT_REGION.longitude;

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

  const handleSelectSearchResult = (result: any) => {
    setSearchQuery(result.display_name.split(",")[0]);
    setShowSearchResults(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  if (loading) {
    return <LoadingView message="Loading map..." />;
  }

  // Build a simple OpenStreetMap embed URL centered on user's (or default) location
  const bboxSize = 0.05; // roughly ~5km box
  const left = centerLon - bboxSize;
  const right = centerLon + bboxSize;
  const top = centerLat + bboxSize;
  const bottom = centerLat - bboxSize;
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${centerLat}%2C${centerLon}`;

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {/* Browser map via OpenStreetMap embed */}
        <iframe
          title="Fuel stations map"
          src={osmUrl}
          style={{ border: "none", width: "100%", height: "100%" }}
        />
      </View>

      {/* Menu Button */}
      <MenuButton onPress={() => setDrawerVisible(true)} />

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchQueryChange={(text) => {
          setSearchQuery(text);
          if (text.length >= 3) {
            handleSearch(text);
          } else {
            setShowSearchResults(false);
          }
        }}
        searchResults={searchResults}
        showSearchResults={showSearchResults}
        isSearching={isSearching}
        onSelectResult={handleSelectSearchResult}
        onClear={handleClearSearch}
      />

      {/* Zoom Controls - visual only on web */}
      <ZoomControls onZoomIn={() => {}} onZoomOut={() => {}} />

      {/* Refresh Stations Button */}
      <RefreshStationsButton
        onPress={refreshStations}
        isLoading={isFetchingStations}
      />

      {/* My Location Button - no animation on web */}
      <MyLocationButton onPress={() => {}} />

      {/* Station Info Card */}
      {selectedStation && (
        <StationCard
          station={selectedStation}
          routeInfo={routeInfo}
          showingDirections={false}
          isLoading={isSearching}
          onShowDirections={() => setRouteInfo(null)}
          onCloseDirections={() => setRouteInfo(null)}
          onStationPress={() => setSelectedStation(selectedStation)}
        />
      )}

      {/* Drawer Menu */}
      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />

      {/* Small label to indicate web-specific behaviour */}
      <View style={styles.webNotice}>
        <Text style={styles.webNoticeText}>
          Web view uses an embedded OpenStreetMap. For full navigation, use the
          mobile app.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  mapContainer: {
    width: width,
    height: height,
    backgroundColor: Colors.background,
  },
  webNotice: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
  },
  webNoticeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
