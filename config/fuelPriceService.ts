/**
 * Fuel Price Service
 * Backend service for managing fuel prices in Firebase
 */

import {
    doc,
    getDoc,
    setDoc,
    Timestamp
} from "firebase/firestore";
import { auth, db } from "./firebase";

// ==================== TYPES ====================

export interface FuelPrices {
    petrol92: string;
    petrol95: string;
    autoDiesel: string;
    superDiesel: string;
    updatedAt?: Date;
    updatedBy?: string;
}

// Default prices if none exist in Firebase
const DEFAULT_PRICES: FuelPrices = {
    petrol92: "355.00",
    petrol95: "395.00",
    autoDiesel: "320.00",
    superDiesel: "385.00",
};

// ==================== SERVICE FUNCTIONS ====================

/**
 * Get current fuel prices from Firebase
 * Returns default prices if none exist
 */
export async function getFuelPrices(): Promise<FuelPrices> {
    console.log("=== START getFuelPrices ===");

    try {
        const docRef = doc(db, "fuelPrices", "current");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("✅ Fuel prices loaded from Firebase");

            return {
                petrol92: data.petrol92 || DEFAULT_PRICES.petrol92,
                petrol95: data.petrol95 || DEFAULT_PRICES.petrol95,
                autoDiesel: data.autoDiesel || DEFAULT_PRICES.autoDiesel,
                superDiesel: data.superDiesel || DEFAULT_PRICES.superDiesel,
                updatedAt: data.updatedAt instanceof Timestamp
                    ? data.updatedAt.toDate()
                    : data.updatedAt ? new Date(data.updatedAt) : undefined,
                updatedBy: data.updatedBy,
            };
        } else {
            console.log("⚠️ No fuel prices found, using defaults");
            return DEFAULT_PRICES;
        }
    } catch (error: any) {
        console.error("❌ ERROR in getFuelPrices:", error?.message);
        console.log("Returning default prices due to error");
        return DEFAULT_PRICES;
    } finally {
        console.log("=== END getFuelPrices ===\n");
    }
}

/**
 * Update fuel prices in Firebase
 * Saves timestamp and admin user info
 */
export async function updateFuelPrices(prices: FuelPrices): Promise<void> {
    console.log("=== START updateFuelPrices ===");

    try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            throw new Error("User not authenticated");
        }

        const docRef = doc(db, "fuelPrices", "current");
        const dataToSave = {
            petrol92: prices.petrol92,
            petrol95: prices.petrol95,
            autoDiesel: prices.autoDiesel,
            superDiesel: prices.superDiesel,
            updatedAt: Timestamp.now(),
            updatedBy: currentUser.email || currentUser.uid,
        };

        await setDoc(docRef, dataToSave);
        console.log("✅ Fuel prices updated successfully");
        console.log("Updated by:", dataToSave.updatedBy);
    } catch (error: any) {
        console.error("❌ ERROR in updateFuelPrices:", error?.message);
        throw error;
    } finally {
        console.log("=== END updateFuelPrices ===\n");
    }
}
