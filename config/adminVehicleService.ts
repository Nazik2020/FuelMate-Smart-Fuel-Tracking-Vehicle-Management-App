/**
 * Admin Vehicle Service  
 * Functions for Admin Vehicle Management
 */

import {
    collection,
    doc,
    getDoc,
    getDocs,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export type VehicleStatus = "Active" | "Inactive";

export interface AdminVehicle {
    id: string;
    name: string;
    licensePlate: string;
    make: string;
    model: string;
    year: string;
    vehicleType: string;
    fuelType: "Petrol" | "Diesel" | "Electric";
    status: VehicleStatus;
    ownerName: string;
    ownerId: string;
    photoURL?: string;
    createdAt: Date;
}

export interface VehicleStats {
    total: number;
    active: number;
    inactive: number;
}

/**
 * Get all vehicles with owner information for admin management
 */
export async function getAllVehiclesWithOwners(): Promise<AdminVehicle[]> {
    try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            return [];
        }

        const vehiclesRef = collection(db, "vehicles");
        const vehiclesSnapshot = await getDocs(vehiclesRef);

        if (vehiclesSnapshot.empty) {
            return [];
        }

        const userIds = new Set<string>();
        vehiclesSnapshot.docs.forEach((vehicleDoc) => {
            const data = vehicleDoc.data();
            if (data.userId) {
                userIds.add(data.userId);
            }
        });

        const userMap: { [key: string]: string } = {};

        if (userIds.size > 0) {
            const userPromises = Array.from(userIds).map(async (userId) => {
                try {
                    const userDocRef = doc(db, "users", userId);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const displayName =
                            userData.firstName && userData.lastName
                                ? `${userData.firstName} ${userData.lastName}`
                                : userData.username || userData.email || "Unknown";
                        userMap[userId] = displayName;
                    } else {
                        userMap[userId] = "Unknown Owner";
                    }
                } catch (userError: any) {
                    userMap[userId] = "Unknown Owner";
                }
            });

            await Promise.all(userPromises);
        }

        const vehicles: AdminVehicle[] = vehiclesSnapshot.docs.map((vehicleDoc) => {
            const data = vehicleDoc.data();

            const createdAt =
                data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : data.createdAt
                        ? new Date(data.createdAt)
                        : new Date();

            const updatedAt =
                data.updatedAt instanceof Timestamp
                    ? data.updatedAt.toDate()
                    : data.updatedAt
                        ? new Date(data.updatedAt)
                        : undefined;

            let status = (data.status as VehicleStatus) || "Active";

            const referenceDate = updatedAt || createdAt;
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            if (status !== "Inactive" && referenceDate < sixMonthsAgo) {
                status = "Inactive";
            }

            return {
                id: vehicleDoc.id,
                name: data.name || `${data.make || ""} ${data.model || ""}`.trim() || "Unknown Vehicle",
                licensePlate: data.licensePlate || "",
                make: data.make || "",
                model: data.model || "",
                year: data.year ? String(data.year) : "",
                vehicleType: data.vehicleType || "Car",
                fuelType: (data.fuelType as "Petrol" | "Diesel" | "Electric") || "Petrol",
                status: status,
                ownerName: userMap[data.userId] || "Unknown Owner",
                ownerId: data.userId || "",
                photoURL: data.photoURL,
                createdAt,
            };
        });

        vehicles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return vehicles;

    } catch (error: any) {
        return [];
    }
}

/**
 * Get vehicle statistics
 */
export async function getVehicleStats(): Promise<VehicleStats> {
    try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            return { total: 0, active: 0, inactive: 0 };
        }

        const snapshot = await getDocs(collection(db, "vehicles"));

        let total = 0;
        let active = 0;
        let inactive = 0;

        snapshot.docs.forEach((vehicleDoc) => {
            const data = vehicleDoc.data();
            total++;

            let status = (data.status as VehicleStatus) || "Active";

            const createdAt =
                data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : data.createdAt
                        ? new Date(data.createdAt)
                        : new Date();

            const updatedAt =
                data.updatedAt instanceof Timestamp
                    ? data.updatedAt.toDate()
                    : data.updatedAt
                        ? new Date(data.updatedAt)
                        : undefined;

            const referenceDate = updatedAt || createdAt;
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            if (status !== "Inactive" && referenceDate < sixMonthsAgo) {
                status = "Inactive";
            }

            if (status === "Active") {
                active++;
            } else if (status === "Inactive") {
                inactive++;
            }
        });

        return { total, active, inactive };

    } catch (error: any) {
        return { total: 0, active: 0, inactive: 0 };
    }
}

/**
 * Search vehicles by model, plate, or owner  
 */
export async function searchVehicles(searchQuery: string): Promise<AdminVehicle[]> {
    try {
        const allVehicles = await getAllVehiclesWithOwners();
        const query = searchQuery.toLowerCase().trim();

        if (!query) return allVehicles;

        return allVehicles.filter(
            (vehicle) =>
                vehicle.name.toLowerCase().includes(query) ||
                vehicle.licensePlate.toLowerCase().includes(query) ||
                vehicle.make.toLowerCase().includes(query) ||
                vehicle.model.toLowerCase().includes(query) ||
                vehicle.ownerName.toLowerCase().includes(query)
        );
    } catch (error) {
        return [];
    }
}

/**
 * Update vehicle status
 */
export async function updateVehicleStatus(
    vehicleId: string,
    status: VehicleStatus
): Promise<void> {
    try {
        await updateDoc(doc(db, "vehicles", vehicleId), {
            status,
            updatedAt: Timestamp.now(),
        });
    } catch (error: any) {
        throw error;
    }
}
