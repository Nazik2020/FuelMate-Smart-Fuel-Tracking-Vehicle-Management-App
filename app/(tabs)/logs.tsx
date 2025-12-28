// ISHINI - Fuel Logs Screen
import AddFuelEntry from "@/components/Fuel Logs/AddFuelEntry";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LogsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AddFuelEntry />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
});
