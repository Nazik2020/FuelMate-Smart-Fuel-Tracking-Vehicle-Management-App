// VINDYA - Home/Dashboard Screen
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import CardMSpend from "@/components/DashBoard Components/CardMSpend";
import Rectangle2 from "@/components/DashBoard Components/Rectangle2";
import CardMExpense from "@/components/DashBoard Components/CardMExpense";
import Rectangle3 from "@/components/DashBoard Components/Rectangle3";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>Welcome, Alex</Text>
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
        <Rectangle2 title = "Average Efficiency"  value="32.5 MPG"/>
        </View>
        <View style={styles.Cformgroup}>
          <Rectangle2 title="Last Fill" value="3 days ago"></Rectangle2>
        </View>
        </View>

        <View style={styles.placeholder}>
        <CardMExpense/> 
        </View>
        <View>
          <Text style={styles.text4}>Recent Fuel Logs</Text>
        </View>
        <View style={styles.placeholder}>
          <Rectangle3 name="Shell Station" value="Rs 4000"  date="Oct 28, 2023"/>
        </View>
        <View style={styles.placeholder}>
          <Rectangle3 name="BP" value="Rs 3000"  date="Nov 2, 2023"/>
        </View>
        <View style={styles.placeholder}>
          <Rectangle3 name="Mobil" value="Rs 2500"  date="Nov 5, 2023"/>
        </View>
       
      </ScrollView>
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

text4:{
  fontSize: 22,
    color: "#074396ff", // text-slate-500
    lineHeight: 22,
    marginLeft:20,

}

});
