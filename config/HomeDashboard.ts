import { collection, getDocs } from "firebase/firestore";
import { firestore } from "./firebase";
import { getAuth } from "firebase/auth";

// ----------------- Fetch fuel logs -----------------
export const getFuelLogs = async (): Promise<
  { userId: string; fuelStation: string; date: string; totalCost: number }[]
> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("User not logged in");
      return [];
    }

    //  Fetch logs for the currently logged-in user
    const fuelLogsCollection = collection(
      firestore,
      "users",
      user.uid,
      "fuelLogs"
    );

    const querySnapshot = await getDocs(fuelLogsCollection);

    const logs: {
      userId: string;
      fuelStation: string;
      date: string;
      totalCost: number;
    }[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data) {
        logs.push({
          userId: user.uid,
          fuelStation: data.fuelStation || "Unknown",
          date: data.date
            ? new Date(data.date).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            : "Unknown",
          totalCost: data.totalCost || 0,
        });

      }
    });

    // Sort logs by date descending (most recent first)
    logs.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return logs;
  } catch (error) {
    console.error("Error fetching fuel logs:", error);
    return [];
  }
};

// ----------------- Prepare monthly bar chart data -----------------
export const getBarChartData = async (): Promise<
  { label: string; value: number }[]
> => {
  try {
    const logs = await getFuelLogs();

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const monthlyTotals: Record<string, number> = {};
    months.forEach((m) => (monthlyTotals[m] = 0));

    // Aggregate totalCost by month
    logs.forEach((log) => {
      const dateObj = new Date(log.date);
      if (!isNaN(dateObj.getTime())) {
        const monthName = months[dateObj.getMonth()];
        monthlyTotals[monthName] += log.totalCost;
      }
    });

    // Convert to array for chart
    return months.map((m) => ({
      label: m,
      value: monthlyTotals[m],
    }));
  } catch (error) {
    console.error("Error preparing bar chart data:", error);
    return [];
  }
};
