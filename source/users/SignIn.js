import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Input from "../utils/Input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import SimpleButton from "../utils/SimpleButton";
 import baseUrl from "../../assets/baseUrl";
 import axios from "axios";

const SignIn = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    let data = JSON.stringify({
      email: email,
      password: password
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url:`${baseUrl}users/signin`,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios.request(config)
    .then((response) => {
      if (response.status === 200) {
        const userData = response.data;
        const userRole = userData.role;

        // Save user role to AsyncStorage
        AsyncStorage.setItem("userRole", userRole);

        // Navigate based on user role
        if (userRole === 'wiseJudge') {
          navigation.navigate("AdminScreen");
        } else if (userRole === 'user' || userRole === '') {
          navigation.navigate("MainScreen");
        } else {
          console.log("Unsupported user role:", userRole);
        }
      } else {
        Toast.show(response.message, Toast.LENGTH_SHORT);
      }

      //   console.log("just a look through",userData);
      //   AsyncStorage.setItem("userString", JSON.stringify(userData));
      //   navigation.navigate("MainScreen");
      // } else {
      //   Toast.show(response.message, Toast.LENGTH_SHORT);
      // }
    })
    .catch((error) => {
      console.log(error);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{position:"absolute",top:65, alignSelf:"center"}}>
        <Text style={styles.headerText}>Welcome Back</Text>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
       {/* <ScrollView style={styles.inputContainer}> */}
          <View style={{ marginTop: 90 }}>
            <Image
              source={require("../../assets/images/tellogo.png")}
              resizeMode="contain"
              style={styles.image}
            />
          </View>
       <ScrollView contentContainerStyle={styles.scrollContainer}>

          <View style={{ marginTop: 40, padding: 10 }}>
            <View style={styles.inputContainer}>
              <Text style={{ marginLeft: 10 }}>Email</Text>
              <Input
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
                value={email}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={{ marginLeft: 10 }}>Password</Text>
              <Input
                placeholder="Password"
                placeholderColor="#CCCEE6"
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={true}
              />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")} style={{ position: "absolute", top: 195, right: 20 }}>
              <Text style={{ fontWeight: "700", color: "#000A83" }}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 180 }}>
            <SimpleButton
              onPress={() => handleSubmit()}
              buttonText="Sign In"
            />

          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={styles.signUpLink}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={styles.signUpLinkText}>
              <Text style={styles.normalText}>Don't have an account? </Text>
              <Text style={styles.boldText}>SignUp</Text>
            </Text>
          </TouchableOpacity>

       </ScrollView>
       </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center",
  },
  subHeaderText: {
    fontSize: 13,
    alignSelf: "center",
  },
  image: {
    width: "100%",
  },
  inputContainer: {
    marginTop: 5,
  },
  
  errorText: {
    color: "red",
    fontSize: 16,
    alignSelf: "center",
    marginTop: 10,
  },
  signUpLink: {
    alignSelf: "center",
    position:"absolute",
    bottom: 40,
    flexDirection: "row",
  },
  signUpLinkText: {
    color: "black",
    fontSize: 14,
    fontWeight: "normal",
    color: "#000A83",
  },
  normalText: {
    fontSize: 16, // Adjust the size as needed
  },
  boldText: {
    fontSize: 16, // Adjust the size as needed
    fontWeight: "bold", // Make the text bold
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  
});

export default SignIn;
