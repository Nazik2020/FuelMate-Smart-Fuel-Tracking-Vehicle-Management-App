import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Pressable,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const StatCard = ({ title, value, icon, color, iconType = "Ionicons" }: any) => (
    <View style={styles.statCard}>
        <View style={[styles.iconContainer, { backgroundColor: color + "15" }]}>
            {iconType === "Ionicons" ? (
                <Ionicons name={icon} size={24} color={color} />
            ) : (
                <MaterialCommunityIcons name={icon} size={24} color={color} />
            )}
        </View>
        <Text style={styles.statLabel}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
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

    const weeklyData = [
        { value: 400, label: "Mon" },
        { value: 350, label: "Tue" },
        { value: 500, label: "Wed" },
        { value: 450, label: "Thu" },
        { value: 600, label: "Fri" },
        { value: 400, label: "Sat" },
        { value: 300, label: "Sun" },
    ];

    const monthlyData = [
        { value: 1200, label: "Jan" },
        { value: 1500, label: "Feb" },
        { value: 1100, label: "Mar" },
        { value: 1800, label: "Apr" },
        { value: 2100, label: "May" },
        { value: 1700, label: "Jun" },
        { value: 1900, label: "Jul" },
        { value: 2400, label: "Aug" },
        { value: 2000, label: "Sep" },
        { value: 2200, label: "Oct" },
        { value: 2500, label: "Nov" },
        { value: 2800, label: "Dec" },
    ];

    const currentData = activeTab === "This Week" ? weeklyData : monthlyData;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            {/* Header - Fixed/Sticky */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Admin Dashboard</Text>
                    <Text style={styles.headerSubtitle}>Overview & Analytics</Text>
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

            <ScrollView style={styles.container} contentContainerStyle={styles.content}>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <StatCard
                        title="Total Users"
                        value="1,482"
                        icon="people-outline"
                        color="#0D9488"
                    />
                    <StatCard
                        title="Total Vehicles"
                        value="2,150"
                        icon="car-outline"
                        color="#F59E0B"
                        iconType="MaterialCommunityIcons"
                    />
                    <StatCard
                        title="Active Alerts"
                        value="3"
                        icon="notifications-outline"
                        color="#EF4444"
                    />
                </View>

                {/* Chart Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Fuel Expense Overview</Text>

                    <View style={styles.tabRow}>
                        <TouchableOpacity
                            onPress={() => setActiveTab("This Week")}
                            style={[styles.tab, activeTab === "This Week" && styles.activeTab]}
                        >
                            <Text style={[styles.tabText, activeTab === "This Week" && styles.activeTabText]}>This Week</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveTab("This Month")}
                            style={[styles.tab, activeTab === "This Month" && styles.activeTab]}
                        >
                            <Text style={[styles.tabText, activeTab === "This Month" && styles.activeTabText]}>This Month</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.chartSubtitle}>
                        {activeTab === "This Week" ? "Weekly Fuel Expense" : "Monthly Fuel Expense"}
                    </Text>
                    <View style={styles.expenseRow}>
                        <Text style={styles.expenseValue}>
                            {activeTab === "This Week" ? "$1,250" : "$21,400"}
                        </Text>
                        <View style={styles.growthBadge}>
                            <Ionicons name="trending-up" size={14} color="#0D9488" />
                            <Text style={styles.growthText}>5.2%</Text>
                        </View>
                    </View>

                    <View style={styles.chartContainer}>
                        <LineChart
                            data={currentData}
                            width={width - 80}
                            height={160}
                            thickness={3}
                            color="#0D9488"
                            hideDataPoints
                            noOfSections={3}
                            yAxisThickness={0}
                            xAxisThickness={0}
                            hideRules
                            areaChart
                            startFillColor="#0D9488"
                            startOpacity={0.2}
                            endFillColor="#0D9488"
                            endOpacity={0.01}
                            pointerConfig={{
                                pointerStripColor: '#0D9488',
                                pointerStripWidth: 2,
                                pointerColor: '#0D9488',
                                radius: 6,
                            }}
                        />
                    </View>

                    <View style={styles.xAxis}>
                        {currentData.map(item => (
                            <Text key={item.label} style={[styles.xAxisLabel, activeTab === "This Month" && { fontSize: 8 }]}>
                                {item.label}
                            </Text>
                        ))}
                    </View>
                </View>

                {/* Recent Alerts Section */}
                <View style={styles.alertsContainer}>
                    <Text style={styles.sectionTitle}>Recent Alerts</Text>
                    <AlertCard
                        title="Vehicle XYZ"
                        time="2 hours ago"
                        icon="alert-circle-outline"
                        color="#F59E0B"
                    />
                    <AlertCard
                        title="New User Registration: J. Doe"
                        time="Yesterday"
                        icon="person-add-outline"
                        color="#0D9488"
                    />
                    <AlertCard
                        title="Expense Report Flagged"
                        time="2 days ago"
                        icon="flag-outline"
                        color="#EF4444"
                    />
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
});
