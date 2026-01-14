// Web fallback for react-native-maps
// This file is used on web where react-native-maps is not supported

import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Export null components for web
export const MapView = null;
export const Marker = null;
export const Polyline = null;
export const PROVIDER_GOOGLE = null;

export function WebMapFallback() {
  return (
    <View style={styles.container}>
      <View style={styles.webFallback}>
        <Ionicons name="map-outline" size={64} color={Colors.primary} />
        <Text style={styles.webFallbackTitle}>Map View</Text>
        <Text style={styles.webFallbackText}>
          Maps are only available on mobile devices.
        </Text>
        <Text style={styles.webFallbackText}>
          Please use the Expo Go app on your phone to view the map.
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
  webFallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  webFallbackTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  webFallbackText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
});
