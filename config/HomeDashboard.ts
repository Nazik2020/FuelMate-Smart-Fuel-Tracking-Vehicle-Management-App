import { firestore, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

// Helper to wait for auth state
const waitForAuth = (): Promise<void> => {
  return new Promise((resolve) => {
    // If already logged in, resolve immediately
    if (auth.currentUser) {
      resolve();
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsubscribe();
        resolve();
      }
    });

    // Timeout after 5 seconds to avoid hanging forever
    setTimeout(() => {
      unsubscribe();
      resolve();
    }, 5000);
  });
};

// ----------------- Fetch fuel logs -----------------
export const getFuelLogs = async (): Promise<
  { userId: string; fuelStation: string; date: string; totalCost: number }[]
> => {
  try {
    // Ensure we are authenticated before fetching
    await waitForAuth();

    const fuelLogsCollection = collection(firestore, "fuelLogs");
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
          userId: doc.id,
          fuelStation: data.fuelStation || "Unknown",
          date: data.date
            ? data.date.toDate
              ? data.date.toDate().toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              : data.date
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
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyTotals: Record<string, number> = {};
    months.forEach((m) => (monthlyTotals[m] = 0));

    // Aggregate fuel amounts by month
    logs.forEach((log) => {
      const dateObj = new Date(log.date);
      if (!isNaN(dateObj.getTime())) {
        const monthName = months[dateObj.getMonth()];
        monthlyTotals[monthName] += log.totalCost;
      }
    });

    // Convert to array for BarChart
    const chartData = months.map((m) => ({
      label: m,
      value: monthlyTotals[m],
    }));

    return chartData;
  } catch (error) {
    console.error("Error preparing bar chart data:", error);
    return [];
  }
};
