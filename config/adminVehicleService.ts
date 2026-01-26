/**
 * Admin Vehicle Service  
 * Complete backend functions for Admin Vehicle Management page
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

// ==================== TYPES ====================

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

// ==================== MAIN SERVICE FUNCTIONS ====================

/**
 * Get all vehicles with owner information for admin management
 * COMPLETE FUNCTION WITH FULL ERROR HANDLING
 */
export async function getAllVehiclesWithOwners(): Promise<AdminVehicle[]> {
    console.log("=== START getAllVehiclesWithOwners ===");

    try {
        // Step 1: Check authentication
        const currentUser = auth.currentUser;
        console.log("Current user:", currentUser?.email || "NOT LOGGED IN");

        if (!currentUser) {
            console.warn("⚠️ User not authenticated, returning empty array");
            return [];
        }

        // Step 2: Fetch vehicles collection
        console.log("📦 Fetching from vehicles collection...");
        const vehiclesRef = collection(db, "vehicles");
        const vehiclesSnapshot = await getDocs(vehiclesRef);

        console.log(`✅ Firebase query successful! Found ${vehiclesSnapshot.size} documents`);
        console.log("Empty?", vehiclesSnapshot.empty);

        if (vehiclesSnapshot.empty) {
            console.log("⚠️ No vehicles found in database");
            console.log("SUGGESTION: Check if vehicles are stored at /vehicles or /users/{uid}/vehicles");
            return [];
        }

        // Step 3: Log first vehicle for debugging
        const firstVehicle = vehiclesSnapshot.docs[0]?.data();
        console.log("Sample vehicle data:", JSON.stringify(firstVehicle, null, 2));

        // Step 4: Collect unique user IDs
        const userIds = new Set<string>();
        vehiclesSnapshot.docs.forEach((vehicleDoc) => {
            const data = vehicleDoc.data();
            if (data.userId) {
                userIds.add(data.userId);
            } else {
                console.warn(`⚠️ Vehicle ${vehicleDoc.id} has no userId field`);
            }
        });

        console.log(`Found ${userIds.size} unique user IDs`);

        // Step 5: Fetch user data for all owners
        const userMap: { [key: string]: string } = {};

        if (userIds.size > 0) {
            console.log("👥 Fetching user data for owners...");
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
                        console.log(`  ✓ User ${userId}: ${displayName}`);
                    } else {
                        console.warn(`  ⚠️ User document not found for ID: ${userId}`);
                        userMap[userId] = "Unknown Owner";
                    }
                } catch (userError: any) {
                    console.error(`  ❌ Error fetching user ${userId}:`, userError.message);
                    userMap[userId] = "Unknown Owner";
                }
            });

            await Promise.all(userPromises);
            console.log("✅ User data fetch complete");
        }

        // Step 6: Map vehicles to AdminVehicle type
        const vehicles: AdminVehicle[] = vehiclesSnapshot.docs.map((vehicleDoc) => {
            const data = vehicleDoc.data();

            // Parse createdAt
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

            // 6-month inactivity rule
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

        // Step 7: Sort by date (newest first)
        vehicles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        console.log(`✅ Returning ${vehicles.length} vehicles`);
        console.log("=== END getAllVehiclesWithOwners ===\n");

        return vehicles;

    } catch (error: any) {
        console.error("❌ ERROR in getAllVehiclesWithOwners:");
        console.error("Error code:", error?.code);
        console.error("Error message:", error?.message);
        console.error("Full error:", error);

        // Check for specific error types
        if (error?.code === "permission-denied") {
            console.error("🔒 PERMISSION DENIED - Check Firebase rules!");
            console.error("Rules should allow: allow read: if request.auth != null;");
        } else if (error?.message?.includes("Missing or insufficient permissions")) {
            console.error("🔒 INSUFFICIENT PERMISSIONS - Firebase rules blocking access");
        }

        return [];
    }
}

/**
 * Get vehicle statistics
 * COMPLETE FUNCTION
 */
export async function getVehicleStats(): Promise<VehicleStats> {
    console.log("=== START getVehicleStats ===");

    try {
        const currentUser = auth.currentUser;
        console.log("Current user:", currentUser?.email || "NOT LOGGED IN");

        if (!currentUser) {
            console.warn("⚠️ User not authenticated, returning zero stats");
            return { total: 0, active: 0, inactive: 0 };
        }

        console.log("📊 Fetching vehicle stats...");
        const snapshot = await getDocs(collection(db, "vehicles"));
        console.log(`Found ${snapshot.size} vehicles`);

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

            // 6-month inactivity rule
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

        const stats = { total, active, inactive };
        console.log("Stats:", stats);
        console.log("=== END getVehicleStats ===\n");

        return stats;

    } catch (error: any) {
        console.error("❌ ERROR in getVehicleStats:", error?.message);
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
        console.error("Error searching vehicles:", error);
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
        console.log(`✅ Updated vehicle ${vehicleId} status to ${status}`);
    } catch (error: any) {
        console.error("❌ Error updating vehicle status:", error?.message);
        throw error;
    }
}
