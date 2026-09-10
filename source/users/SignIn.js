import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Input from "../utils/Input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import SimpleButton from "../utils/SimpleButton";
import baseUrl from "../../assets/baseUrl";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const SignIn = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Toast.show("Please enter email and password", { duration: Toast.durations.SHORT });
      return;
    }

    setIsLoading(true);

    try {
      const { data, status } = await axios.post(
        `${baseUrl}users/signin`,
        { email: email.trim().toLowerCase(), password },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );

      if (status === 200 && data.success) {
        if (!data.token) {
          Toast.show("Login failed: No token received", { duration: Toast.durations.SHORT });
          return;
        }

        // Save token separately for components that read it directly
        await AsyncStorage.setItem("token", data.token);

        // Save userId separately
        if (data.userId) {
          await AsyncStorage.setItem("userId", String(data.userId));
        }

        // Save full user details
        const userDetails = {
          userId: data.userId,
          token: data.token,
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          appEmail: data.appEmail,
          phone: data.phone,
          role: data.role,
          image: data.image,
          mustChangePassword: data.mustChangePassword,
        };

        await AsyncStorage.setItem("userDetails", JSON.stringify(userDetails));

        // Also save to userString for Authcode.js and other screens that read it
        await AsyncStorage.setItem("userString", JSON.stringify(userDetails));

        Toast.show("Login successful!", { duration: Toast.durations.SHORT });

        // wisejudge logs in with tempPassword first time — prompt password change
        if (data.mustChangePassword) {
          navigation.navigate("NewPassword");
          return;
        }

        navigation.navigate("MainScreen");

        // Navigate based on role — must match exactly what backend returns

      } else {
        Toast.show(data.message || "Login failed", { duration: Toast.durations.SHORT });
      }
    } catch (err) {
      if (err.response) {
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          "Login failed. Please try again.";
        Toast.show(errorMessage, { duration: Toast.durations.LONG });
      } else if (err.request) {
        Toast.show("Network error. Please check your connection.", {
          duration: Toast.durations.LONG,
        });
      } else {
        Toast.show("An error occurred. Please try again.", {
          duration: Toast.durations.SHORT,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ✅ Welcome text + logo now live inside the ScrollView's normal
              flow (instead of being absolutely positioned outside it), so
              they scroll up out of the way along with everything else when
              the keyboard opens, instead of staying fixed and getting
              covered by it. */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Welcome Back</Text>
            <Image
              source={require("../../assets/images/marklogo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.txt}>Email</Text>
              <Input
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
                value={email}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.txt}>Password</Text>
              <Input
                placeholder="Password"
                placeholderColor="#CCCEE6"
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={true}
                style={styles.input}
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
              style={styles.forgotPasswordLink}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <SimpleButton
              onPress={handleSubmit}
              buttonText={isLoading ? "Signing In..." : "Sign In"}
              disabled={isLoading}
            />
          </View>

          <TouchableOpacity
            style={styles.signUpLink}
            onPress={() => navigation.navigate("SignUp")}
            disabled={isLoading}
          >
            <Text style={styles.signUpLinkText}>
              <Text style={styles.normalText}>Don't have an account? </Text>
              <Text style={styles.boldText}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000E7A",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: height * 0.12,
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  headerContainer: {
    alignItems: "center",
  },
  headerText: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  logo: {
    width: width * 0.35,
    height: width * 0.35,
    marginTop: 16,
  },
  inputContainer: {
    marginTop: height * 0.01,
  },
  input: {
    backgroundColor: "#CCCEE6",
    borderRadius: 5,
    paddingHorizontal: 10,
    height: height * 0.06,
  },
  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotPasswordText: {
    fontWeight: "700",
    color: "#FFFFFF",
  },
  formContainer: {
    marginTop: height * 0.05,
    padding: width * 0.03,
  },
  buttonContainer: {
    marginTop: 140,
    borderBlockColor:" #FFFFFF"
  },
  signUpLink: {
    alignSelf: "center",
    marginTop: -60,
  },
  signUpLinkText: {
    color: "#000A83",
    fontSize: width * 0.035,
  },
  normalText: {
    fontSize: width * 0.04,
    color: "#FFFFFF",
  },
  boldText: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  txt: {
    color: "#FFFFFF",
    marginLeft: width * 0.03,
  },
});

export default SignIn;

