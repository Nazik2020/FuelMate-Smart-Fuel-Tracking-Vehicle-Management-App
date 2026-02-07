/**
 * Fuel Price Service
 * Service for managing fuel prices in Firebase
 */

import {
    doc,
    getDoc,
    setDoc,
    Timestamp
} from "firebase/firestore";
import { auth, db } from "./firebase";

export interface FuelPrices {
    petrol92: string;
    petrol95: string;
    autoDiesel: string;
    superDiesel: string;
    updatedAt?: Date;
    updatedBy?: string;
}

const DEFAULT_PRICES: FuelPrices = {
    petrol92: "355.00",
    petrol95: "395.00",
    autoDiesel: "320.00",
    superDiesel: "385.00",
};

/**
 * Get current fuel prices from Firebase
 */
export async function getFuelPrices(): Promise<FuelPrices> {
    try {
        const docRef = doc(db, "fuelPrices", "current");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

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
            return DEFAULT_PRICES;
        }
    } catch (error: any) {
        return DEFAULT_PRICES;
    }
}

/**
 * Update fuel prices in Firebase
 */
export async function updateFuelPrices(prices: FuelPrices): Promise<void> {
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
    } catch (error: any) {
        throw error;
    }
}
