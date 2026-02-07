/**
 * Notification Service
 * Backend for managing user notifications
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

export type NotificationType = "welcome" | "fuel_price" | "service" | "warning" | "custom";

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    icon?: string;
    iconColor?: string;
}

export interface CreateNotificationData {
    type: NotificationType;
    title: string;
    message: string;
    icon?: string;
    iconColor?: string;
}

/**
 * Create a welcome notification for a new user
 */
export async function createWelcomeNotification(
    userId: string,
    userName: string
): Promise<void> {
    try {
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
    } catch (error) {
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
        const notificationDoc: any = {
            userId,
            type: notificationData.type,
            title: notificationData.title,
            message: notificationData.message,
            isRead: false,
            createdAt: Timestamp.now(),
        };

        if (notificationData.icon) {
            notificationDoc.icon = notificationData.icon;
        }
        if (notificationData.iconColor) {
            notificationDoc.iconColor = notificationData.iconColor;
        }

        await addDoc(collection(db, "notifications"), notificationDoc);
    } catch (error) {
        throw error;
    }
}

/**
 * Send a notification to all users
 */
export async function sendNotificationToAll(
    notificationData: CreateNotificationData
): Promise<void> {
    try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const batch = writeBatch(db);
        const notificationsRef = collection(db, "notifications");

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

            if (notificationData.icon) {
                notificationDoc.icon = notificationData.icon;
            }
            if (notificationData.iconColor) {
                notificationDoc.iconColor = notificationData.iconColor;
            }

            batch.set(notifRef, notificationDoc);
        });

        await batch.commit();
    } catch (error) {
        throw error;
    }
}

/**
 * Get all notifications for a user
 */
export async function getUserNotifications(userId: string): Promise<Notification[]> {
    try {
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

        return notifications;
    } catch (error) {
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
    } catch (error) {
        throw error;
    }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string): Promise<void> {
    try {
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
    } catch (error) {
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
            return;
        }

        const triggerDate = new Date(date);
        triggerDate.setHours(9, 0, 0, 0);

        if (triggerDate.getTime() < Date.now()) {
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
    } catch (error) {
        // Notification scheduling failed silently
    }
}
