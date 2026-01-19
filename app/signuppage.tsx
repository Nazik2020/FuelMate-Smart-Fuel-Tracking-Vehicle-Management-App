import { auth, db } from "@/config/firebase"; // adjust if needed
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const options = {
  headerShown: false,
};

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function SignupPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    const trimmedUsername = username.trim();
    const normalizedUsername = trimmedUsername.toLowerCase();

    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      // ensure username is unique (case-insensitive)
      const usernameLowerQuery = query(
        collection(db, "users"),
        where("usernameLower", "==", normalizedUsername),
      );
      const legacyUsernameQuery = query(
        collection(db, "users"),
        where("username", "==", normalizedUsername),
      );

      const [usernameLowerSnapshot, legacyUsernameSnapshot] = await Promise.all(
        [getDocs(usernameLowerQuery), getDocs(legacyUsernameQuery)],
      );

      if (!usernameLowerSnapshot.empty || !legacyUsernameSnapshot.empty) {
        Alert.alert("Error", "Username already taken");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: trimmedUsername,
        usernameLower: normalizedUsername,
        role: "user",
        createdAt: serverTimestamp(),
        notificationsEnabled: true,
        darkMode: false,
      });

      Alert.alert("Success", "Signup successful!");

      setFirstName("");
      setLastName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      router.replace("/loginpage");
    } catch (error: any) {
      const message = error?.message ?? "An error occurred";
      Alert.alert("Signup Failed", message);
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <Image
            source={require("@/assets/images/fuletrackerlogo.png")}
            style={styles.logo}
          />

          {/* Title */}
          <Text style={styles.title}>Welcome to Fuelmate</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Sign up to continue tracking your fuel expenses
          </Text>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.rowTwo}>
              <View style={styles.halfInputWrapper}>
                <Text style={styles.label}>First Name</Text>
                <View style={styles.inputBox}>
                  <MaterialIcons name="person" size={22} color="#9a9696ff" />
                  <TextInput
                    placeholder="First name"
                    placeholderTextColor="#83888B"
                    style={styles.input}
                    autoCapitalize="words"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
              </View>

              <View style={styles.halfInputWrapper}>
                <Text style={styles.label}>Last Name</Text>
                <View style={styles.inputBox}>
                  <MaterialIcons name="person" size={22} color="#9a9696ff" />
                  <TextInput
                    placeholder="Last name"
                    placeholderTextColor="#83888B"
                    style={styles.input}
                    autoCapitalize="words"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>
            </View>

            <Text style={styles.label}>Username</Text>
            <View style={styles.inputBox}>
              <MaterialIcons
                name="alternate-email"
                size={22}
                color="#9a9696ff"
              />
              <TextInput
                placeholder="Username"
                placeholderTextColor="#83888B"
                style={styles.input}
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
              />
            </View>

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
                onChangeText={(text) => setEmail(text.trim())}
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

            <Text style={styles.label}>Re Enter Password</Text>
            <View style={styles.inputBox}>
              <MaterialIcons name="lock" size={22} color="#9a9696ff" />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#83888B"
                secureTextEntry={!showConfirmPassword}
                style={styles.input}
                autoCapitalize="none"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword((prev) => !prev)}
                style={styles.eyeButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialIcons
                  name={showConfirmPassword ? "visibility" : "visibility-off"}
                  size={20}
                  color="#9a9696ff"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.signupbutton} onPress={handleSignup}>
            <Text style={styles.signupbuttontext}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginLinkText}>
              Already have an account?{" "}
              <Link href="/loginpage" asChild>
                <Text style={styles.loginLinkButton}>Sign in</Text>
              </Link>
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 32,
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    marginTop: 40,
    marginBottom: 20,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  form: {
    width: "100%",
    marginBottom: 20,
  },
  rowTwo: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  halfInputWrapper: {
    width: "48%",
  },
  label: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 8,
    marginTop: 12,
  },
  inputBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 50,
    width: "100%",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#333333",
  },
  eyeButton: {
    padding: 4,
  },
  signupbutton: {
    width: "100%",
    height: 50,
    backgroundColor: "#005F73",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 10,
  },
  signupbuttontext: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginLinkContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  loginLinkText: {
    color: "#fff",
    fontSize: 14,
  },
  loginLinkButton: {
    color: "#ffffff",
    fontWeight: "700",
  },
  signupwithgooglebutton: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
  },
  signupwithgooglebuttontext: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 7,
  },
  dividerContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  line: {
    flex: 1,
    height: 1.5,
    backgroundColor: "#FFFFFF",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
