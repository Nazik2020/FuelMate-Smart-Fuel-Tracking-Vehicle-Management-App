// Hidden screen for the add button tab
// This screen is not meant to be displayed
import { Redirect } from "expo-router";

export default function AddScreen() {
  return <Redirect href="/(tabs)/logs" />;
}

