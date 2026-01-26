import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface NotificationCardProps {
    icon: string;
    iconType?: "ionicons" | "material";
    title: string;
    description: string;
    timestamp: string;
    isUnread: boolean;
    iconColor?: string;
    iconBgColor?: string;
    accentColor?: string;
    onPress?: () => void;
}

export default function NotificationCard({
    icon,
    iconType = "ionicons",
    title,
    description,
    timestamp,
    isUnread,
    iconColor = "#0D9488",
    iconBgColor = "#E0F2F1",
    accentColor = "#0D9488",
    onPress,
}: NotificationCardProps) {
    return (
        <TouchableOpacity
            style={[
                styles.card,
                isUnread && { borderLeftWidth: 4, borderLeftColor: accentColor },
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
                {iconType === "ionicons" ? (
                    <Ionicons name={icon as any} size={24} color={iconColor} />
                ) : (
                    <MaterialCommunityIcons name={icon as any} size={24} color={iconColor} />
                )}
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    {isUnread && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.description} numberOfLines={2}>
                    {description}
                </Text>
                <Text style={styles.timestamp}>{timestamp}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        flexDirection: "row",
        alignItems: "flex-start",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
        flex: 1,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#0D9488",
        marginLeft: 8,
    },
    description: {
        fontSize: 14,
        color: "#6B7280",
        lineHeight: 20,
        marginBottom: 8,
    },
    timestamp: {
        fontSize: 12,
        color: "#9CA3AF",
    },
});
