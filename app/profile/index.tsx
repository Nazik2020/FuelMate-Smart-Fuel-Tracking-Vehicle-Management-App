import {
  ContactInfoCard,
  ProfileHeader,
  Vehicle,
  VehiclesList,
} from "@/components/user profile";
import { Colors } from "@/constants/theme";
import React from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    name: "Toyota Corolla",
    plate: "WP ABC-1234",
    type: "Sedan",
    fuel: "Petrol",
    year: "2020",
  },
  {
    id: "2",
    name: "Honda Civic",
    plate: "WP XYZ-5678",
    type: "Sedan",
    fuel: "Petrol",
    year: "2019",
  },
];

export default function UserProfileScreen() {
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <ProfileHeader
          name="Alex Johnson"
          memberSince="Jan 2023"
          onBack={() => null}
          onEditAvatar={() => null}
        />

        <ContactInfoCard email="alex@email.com" phone="+94 77 123 4567" />

        <VehiclesList vehicles={mockVehicles} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  content: {
    paddingTop: 10,
    paddingBottom: 24,
  },
});
