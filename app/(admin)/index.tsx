import {
    AdminAlert,
    AdminStats,
    FuelExpenseData,
    getAdminStats,
    getFuelExpenseOverview,
    getRecentAlerts,
} from "@/config/adminDashboardService";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const StatCard = ({ title, value, icon, color, iconType = "Ionicons", loading = false }: any) => (
    <View style={styles.statCard}>
        <View style={[styles.iconContainer, { backgroundColor: color + "15" }]}>
            {iconType === "Ionicons" ? (
                <Ionicons name={icon} size={24} color={color} />
            ) : (
                <MaterialCommunityIcons name={icon} size={24} color={color} />
            )}
        </View>
        <Text style={styles.statLabel}>{title}</Text>
        {loading ? (
            <ActivityIndicator size="small" color={color} />
        ) : (
            <Text style={styles.statValue}>{value}</Text>
        )}
    </View>
);

const AlertCard = ({ title, time, icon, color }: any) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Pressable
            onPressIn={() => setIsHovered(true)}
            onPressOut={() => setIsHovered(false)}
            style={[
                styles.alertCard,
                isHovered && styles.alertCardHovered
            ]}
        >
            <View style={[styles.alertIconBox, { backgroundColor: color + "15" }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>{title}</Text>
                <Text style={styles.alertTime}>{time}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </Pressable>
    );
};

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("This Week");
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, totalVehicles: 0, activeAlerts: 0 });
    const [weeklyData, setWeeklyData] = useState<FuelExpenseData[]>([]);
    const [monthlyData, setMonthlyData] = useState<FuelExpenseData[]>([]);
    const [weeklyTotal, setWeeklyTotal] = useState(0);
    const [monthlyTotal, setMonthlyTotal] = useState(0);
    const [alerts, setAlerts] = useState<AdminAlert[]>([]);
    const [alertsToShow, setAlertsToShow] = useState(7); // Show 7 initially

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch all data in parallel
            const [statsData, weeklyExpense, monthlyExpense, alertsData] = await Promise.all([
                getAdminStats(),
                getFuelExpenseOverview("week"),
                getFuelExpenseOverview("month"),
                getRecentAlerts(),
            ]);

            setStats(statsData);
            setWeeklyData(weeklyExpense.data);
            setWeeklyTotal(weeklyExpense.total);
            setMonthlyData(monthlyExpense.data);
            setMonthlyTotal(monthlyExpense.total);
            setAlerts(alertsData);
        } catch (error) {
            // Error loading dashboard data
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMoreAlerts = () => {
        setAlertsToShow(prev => prev + 7);
    };

    const currentData = activeTab === "This Week" ? weeklyData : monthlyData;
    const currentTotal = activeTab === "This Week" ? weeklyTotal : monthlyTotal;

    const getAlertIcon = (type: string) => {
        switch (type) {
            case "vehicle": return "alert-circle-outline";
            case "user": return "person-add-outline";
            case "expense": return "flag-outline";
            default: return "notifications-outline";
        }
    };

    const getAlertColor = (type: string) => {
        switch (type) {
            case "vehicle": return "#F59E0B";
            case "user": return "#0D9488";
            case "expense": return "#EF4444";
            default: return "#6B7280";
        }
    };

    const visibleAlerts = alerts.slice(0, alertsToShow);
    const hasMoreAlerts = alertsToShow < alerts.length;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            {/* Header - Fixed/Sticky */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Admin Dashboard</Text>
                    <Text style={styles.headerSubtitle}>Overview & Analytics</Text>
                </View>
            </View>

            <ScrollView style={styles.container} contentContainerStyle={styles.content}>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers.toLocaleString()}
                        icon="people-outline"
                        color="#0D9488"
                        loading={loading}
                    />
                    <StatCard
                        title="Total Vehicles"
                        value={stats.totalVehicles.toLocaleString()}
                        icon="car-outline"
                        color="#F59E0B"
                        iconType="MaterialCommunityIcons"
                        loading={loading}
                    />
                    <StatCard
                        title="Active Alerts"
                        value={stats.activeAlerts.toString()}
                        icon="notifications-outline"
                        color="#EF4444"
                        loading={loading}
                    />
                </View>

                {/* Chart Section Removed as per request */}

                {/* Recent Alerts Section */}
                <View style={styles.alertsContainer}>
                    <Text style={styles.sectionTitle}>Recent Alerts</Text>
                    {loading ? (
                        <ActivityIndicator size="large" color="#0D9488" style={{ marginTop: 20 }} />
                    ) : alerts.length === 0 ? (
                        <Text style={{ color: "#6B7280", textAlign: "center", marginTop: 20 }}>No recent alerts</Text>
                    ) : (
                        <>
                            {visibleAlerts.map((alert) => (
                                <AlertCard
                                    key={alert.id}
                                    title={alert.title}
                                    time={alert.time}
                                    icon={getAlertIcon(alert.type)}
                                    color={getAlertColor(alert.type)}
                                />
                            ))}
                            {hasMoreAlerts && (
                                <TouchableOpacity
                                    style={styles.loadMoreButton}
                                    onPress={handleLoadMoreAlerts}
                                >
                                    <Ionicons name="chevron-down-circle-outline" size={20} color="#0D9488" />
                                    <Text style={styles.loadMoreText}>
                                        Load More
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    content: {
        paddingBottom: 32,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6", // Very light gray line
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
    statsRow: {
        flexDirection: "row",
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 20,
        marginTop: 10,
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
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    statLabel: {
        fontSize: 11,
        color: "#6B7280",
        fontWeight: "600",
        marginBottom: 4,
        textAlign: "center",
    },
    statValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
    },
    section: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 16,
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 3,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 16,
    },
    tabRow: {
        flexDirection: "row",
        gap: 20,
        marginBottom: 20,
    },
    tab: {
        paddingBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
    },
    activeTab: {
        borderBottomColor: "#0D9488",
    },
    tabText: {
        fontSize: 16,
        color: "#6B7280",
        fontWeight: "500",
    },
    activeTabText: {
        color: "#0D9488",
        fontWeight: "600",
    },
    chartSubtitle: {
        fontSize: 12,
        color: "#6B7280",
        marginBottom: 8,
    },
    expenseRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 24,
    },
    expenseValue: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#111827",
    },
    growthBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0D948815",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 4,
    },
    growthText: {
        fontSize: 12,
        color: "#0D9488",
        fontWeight: "bold",
    },
    chartContainer: {
        height: 180,
        marginTop: 10,
        marginLeft: -20,
    },
    xAxis: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 4,
        marginTop: 10,
    },
    xAxisLabel: {
        fontSize: 10,
        color: "#9CA3AF",
    },
    alertsContainer: {
        paddingHorizontal: 16,
        gap: 12,
    },
    alertCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 2,
    },
    alertCardHovered: {
        backgroundColor: "#FFFFFF",
        transform: [{ scale: 1.05 }], // Noticeable pop-up scale
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 8,
        zIndex: 10,
    },
    alertIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    alertContent: {
        flex: 1,
    },
    alertTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 2,
    },
    alertTime: {
        fontSize: 12,
        color: "#6B7280",
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
});
