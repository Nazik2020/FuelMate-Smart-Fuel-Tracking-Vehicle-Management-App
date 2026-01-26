import { Colors } from "@/constants/theme";
import React from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";

interface TaskNameInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function TaskNameInput({
  value,
  onChangeText,
  placeholder = "e.g. Oil Change",
}: TaskNameInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Name</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textLight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
});
