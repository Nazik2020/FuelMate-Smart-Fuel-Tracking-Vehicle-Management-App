import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DrawerHeaderProps {
  onClose: () => void;
  name?: string | null;
  email?: string | null;
  photoURL?: string | null;
  onProfilePress?: () => void;
}

const resolveDisplayValue = (value?: string | null, fallback?: string) => {
  if (typeof value !== "string") {
    return fallback ?? "";
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : (fallback ?? "");
};

export default function DrawerHeader({
  onClose,
  name,
  email,
  photoURL,
  onProfilePress,
}: DrawerHeaderProps) {
  const displayName = resolveDisplayValue(name, "Your Profile");
  const displayEmail = resolveDisplayValue(email, "Add your email");

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.profileSection}
        onPress={onProfilePress}
        activeOpacity={onProfilePress ? 0.85 : 1}
      >
        <View style={styles.profileIcon}>
          {photoURL ? (
            <Image source={{ uri: photoURL }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person" size={40} color="#0D7377" />
          )}
        </View>
        <Text style={styles.profileName}>{displayName}</Text>
        <Text style={styles.profileEmail}>{displayEmail}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#0D7377",
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: "#E6F7F8",
  },
  vehicleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#14919B",
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  vehicleInfo: {
    marginLeft: 15,
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  vehiclePlate: {
    fontSize: 14,
    color: "#E6F7F8",
  },
});
