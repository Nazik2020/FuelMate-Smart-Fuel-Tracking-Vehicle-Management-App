// app/login.tsx
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";




const { width } = Dimensions.get("window");

export const options = {
  headerShown: false,
};

export default function LoginPage() {
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
            />
          </View>
          <Text style={styles.label1}>Forgot Password?</Text>



        </View>
        <TouchableOpacity style={styles.signinbutton}>
          <Text style={styles.signinbuttontext}>sign In</Text>
        </TouchableOpacity>


        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.signinwithgooglebutton}>
          <AntDesign name="google" size={24}/>
          <Text style={styles.signinwithgooglebuttontext}>Sign in with Google</Text>
        </TouchableOpacity>

        <View style={styles.signupcontainer}>
          <Text style={styles.donttext}>Don’t have an account?</Text>
          <Pressable >
            <Text style={styles.signupText}>
              Sign Up
            </Text>
          </Pressable >

        </View>







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
  label1: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 6,
    marginTop: 16,
    textAlign: "right",
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
  signinbutton: {
    width: "100%",
    height: 50,
    backgroundColor: "#005F73",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  signinwithgooglebutton: {
    width: "100%",
    height: 50,
    backgroundColor: "#ffffffff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
  },

  signinbuttontext: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  signinwithgooglebuttontext: {
    color: "#000000ff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 7,
  },
  line: {
    flex: 1,
    height: 1.5,
    backgroundColor: "#FFFFFF",

  },



  dividerContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },

  dividerText: {
    marginHorizontal: 10,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  signupText: {
    marginHorizontal: 6,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  donttext: {
    color: "#FFFFFF",
    fontSize: 15,


  },
  signupcontainer: {
    flexDirection: "row",
    marginTop: 30,
    alignItems: "center",
  }








});
