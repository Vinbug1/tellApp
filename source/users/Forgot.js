import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import { AntDesign } from "@expo/vector-icons";

import Input from "../utils/Input";
import SimpleButton from "../utils/SimpleButton";
import baseUrl from "../../assets/baseUrl";

const { width, height } = Dimensions.get("window");

const Forgot = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      Toast.show("Please enter your registered email.", {
        duration: Toast.durations.SHORT,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}users/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("resetEmail", trimmedEmail);

        Toast.show(
          data.message || "Reset PIN has been sent to your email.",
          {
            duration: Toast.durations.LONG,
          }
        );

        navigation.navigate("NewPassword");
      } else {
        Toast.show(
          data.message || "Unable to process your request.",
          {
            duration: Toast.durations.LONG,
          }
        );
      }
    } catch (error) {
      console.log(error);

      Toast.show(
        "Network error. Please check your internet connection.",
        {
          duration: Toast.durations.LONG,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <AntDesign name="left" size={22} color="black" />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Forgot Password</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.instructionsContainer}>
          <Text style={styles.boldText}>
            Enter your registered email address
          </Text>

          <Text style={styles.normalText}>
            We'll send a verification PIN to your registered email so you can
            reset your password.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>

          <Input
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        <View style={styles.buttonContainer}>
          <SimpleButton
            onPress={handleSubmit}
            buttonText={loading ? "Sending..." : "Continue"}
            disabled={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Forgot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },

  backButton: {
    position: "absolute",
    top: height * 0.08,
    left: width * 0.08,
    zIndex: 100,
    padding: 10,
  },

  headerContainer: {
    alignSelf: "center",
    marginTop: height * 0.08,
  },

  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000A83",
  },

  keyboardContainer: {
    flex: 1,
  },

  instructionsContainer: {
    marginTop: height * 0.1,
    alignItems: "center",
    paddingHorizontal: 25,
  },

  boldText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000A83",
    textAlign: "center",
  },

  normalText: {
    marginTop: 10,
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },

  inputContainer: {
    marginTop: height * 0.05,
    paddingHorizontal: 20,
  },

  inputLabel: {
    marginLeft: 10,
    marginBottom: 5,
    fontWeight: "500",
  },

  buttonContainer: {
    marginTop: height * 0.18,
    paddingHorizontal: 20,
  },
});



