/**
 * Notification Service
 * Complete backend for managing user notifications
 */

import * as Notifications from "expo-notifications";
import {
    addDoc,
    collection,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where,
    writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

// ==================== TYPES ====================

export type NotificationType = "welcome" | "fuel_price" | "service" | "warning" | "custom";

export interface Notification {
    id: string;
    userId: string;              // Recipient user ID (or "all" for broadcast)
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    icon?: string;               // Optional custom icon
    iconColor?: string;          // Optional custom color
}

export interface CreateNotificationData {
    type: NotificationType;
    title: string;
    message: string;
    icon?: string;
    iconColor?: string;
}

// ==================== SERVICE FUNCTIONS ====================

/**
 * Create a welcome notification for a new user
 */
export async function createWelcomeNotification(
    userId: string,
    userName: string
): Promise<void> {
    try {
        console.log(`📧 Creating welcome notification for user: ${userId}`);

        await addDoc(collection(db, "notifications"), {
            userId,
            type: "welcome",
            title: `Welcome to FuelMate, ${userName}!`,
            message: "We're excited to have you on board. Start tracking your fuel expenses and managing your vehicles efficiently.",
            isRead: false,
            createdAt: Timestamp.now(),
            icon: "hand-wave-outline",
            iconColor: "#0D9488",
        });

        console.log("✅ Welcome notification created successfully");
    } catch (error) {
        console.error("❌ Error creating welcome notification:", error);
        throw error;
    }
}

/**
 * Send a notification to a specific user
 */
export async function sendNotificationToUser(
    userId: string,
    notificationData: CreateNotificationData
): Promise<void> {
    try {
        console.log(`📧 Sending notification to user: ${userId}`);

        const notificationDoc: any = {
            userId,
            type: notificationData.type,
            title: notificationData.title,
            message: notificationData.message,
            isRead: false,
            createdAt: Timestamp.now(),
        };

        // Only include optional fields if they are defined
        if (notificationData.icon) {
            notificationDoc.icon = notificationData.icon;
        }
        if (notificationData.iconColor) {
            notificationDoc.iconColor = notificationData.iconColor;
        }

        await addDoc(collection(db, "notifications"), notificationDoc);

        console.log("✅ Notification sent successfully");
    } catch (error) {
        console.error("❌ Error sending notification:", error);
        throw error;
    }
}

/**
 * Send a notification to all users (broadcast)
 */
export async function sendNotificationToAll(
    notificationData: CreateNotificationData
): Promise<void> {
    try {
        console.log("📧 Sending notification to ALL users");

        // Get all users
        const usersSnapshot = await getDocs(collection(db, "users"));
        const batch = writeBatch(db);
        const notificationsRef = collection(db, "notifications");

        // Create notification for each user
        let count = 0;
        usersSnapshot.docs.forEach((userDoc) => {
            const notifRef = doc(notificationsRef);
            const notificationDoc: any = {
                userId: userDoc.id,
                type: notificationData.type,
                title: notificationData.title,
                message: notificationData.message,
                isRead: false,
                createdAt: Timestamp.now(),
            };

            // Only include optional fields if they are defined
            if (notificationData.icon) {
                notificationDoc.icon = notificationData.icon;
            }
            if (notificationData.iconColor) {
                notificationDoc.iconColor = notificationData.iconColor;
            }

            batch.set(notifRef, notificationDoc);
            count++;
        });

        await batch.commit();
        console.log(`✅ Notification sent to ${count} users`);
    } catch (error) {
        console.error("❌ Error sending notification to all:", error);
        throw error;
    }
}

/**
 * Get all notifications for a user
 */
export async function getUserNotifications(userId: string): Promise<Notification[]> {
    try {
        console.log(`📬 Fetching notifications for user: ${userId}`);

        const q = query(
            collection(db, "notifications"),
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const notifications: Notification[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                type: data.type as NotificationType,
                title: data.title,
                message: data.message,
                isRead: data.isRead || false,
                createdAt: data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : new Date(data.createdAt),
                icon: data.icon,
                iconColor: data.iconColor,
            };
        });

        console.log(`✅ Found ${notifications.length} notifications`);
        return notifications;
    } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        return [];
    }
}

/**
 * Subscribe to real-time notifications for a user
 */
export function subscribeToNotifications(
    userId: string,
    callback: (notifications: Notification[]) => void
): () => void {
    console.log(`🔔 Subscribing to notifications for user: ${userId}`);

    const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifications: Notification[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                type: data.type as NotificationType,
                title: data.title,
                message: data.message,
                isRead: data.isRead || false,
                createdAt: data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : new Date(data.createdAt),
                icon: data.icon,
                iconColor: data.iconColor,
            };
        });

        console.log(`✅ Received ${notifications.length} notifications (real-time)`);
        callback(notifications);
    });

    return unsubscribe;
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notificationId: string): Promise<void> {
    try {
        const notifRef = doc(db, "notifications", notificationId);
        await updateDoc(notifRef, {
            isRead: true,
        });
        console.log(`✅ Notification ${notificationId} marked as read`);
    } catch (error) {
        console.error("❌ Error marking notification as read:", error);
        throw error;
    }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string): Promise<void> {
    try {
        console.log(`📬 Marking all notifications as read for user: ${userId}`);

        const q = query(
            collection(db, "notifications"),
            where("userId", "==", userId),
            where("isRead", "==", false)
        );

        const snapshot = await getDocs(q);
        const batch = writeBatch(db);

        snapshot.docs.forEach((docSnap) => {
            batch.update(docSnap.ref, { isRead: true });
        });

        await batch.commit();
        console.log(`✅ Marked ${snapshot.size} notifications as read`);
    } catch (error) {
        console.error("❌ Error marking all as read:", error);
        throw error;
    }
}
/**
 * Request notification permissions
 */
export async function requestPermissions(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        return newStatus === "granted";
    }
    return true;
}

/**
 * Schedule a local notification for a task
 */
export async function scheduleTaskNotification(
    title: string,
    body: string,
    date: Date
): Promise<void> {
    try {
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
            console.log("❌ Notification permissions not granted");
            return;
        }

        // Default to 9:00 AM on the due date
        const triggerDate = new Date(date);
        triggerDate.setHours(9, 0, 0, 0);

        // If the date is already passed today (e.g. creating task at 10 AM for today),
        // schedule for 1 hour from now or just let it fire immediately if using date trigger?
        // For simplicity, if it's in the past, we don't schedule or schedule for next year?
        // Let's assume tasks are future dated usually.
        if (triggerDate.getTime() < Date.now()) {
            // If 9 AM already passed, maybe schedule for right now + 1 min?
            // Or just don't schedule.
            console.log("⚠️ Task due date 9 AM has already passed, skipping notification");
            return;
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: true,
            },
            trigger: triggerDate as any,
        });

        console.log(`✅ Scheduled notification for ${triggerDate.toLocaleString()}`);
    } catch (error) {
        console.error("❌ Error scheduling notification:", error);
    }
}
