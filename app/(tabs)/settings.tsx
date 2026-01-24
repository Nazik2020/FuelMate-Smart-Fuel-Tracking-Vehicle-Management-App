// DIHANSI - Settings Screen
import DrawerMenu from "@/components/DrawerMenu";
import {
  SettingsHeader,
  SettingsItem,
  SettingsSection,
  SettingsToggle,
} from "@/components/Settings";
import { auth } from "@/config/firebase";
import { Colors } from "@/constants/theme";
import { useCurrentUserProfile } from "@/hooks/use-current-user-profile";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const confirmOnWeb = (message: string) => {
  const confirmFn = (globalThis as { confirm?: (msg?: string) => boolean })
    ?.confirm;
  if (typeof confirmFn !== "function") {
    return true;
  }
  return confirmFn(message);
};

export default function SettingsScreen() {
  const router = useRouter();
  const { profile } = useCurrentUserProfile();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  const handleProfilePress = () => {
    router.push("/profile");
  };

  const handleVehiclesPress = () => {
    router.push("/vehicles");
  };

  const handlePrivacyPolicyPress = () => {
    Alert.alert("Privacy Policy", "Navigate to privacy policy");
  };

  const handleHelpPress = () => {
    Alert.alert("Help & FAQ", "Navigate to help center");
  };

  const handleAboutPress = () => {
    Alert.alert("About Us", "FuelMate App v1.0.0");
  };

  const performLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Sign-out failed", err);
    }
    router.replace("/loginpage");
  };

  const handleLogout = () => {
    if (Platform.OS === "web") {
      const confirmed = confirmOnWeb("Do you want to log out?");
      if (confirmed) {
        performLogout();
      }
      return;
    }

    Alert.alert("Log out", "Do you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: performLogout,
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <SettingsHeader
        title="Settings"
        subtitle="Manage your preferences"
        photoURL={profile?.photoURL}
        onMenuPress={() => setDrawerVisible(true)}
        onProfilePress={handleProfilePress}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <SettingsSection title="ACCOUNT">
          <SettingsItem
            icon="person-outline"
            iconColor={Colors.primary}
            iconBackground={Colors.primaryLight + "20"}
            title="Profile"
            subtitle="Manage your account details"
            onPress={handleProfilePress}
          />
          <SettingsItem
            icon="car-outline"
            iconColor={Colors.primary}
            iconBackground={Colors.primaryLight + "20"}
            title="Vehicles"
            subtitle="Manage registered vehicles"
            onPress={handleVehiclesPress}
            isLast
          />
        </SettingsSection>

        {/* Preferences Section */}
        <SettingsSection title="PREFERENCES">
          <SettingsToggle
            icon="notifications-outline"
            iconColor={Colors.primary}
            iconBackground={Colors.primaryLight + "20"}
            title="Notifications"
            subtitle="Push notifications"
            value={notificationsEnabled}
            onToggle={setNotificationsEnabled}
          />
          <SettingsToggle
            icon="moon-outline"
            iconColor={Colors.primary}
            iconBackground={Colors.primaryLight + "20"}
            title="Dark Mode"
            subtitle="Toggle dark theme"
            value={darkModeEnabled}
            onToggle={setDarkModeEnabled}
            isLast
          />
        </SettingsSection>

        {/* Support Section */}
        <SettingsSection title="SUPPORT">
          <SettingsItem
            icon="shield-outline"
            iconColor={Colors.primary}
            iconBackground={Colors.primaryLight + "20"}
            title="Privacy Policy"
            onPress={handlePrivacyPolicyPress}
          />
          <SettingsItem
            icon="help-circle-outline"
            iconColor={Colors.primary}
            iconBackground={Colors.primaryLight + "20"}
            title="Help & FAQ"
            onPress={handleHelpPress}
          />
          <SettingsItem
            icon="information-circle-outline"
            iconColor={Colors.primary}
            iconBackground={Colors.primaryLight + "20"}
            title="About Us"
            subtitle="App version 1.0.0"
            onPress={handleAboutPress}
          />
          <SettingsItem
            icon="log-out-outline"
            iconColor={Colors.error}
            iconBackground={Colors.error + "20"}
            title="Log out"
            onPress={handleLogout}
            isLast
          />
        </SettingsSection>
      </ScrollView>

      {/* Drawer Menu */}
      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
});
