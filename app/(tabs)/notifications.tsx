import {
    Notification,
    NotificationHeader,
    NotificationsList,
} from "@/components/Notifications";
import { auth } from "@/config/firebase";
import {
    Notification as FirestoreNotification,
    markAllAsRead,
    markAsRead,
    subscribeToNotifications
} from "@/config/notificationService";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Helper function to format timestamp
const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
};

// Convert Firestore notification to component format
const convertNotification = (notif: FirestoreNotification): Notification => ({
    id: notif.id,
    type: notif.type,
    title: notif.title,
    description: notif.message,
    timestamp: formatTimestamp(notif.createdAt),
    isUnread: !notif.isRead,
});

export default function NotificationsScreen() {
    const isWeb = Platform.OS === "web";
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            setLoading(false);
            return;
        }

        // Subscribe to real-time notifications
        const unsubscribe = subscribeToNotifications(user.uid, (firestoreNotifs) => {
            const converted = firestoreNotifs.map(convertNotification);
            setNotifications(converted);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleMarkAllAsRead = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            await markAllAsRead(user.uid);
            // Real-time listener will auto-update the UI
        } catch (error) {
            // Silent error handling
        }
    };

    const handleNotificationPress = async (id: string) => {
        try {
            await markAsRead(id);
            // Real-time listener will auto-update the UI
        } catch (error) {
            // Silent error handling
        }
    };

    if (loading) {
        return (
            <View style={[styles.viewport, isWeb && styles.webViewport]}>
                <SafeAreaView
                    style={[styles.safeArea, isWeb && styles.webShell]}
                    edges={["top", "bottom"]}
                >
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" color="#0D9488" />
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={[styles.viewport, isWeb && styles.webViewport]}>
            <SafeAreaView
                style={[styles.safeArea, isWeb && styles.webShell]}
                edges={["top", "bottom"]}
            >
                <NotificationHeader onMarkAllAsRead={handleMarkAllAsRead} />
                <NotificationsList
                    notifications={notifications}
                    onMarkAllAsRead={handleMarkAllAsRead}
                    onNotificationPress={handleNotificationPress}
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    viewport: {
        flex: 1,
        backgroundColor: "#FFFFFF", // Fix for black line
    },
    webViewport: {
        // Removed floating card style
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    webShell: {
        flex: 1,
        width: "100%",
        maxWidth: "100%",
    },
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
});
