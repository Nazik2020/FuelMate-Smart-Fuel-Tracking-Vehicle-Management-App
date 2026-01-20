// app/login.tsx
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase"; // adjust path if needed

const { width } = Dimensions.get("window");

export const options = {
  headerShown: false,
};

// simple email validation
const isValidEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};



export default function LoginPage() {
  const router = useRouter();

  // 🔹 states added
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 sign in logic
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email");
      return;
    }

    try {
      // Firebase Auth login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      console.log("Sign-in successful for:", user.email);

      // 🔹 check for admin email FIRST
      if (email.toLowerCase() === "admin@fuelmat.com") {
        console.log("Admin detected, redirecting...");
        setEmail("");
        setPassword("");
        router.replace("/(admin)" as any);
        return;
      }

      // Optional: check user exists in Firestore (for regular users)
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
          console.warn("User doc missing in Firestore for:", user.uid);
          // We can decide to allow them in anyway or block.
          // For now, let's keep it optional to prevent total lockout.
        }
      } catch (err) {
        console.error("Firestore check failed:", err);
      }

      // clear inputs
      setEmail("");
      setPassword("");
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Login Error:", error.code, error.message);
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
          source={require("../assets/images/fuletrackerlogo.png")}
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
          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputBox}>
            <MaterialIcons name="email" size={22} color="#9a9696ff" />
            <TextInput
              placeholder="Enter your email address"
              placeholderTextColor="#83888B"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
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

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.line} />
        </View>

        {/* Google */}
        <TouchableOpacity style={styles.signinwithgooglebutton}>
          <AntDesign name="google" size={24} />
          <Text style={styles.signinwithgooglebuttontext}>
            Sign in with Google
          </Text>
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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ffffff",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  signinwithgooglebutton: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  signinwithgooglebuttontext: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  signupcontainer: {
    alignItems: "center",
  },
  donttext: {
    color: "#ffffff",
    fontSize: 14,
  },
});
