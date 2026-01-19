import {
  ContactInfoCard,
  ProfileHeader,
  Vehicle,
  VehiclesList,
} from "@/components/user profile";
import { Colors } from "@/constants/theme";
import { useCurrentUserProfile } from "@/hooks/use-current-user-profile";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
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

const formatMemberSince = (value?: { toDate?: () => Date } | Date | null) => {
  if (!value) {
    return null;
  }

  const parsedDate = value instanceof Date ? value : value.toDate?.();

  if (!parsedDate) {
    return null;
  }

  return parsedDate.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
};

export default function UserProfileScreen() {
  const router = useRouter();
  const { displayName, email, profile } = useCurrentUserProfile();
  const memberSince = useMemo(
    () => formatMemberSince(profile?.createdAt ?? null),
    [profile?.createdAt],
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <ProfileHeader
          name={displayName}
          memberSince={memberSince}
          onBack={() => router.back()}
          onEditAvatar={() => null}
        />

        <ContactInfoCard email={email} phone={profile?.phone ?? null} />

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
