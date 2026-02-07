import { auth } from "@/config/firebase";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native";

const Colors = {
  primary: "#0D7377",
  gray: "#9CA3AF",
  grayLight: "#E5E7EB",
  white: "#FFFFFF",
};

export default function AdminLayout() {
  const isWeb = Platform.OS === "web";
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state directly
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Show loading while checking auth
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading admin panel...</Text>
      </View>
    );
  }

  // Show message if not authenticated (don't redirect to avoid route issues)
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="lock-closed" size={48} color={Colors.gray} />
        <Text style={styles.errorTitle}>Access Denied</Text>
        <Text style={styles.loadingText}>Please log in to access the admin panel</Text>
      </View>
    );
  }

  return (
    <View style={[styles.viewport, isWeb && styles.webViewport]}>
      <View style={[styles.shell, isWeb && styles.webShell]}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: "#6B7280", // Darker gray
            headerShown: false,
            tabBarStyle: {
              height: Platform.OS === "ios" ? 88 : 65,
              paddingBottom: Platform.OS === "ios" ? 28 : 10,
              paddingTop: 10,
              backgroundColor: Colors.white,
              borderTopWidth: 1,
              borderTopColor: Colors.grayLight,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "600",
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Dashboard",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "stats-chart" : "stats-chart-outline"}
                  size={24}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="users"
            options={{
              title: "Users",
              headerTitle: "User Management",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "people" : "people-outline"}
                  size={24}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="vehicles"
            options={{
              title: "Vehicles",
              headerTitle: "Vehicle Management",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "car" : "car-outline"}
                  size={24}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: "Settings",
              headerTitle: "Admin Settings",
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "settings" : "settings-outline"}
                  size={24}
                  color={color}
                />
              ),
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
  },
  shell: {
    flex: 1,
  },
  webViewport: {
    backgroundColor: "#05172D",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  webShell: {
    width: 420,
    maxWidth: "100%",
    flex: 1,
    borderRadius: 32,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 24 },
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.gray,
    textAlign: "center",
  },
  errorTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
});
