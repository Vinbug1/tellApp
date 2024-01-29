import React, { useState,useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { useNavigation,useFocusEffect } from "@react-navigation/native";
import Input from "../utils/Input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import SimpleButton from "../utils/SimpleButton";
import { AntDesign } from '@expo/vector-icons';
import baseUrl from "../../assets/baseUrl"
import axios from "axios";

const ChangePassword = () => {
    const navigation = useNavigation();
    const [newPassword, setNewPassword] = useState("");
    const [email, setEmail] = useState("");
    const [tkn, setTkn] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
  

    useFocusEffect(
      useCallback(() => {
        AsyncStorage.getItem("userString")
          .then((data) => {
            if (data) {
              //console.log(data);
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
          // if (!enteredPin) {
          //   setEmail("");
          // }
  
        return () => {
          setTkn();
          setEmail();
        };
      }, [])
    );
    const handleSubmit = async () => {

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }else{

          let data = JSON.stringify({
            email: email,
            newPassword: newPassword
          });
          
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${baseUrl}users/reset-password`,
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': `Bearer${tkn}`
            },
            data : data
          };
          
          axios.request(config)
          .then((response) => {
            if (response.status === 200) {
              navigation.navigate("SignIn");
            } else {
              Toast.show(response.data.message, Toast.LENGTH_SHORT);
            }
    
          })
          .catch((error) => {
            console.log(error);
          });
      }

      
    };
    
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{position:"absolute", top:65,left: 35 }}>
            <AntDesign name="left" size={20} color="black" />
        </TouchableOpacity>
        <View style={{ top:15, alignSelf: "center" }}>
          <Text style={styles.headerText}>New Password</Text>
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          enabled
        >
  
          <View style={{ marginTop: 70, padding: 10 }}>
          <View style={{ left: 10, top: 75, alignItems: "center", width: "85%" }}>
                        <Text style={styles.boldText}>Please enter new password.</Text>                       
                        <Text style={styles.normalText}>We have sent a verification code to your registered email</Text>
                    </View>
  
            <View style={styles.inputContainer}>
              <Text style={{ marginLeft: 10 }}>NewPassword</Text>
              <Input
                placeholder="NewPassword"
                placeholderColor="#CCCEE6"
                onChangeText={(text) => setNewPassword(text)}
                value={newPassword}
                secureTextEntry={true}
              />
              <Text style={{ marginLeft: 10 }}>ConfirmPassword</Text>
              <Input
                placeholder="Confirm Password"
                placeholderColor="#CCCEE6"
                onChangeText={(text) => setConfirmPassword(text)}
                value={confirmPassword}
                secureTextEntry={true}
              />
            </View>
  
          </View>
  
  
  
          <View style={{ marginTop: 180 }}>
            <SimpleButton
              onPress={() => handleSubmit()}
              buttonText="Reset"
            />
          </View>
  
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
}

export default ChangePassword


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFFFFF",
      justifyContent: "center",
    },
    headerText: {
      fontSize: 25,
      fontWeight: '900',
      alignSelf: "center",
    },
    subHeaderText: {
      fontSize: 13,
      alignSelf: "center",
      color: "#000A83"
    },
    image: {
      width: "100%",
    },
    inputContainer: {
      marginTop: 125,
    },
  
    errorText: {
      color: "red",
      fontSize: 16,
      alignSelf: "center",
      marginTop: 10,
    },
    signUpLink: {
      alignSelf: "center",
      position: "absolute",
      bottom: 35,
      flexDirection: "row",
    },
    signUpLinkText: {
      color: "black",
      fontSize: 14,
      fontWeight: "normal",
      color: "#000A83",
    },
    signUpLinkTt: {
      color: "black",
      fontSize: 14,
      fontWeight: "normal",
      color: "#000A83",
    },
    normalText: {
      fontSize: 16,// Other styles for normal text
      margin: 5,
    },
    boldText: {
      fontSize: 16,
      fontWeight: '900',
      color: "#000A83" // Other styles for bold text
    },
    marginRight: {
      margin: 35, // Adjust the spacing as needed
    },
  
  
  });