import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export const options = {
  headerShown: false,
};

const ADMIN_EMAIL = "admin@fuelmate.com";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const trimmedUsername = username.trim();
      const normalizedUsername = trimmedUsername.toLowerCase();
      console.log("🔐 Attempting login for username:", normalizedUsername);

      const matchesAdminIdentifier =
        normalizedUsername === ADMIN_EMAIL.toLowerCase() ||
        normalizedUsername === ADMIN_USERNAME.toLowerCase();

      if (matchesAdminIdentifier && password === ADMIN_PASSWORD) {
        console.log("✅ Admin shortcut matched, navigating to admin panel");
        setUsername("");
        setPassword("");
        router.replace("/(admin)" as any);
        return;
      }

      let userEmailToSignIn = "";

      const usernameLowerQuery = query(
        collection(db, "users"),
        where("usernameLower", "==", normalizedUsername),
      );
      let userSnapshot = await getDocs(usernameLowerQuery);

      if (userSnapshot.empty) {
        const emailQuery = query(
          collection(db, "users"),
          where("email", "==", trimmedUsername),
        );
        userSnapshot = await getDocs(emailQuery);
      }

      if (userSnapshot.empty) {
        const legacyUsernameQuery = query(
          collection(db, "users"),
          where("username", "==", trimmedUsername),
        );
        userSnapshot = await getDocs(legacyUsernameQuery);
      }

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        userEmailToSignIn = userDoc.data()?.email as string;

        const storedUsername = userDoc.data()?.username as string | undefined;
        if (!storedUsername || storedUsername !== trimmedUsername) {
          try {
            if (
              trimmedUsername.toLowerCase() !== userEmailToSignIn.toLowerCase()
            ) {
              await updateDoc(doc(db, "users", userDoc.id), {
                username: trimmedUsername,
                usernameLower: normalizedUsername,
              });
            }
          } catch (e) {
            console.warn("Username sync failed", e);
          }
        }
      } else {
        if (trimmedUsername.includes("@") && trimmedUsername.includes(".")) {
          userEmailToSignIn = trimmedUsername;
        } else {
          console.log("❌ No user found with identifier:", normalizedUsername);
          Alert.alert("Login Failed", "Invalid username or password");
          return;
        }
      }

      console.log("🔑 Attempting sign-in for:", userEmailToSignIn);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userEmailToSignIn,
        password,
      );
      const user = userCredential.user;

      setUsername("");
      setPassword("");

      if (user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        console.log("✅ Admin login successful, navigating to admin panel");
        router.replace("/(admin)" as any);
      } else {
        console.log("✅ Regular user login successful, navigating to home");
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      console.error("❌ Login Error:", error.code, error.message);
      Alert.alert("Login Failed", "Invalid username or password");
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
        <Image
          source={require("../assets/images/fuletrackerlogo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in to your account to continue tracking your fuel expenses
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Username</Text>
          <View style={styles.inputBox}>
            <MaterialIcons name="person" size={22} color="#9a9696ff" />
            <TextInput
              placeholder="Enter your username"
              placeholderTextColor="#83888B"
              style={styles.input}
              autoCapitalize="none"
              value={username}
              onChangeText={(text) => setUsername(text.trimStart())}
            />
          </View>

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

        <TouchableOpacity style={styles.signinbutton} onPress={handleSignIn}>
          <Text style={styles.signinbuttontext}>Sign In</Text>
        </TouchableOpacity>

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