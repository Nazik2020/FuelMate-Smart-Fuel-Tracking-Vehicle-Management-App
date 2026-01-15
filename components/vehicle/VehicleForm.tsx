import { Colors } from "@/constants/theme";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface VehicleFormProps {
  onSubmit?: () => void;
}

export function VehicleForm({ onSubmit }: VehicleFormProps) {
  return (
    <View style={styles.form}>
      <Text style={styles.label}>Vehicle Name</Text>
      <TextInput
        style={styles.input}
        placeholder="My Car"
        placeholderTextColor={Colors.textSecondary}
      />

      <Text style={styles.label}>Vehicle Type</Text>
      <Pressable style={styles.select}>
        <Text style={styles.selectText}>Car</Text>
      </Pressable>

      <Text style={styles.label}>Fuel Type</Text>
      <Pressable style={styles.select}>
        <Text style={styles.selectText}>Petrol</Text>
      </Pressable>

      <Text style={styles.label}>License Plate Number</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. ABC-1234"
        placeholderTextColor={Colors.textSecondary}
      />

      <View style={styles.row}>
        <View style={[styles.rowItem, { marginRight: 10 }]}>
          <Text style={styles.label}>Make</Text>
          <TextInput
            style={styles.input}
            placeholder="Honda"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>
        <View style={[styles.rowItem, { marginLeft: 10 }]}>
          <Text style={styles.label}>Model</Text>
          <TextInput
            style={styles.input}
            placeholder="Civic"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>
      </View>

      <Text style={styles.label}>Year</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 2023"
        placeholderTextColor={Colors.textSecondary}
        keyboardType="numeric"
      />

      <Pressable
        style={styles.submit}
        onPress={onSubmit}
        accessibilityRole="button"
      >
        <Text style={styles.submitText}>Add Vehicle</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 20,
  },
  label: {
    marginTop: 14,
    marginBottom: 6,
    fontSize: 14,
    color: Colors.text,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E1E5EC",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  select: {
    borderWidth: 1,
    borderColor: "#E1E5EC",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: Colors.white,
  },
  selectText: {
    fontSize: 15,
    color: Colors.text,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowItem: {
    flex: 1,
  },
  submit: {
    marginTop: 26,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 3,
    marginBottom: 20,
  },
  submitText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
