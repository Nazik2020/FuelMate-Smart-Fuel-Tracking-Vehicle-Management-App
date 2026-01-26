import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

export default function ContactInfo() {
  return (
    <View style={styles.container}>
      {/* Email Card */}
      <View style={styles.card}>
        <View style={styles.iconBox}>
          <Ionicons name="mail-outline" size={24} color="#0D9488" />
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>support@fuelmate.app</Text>
        </View>
      </View>

      {/* Phone Card */}
      <View style={styles.card}>
        <View style={styles.iconBox}>
          <Ionicons name="call-outline" size={24} color="#0D9488" />
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>+94 11 234 5678</Text>
        </View>
      </View>

      {/* Address Card */}
      <View style={styles.card}>
        <View style={styles.iconBox}>
          <Ionicons name="location-outline" size={24} color="#0D9488" />
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.value}>Colombo, Sri Lanka</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#E6F7F8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
    ...Platform.select({
      ios: { fontFamily: "System" },
      android: { fontFamily: "sans-serif" },
      web: { fontFamily: "sans-serif" },
    }),
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    ...Platform.select({
      ios: { fontFamily: "System" },
      android: { fontFamily: "sans-serif" },
      web: { fontFamily: "sans-serif" },
    }),
  },
});
