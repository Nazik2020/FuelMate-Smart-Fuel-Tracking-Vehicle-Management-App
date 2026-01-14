import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

interface ReminderToggleProps {
  value: boolean;
  onToggle: (value: boolean) => void;
}

export default function ReminderToggle({
  value,
  onToggle,
}: ReminderToggleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Ionicons
          name="notifications-outline"
          size={22}
          color={Colors.text}
          style={styles.icon}
        />
        <Text style={styles.label}>Set Reminder</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{
          false: Colors.grayLight,
          true: Colors.primary,
        }}
        thumbColor={Colors.white}
        ios_backgroundColor={Colors.grayLight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
  },
});
