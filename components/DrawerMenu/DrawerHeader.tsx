import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DrawerHeaderProps {
  onClose: () => void;
}

export default function DrawerHeader({ onClose }: DrawerHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <View style={styles.profileSection}>
        <View style={styles.profileIcon}>
          <Ionicons name="person" size={40} color="#0D7377" />
        </View>
        <Text style={styles.profileName}>Alex Johnson</Text>
        <Text style={styles.profileEmail}>alex@email.com</Text>
      </View>

      {/* Vehicle Card */}
      <View style={styles.vehicleCard}>
        <Ionicons name="car-outline" size={24} color="#FFFFFF" />
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleName}>Toyota Corolla</Text>
          <Text style={styles.vehiclePlate}>WP ABC-1234</Text>
        </View>
      </View>
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
    marginBottom: 20,
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

