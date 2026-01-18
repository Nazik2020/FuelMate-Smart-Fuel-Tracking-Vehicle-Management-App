// app/login.tsx
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth, db } from "@/config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

const { width } = Dimensions.get("window");

export const options = {
  headerShown: false,
};

export default function LoginPage() {
  const router = useRouter();

  // 🔹 states added
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 sign in logic
  const handleSignIn = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const userQuery = query(
        collection(db, "users"),
        where("username", "==", username.trim().toLowerCase()),
      );
      const userSnapshot = await getDocs(userQuery);
      if (userSnapshot.empty) {
        Alert.alert("Error", "Username not found");
        return;
      }

      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();
      const emailFromUsername = userData.email;
      if (!emailFromUsername) {
        Alert.alert("Error", "Email not found for this username");
        return;
      }

      // Firebase Auth login
      await signInWithEmailAndPassword(auth, emailFromUsername, password);

      // clear inputs
      setUsername("");
      setPassword("");

      // navigate to main tabs
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <LinearGradient
      colors={["#0C9396", "#E4D7A4"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        {/* Logo */}
        <Image
          source={require("@/assets/images/fuletrackerlogo.png")}
          style={styles.logo}
        />

        {/* Title */}
        <Text style={styles.title}>Welcome Back</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Sign in to your account to continue tracking your fuel expenses
        </Text>

        {/* Form */}
        <View style={styles.form}>
          {/* Username */}
          <Text style={styles.label}>Username</Text>
          <View style={styles.inputBox}>
            <MaterialIcons name="person" size={22} color="#9a9696ff" />
            <TextInput
              placeholder="Enter your username"
              placeholderTextColor="#83888B"
              style={styles.input}
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputBox}>
            <MaterialIcons name="lock" size={22} color="#9a9696ff" />
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#83888B"
              secureTextEntry
              style={styles.input}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Text style={styles.label1}>Forgot Password?</Text>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity style={styles.signinbutton} onPress={handleSignIn}>
          <Text style={styles.signinbuttontext}>Sign In</Text>
        </TouchableOpacity>

        {/* Signup */}
        <View style={styles.signupcontainer}>
          <Text style={styles.donttext}>
            Don’t have an account?{" "}
            <Link href="/signuppage" asChild>
              <Text style={{ color: "#ffffffff", fontWeight: "600" }}>
                Sign up
              </Text>
            </Link>
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 30,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  label1: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
    marginTop: 10,
    textAlign: "right",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#333333",
  },
  signinbutton: {
    backgroundColor: "#0C9396",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  signinbuttontext: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  signupcontainer: {
    alignItems: "center",
  },
  donttext: {
    color: "#ffffff",
    fontSize: 14,
  },
});
