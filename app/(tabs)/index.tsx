import CardMExpense from "@/components/DashBoard Components/CardMExpense";
import CardMSpend from "@/components/DashBoard Components/CardMSpend";
import Rectangle2 from "@/components/DashBoard Components/Rectangle2";
import Rectangle3 from "@/components/DashBoard Components/Rectangle3";
import DrawerMenu from "@/components/DrawerMenu";
import { getBarChartData, getFuelLogs } from "@/config/HomeDashboard";
import { useCurrentUserProfile } from "@/hooks/use-current-user-profile";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
<<<<<<< Updated upstream
import { Colors } from "@/constants/theme";
import { auth } from "@/config/firebase";

export default function HomeScreen() {
  const router = useRouter();
  const { displayName } = useCurrentUserProfile();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [fuelLogs, setFuelLogs] = useState<
    { userId: string; fuelStation: string; date: string; totalCost: number }[]
  >([]);
  const [chartData, setChartData] = useState<
    { label: string; value: number }[]
  >([]);
=======

import { auth } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";

/* ================= TYPES ================= */

type FuelLog = {
  id: string;
  userId: string;
  fuelStation: string;
  date: string;
  totalCost: number;
  fuelLiters: number;
  distancekm: number;
};

const MONTHS = [
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

export default function HomeScreen() {
  const router = useRouter();
  const { displayName, profile } = useCurrentUserProfile();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [chartData, setChartData] = useState<
    { label: string; value: number }[]
  >([]);

  const [thisMonthTotal, setThisMonthTotal] = useState(0);
  const [lastMonthTotal, setLastMonthTotal] = useState(0);
  const [lastFillText, setLastFillText] = useState("No data");
  const [avgEfficiency, setAvgEfficiency] = useState("N/A");

  /* ================= FETCH LOGS ================= */
>>>>>>> Stashed changes

  useEffect(() => {
    const fetchData = async () => {
      const logs = await getFuelLogs();
      setFuelLogs(logs);

<<<<<<< Updated upstream
      const bData = await getBarChartData();
      setChartData(bData);
    };
    fetchData();
  }, []);

=======
      try {
        const logs = await getFuelLogs(user.uid);

        const normalizedLogs: FuelLog[] = logs.map((log: any) => ({
          id: log.id,
          userId: log.userId,
          fuelStation: log.fuelStation,
          date: log.date?.toDate ? log.date.toDate().toISOString() : log.date,
          totalCost: log.totalCost != null ? Number(log.totalCost) : 0,
          //  Safe conversion
          fuelLiters: log.fuelLiters != null ? Number(log.fuelLiters) : 0,
          distancekm: log.distancekm != null ? Number(log.distancekm) : 0,
        }));

        setFuelLogs(normalizedLogs);
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
      const d = new Date(log.date);
      monthlyTotals[d.getMonth()] += log.totalCost;
    });

    setChartData(
      MONTHS.map((month, index) => ({
        label: month,
        value: monthlyTotals[index],
      })),
    );
  }, [fuelLogs]);

  /* ================= MONTHLY TOTALS ================= */

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let thisMonth = 0;
    let lastMonth = 0;

    fuelLogs.forEach((log) => {
      const d = new Date(log.date);
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        thisMonth += log.totalCost;
      }
      if (
        d.getFullYear() === currentYear &&
        d.getMonth() === currentMonth - 1
      ) {
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

    const latestLog = fuelLogs.reduce((a, b) =>
      new Date(a.date) > new Date(b.date) ? a : b,
    );

    const diffTime = Math.abs(Date.now() - new Date(latestLog.date).getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) setLastFillText("Today");
    else if (diffDays === 1) setLastFillText("1 day ago");
    else setLastFillText(`${diffDays} days ago`);
  }, [fuelLogs]);

  /* ================= AVERAGE EFFICIENCY ================= */

  useEffect(() => {
    if (fuelLogs.length === 0) {
      setAvgEfficiency("N/A");
      return;
    }

    let totalDistance = 0;
    let totalFuel = 0;

    fuelLogs.forEach((log) => {
      if (!isNaN(log.distancekm) && !isNaN(log.fuelLiters)) {
        totalDistance += log.distancekm;
        totalFuel += log.fuelLiters;
      }
    });

    if (totalFuel === 0) {
      setAvgEfficiency("N/A");
      return;
    }

    setAvgEfficiency(`${(totalDistance / totalFuel).toFixed(1)} km/L`);
  }, [fuelLogs]);

  /* ================= UI ================= */

>>>>>>> Stashed changes
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
            {profile?.photoURL ? (
              <Image
                source={{ uri: profile.photoURL }}
                style={styles.profileImage}
              />
            ) : (
              <Ionicons name="person-outline" size={24} color="#1F2937" />
            )}
          </TouchableOpacity>
        </View>

        {/* Placeholder content */}
        <View style={styles.placeholder}>
          <CardMSpend />
        </View>

        <View style={styles.smallCardRow}>
          <View style={styles.Cformgroup}>
            <Rectangle2 title="Average Efficiency" value="32.5 MPG" />
          </View>
          <View style={styles.Cformgroup}>
            <Rectangle2 title="Last Fill" value="3 days ago" />
          </View>
        </View>

        {/* Monthly Expense BarChart */}
        <View style={styles.placeholder}>
          <CardMExpense data={chartData} />
        </View>

        {/* Recent Fuel Logs */}
        <View>
          <Text style={styles.text4}>Recent Fuel Logs</Text>
        </View>
        {fuelLogs.map((log) => (
          <View style={styles.placeholder} key={log.userId}>
            <Rectangle3
              name={log.fuelStation}
              value={`Rs ${log.totalCost}`}
              date={log.date}
            />
          </View>
        ))}
      </ScrollView>
      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </SafeAreaView>
  );
}

// ===== Styles =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuButton: {
    marginRight: 12,
    padding: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  placeholder: {
    margin: 10,
    padding: 0,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
  },
  placeholderText: {
    color: "#6B7280",
    fontSize: 16,
  },
  smallCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  Cformgroup: {
    width: "48%",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
  },
  text4: {
    fontSize: 22,
    color: "#0d7377", // Green color for title
    fontWeight: "600",
    lineHeight: 22,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
  },

  fuelLogContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
});
