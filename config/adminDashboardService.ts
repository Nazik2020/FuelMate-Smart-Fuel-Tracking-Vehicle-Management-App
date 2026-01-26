/**
 * Admin Dashboard Service
 * Complete backend for Admin Overview & Analytics
 */

import {
    collection,
    getDocs,
    Timestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";

// ==================== TYPES ====================

export interface AdminStats {
    totalUsers: number;
    totalVehicles: number;
    activeAlerts: number;
}

export interface FuelExpenseData {
    label: string;
    value: number;
}

export interface AdminAlert {
    id: string;
    title: string;
    time: string;
    type: "vehicle" | "user" | "expense";
    createdAt: Date;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Check if a user is an admin based on email or username
 */
const isAdminUser = (email?: string, username?: string): boolean => {
    const emailLower = (email || "").toLowerCase();
    const usernameLower = (username || "").toLowerCase();
    return emailLower.includes("admin") || usernameLower === "admin";
};

const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
};

// ==================== SERVICE FUNCTIONS ====================

/**
 * Get admin dashboard statistics
 * COMPLETE FUNCTION WITH FULL LOGGING
 */
export async function getAdminStats(): Promise<AdminStats> {
    console.log("=== START getAdminStats ===");

    try {
        const currentUser = auth.currentUser;
        console.log("Current user:", currentUser?.email || "NOT LOGGED IN");

        if (!currentUser) {
            console.warn("⚠️ User not authenticated");
            return { totalUsers: 0, totalVehicles: 0, activeAlerts: 0 };
        }

        console.log("📊 Fetching dashboard stats...");

        const usersSnapshot = await getDocs(collection(db, "users"));
        // Filter out admin users from count
        const nonAdminUsers = usersSnapshot.docs.filter((docSnap) => {
            const data = docSnap.data();
            return !isAdminUser(data.email, data.username);
        });
        const totalUsers = nonAdminUsers.length;
        console.log(`  Users (excluding admins): ${totalUsers}`);

        const vehiclesSnapshot = await getDocs(collection(db, "vehicles"));
        const totalVehicles = vehiclesSnapshot.size;
        console.log(`  Vehicles: ${totalVehicles}`);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        let activeAlerts = 0;
        nonAdminUsers.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.createdAt) {
                const createdAt = data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : new Date(data.createdAt);
                if (createdAt >= sevenDaysAgo) {
                    activeAlerts++;
                }
            }
        });
        console.log(`  Active Alerts: ${activeAlerts}`);

        const stats = { totalUsers, totalVehicles, activeAlerts };
        console.log("=== END getAdminStats ===\n");

        return stats;

    } catch (error: any) {
        console.error("❌ ERROR in getAdminStats:", error?.message);
        return { totalUsers: 0, totalVehicles: 0, activeAlerts: 0 };
    }
}

/**
 * Get fuel expense overview for week or month
 */
export async function getFuelExpenseOverview(period: "week" | "month"): Promise<{ data: FuelExpenseData[]; total: number }> {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) return { data: [], total: 0 };

        const fuelLogsSnapshot = await getDocs(collection(db, "fuelLogs"));
        const now = new Date();
        const data: { [key: string]: number } = {};
        let total = 0;

        if (period === "week") {
            // Last 7 days
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const dayKey = days[date.getDay()];
                data[dayKey] = 0;
            }

            fuelLogsSnapshot.docs.forEach((docSnap) => {
                const logData = docSnap.data();
                if (logData.date && logData.totalCost) {
                    const date = logData.date instanceof Timestamp
                        ? logData.date.toDate()
                        : new Date(logData.date);
                    const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
                    if (daysDiff <= 6) {
                        const dayKey = days[date.getDay()];
                        const cost = Number(logData.totalCost);
                        data[dayKey] = (data[dayKey] || 0) + cost;
                        total += cost;
                    }
                }
            });

            return {
                data: days.map(day => ({ label: day, value: Math.round(data[day] || 0) })),
                total: Math.round(total)
            };
        } else {
            // Last 6 months
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            fuelLogsSnapshot.docs.forEach((docSnap) => {
                const logData = docSnap.data();
                if (logData.date && logData.totalCost) {
                    const date = logData.date instanceof Timestamp
                        ? logData.date.toDate()
                        : new Date(logData.date);
                    const monthKey = months[date.getMonth()];
                    const cost = Number(logData.totalCost);
                    data[monthKey] = (data[monthKey] || 0) + cost;
                    total += cost;
                }
            });

            const currentMonth = now.getMonth();
            const result: FuelExpenseData[] = [];
            for (let i = 5; i >= 0; i--) {
                const monthIndex = (currentMonth - i + 12) % 12;
                const monthLabel = months[monthIndex];
                result.push({
                    label: monthLabel,
                    value: Math.round(data[monthLabel] || 0),
                });
            }

            return { data: result, total: Math.round(total) };
        }
    } catch (error) {
        console.error("Error fetching fuel expense overview:", error);
        return { data: [], total: 0 };
    }
}

/**
 * Get monthly fuel expense data for charts
 */
export async function getMonthlyFuelExpenses(): Promise<FuelExpenseData[]> {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) return [];

        const fuelLogsSnapshot = await getDocs(collection(db, "fuelLogs"));
        const monthlyData: { [key: string]: number } = {};
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        fuelLogsSnapshot.docs.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.date && data.totalCost) {
                const date = data.date instanceof Timestamp
                    ? data.date.toDate()
                    : new Date(data.date);
                const monthKey = months[date.getMonth()];
                monthlyData[monthKey] = (monthlyData[monthKey] || 0) + Number(data.totalCost);
            }
        });

        const currentMonth = new Date().getMonth();
        const result: FuelExpenseData[] = [];
        for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            const monthLabel = months[monthIndex];
            result.push({
                label: monthLabel,
                value: Math.round(monthlyData[monthLabel] || 0),
            });
        }

        return result;
    } catch (error) {
        console.error("Error fetching fuel expenses:", error);
        return [];
    }
}

/**
 * Get recent admin alerts
 */
export async function getRecentAlerts(): Promise<AdminAlert[]> {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) return [];

        const alerts: AdminAlert[] = [];
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const usersSnapshot = await getDocs(collection(db, "users"));
        usersSnapshot.docs.forEach((docSnap) => {
            const data = docSnap.data();
            // Skip admin users from alerts
            if (isAdminUser(data.email, data.username)) {
                return;
            }
            if (data.createdAt) {
                const createdAt = data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : new Date(data.createdAt);
                if (createdAt >= sevenDaysAgo) {
                    alerts.push({
                        id: docSnap.id,
                        title: `New user registered: ${data.firstName || data.username || data.email}`,
                        time: formatRelativeTime(createdAt),
                        type: "user",
                        createdAt,
                    });
                }
            }
        });

        const vehiclesSnapshot = await getDocs(collection(db, "vehicles"));
        vehiclesSnapshot.docs.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.createdAt) {
                const createdAt = data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : new Date(data.createdAt);
                if (createdAt >= sevenDaysAgo) {
                    alerts.push({
                        id: docSnap.id,
                        title: `New vehicle added: ${data.make || ""} ${data.model || ""}`.trim() || "Unknown",
                        time: formatRelativeTime(createdAt),
                        type: "vehicle",
                        createdAt,
                    });
                }
            }
        });

        return alerts
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 10);
    } catch (error) {
        console.error("Error fetching alerts:", error);
        return [];
    }
}
