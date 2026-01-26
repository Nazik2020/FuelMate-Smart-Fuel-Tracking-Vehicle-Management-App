import { Colors } from "@/constants/theme";
import { Platform, StyleSheet } from "react-native";

interface ReminderToggleProps {
  value: boolean;
  onToggle: (value: boolean) => void;
}

export default function ReminderToggle({
  value,
  onToggle,
}: ReminderToggleProps) {

}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
    borderRadius: 12,
    marginBottom: 20,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
    color: Colors.textSecondary,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
  },
});
