import {
    addDoc,
    collection,
    getDocs,
    query,
    serverTimestamp,
    Timestamp,
    where
} from "firebase/firestore";
import { auth, db } from "./firebase";

export interface FuelLog {
    id?: string;
    userId: string;
    vehicleId: string;
    vehicleName: string;
    fuelAmountRs: number;
    fuelLiters: number;
    fuelType: string;
    station: string;
    date: any;
    estimatedRange: string;
    createdAt?: any;
}

const ensureUser = () => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("You need to be signed in.");
    }
    return user;
};

/**
 * Add a new fuel log
 */
export async function addFuelLog(
    data: Omit<FuelLog, "id" | "userId" | "createdAt">
): Promise<string> {
    const user = ensureUser();

    const newLog = {
        ...data,
        userId: user.uid,
        createdAt: serverTimestamp(),
        // Ensure date is a Timestamp if it's a Date object
        date: data.date instanceof Date ? Timestamp.fromDate(data.date) : data.date,
    };

    const docRef = await addDoc(collection(db, "fuelLogs"), newLog);
    return docRef.id;
}

/**
 * Get all fuel logs for the current user
 */
export async function getFuelLogs() {
    const user = ensureUser();

    // FIX: Querying by userId only to avoid needing a composite index immediately.
    // We will sort the results client-side (in TypeScript).
    const q = query(
        collection(db, "fuelLogs"),
        where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    const logs = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            // Ensure date is processed correctly from Timestamp
            date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
        };
    }) as FuelLog[];

    // Sort by date descending (newest first)
    return logs.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
    });
}
