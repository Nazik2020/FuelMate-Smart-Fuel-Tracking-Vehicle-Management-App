import { Vehicle } from "@/config/vehicleService";
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
import { VehicleCard } from "./VehicleCard";

interface VehiclesListProps {
  vehicles: Vehicle[];
  isLoading?: boolean;
  onAddVehicle?: () => void;
  onEditVehicle?: (vehicleId: string) => void;
}

export function VehiclesList({
  vehicles,
  isLoading,
  onAddVehicle,
  onEditVehicle,
}: VehiclesListProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>My Vehicles</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={onAddVehicle}
          accessibilityRole="button"
          accessibilityLabel="Add vehicle"
        >
          <Ionicons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      ) : vehicles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="car-outline" size={48} color={Colors.gray} />
          <Text style={styles.emptyText}>No vehicles added yet</Text>
          <TouchableOpacity
            style={styles.emptyAddButton}
            onPress={onAddVehicle}
          >
            <Text style={styles.emptyAddText}>Add your first vehicle</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.list}>
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={() => vehicle.id && onEditVehicle?.(vehicle.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 18,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  heading: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    marginBottom: 10,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 30,
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  emptyAddButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.primaryLight + "30",
    borderRadius: 8,
  },
  emptyAddText: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
});
