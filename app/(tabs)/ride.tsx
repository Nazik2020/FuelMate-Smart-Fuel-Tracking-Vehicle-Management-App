// VINDYA - Ride/Vehicles Screen
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";

export default function RideScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Vehicles</Text>
      <Text style={styles.subtitle}>
        Your registered vehicles will appear here
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
  },
});
