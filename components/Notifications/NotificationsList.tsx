import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import NotificationCard from "./NotificationCard";

export interface Notification {
    id: string;
    type: "fuel_price" | "service" | "warning" | "welcome" | "custom";
    title: string;
    description: string;
    timestamp: string;
    isUnread: boolean;
}

interface NotificationsListProps {
    notifications: Notification[];
    onMarkAllAsRead: () => void;
    onNotificationPress?: (id: string) => void;
}

const getNotificationStyle = (type: Notification["type"]) => {
    switch (type) {
        case "fuel_price":
            return {
                icon: "hardware-chip",
                iconType: "ionicons" as const,
                iconColor: "#0D9488",
                iconBgColor: "#E0F2F1",
                accentColor: "#0D9488",
            };
        case "service":
            return {
                icon: "build",
                iconType: "ionicons" as const,
                iconColor: "#F59E0B",
                iconBgColor: "#FEF3C7",
                accentColor: "#F59E0B",
            };
        case "warning":
            return {
                icon: "warning",
                iconType: "ionicons" as const,
                iconColor: "#EF4444",
                iconBgColor: "#FEE2E2",
                accentColor: "#EF4444",
            };
        case "welcome":
            return {
                icon: "notifications",
                iconType: "ionicons" as const,
                iconColor: "#6B7280",
                iconBgColor: "#F3F4F6",
                accentColor: "#6B7280",
            };
        case "custom":
            return {
                icon: "megaphone-outline",
                iconType: "ionicons" as const,
                iconColor: "#8B5CF6",
                iconBgColor: "#EDE9FE",
                accentColor: "#8B5CF6",
            };
        default:
            return {
                icon: "notifications",
                iconType: "ionicons" as const,
                iconColor: "#6B7280",
                iconBgColor: "#F3F4F6",
                accentColor: "#6B7280",
            };
    }
};

export default function NotificationsList({
    notifications,
    onNotificationPress,
}: NotificationsListProps) {
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {notifications.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No notifications yet</Text>
                </View>
            ) : (
                notifications.map((notification) => {
                    const style = getNotificationStyle(notification.type);
                    return (
                        <NotificationCard
                            key={notification.id}
                            icon={style.icon}
                            iconType={style.iconType}
                            title={notification.title}
                            description={notification.description}
                            timestamp={notification.timestamp}
                            isUnread={notification.isUnread}
                            iconColor={style.iconColor}
                            iconBgColor={style.iconBgColor}
                            accentColor={style.accentColor}
                            onPress={() => onNotificationPress?.(notification.id)}
                        />
                    );
                })
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    content: {
        paddingVertical: 8,
        paddingBottom: 24,
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 80,
    },
    emptyText: {
        fontSize: 16,
        color: "#9CA3AF",
    },
});
