import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  type: string;
  fuel: string;
  year: string;
  onEdit?: () => void;
}

export function VehicleCard({
  name,
  plate,
  type,
  fuel,
  year,
  onEdit,
}: Vehicle) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.leftRow}>
          <View style={styles.iconBadge}>
            <Ionicons name="car-outline" size={26} color={Colors.primary} />
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.plate}>{plate}</Text>
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
          <Text style={styles.metaValue}>{type}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Fuel</Text>
          <Text style={styles.metaValue}>{fuel}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Year</Text>
          <Text style={styles.metaValue}>{year}</Text>
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
