import { useCurrentUserProfile } from "@/hooks/use-current-user-profile"; // Import hook
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NotificationHeaderProps {
    onMarkAllAsRead: () => void;
}

export default function NotificationHeader({
    onMarkAllAsRead,
}: NotificationHeaderProps) {
    const router = useRouter();
    const { profile } = useCurrentUserProfile(); // Use hook

    return (
        <View style={styles.header}>
            <View style={styles.topRow}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={24} color="#111827" />
                </TouchableOpacity>

                <Text style={styles.title}>Notifications</Text>

                <TouchableOpacity style={styles.profileButton}>
                    <View style={styles.profileIcon}>
                        {profile?.photoURL ? (
                            <Image
                                source={{ uri: profile.photoURL }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <Ionicons name="person-outline" size={20} color="#6B7280" />
                        )}
                    </View>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.markAllButton}
                onPress={onMarkAllAsRead}
            >
                <Ionicons name="checkmark-done" size={16} color="#0D9488" />
                <Text style={styles.markAllText}>Mark all as read</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#FFFFFF",
        paddingTop: 16,
        paddingBottom: 12,
        // Removed border to fix "black bold line" usage
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#111827",
        flex: 1,
        marginLeft: 8,
    },
    profileButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    profileIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        overflow: 'hidden', // Ensure image stays within bounds
    },
    markAllButton: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-end",
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    markAllText: {
        fontSize: 14,
        color: "#0D9488",
        fontWeight: "500",
        marginLeft: 4,
    },
    profileImage: {
        width: "100%",
        height: "100%",
    },
});
