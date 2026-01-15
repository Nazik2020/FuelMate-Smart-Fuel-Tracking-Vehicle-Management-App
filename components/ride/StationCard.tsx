// Station Info Card Component

import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RouteInfo, Station } from "./LocationService";

interface StationCardProps {
  station: Station;
  routeInfo: RouteInfo | null;
  showingDirections: boolean;
  isLoading: boolean;
  onShowDirections: () => void;
  onCloseDirections: () => void;
  onStationPress: () => void;
}

export const StationCard: React.FC<StationCardProps> = ({
  station,
  routeInfo,
  showingDirections,
  isLoading,
  onShowDirections,
  onCloseDirections,
  onStationPress,
}) => {
  return (
    <View style={styles.stationCard}>
      <TouchableOpacity
        style={styles.stationInfo}
        onPress={onStationPress}
        activeOpacity={0.8}
      >
        <Text style={styles.stationLabel}>
          {showingDirections ? "Directions to" : "Nearest Fuel Station"}
        </Text>
        <Text style={styles.stationName}>{station.name}</Text>
        <View style={styles.stationDetails}>
          <View style={styles.distanceContainer}>
            <Ionicons name="navigate" size={16} color={Colors.primary} />
            <Text style={styles.stationDistance}>
              {routeInfo ? routeInfo.distance : `${station.distance} km`}
            </Text>
          </View>
          {routeInfo ? (
            <View style={styles.distanceContainer}>
              <Ionicons name="time" size={16} color={Colors.secondary} />
              <Text style={styles.stationDuration}>{routeInfo.duration}</Text>
            </View>
          ) : (
            <Text style={styles.stationPrice}>
              Rs. {station.price.toFixed(0)}/L
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
            onPress={onCloseDirections}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={20} color={Colors.text} />
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        ) : (
          /* Show Directions Button */
          <TouchableOpacity
            style={styles.navigateButton}
            onPress={onShowDirections}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <>
                <Ionicons
                  name="navigate-circle"
                  size={20}
                  color={Colors.white}
                />
                <Text style={styles.navigateButtonText}>Show Directions</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default StationCard;
