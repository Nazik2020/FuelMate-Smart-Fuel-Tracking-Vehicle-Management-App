import { Vehicle } from "@/config/vehicleService";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit?: () => void;
}

export function VehicleCard({ vehicle, onEdit }: VehicleCardProps) {
  const { name, licensePlate, vehicleType, fuelType, year, photoURL } = vehicle;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.leftRow}>
          <View style={styles.iconBadge}>
            {photoURL ? (
              <Image source={{ uri: photoURL }} style={styles.vehicleImage} />
            ) : (
              <Ionicons name="car-outline" size={26} color={Colors.primary} />
            )}
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.plate}>{licensePlate || "No plate"}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onEdit} accessibilityRole="button">
          <Ionicons
            name="create-outline"
            size={22}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Type</Text>
          <Text style={styles.metaValue}>{vehicleType || "N/A"}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Fuel</Text>
          <Text style={styles.metaValue}>{fuelType || "N/A"}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Year</Text>
          <Text style={styles.metaValue}>{year || "N/A"}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBadge: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#E6F4F4",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  vehicleImage: {
    width: 46,
    height: 46,
    borderRadius: 12,
  },
  titleBlock: {
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  plate: {
    marginTop: 2,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  metaValue: {
    marginTop: 2,
    fontSize: 15,
    color: Colors.text,
    fontWeight: "700",
  },
});
