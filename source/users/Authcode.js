import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReactNativePinView from "react-native-pin-view";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-root-toast";
import SimpleButton from "../utils/SimpleButton";
import axios from "axios";
import baseUrl from "../../assets/baseUrl";

const Authcode = () => {
  const navigation = useNavigation();
  const pinView = useRef(null);
  const [tkn, setTkn] = useState("");
  const [email, setEmail] = useState("");
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [showCompletedButton, setShowCompletedButton] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("userString")
        .then((data) => {
          if (data) {
            const userdetails = JSON.parse(data);
            setTkn(userdetails.token);
            setEmail(userdetails.email);
          } else {
            console.log("Object not found in AsyncStorage");
          }
        })
        .catch((error) => {
          console.error("Error retrieving object:", error);
        });

      return () => {
        setTkn("");
        setEmail("");
        setEnteredPin("");
      };
    }, [])
  );

  useEffect(() => {
    setShowRemoveButton(enteredPin.length > 0);
    setShowCompletedButton(enteredPin.length === 6);
  }, [enteredPin]);

  const handleSubmitPress = async () => {
    if (enteredPin.length !== 6) {
      Toast.show("Please enter the 6-digit PIN", Toast.LENGTH_SHORT);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}users/verify-pin`,
        { email, pin: enteredPin },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tkn}`,
          },
        }
      );

      if (response.status === 200) {
        Toast.show("Account verified successfully!", Toast.LENGTH_SHORT);
        navigation.navigate("SignIn");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Verification failed. Please try again.";
      Toast.show(message, Toast.LENGTH_SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ position: "absolute", top: 65, left: 35 }}
      >
        <AntDesign name="left" size={20} color="black" />
      </TouchableOpacity>

      <View style={{ top: 15, alignSelf: "center" }}>
        <Text style={styles.headerText}>Authentication</Text>
      </View>

      <View style={{ marginTop: 55, alignItems: "center", width: "85%" }}>
        <Text style={styles.boldText}>Enter your authentication code</Text>
        <Text style={styles.normalText}>
          We have sent a 6-digit authentication code to your registered email
          to help you finish your registration.
        </Text>
      </View>

      <ReactNativePinView
        inputSize={56}
        ref={pinView}
        pinLength={6}
        onValueChange={(text) => setEnteredPin(text)}
        showInputText={true}
        inputTextStyle={{
          fontSize: 24,
          color: "#00021A",
          position: "absolute",
          top: -30,
          left: "50%",
          textAlign: "center",
          transform: [{ translateX: -12 }],
        }}
        inputAreaStyle={{
          marginTop: 74,
        }}
        inputViewFilledStyle={{
          borderWidth: 1,
          borderColor: "#00021A",
          backgroundColor: "transparent",
          width: 60,
          height: 2,
          borderRadius: 10,
        }}
        inputViewEmptyStyle={{
          backgroundColor: "transparent",
          height: 2,
          width: 60,
          backgroundColor: "#00021A",
          borderRadius: 10,
        }}
        buttonTextStyle={{
          color: "black",
        }}
        onButtonPress={(key) => {
          if (key === "custom_left") {
            pinView.current.clear();
            setEnteredPin("");
          }
        }}
        customLeftButton={
          showRemoveButton ? (
            <Ionicons name="backspace-outline" size={24} color="black" />
          ) : undefined
        }
        customRightButton={
          showCompletedButton ? (
            <AntDesign name="lock" size={24} color="black" />
          ) : undefined
        }
      />

      <View style={{ marginTop: 180 }}>
        <SimpleButton
          onPress={handleSubmitPress}
          buttonText={loading ? "Verifying..." : "Verify"}
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default Authcode;

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    paddingBottom: 48,
    fontWeight: "900",
    fontSize: 23,
  },
  normalText: {
    fontSize: 14,
  },
  boldText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#000A83",
  },
});
