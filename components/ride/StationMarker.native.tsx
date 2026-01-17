// Custom Fuel Station Marker Component - Native (iOS/Android)

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";
import { Station } from "./LocationService";

interface StationMarkerProps {
  station: Station;
  isNearest: boolean;
  isSelected: boolean;
  markersReady: boolean;
  onPress: (station: Station) => void;
}

export const StationMarker: React.FC<StationMarkerProps> = ({
  station,
  isNearest,
  isSelected,
  markersReady,
  onPress,
}) => {
  return (
    <Marker
      coordinate={{
        latitude: station.latitude,
        longitude: station.longitude,
      }}
      onPress={() => onPress(station)}
      tracksViewChanges={!markersReady}
      zIndex={isNearest ? 10 : 1}
    >
      <View
        style={[
          styles.customMarker,
          isSelected && { transform: [{ scale: 1.2 }] },
        ]}
      >
        <View style={[styles.markerPin, isNearest && styles.nearestMarkerPin]}>
          <Ionicons name="flame" size={18} color="#fff" />
        </View>
        <View
          style={[styles.markerTip, isNearest && styles.nearestMarkerTip]}
        />
      </View>
    </Marker>
  );
};

interface SearchMarkerProps {
  latitude: number;
  longitude: number;
  name: string;
}

export const SearchMarker: React.FC<SearchMarkerProps> = ({
  latitude,
  longitude,
  name,
}) => {
  return (
    <Marker coordinate={{ latitude, longitude }} title={name}>
      <View style={styles.searchMarkerContainer}>
        <Ionicons name="location" size={40} color="#E53935" />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
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
  searchMarkerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default StationMarker;
