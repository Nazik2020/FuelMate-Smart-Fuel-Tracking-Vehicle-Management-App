import {
    addDoc,
    collection,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export interface Task {
    id?: string;
    userId: string;
    taskName: string;
    dueDate: any; // Timestamp or Date
    setReminder: boolean;
    notes: string;
    createdAt?: any;
    completed?: boolean;
}

const ensureUser = () => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("You need to be signed in.");
    }
    return user;
};

/**
 * Add a new task
 */
export async function addTask(
    data: Omit<Task, "id" | "userId" | "createdAt" | "completed">
): Promise<string> {
    const user = ensureUser();

    const newTask = {
        ...data,
        userId: user.uid,
        createdAt: serverTimestamp(),
        completed: false,
        // Ensure dueDate is a Timestamp if it's a Date object, or null if not set
        dueDate: data.dueDate instanceof Date ? Timestamp.fromDate(data.dueDate) : data.dueDate,
    };

    const docRef = await addDoc(collection(db, "tasks"), newTask);
    return docRef.id;
}
