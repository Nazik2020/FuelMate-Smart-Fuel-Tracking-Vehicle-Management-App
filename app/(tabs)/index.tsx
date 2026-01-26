import CardMExpense from "@/components/DashBoard Components/CardMExpense";
import CardMSpend from "@/components/DashBoard Components/CardMSpend";
import Rectangle2 from "@/components/DashBoard Components/Rectangle2";
import Rectangle3 from "@/components/DashBoard Components/Rectangle3";
import DrawerMenu from "@/components/DrawerMenu";
import { FuelLog, getFuelLogs } from "@/config/fuelLogService"; // Updated import
import { useCurrentUserProfile } from "@/hooks/use-current-user-profile";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router"; // Added useFocusEffect
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function HomeScreen() {
  const router = useRouter();
  const { displayName, profile } = useCurrentUserProfile();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [chartData, setChartData] = useState<{ label: string; value: number }[]>([]);
  const [thisMonthTotal, setThisMonthTotal] = useState(0);
  const [lastMonthTotal, setLastMonthTotal] = useState(0);
  const [lastFillText, setLastFillText] = useState("No data");
  const [avgEfficiency, setAvgEfficiency] = useState("N/A");

  /* ================= FETCH LOGS ================= */

  const fetchLogs = async () => {
    try {
      const logs = await getFuelLogs();

      // Transform timestamp to date string for display/calc if needed
      // but keep original object structure mostly
      setFuelLogs(logs);
    } catch (error) {
      console.error("Error fetching fuel logs:", error);
    }
  };

  // Use useFocusEffect to refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchLogs();
    }, [])
  );

  /* ================= MONTHLY CHART ================= */

  /* ================= MONTHLY CHART ================= */

  useEffect(() => {
    const now = new Date();
    const last7Months: {
      monthIndex: number;
      year: number;
      label: string;
      value: number;
    }[] = [];

    // 1. Generate the last 5 months (including current)
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last7Months.push({
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        label: MONTHS[d.getMonth()],
        value: 0,
      });
    }

    // 2. Aggregate data from fuelLogs
    fuelLogs.forEach((log) => {
      const d = log.date?.toDate ? log.date.toDate() : new Date(log.date);
      if (!isNaN(d.getTime())) {
        const logMonth = d.getMonth();
        const logYear = d.getFullYear();

        // Find the matching month in our generated list
        const match = last7Months.find(
          (item) => item.monthIndex === logMonth && item.year === logYear
        );

        if (match) {
          match.value += Number(log.fuelAmountRs || 0);
        }
      }
    });

    // 3. Map to chart data format
    setChartData(
      last7Months.map((item) => ({
        label: item.label,
        value: item.value,
      }))
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
      const d = log.date?.toDate ? log.date.toDate() : new Date(log.date);
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        thisMonth += Number(log.fuelAmountRs || 0);
      }
      if (
        d.getFullYear() === currentYear &&
        d.getMonth() === currentMonth - 1
      ) {
        lastMonth += Number(log.fuelAmountRs || 0);
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

    // Logs are already ordered by date desc from service
    const latestLog = fuelLogs[0];
    const latestDate = latestLog.date?.toDate ? latestLog.date.toDate() : new Date(latestLog.date);

    const diffTime = Math.abs(Date.now() - latestDate.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) setLastFillText("Today");
    else if (diffDays === 1) setLastFillText("1 day ago");
    else setLastFillText(`${diffDays} days ago`);
  }, [fuelLogs]);

  /* ================= AVERAGE EFFICIENCY ================= */

  useEffect(() => {
    // For now we don't have odometer readings to calculate real efficiency
    // We can show the estimated range of the latest log or average range
    if (fuelLogs.length === 0) {
      setAvgEfficiency("N/A");
      return;
    }

    // Example: average estimated range from logs
    // Parsing "330km - 360km" to get average
    let totalRange = 0;
    let count = 0;

    fuelLogs.forEach(log => {
      if (log.estimatedRange) {
        const parts = log.estimatedRange.split("-");
        if (parts.length === 2) {
          const min = parseInt(parts[0].replace(/[^0-9]/g, ""));
          const max = parseInt(parts[1].replace(/[^0-9]/g, ""));
          if (!isNaN(min) && !isNaN(max)) {
            totalRange += (min + max) / 2;
            count++;
          }
        }
      }
    });

    if (count > 0) {
      setAvgEfficiency(`~${Math.round(totalRange / count)} km`);
    } else {
      setAvgEfficiency("N/A");
    }
  }, [fuelLogs]);

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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

        {fuelLogs.map((log) => {
          const d = log.date?.toDate ? log.date.toDate() : new Date(log.date);
          const dateStr = !isNaN(d.getTime()) ? d.toDateString() : "Unknown Date";

          return (
            <View style={styles.placeholder} key={log.id}>
              <Rectangle3
                name={log.station || "Unknown Station"}
                value={`Rs ${Math.round(Number(log.fuelAmountRs || 0))}`}
                date={dateStr}
              />
            </View>
          );
        })}
      </ScrollView>

      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  menuButton: { marginRight: 12, padding: 4 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1F2937" },
  subtitle: { fontSize: 16, color: "#6B7280", marginTop: 4 },
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
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
  },
  smallCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
    alignItems: "stretch", // Ensure equal height
  },
  Cformgroup: {
    width: "48%",
    // backgroundColor: "#F3F4F6", // Removed to allow card to handle bg
    borderRadius: 12,
  },
  text4: {
    fontSize: 22,
    color: "#0d7377",
    fontWeight: "600",
    marginLeft: 20,
    marginVertical: 10,
  },
});