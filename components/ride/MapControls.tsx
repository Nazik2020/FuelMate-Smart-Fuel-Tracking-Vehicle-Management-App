// Map Control Buttons (Zoom In/Out, My Location, Menu)

import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

interface MenuButtonProps {
  onPress: () => void;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <Ionicons name="menu-outline" size={24} color={Colors.text} />
    </TouchableOpacity>
  );
};

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  onZoomIn,
  onZoomOut,
}) => {
  return (
    <View style={styles.zoomControls}>
      <TouchableOpacity style={styles.zoomButton} onPress={onZoomIn}>
        <Ionicons name="add" size={24} color={Colors.text} />
      </TouchableOpacity>
      <View style={styles.zoomDivider} />
      <TouchableOpacity style={styles.zoomButton} onPress={onZoomOut}>
        <Ionicons name="remove" size={24} color={Colors.text} />
      </TouchableOpacity>
    </View>
  );
};

interface MyLocationButtonProps {
  onPress: () => void;
}

export const MyLocationButton: React.FC<MyLocationButtonProps> = ({
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.locationButton} onPress={onPress}>
      <Ionicons name="locate" size={24} color={Colors.primary} />
    </TouchableOpacity>
  );
};

interface RefreshStationsButtonProps {
  onPress: () => void;
  isLoading?: boolean;
}

export const RefreshStationsButton: React.FC<RefreshStationsButtonProps> = ({
  onPress,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      style={styles.refreshButton}
      onPress={onPress}
      disabled={isLoading}
    >
      <Ionicons
        name="refresh"
        size={24}
        color={isLoading ? Colors.gray : Colors.primary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  refreshButton: {
    position: "absolute",
    right: 16,
    bottom: 280,
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
});

export default {
  MenuButton,
  ZoomControls,
  MyLocationButton,
  RefreshStationsButton,
};
