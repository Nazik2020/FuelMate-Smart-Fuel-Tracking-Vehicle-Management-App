import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { LogBox, Platform, StyleSheet, View } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

// Ignored logs for specific Expo Go warnings
LogBox.ignoreLogs([
  "expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go",
]);

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isWeb = Platform.OS === "web";

  useEffect(() => {
    if (!isWeb || typeof document === "undefined") {
      return;
    }

    const { body } = document;
    const html = document.documentElement;
    const previous = {
      bodyOverflow: body.style.overflow,
      htmlOverflow: html.style.overflow,
      bodyBg: body.style.backgroundColor,
      htmlBg: html.style.backgroundColor,
    };

    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    body.style.backgroundColor = "#05172D";
    html.style.backgroundColor = "#05172D";

    return () => {
      body.style.overflow = previous.bodyOverflow;
      html.style.overflow = previous.htmlOverflow;
      body.style.backgroundColor = previous.bodyBg;
      html.style.backgroundColor = previous.htmlBg;
    };
  }, [isWeb]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={[styles.viewport, isWeb && styles.webViewport]}>
        <View style={[styles.shell, isWeb && styles.webShell]}>
          <Stack initialRouteName="loginpage">
            <Stack.Screen name="loginpage" options={{ headerShown: false }} />
            <Stack.Screen name="signuppage" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(admin)" options={{ headerShown: false }} />
            <Stack.Screen
              name="profile/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
            <Stack.Screen
              options={{ title: "Vehicles" }}
            />
            <Stack.Screen name="help" options={{ headerShown: false }} />
          </Stack>
        </View>
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
  },
  shell: {
    flex: 1,
  },
  webViewport: {
    backgroundColor: "#05172D",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  webShell: {
    width: 420,
    maxWidth: "100%",
    flex: 1,
    borderRadius: 36,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 24 },
  },
});
