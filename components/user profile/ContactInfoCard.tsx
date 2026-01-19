import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ContactInfoCardProps {
  email?: string | null;
  phone?: string | null;
}

const getFieldValue = (value?: string | null) => {
  if (typeof value !== "string") {
    return "Not provided";
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : "Not provided";
};

export function ContactInfoCard({ email, phone }: ContactInfoCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Contact Information</Text>

      <View style={styles.row}>
        <View style={styles.iconBadge}>
          <Ionicons name="mail-outline" size={24} color={Colors.primary} />
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{getFieldValue(email)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <View style={styles.iconBadge}>
          <Ionicons name="call-outline" size={24} color={Colors.primary} />
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{getFieldValue(phone)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 20,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E6F4F4",
    alignItems: "center",
    justifyContent: "center",
  },
  infoBlock: {
    marginLeft: 12,
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grayLight,
    marginVertical: 14,
  },
});
