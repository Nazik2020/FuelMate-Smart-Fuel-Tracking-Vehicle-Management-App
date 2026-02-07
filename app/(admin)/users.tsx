import {
    AdminUser,
    UserStats,
    getAllUsers,
    getUserDisplayName,
    getUserStats
} from "@/config/adminUserService";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Modal,
    Pressable,
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

// User Details Modal Component (Read-only)
const UserDetailsModal = ({
    visible,
    user,
    onClose,
}: {
    visible: boolean;
    user: AdminUser | null;
    onClose: () => void;
}) => {
    if (!user) return null;

    const statusColor =
        user.status === "Active" ? "#0D9488" :
            user.status === "Pending" ? "#F59E0B" : "#EF4444";

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>User Details</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* User Avatar & Name */}
                    <View style={styles.modalUserInfo}>
                        <View style={styles.modalAvatar}>
                            <Ionicons name="person" size={40} color="#0D9488" />
                        </View>
                        <Text style={styles.modalUserName}>{getUserDisplayName(user)}</Text>
                        <View style={[styles.modalStatusBadge, { backgroundColor: statusColor + "15" }]}>
                            <Text style={[styles.modalStatusText, { color: statusColor }]}>{user.status}</Text>
                        </View>
                    </View>

                    {/* User Details */}
                    <View style={styles.modalDetails}>
                        <View style={styles.detailRow}>
                            <Ionicons name="mail-outline" size={20} color="#6B7280" />
                            <Text style={styles.detailLabel}>Email</Text>
                            <Text style={styles.detailValue}>{user.email}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Ionicons name="person-outline" size={20} color="#6B7280" />
                            <Text style={styles.detailLabel}>Username</Text>
                            <Text style={styles.detailValue}>{user.username || "N/A"}</Text>
                        </View>
                        <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                            <Text style={styles.detailLabel}>Joined</Text>
                            <Text style={styles.detailValue}>
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                            </Text>
                        </View>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};


const UserRow = ({ user, onPress }: { user: AdminUser; onPress: () => void }) => {
    const statusColor =
        user.status === "Active" ? "#0D9488" :
            user.status === "Pending" ? "#F59E0B" : "#EF4444";

    const statusBg = statusColor + "15";

    return (
        <TouchableOpacity style={styles.userCard} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.avatar}>
                <Ionicons name="person-outline" size={24} color="#0D9488" />
            </View>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{getUserDisplayName(user)}</Text>
                <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>{user.status}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
    );
};


export default function UserManagement() {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [stats, setStats] = useState<UserStats>({ total: 0, active: 0, pending: 0, inactive: 0 });
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [usersToShow, setUsersToShow] = useState(7); // Show 7 initially

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const [usersData, statsData] = await Promise.all([
                getAllUsers(),
                getUserStats(),
            ]);
            setUsers(usersData);
            setStats(statsData);
        } catch (error) {
            Alert.alert("Error", "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMoreUsers = () => {
        setUsersToShow(prev => prev + 7);
    };

    // Filter users based on search
    const filteredUsers = users.filter(user => {
        // Apply search filter
        if (search.trim()) {
            const query = search.toLowerCase();
            return (
                user.firstName.toLowerCase().includes(query) ||
                user.lastName.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.username.toLowerCase().includes(query)
            );
        }
        return true;
    });

    // Pagination
    const visibleUsers = filteredUsers.slice(0, usersToShow);
    const hasMoreUsers = usersToShow < filteredUsers.length;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            {/* Header - Fixed */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>User Management</Text>
                    <Text style={styles.headerSubtitle}>Manage all users</Text>
                </View>
            </View>

            <FlatList
                data={visibleUsers}
                keyExtractor={(item) => item.id}
                style={styles.container}
                contentContainerStyle={styles.content}
                ListHeaderComponent={
                    <>
                        {/* Stats Summary */}
                        <View style={styles.statsRow}>
                            <StatCard label="Total" value={stats.total} color="#111827" loading={loading} />
                            <StatCard label="Active" value={stats.active} color="#0D9488" loading={loading} />
                            <StatCard label="Inactive" value={stats.inactive} color="#EF4444" loading={loading} />
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
                        user={item}
                        onPress={() => {
                            setSelectedUser(item);
                            setModalVisible(true);
                        }}
                    />
                )}
                ListEmptyComponent={
                    loading ? (
                        <ActivityIndicator size="large" color="#0D9488" style={{ marginTop: 40 }} />
                    ) : (
                        <Text style={styles.emptyText}>No users found</Text>
                    )
                }
                ListFooterComponent={
                    !loading && hasMoreUsers ? (
                        <TouchableOpacity
                            style={styles.loadMoreButton}
                            onPress={handleLoadMoreUsers}
                        >
                            <Ionicons name="chevron-down-circle-outline" size={20} color="#0D9488" />
                            <Text style={styles.loadMoreText}>
                                Load More
                            </Text>
                        </TouchableOpacity>
                    ) : null
                }
            />

            {/* User Details Modal */}
            <UserDetailsModal
                visible={modalVisible}
                user={selectedUser}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedUser(null);
                }}
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
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 16,
        paddingVertical: 8,
    },
    filterText: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "500",
    },
    emptyText: {
        textAlign: "center",
        color: "#6B7280",
        fontSize: 16,
        marginTop: 40,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 24,
        width: "100%",
        maxWidth: 400,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
    },
    modalUserInfo: {
        alignItems: "center",
        marginBottom: 24,
    },
    modalAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#0D948815",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    modalUserName: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 8,
    },
    modalStatusBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
    },
    modalStatusText: {
        fontSize: 14,
        fontWeight: "600",
    },
    modalDetails: {
        backgroundColor: "#F9FAFB",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    detailLabel: {
        fontSize: 14,
        color: "#6B7280",
        marginLeft: 12,
        width: 80,
    },
    detailValue: {
        flex: 1,
        fontSize: 14,
        color: "#111827",
        fontWeight: "500",
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 12,
    },
    statusActions: {
        flexDirection: "row",
        gap: 10,
    },
    statusButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
    },
    statusButtonText: {
        fontSize: 14,
        fontWeight: "600",
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
