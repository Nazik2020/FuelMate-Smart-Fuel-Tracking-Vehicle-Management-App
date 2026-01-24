import {
  ContactInfoCard,
  ProfileHeader,
  VehiclesList,
} from "@/components/user profile";
import { auth } from "@/config/firebase";
import { pickAndUploadProfilePhoto } from "@/config/profilePhoto";
import { getUserVehicles, Vehicle } from "@/config/vehicleService";
import { Colors } from "@/constants/theme";
import { useCurrentUserProfile } from "@/hooks/use-current-user-profile";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StatusBar, StyleSheet, View } from "react-native";

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
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);

  // Fetch vehicles when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchVehicles = async () => {
        try {
          setIsLoadingVehicles(true);
          const userVehicles = await getUserVehicles();
          setVehicles(userVehicles);
        } catch (error) {
          console.error("Failed to fetch vehicles:", error);
        } finally {
          setIsLoadingVehicles(false);
        }
      };

      if (auth.currentUser) {
        fetchVehicles();
      }
    }, []),
  );

  useEffect(() => {
    setAvatarUri(profile?.photoURL ?? auth.currentUser?.photoURL ?? null);
  }, [profile?.photoURL]);

  const handleEditAvatar = async () => {
    if (isUploadingPhoto) {
      return;
    }

    try {
      setIsUploadingPhoto(true);
      const result = await pickAndUploadProfilePhoto();

      if (!result.cancelled && result.photoURL) {
        setAvatarUri(result.photoURL);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not update your profile photo right now.";
      Alert.alert("Profile Photo", message);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <ProfileHeader
          name={displayName}
          memberSince={memberSince}
          onBack={() => router.back()}
          onEditAvatar={handleEditAvatar}
          photoURL={avatarUri}
          isUploadingPhoto={isUploadingPhoto}
        />

        <ContactInfoCard email={email} />

        <VehiclesList
          vehicles={vehicles}
          isLoading={isLoadingVehicles}
          onAddVehicle={() => router.push("/vehicles")}
          onEditVehicle={(vehicleId) =>
            router.push(`/vehicles?id=${vehicleId}`)
          }
        />
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
