import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileHeaderProps {
  name?: string | null;
  memberSince?: string | null;
  onBack?: () => void;
  onEditAvatar?: () => void;
}

const resolveName = (value?: string | null) => {
  if (typeof value !== "string") {
    return "Your Profile";
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : "Your Profile";
};

export function ProfileHeader({
  name,
  memberSince,
  onBack,
  onEditAvatar,
}: ProfileHeaderProps) {
  const displayName = resolveName(name);

  return (
    <View style={styles.wrapper}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} accessibilityRole="button">
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Profile</Text>
        <Ionicons name="person-circle-outline" size={28} color={Colors.gray} />
      </View>

      <View style={styles.card}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person-outline" size={48} color={Colors.white} />
          </View>
          <TouchableOpacity
            style={styles.editBadge}
            onPress={onEditAvatar}
            accessibilityRole="button"
          >
            <Ionicons name="create-outline" size={18} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{displayName}</Text>
        {memberSince ? (
          <Text style={styles.subtitle}>Member since {memberSince}</Text>
        ) : (
          <Text style={styles.subtitle}>Complete your profile details</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  topTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  editBadge: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: Colors.textSecondary,
  },
});
