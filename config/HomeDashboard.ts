import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export const getFuelLogs = async (userId: string) => {
  const logsRef = collection(db, "fuelLogs");
  const q = query(logsRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      userId: data.userId,
      fuelStation: data.fuelStation,
      totalCost: data.totalCost,
      date:
        data.date instanceof Timestamp
          ? data.date.toDate().toDateString()
          :data.date ?? "Unknown date",
    };
  });
};
