// VINDYA - Home/Dashboard Screen
import CardMExpense from "@/components/DashBoard Components/CardMExpense";
import CardMSpend from "@/components/DashBoard Components/CardMSpend";
import Rectangle2 from "@/components/DashBoard Components/Rectangle2";
import Rectangle3 from "@/components/DashBoard Components/Rectangle3";
import DrawerMenu from "@/components/DrawerMenu";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [drawerVisible, setDrawerVisible] = useState(false);

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
              <Text style={styles.subtitle}>Welcome, Alex</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Placeholder content - Vindya will build this */}
        <View style={styles.placeholder}>
          <CardMSpend></CardMSpend>
        </View>

        <View style={styles.smallCardRow}>
          <View style={styles.Cformgroup} >
            <Rectangle2 title="Average Efficiency" value="32.5 MPG" />
          </View>
          <View style={styles.Cformgroup}>
            <Rectangle2 title="Last Fill" value="3 days ago"></Rectangle2>
          </View>
        </View>

        <View style={styles.placeholder}>
          <CardMExpense />
        </View>
        <View>
          <Text style={styles.text4}>Recent Fuel Logs</Text>
        </View>
        <View style={styles.fuelLogContainer}>
          <Rectangle3 name="Shell Station" value="Rs 4000" date="Oct 28, 2023" />
        </View>
        <View style={styles.fuelLogContainer}>
          <Rectangle3 name="BP" value="Rs 3000" date="Nov 2, 2023" />
        </View>
        <View style={styles.fuelLogContainer}>
          <Rectangle3 name="Mobil" value="Rs 2500" date="Nov 5, 2023" />
        </View>

      </ScrollView>
      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </SafeAreaView>
  );
}

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
