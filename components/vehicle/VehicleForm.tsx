import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export interface VehicleFormData {
  name: string;
  vehicleType: string;
  fuelType: "Petrol" | "Diesel";
  licensePlate: string;
  make: string;
  model: string;
  year: string;
}

interface VehicleFormProps {
  initialData?: Partial<VehicleFormData>;
  onSubmit?: (data: VehicleFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const FUEL_TYPES: ("Petrol" | "Diesel")[] = ["Petrol", "Diesel"];
const VEHICLE_TYPES = ["Car", "Motorcycle", "Van", "Truck", "SUV"];

export function VehicleForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = "Add Vehicle",
}: VehicleFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [vehicleType, setVehicleType] = useState(
    initialData?.vehicleType || "Car",
  );
  const [fuelType, setFuelType] = useState<"Petrol" | "Diesel">(
    initialData?.fuelType || "Petrol",
  );
  const [licensePlate, setLicensePlate] = useState(
    initialData?.licensePlate || "",
  );
  const [make, setMake] = useState(initialData?.make || "");
  const [model, setModel] = useState(initialData?.model || "");
  const [year, setYear] = useState(initialData?.year || "");

  const [showFuelDropdown, setShowFuelDropdown] = useState(false);
  const [showVehicleTypeDropdown, setShowVehicleTypeDropdown] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) {
      return;
    }
    onSubmit?.({
      name: name.trim(),
      vehicleType,
      fuelType,
      licensePlate: licensePlate.trim(),
      make: make.trim(),
      model: model.trim(),
      year: year.trim(),
    });
  };

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Vehicle Name</Text>
      <TextInput
        style={styles.input}
        placeholder="My Car"
        placeholderTextColor={Colors.textSecondary}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Vehicle Type</Text>
      <Pressable
        style={styles.select}
        onPress={() => setShowVehicleTypeDropdown(true)}
      >
        <Text style={styles.selectText}>{vehicleType}</Text>
        <Ionicons name="chevron-down" size={18} color={Colors.textSecondary} />
      </Pressable>

      <Text style={styles.label}>Fuel Type</Text>
      <Pressable
        style={styles.select}
        onPress={() => setShowFuelDropdown(true)}
      >
        <Text style={styles.selectText}>{fuelType}</Text>
        <Ionicons name="chevron-down" size={18} color={Colors.textSecondary} />
      </Pressable>

      <Text style={styles.label}>License Plate Number</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. ABC-1234"
        placeholderTextColor={Colors.textSecondary}
        value={licensePlate}
        onChangeText={setLicensePlate}
        autoCapitalize="characters"
      />

      <View style={styles.row}>
        <View style={[styles.rowItem, { marginRight: 10 }]}>
          <Text style={styles.label}>Make</Text>
          <TextInput
            style={styles.input}
            placeholder="Honda"
            placeholderTextColor={Colors.textSecondary}
            value={make}
            onChangeText={setMake}
          />
        </View>
        <View style={[styles.rowItem, { marginLeft: 10 }]}>
          <Text style={styles.label}>Model</Text>
          <TextInput
            style={styles.input}
            placeholder="Civic"
            placeholderTextColor={Colors.textSecondary}
            value={model}
            onChangeText={setModel}
          />
        </View>
      </View>

      <Text style={styles.label}>Year</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 2023"
        placeholderTextColor={Colors.textSecondary}
        keyboardType="numeric"
        value={year}
        onChangeText={setYear}
        maxLength={4}
      />

      <Pressable
        style={[styles.submit, isLoading && styles.submitDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
        accessibilityRole="button"
      >
        {isLoading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={styles.submitText}>{submitLabel}</Text>
        )}
      </Pressable>

      {/* Fuel Type Dropdown Modal */}
      <Modal
        visible={showFuelDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFuelDropdown(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowFuelDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownTitle}>Select Fuel Type</Text>
            {FUEL_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.dropdownItem,
                  fuelType === type && styles.dropdownItemSelected,
                ]}
                onPress={() => {
                  setFuelType(type);
                  setShowFuelDropdown(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    fuelType === type && styles.dropdownItemTextSelected,
                  ]}
                >
                  {type}
                </Text>
                {fuelType === type && (
                  <Ionicons name="checkmark" size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Vehicle Type Dropdown Modal */}
      <Modal
        visible={showVehicleTypeDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVehicleTypeDropdown(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowVehicleTypeDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownTitle}>Select Vehicle Type</Text>
            {VEHICLE_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.dropdownItem,
                  vehicleType === type && styles.dropdownItemSelected,
                ]}
                onPress={() => {
                  setVehicleType(type);
                  setShowVehicleTypeDropdown(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    vehicleType === type && styles.dropdownItemTextSelected,
                  ]}
                >
                  {type}
                </Text>
                {vehicleType === type && (
                  <Ionicons name="checkmark" size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  submitDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 8,
    width: "80%",
    maxWidth: 320,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E1E5EC",
    marginBottom: 4,
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  dropdownItemSelected: {
    backgroundColor: Colors.primaryLight + "20",
  },
  dropdownItemText: {
    fontSize: 16,
    color: Colors.text,
  },
  dropdownItemTextSelected: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
