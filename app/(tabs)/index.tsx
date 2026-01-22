import CardMExpense from "@/components/DashBoard Components/CardMExpense";
import CardMSpend from "@/components/DashBoard Components/CardMSpend";
import Rectangle2 from "@/components/DashBoard Components/Rectangle2";
import Rectangle3 from "@/components/DashBoard Components/Rectangle3";
import DrawerMenu from "@/components/DrawerMenu";
import { getFuelLogs } from "@/config/HomeDashboard";
import { useCurrentUserProfile } from "@/hooks/use-current-user-profile";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";

/* ================= TYPES ================= */

type FuelLog = {
  id: string;
  userId: string;
  fuelStation: string;
  date: string;
  totalCost: number;
  fuelLiters: number; // default 0 if missing
  odometer: number;   // default 0 if missing
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function HomeScreen() {
  const router = useRouter();
  const { displayName } = useCurrentUserProfile();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [chartData, setChartData] = useState<{ label: string; value: number }[]>(
    []
  );

  const [thisMonthTotal, setThisMonthTotal] = useState(0);
  const [lastMonthTotal, setLastMonthTotal] = useState(0);
  const [lastFillText, setLastFillText] = useState("No data");
  const [avgEfficiency, setAvgEfficiency] = useState("N/A");

  /* ================= AUTH + DATA ================= */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setFuelLogs([]);
        return;
      }

      try {
        const logs = await getFuelLogs(user.uid);

        // Map logs to include default fuelLiters and odometer
        const formattedLogs: FuelLog[] = logs.map((log) => ({
          id: log.id,
          userId: log.userId,
          fuelStation: log.fuelStation,
          date: log.date,
          totalCost: log.totalCost,
          fuelLiters: 0 ?? 0,
          odometer: 0 ?? 0,
        }));

        setFuelLogs(formattedLogs);
      } catch (error) {
        console.error("Error fetching fuel logs:", error);
      }
    });

    return unsubscribe;
  }, []);

  /* ================= MONTHLY CHART ================= */

  useEffect(() => {
    const monthlyTotals = Array(12).fill(0);

    fuelLogs.forEach((log) => {
      const dateObj = new Date(log.date);
      const monthIndex = dateObj.getMonth();
      monthlyTotals[monthIndex] += log.totalCost;
    });

    setChartData(
      MONTHS.map((month, index) => ({
        label: month,
        value: monthlyTotals[index],
      }))
    );
  }, [fuelLogs]);

  /* ================= MONTH SPEND ================= */

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let thisMonth = 0;
    let lastMonth = 0;

    fuelLogs.forEach((log) => {
      const d = new Date(log.date);
      const m = d.getMonth();
      const y = d.getFullYear();

      if (y === currentYear && m === currentMonth) {
        thisMonth += log.totalCost;
      }

      if (y === currentYear && m === currentMonth - 1) {
        lastMonth += log.totalCost;
      }
    });

    setThisMonthTotal(thisMonth);
    setLastMonthTotal(lastMonth);
  }, [fuelLogs]);

  /* ================= LAST FILL ================= */

  useEffect(() => {
    if (fuelLogs.length === 0) {
      setLastFillText("No fills yet");
      return;
    }

    const latestLog = fuelLogs.reduce((latest, current) =>
      new Date(current.date) > new Date(latest.date) ? current : latest
    );

    const lastDate = new Date(latestLog.date);
    const now = new Date();

    const diffDays = Math.abs(
      Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
    );

    if (diffDays === 0) setLastFillText("Today");
    else if (diffDays === 1) setLastFillText("1 day ago");
    else setLastFillText(`${diffDays} days ago`);
  }, [fuelLogs]);

  /* ================= AVERAGE EFFICIENCY ================= */

  useEffect(() => {
    if (fuelLogs.length < 2) {
      setAvgEfficiency("N/A");
      return;
    }

    const sortedLogs = [...fuelLogs].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let totalDistance = 0;
    let totalFuel = 0;

    for (let i = 1; i < sortedLogs.length; i++) {
      const prev = sortedLogs[i - 1];
      const curr = sortedLogs[i];

      const distance = curr.odometer - prev.odometer;

      if (distance <= 0 || curr.fuelLiters <= 0) continue;

      totalDistance += distance;
      totalFuel += curr.fuelLiters;
    }

    if (totalFuel === 0) {
      setAvgEfficiency("N/A");
      return;
    }

    const efficiency = totalDistance / totalFuel;
    setAvgEfficiency(`${efficiency.toFixed(1)} km/L`);
  }, [fuelLogs]);

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setDrawerVisible(true)}
            >
              <Ionicons name="menu-outline" size={24} color="#1F2937" />
            </TouchableOpacity>
            <View>
              <Text style={styles.title}>Dashboard</Text>
              <Text style={styles.subtitle}>
                {displayName ? `Welcome, ${displayName}` : "Welcome"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/profile")}
          >
            <Ionicons name="person-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <View style={styles.placeholder}>
          <CardMSpend thisMonth={thisMonthTotal} lastMonth={lastMonthTotal} />
        </View>

        <View style={styles.smallCardRow}>
          <View style={styles.Cformgroup}>
            <Rectangle2 title="Average Efficiency" value={avgEfficiency} />
          </View>
          <View style={styles.Cformgroup}>
            <Rectangle2 title="Last Fill" value={lastFillText} />
          </View>
        </View>

        <View style={styles.placeholder}>
          <CardMExpense data={chartData} />
        </View>

        <Text style={styles.text4}>Recent Fuel Logs</Text>

        {fuelLogs.map((log) => (
          <View style={styles.placeholder} key={log.id}>
            <Rectangle3
              name={log.fuelStation}
              value={`Rs ${log.totalCost}`}
              date={log.date}
            />
          </View>
        ))}
      </ScrollView>

      <DrawerMenu visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  menuButton: { marginRight: 12 },
  title: { fontSize: 28, fontWeight: "bold" },
  subtitle: { fontSize: 16, color: "#6B7280" },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: { margin: 10, borderRadius: 12 },
  smallCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  Cformgroup: { width: "48%" },
  text4: {
    fontSize: 22,
    color: "#0d7377",
    fontWeight: "600",
    marginLeft: 20,
    marginVertical: 10,
  },
});
