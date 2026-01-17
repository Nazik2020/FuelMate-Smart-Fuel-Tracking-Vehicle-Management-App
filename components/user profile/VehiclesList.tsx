import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Vehicle, VehicleCard } from "./VehicleCard";

interface VehiclesListProps {
  vehicles: Vehicle[];
}

export function VehiclesList({ vehicles }: VehiclesListProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>My Vehicles</Text>
      <View style={styles.list}>
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} {...vehicle} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 18,
  },
  heading: {
    marginLeft: 20,
    marginBottom: 10,
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text,
  },
  list: {
    marginBottom: 10,
  },
});
