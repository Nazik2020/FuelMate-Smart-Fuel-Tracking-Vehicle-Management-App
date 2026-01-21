import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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

const VehicleCard = ({ model, plate, owner, fuel, status }: any) => {
    const statusColor = status === "Active" ? "#0D9488" : "#F59E0B";
    const fuelColor = fuel === "Electric" ? "#0D9488" : "#F59E0B";

    return (
        <View style={styles.card}>
            <View style={styles.cardLeft}>
                <View style={styles.iconBox}>
                    <MaterialCommunityIcons name="car-outline" size={24} color="#0D9488" />
                </View>
                <View style={styles.cardInfo}>
                    <Text style={styles.modelText}>{model}</Text>
                    <Text style={styles.plateText}>{plate}</Text>
                    <View style={styles.ownerRow}>
                        <Text style={styles.ownerLabel}>Owner: </Text>
                        <Text style={styles.ownerName}>{owner}</Text>
                    </View>
                    <View style={styles.badgeRow}>
                        <View style={[styles.badge, { backgroundColor: fuelColor + "15" }]}>
                            <Text style={[styles.badgeText, { color: fuelColor }]}>{fuel}</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: statusColor + "15" }]}>
                            <Text style={[styles.badgeText, { color: statusColor }]}>{status}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.menuButton}>
                <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
            </TouchableOpacity>
        </View>
    );
};

export default function VehicleManagement() {
    const [search, setSearch] = useState("");

    const vehicles = [
        { id: "1", model: "Toyota Corolla", plate: "WP ABC-1234", owner: "Isuru Udaara", fuel: "Petrol", status: "Active" },
        { id: "2", model: "Honda Civic", plate: "WP XYZ-5678", owner: "John Perera", fuel: "Petrol", status: "Active" },
        { id: "3", model: "Nissan X-Trail", plate: "WP DEF-9012", owner: "Jane Smith", fuel: "Diesel", status: "Inactive" },
        { id: "4", model: "Suzuki Swift", plate: "WP GHI-3456", owner: "Mike Wilson", fuel: "Petrol", status: "Active" },
        { id: "5", model: "Tesla Model 3", plate: "WP JKL-7890", owner: "Sarah Connor", fuel: "Electric", status: "Active" },
    ];

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Vehicle Management</Text>
                    <Text style={styles.headerSubtitle}>Manage all vehicles</Text>
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
                data={vehicles}
                keyExtractor={(item) => item.id}
                style={styles.container}
                contentContainerStyle={styles.content}
                ListHeaderComponent={
                    <>
                        {/* Stats Summary */}
                        <View style={styles.statsRow}>
                            <StatCard label="Total" value="5" color="#111827" />
                            <StatCard label="Active" value="4" color="#0D9488" />
                            <StatCard label="Inactive" value="1" color="#F59E0B" />
                        </View>

                        {/* Search Bar */}
                        <View style={styles.searchContainer}>
                            <Ionicons name="search-outline" size={20} color="#6B7280" style={styles.searchIcon} />
                            <TextInput
                                placeholder="Search vehicles..."
                                style={styles.searchInput}
                                value={search}
                                onChangeText={setSearch}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </>
                }
                renderItem={({ item }) => (
                    <VehicleCard
                        model={item.model}
                        plate={item.plate}
                        owner={item.owner}
                        fuel={item.fuel}
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
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 2,
    },
    cardLeft: {
        flexDirection: "row",
        flex: 1,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: "#0D948815",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    cardInfo: {
        flex: 1,
    },
    modelText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
    },
    plateText: {
        fontSize: 14,
        color: "#6B7280",
        marginTop: 2,
        marginBottom: 8,
    },
    ownerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    ownerLabel: {
        fontSize: 14,
        color: "#6B7280",
    },
    ownerName: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#111827",
    },
    badgeRow: {
        flexDirection: "row",
        gap: 8,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "600",
    },
    menuButton: {
        padding: 4,
    },
});
