import {
  UploadPhoto,
  VehicleForm,
  VehicleFormData,
} from "@/components/vehicle";
import {
  addVehicle,
  getUserVehicles,
  pickVehicleImage,
  updateVehicle,
  Vehicle,
} from "@/config/vehicleService";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const showAlert = (title: string, message: string) => {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function VehicleScreen() {
  const router = useRouter();
  const { id: vehicleId } = useLocalSearchParams<{ id?: string }>();
  const isEditing = Boolean(vehicleId);

  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVehicle, setIsLoadingVehicle] = useState(false);
  const [existingVehicle, setExistingVehicle] = useState<Vehicle | null>(null);

  // Load existing vehicle data if editing
  useEffect(() => {
    if (!vehicleId) return;

    const loadVehicle = async () => {
      setIsLoadingVehicle(true);
      try {
        const vehicles = await getUserVehicles();
        const vehicle = vehicles.find((v) => v.id === vehicleId);
        if (vehicle) {
          setExistingVehicle(vehicle);
          setPhotoURL(vehicle.photoURL || null);
        }
      } catch (error) {
        showAlert("Error", "Could not load vehicle details");
      } finally {
        setIsLoadingVehicle(false);
      }
    };

    loadVehicle();
  }, [vehicleId]);

  const handleChoosePhoto = async () => {
    try {
      const url = await pickVehicleImage();
      if (url) {
        setPhotoURL(url);
      }
    } catch (error) {
      showAlert(
        "Error",
        error instanceof Error ? error.message : "Could not select image",
      );
    }
  };

  const handleSubmit = async (data: VehicleFormData) => {
    if (!data.name.trim()) {
      showAlert("Error", "Please enter a vehicle name");
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing && vehicleId) {
        // Update existing vehicle
        await updateVehicle(vehicleId, {
          ...data,
          photoURL: photoURL || undefined,
        });
        showAlert("Success", "Vehicle updated successfully!");
      } else {
        // Add new vehicle
        await addVehicle({
          ...data,
          photoURL: photoURL || undefined,
        });
        showAlert("Success", "Vehicle added successfully!");
      }
      router.back();
    } catch (error) {
      showAlert(
        "Error",
        error instanceof Error ? error.message : "Could not save vehicle",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingVehicle) {
    return (
      <View style={[styles.screen, styles.loadingScreen]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isEditing ? "Edit Vehicle" : "Add Vehicle"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <UploadPhoto photoURL={photoURL} onChoose={handleChoosePhoto} />
        <VehicleForm
          initialData={
            existingVehicle
              ? {
                name: existingVehicle.name,
                vehicleType: existingVehicle.vehicleType,
                fuelType: existingVehicle.fuelType,
                licensePlate: existingVehicle.licensePlate,
                make: existingVehicle.make,
                model: existingVehicle.model,
                year: existingVehicle.year,
              }
              : undefined
          }
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitLabel={isEditing ? "Update Vehicle" : "Add Vehicle"}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingScreen: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEFF2",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  content: {
    paddingTop: 16,
    paddingBottom: 30,
  },
});
