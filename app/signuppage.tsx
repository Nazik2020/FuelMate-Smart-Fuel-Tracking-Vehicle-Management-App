import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../firebase/firebaseConfig";

const { width } = Dimensions.get("window");

export const options = {
  headerShown: false,
};

// ✅ Email validation function
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function signuppage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {

    if (!email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // 1️⃣ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 2️⃣ Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user",
        createdAt: serverTimestamp(),
        notificationsEnabled: true,
        darkMode: false,
      });

      alert("Signup successful!");

      // ✅ Clear input fields after success
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      alert(errorMessage);
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
        <Text style={styles.title}>Welcome to fuel mate</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Sign up to continue tracking your fuel expenses
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
              onChangeText={(text) => setEmail(text.trim())}
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

          {/* Confirm Password */}
          <Text style={styles.label}>Re Enter Password</Text>
          <View style={styles.inputBox}>
            <MaterialIcons name="lock" size={22} color="#9a9696ff" />
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#83888B"
              secureTextEntry
              style={styles.input}
              autoCapitalize="none"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

        </View>

        <TouchableOpacity style={styles.signupbutton} onPress={handleSignup}>
          <Text style={styles.signupbuttontext}>Sign Up</Text>
        </TouchableOpacity>

        {/*<View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.signupwithgooglebutton}>
          <AntDesign name="google" size={24} />
          <Text style={styles.signupwithgooglebuttontext}>
            Sign up with Google
          </Text>
        </TouchableOpacity>*/}

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
  logo: {
    width: 80,
    height: 80,
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 6,
    marginTop: 16,
  },
  inputBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 50,
    width: "100%",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
    width: "90%",
  },
  signupbutton: {
    width: "100%",
    height: 50,
    backgroundColor: "#005F73",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  signupbuttontext: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
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
