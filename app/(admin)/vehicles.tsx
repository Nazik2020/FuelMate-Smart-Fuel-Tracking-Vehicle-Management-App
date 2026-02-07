import {
    AdminVehicle,
    getAllVehiclesWithOwners,
    getVehicleStats,
    VehicleStats
} from "@/config/adminVehicleService";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const StatCard = ({ label, value, color, loading = false }: any) => (
    <View style={styles.statCard}>
        {loading ? (
            <ActivityIndicator size="small" color={color} />
        ) : (
            <Text style={[styles.statValue, { color }]}>{value}</Text>
        )}
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const VehicleDetailsModal = ({ vehicle, visible, onClose }: { vehicle: AdminVehicle | null; visible: boolean; onClose: () => void }) => {
    if (!vehicle) return null;

    const items = [
        { label: "Make", value: vehicle.make },
        { label: "Model", value: vehicle.model },
        { label: "Year", value: vehicle.year },
        { label: "License Plate", value: vehicle.licensePlate },
        { label: "Fuel Type", value: vehicle.fuelType },
        { label: "Vehicle Type", value: vehicle.vehicleType },
        { label: "Owner", value: vehicle.ownerName },
        { label: "Status", value: vehicle.status, isStatus: true },
    ];

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Vehicle Details</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.detailsList}>
                        {items.map((item, index) => (
                            <View key={index} style={styles.detailItem}>
                                <Text style={styles.detailLabel}>{item.label}</Text>
                                {item.isStatus ? (
                                    <View style={[styles.badge, {
                                        backgroundColor: item.value === "Active" ? "#0D948815" : "#F59E0B15",
                                        marginTop: 0
                                    }]}>
                                        <Text style={[styles.badgeText, {
                                            color: item.value === "Active" ? "#0D9488" : "#F59E0B"
                                        }]}>
                                            {item.value}
                                        </Text>
                                    </View>
                                ) : (
                                    <Text style={styles.detailValue}>{item.value || "N/A"}</Text>
                                )}
                            </View>
                        ))}
                    </View>

                    <View style={styles.modalFooter}>
                        <Text style={styles.modalFooterText}>
                            Registered on {vehicle.createdAt ? new Date(vehicle.createdAt).toLocaleDateString() : 'Unknown'}
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const VehicleCard = ({ vehicle, onPress }: { vehicle: AdminVehicle; onPress: () => void }) => {
    const statusColor = vehicle.status === "Active" ? "#0D9488" : "#F59E0B";
    const fuelColor = vehicle.fuelType === "Electric" ? "#0D9488" : "#F59E0B";

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.cardLeft}>
                <View style={styles.iconBox}>
                    <MaterialCommunityIcons name="car-outline" size={24} color="#0D9488" />
                </View>
                <View style={styles.cardInfo}>
                    <Text style={styles.modelText}>{vehicle.name}</Text>
                    <Text style={styles.plateText}>{vehicle.licensePlate}</Text>
                    <View style={styles.ownerRow}>
                        <Text style={styles.ownerLabel}>Owner: </Text>
                        <Text style={styles.ownerName}>{vehicle.ownerName}</Text>
                    </View>
                    <View style={styles.badgeRow}>
                        <View style={[styles.badge, { backgroundColor: fuelColor + "15" }]}>
                            <Text style={[styles.badgeText, { color: fuelColor }]}>{vehicle.fuelType}</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: statusColor + "15" }]}>
                            <Text style={[styles.badgeText, { color: statusColor }]}>{vehicle.status}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function VehicleManagement() {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
    const [stats, setStats] = useState<VehicleStats>({ total: 0, active: 0, inactive: 0 });
    const [vehiclesToShow, setVehiclesToShow] = useState(7); // Show 7 initially
    const [selectedVehicle, setSelectedVehicle] = useState<AdminVehicle | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            setLoading(true);
            const [vehiclesData, statsData] = await Promise.all([
                getAllVehiclesWithOwners(),
                getVehicleStats(),
            ]);
            setVehicles(vehiclesData);
            setStats(statsData);
        } catch (error) {
            Alert.alert("Error", "Failed to load vehicles");
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMoreVehicles = () => {
        setVehiclesToShow(prev => prev + 7);
    };

    const handleVehiclePress = (vehicle: AdminVehicle) => {
        setSelectedVehicle(vehicle);
        setModalVisible(true);
    };

    // Filter vehicles based on search
    const filteredVehicles = vehicles.filter(vehicle => {
        if (search.trim()) {
            const query = search.toLowerCase();
            return (
                vehicle.name.toLowerCase().includes(query) ||
                vehicle.licensePlate.toLowerCase().includes(query) ||
                vehicle.make.toLowerCase().includes(query) ||
                vehicle.model.toLowerCase().includes(query) ||
                vehicle.ownerName.toLowerCase().includes(query)
            );
        }
        return true;
    });

    // Pagination
    const visibleVehicles = filteredVehicles.slice(0, vehiclesToShow);
    const hasMoreVehicles = vehiclesToShow < filteredVehicles.length;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Vehicle Management</Text>
                    <Text style={styles.headerSubtitle}>Manage all vehicles</Text>
                </View>
            </View>

            <FlatList
                data={visibleVehicles}
                keyExtractor={(item) => item.id}
                style={styles.container}
                contentContainerStyle={styles.content}
                ListHeaderComponent={
                    <>
                        {/* Stats Summary */}
                        <View style={styles.statsRow}>
                            <StatCard label="Active" value={stats.active} color="#0D9488" loading={loading} />
                            <StatCard label="Inactive" value={stats.inactive} color="#F59E0B" loading={loading} />
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
                    <VehicleCard vehicle={item} onPress={() => handleVehiclePress(item)} />
                )}
                ListEmptyComponent={
                    loading ? (
                        <ActivityIndicator size="large" color="#0D9488" style={{ marginTop: 40 }} />
                    ) : (
                        <Text style={styles.emptyText}>No vehicles found</Text>
                    )
                }
                ListFooterComponent={
                    !loading && hasMoreVehicles ? (
                        <TouchableOpacity
                            style={styles.loadMoreButton}
                            onPress={handleLoadMoreVehicles}
                        >
                            <Ionicons name="chevron-down-circle-outline" size={20} color="#0D9488" />
                            <Text style={styles.loadMoreText}>
                                Load More
                            </Text>
                        </TouchableOpacity>
                    ) : null
                }
            />

            <VehicleDetailsModal
                vehicle={selectedVehicle}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
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
    menuDropdown: {
        position: "absolute",
        right: 40,
        top: 40,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        zIndex: 100,
        minWidth: 140,
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    menuItemText: {
        fontSize: 14,
        fontWeight: "600",
    },
    emptyText: {
        textAlign: "center",
        color: "#6B7280",
        fontSize: 16,
        marginTop: 40,
    },
    loadMoreButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E0F2F1",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 16,
        marginTop: 12,
        gap: 8,
    },
    loadMoreText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#0D9488",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 24,
        width: "100%",
        maxWidth: 400,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
    },
    detailsList: {
        gap: 16,
    },
    detailItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    detailLabel: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "500",
    },
    detailValue: {
        fontSize: 15,
        color: "#111827",
        fontWeight: "600",
        textAlign: "right",
    },
    modalFooter: {
        marginTop: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
    },
    modalFooterText: {
        fontSize: 12,
        color: "#9CA3AF",
        textAlign: "center",
    },
});
