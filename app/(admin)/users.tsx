import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const StatCard = ({ label, value, color }: any) => (
    <View style={styles.statCard}>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const UserRow = ({ name, email, status }: any) => {
    const statusColor =
        status === "Active" ? "#0D9488" :
            status === "Pending" ? "#F59E0B" : "#EF4444";

    const statusBg = statusColor + "15";

    return (
        <View style={styles.userCard}>
            <View style={styles.avatar}>
                <Ionicons name="person-outline" size={24} color="#0D9488" />
            </View>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{name}</Text>
                <Text style={styles.userEmail} numberOfLines={1}>{email}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
            </View>
            <TouchableOpacity style={styles.menuButton}>
                <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
            </TouchableOpacity>
        </View>
    );
};

export default function UserManagement() {
    const [search, setSearch] = useState("");

    const users = [
        { id: "1", name: "Isuru Udaara", email: "isura@gmail.com", status: "Active" },
        { id: "2", name: "John Perera", email: "john@gmail.com", status: "Pending" },
        { id: "3", name: "Kamal Silva", email: "kamal@gmail.com", status: "Active" },
        { id: "4", name: "Nimal Fernando", email: "nimal@gmail.com", status: "Suspended" },
        { id: "5", name: "Sunil Rathnayake", email: "sunil@gmail.com", status: "Active" },
    ];

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            {/* Header - Fixed */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>User Management</Text>
                    <Text style={styles.headerSubtitle}>Manage all users</Text>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.headerIconButton}>
                        <Ionicons name="notifications-outline" size={24} color="#111827" />
                        <View style={styles.notificationDot} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIconButton}>
                        <View style={styles.avatarPlaceholder}>
                            <Ionicons name="person-outline" size={20} color="#6B7280" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                style={styles.container}
                contentContainerStyle={styles.content}
                ListHeaderComponent={
                    <>
                        {/* Stats Summary */}
                        <View style={styles.statsRow}>
                            <StatCard label="Total" value="5" color="#111827" />
                            <StatCard label="Active" value="3" color="#0D9488" />
                            <StatCard label="Pending" value="1" color="#F59E0B" />
                        </View>

                        {/* Search Bar */}
                        <View style={styles.searchContainer}>
                            <Ionicons name="search-outline" size={20} color="#6B7280" style={styles.searchIcon} />
                            <TextInput
                                placeholder="Search users..."
                                style={styles.searchInput}
                                value={search}
                                onChangeText={setSearch}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </>
                }
                renderItem={({ item }) => (
                    <UserRow
                        name={item.name}
                        email={item.email}
                        status={item.status}
                    />
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#111827",
    },
    headerSubtitle: {
        fontSize: 14,
        color: "#6B7280",
        marginTop: 2,
    },
    headerIcons: {
        flexDirection: "row",
        gap: 12,
    },
    headerIconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
    },
    notificationDot: {
        position: "absolute",
        top: 10,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#EF4444",
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    statsRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    statValue: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "#6B7280",
        fontWeight: "500",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#F3F4F6",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#111827",
    },
    userCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 2,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#0D948815",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 14,
        color: "#6B7280",
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "600",
    },
    menuButton: {
        padding: 4,
    },
});
