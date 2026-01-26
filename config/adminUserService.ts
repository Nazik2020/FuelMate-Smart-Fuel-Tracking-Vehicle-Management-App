/**
 * Admin User Service
 * Complete backend for Admin User Management
 */

import {
    collection,
    doc,
    getDocs,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";

// ==================== TYPES ====================

export type UserStatus = "Active" | "Inactive" | "Pending";

export interface AdminUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    status: UserStatus;
    createdAt: Date;
    photoURL?: string;
    lastLoginAt?: Date;
}

export interface UserStats {
    total: number;
    active: number;
    pending: number;
    inactive: number;
}

// ==================== SERVICE FUNCTIONS ====================

/**
 * Check if a user is an admin based on email or username
 */
const isAdminUser = (email?: string, username?: string): boolean => {
    const emailLower = (email || "").toLowerCase();
    const usernameLower = (username || "").toLowerCase();
    return emailLower.includes("admin") || usernameLower === "admin";
};

/**
 * Helper to check if date is older than 6 months
 */
const isInactive = (date?: Date): boolean => {
    if (!date) return true;
    // If no lastLoginAt, but recently created? check createdAt. 
    // Let's passed the date to check.
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return date < sixMonthsAgo;
};

/**
 * Get all users for admin management
 * COMPLETE FUNCTION WITH FULL LOGGING
 */
export async function getAllUsers(): Promise<AdminUser[]> {
    console.log("=== START getAllUsers ===");

    try {
        const currentUser = auth.currentUser;
        console.log("Current user:", currentUser?.email || "NOT LOGGED IN");

        if (!currentUser) {
            console.warn("⚠️ User not authenticated, returning empty array");
            return [];
        }

        console.log("👥 Fetching users from Firebase...");
        const snapshot = await getDocs(collection(db, "users"));
        console.log(`✅ Found ${snapshot.size} users`);

        if (snapshot.empty) {
            console.log("⚠️ No users found in database");
            return [];
        }

        const users: AdminUser[] = snapshot.docs
            .map((docSnap) => {
                const data = docSnap.data();
                const createdAt =
                    data.createdAt instanceof Timestamp
                        ? data.createdAt.toDate()
                        : data.createdAt
                            ? new Date(data.createdAt)
                            : new Date();

                const lastLoginAt =
                    data.lastLoginAt instanceof Timestamp
                        ? data.lastLoginAt.toDate()
                        : data.lastLoginAt
                            ? new Date(data.lastLoginAt)
                            : undefined;

                // Determine calculated status based on 6-month rule
                let status = (data.status as UserStatus) || "Active";

                // If user is conceptually active/pending but hasn't logged in for 6 months
                const referenceDate = lastLoginAt || createdAt;
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

                if (status !== "Inactive" && referenceDate < sixMonthsAgo) {
                    status = "Inactive";
                }

                return {
                    id: docSnap.id,
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    username: data.username || "",
                    status: status,
                    createdAt,
                    photoURL: data.photoURL,
                    lastLoginAt
                };
            })
            // Filter out admin users and current user
            .filter(user => user.id !== currentUser?.uid && !isAdminUser(user.email, user.username));

        users.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        console.log(`✅ Returning ${users.length} users (excluding admins)`);
        console.log("=== END getAllUsers ===\n");

        return users;

    } catch (error: any) {
        console.error("❌ ERROR in getAllUsers:", error?.message);
        if (error?.code === "permission-denied") {
            console.error("🔒 PERMISSION DENIED - Check Firebase rules!");
        }
        return [];
    }
}

/**
 * Get user statistics
 */
export async function getUserStats(): Promise<UserStats> {
    console.log("=== START getUserStats ===");

    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            console.warn("⚠️ User not authenticated");
            return { total: 0, active: 0, pending: 0, inactive: 0 };
        }

        const snapshot = await getDocs(collection(db, "users"));
        console.log(`📊 Stats from ${snapshot.size} users`);

        let total = 0;
        let active = 0;
        let pending = 0;
        let inactive = 0;

        snapshot.docs.forEach((docSnap) => {
            const data = docSnap.data();

            // Skip current user (admin) and potential other admin accounts
            if (docSnap.id === currentUser.uid || isAdminUser(data.email, data.username)) {
                return;
            }
            total++;

            let status = (data.status as UserStatus) || "Active";

            const createdAt =
                data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : data.createdAt
                        ? new Date(data.createdAt)
                        : new Date();

            const lastLoginAt =
                data.lastLoginAt instanceof Timestamp
                    ? data.lastLoginAt.toDate()
                    : data.lastLoginAt
                        ? new Date(data.lastLoginAt)
                        : undefined;

            const referenceDate = lastLoginAt || createdAt;
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            if (status !== "Inactive" && referenceDate < sixMonthsAgo) {
                status = "Inactive";
            }

            if (status === "Active") active++;
            else if (status === "Pending") pending++;
            else if (status === "Inactive") inactive++;
        });

        const stats = { total, active, pending, inactive };
        console.log("Stats:", stats);
        console.log("=== END getUserStats ===\n");

        return stats;

    } catch (error: any) {
        console.error("❌ ERROR in getUserStats:", error?.message);
        return { total: 0, active: 0, pending: 0, inactive: 0 };
    }
}

/**
 * Search users by name or email
 */
export async function searchUsers(searchQuery: string): Promise<AdminUser[]> {
    try {
        const allUsers = await getAllUsers();
        const query = searchQuery.toLowerCase().trim();

        if (!query) return allUsers;

        return allUsers.filter(
            (user) =>
                user.firstName.toLowerCase().includes(query) ||
                user.lastName.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.username.toLowerCase().includes(query) ||
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(query)
        );
    } catch (error) {
        console.error("Error searching users:", error);
        return [];
    }
}

/**
 * Update user status
 */
export async function updateUserStatus(
    userId: string,
    status: UserStatus
): Promise<void> {
    try {
        await updateDoc(doc(db, "users", userId), {
            status,
            updatedAt: Timestamp.now(),
        });
        console.log(`✅ Updated user ${userId} status to ${status}`);
    } catch (error: any) {
        console.error("❌ Error updating user status:", error?.message);
        throw error;
    }
}

/**
 * Get user display name
 */
export function getUserDisplayName(user: AdminUser): string {
    if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
    }
    return user.username || user.email || "Unknown User";
}
