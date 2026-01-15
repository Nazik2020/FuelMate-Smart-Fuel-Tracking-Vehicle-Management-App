import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MenuItem {
  name: string;
  icon: string;
  route: string | null;
}

interface DrawerMenuItemsProps {
  activeRoute?: string;
  onItemPress?: () => void;
}

const menuItems: MenuItem[] = [
  { name: "Home", icon: "home", route: "/(tabs)" },
  { name: "Profile", icon: "person-outline", route: null },
  { name: "Logs", icon: "speedometer-outline", route: "/(tabs)/logs" }, // Updated per instructions
  { name: "Ride", icon: "map-outline", route: "/(tabs)/ride" },
  { name: "Notifications", icon: "notifications-outline", route: null },
  { name: "Contact Us", icon: "call-outline", route: null },
  { name: "Settings", icon: "settings-outline", route: "/(tabs)/settings" },
];

export default function DrawerMenuItems({
  activeRoute = "/(tabs)",
  onItemPress,
}: DrawerMenuItemsProps) {
  const router = useRouter();

  const handleMenuPress = (route: string | null) => {
    if (route) {
      router.push(route as any);
      onItemPress?.();
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // TODO: Add actual logout logic (clear auth state, tokens, etc.)
          onItemPress?.();
          router.replace("/(auth)/login" as any);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.menuItems}>
        {menuItems.map((item, index) => {
          const isActive = item.route === activeRoute;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, isActive && styles.activeMenuItem]}
              onPress={() => handleMenuPress(item.route)}
            >
              <Ionicons
                name={item.icon as any}
                size={24}
                color={isActive ? "#FFFFFF" : "#1F2937"}
              />
              <Text
                style={[
                  styles.menuItemText,
                  isActive && styles.activeMenuItemText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#EF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  menuItems: {
    paddingVertical: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 10,
    marginVertical: 2,
    borderRadius: 12,
  },
  activeMenuItem: {
    backgroundColor: "#0D7377",
  },
  menuItemText: {
    fontSize: 16,
    color: "#1F2937",
    marginLeft: 15,
    fontWeight: "500",
  },
  activeMenuItemText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  logoutText: {
    fontSize: 16,
    color: "#EF4444",
    marginLeft: 15,
    fontWeight: "500",
  },
});
