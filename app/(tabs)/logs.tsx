// ISHINI - Fuel Logs Screen
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LogsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Fuel Logs</Text>
      <Text style={styles.subtitle}>Your fuel history will appear here</Text>
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
