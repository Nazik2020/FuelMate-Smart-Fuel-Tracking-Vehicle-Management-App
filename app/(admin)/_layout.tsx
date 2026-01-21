import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

const Colors = {
    primary: "#0D7377",
    gray: "#9CA3AF",
    grayLight: "#E5E7EB",
    white: "#FFFFFF",
};

export default function AdminLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: Colors.gray,
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
                    fontWeight: "500",
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
    );
}
