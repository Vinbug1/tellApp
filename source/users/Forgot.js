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

} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Input from "../utils/Input";
import SimpleButton from "../utils/SimpleButton";
import { AntDesign } from '@expo/vector-icons';

const Forgot = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        try {
          const user = { email };
          if (email === "") {
            Toast.show("Please fill in your credentials", Toast.LENGTH_SHORT);
          } else {
            const response = await fetch(`${baseUrl}users/forgot-password`, {
              method: "POST",
              body: JSON.stringify(user),
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              const data = await response.json();
            //   AsyncStorage.setItem("userString", JSON.stringify(data));
        navigation.navigate("NewPassword");
            } else {
              Toast.show("Please provide correct credentials", Toast.LENGTH_SHORT);
            }
          }
        } catch (error) {
          Toast.show(error.message, Toast.LENGTH_SHORT);
        }
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{position:"absolute", top:65,left: 35 }}>
            <AntDesign name="left" size={20} color="black" />
             </TouchableOpacity>
            <View style={{  top:15, alignSelf: "center" }}>
                <Text style={styles.headerText}>Forgot Password</Text>
            </View>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                enabled
            >

                <View style={{ marginTop: 70, padding: 10 }}>
                    <View style={{  top: 75, alignItems: "center", width: "85%" }}>
                        <Text style={styles.boldText}> Please enter your registered email. </Text>
                            <Text style={styles.normalText}>  We will send an email instruction to your registered email to reset your password. </Text>
                    </View>


                    <View style={styles.inputContainer}>
                        <Text style={{ marginLeft: 10,marginTop:20 }}>Email</Text>
                        <Input
                            placeholder="Email"
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                        />
                    </View>
                </View>

                <View style={{ marginTop: 180 }}>
                    <SimpleButton
                        onPress={() => handleSubmit()}
                        buttonText="Continue"
                    />
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Forgot


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
    },
    image: {
        width: "100%",
    },
    inputContainer: {
        marginTop: 95,
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
        fontSize: 14,// Other styles for normal text
        //margin: 35,
    },
    boldText: {
        fontSize: 18,
        fontWeight: '900',
        color: "#000A83",

        // Other styles for bold text
    },
    marginRight: {
        margin: 35, // Adjust the spacing as needed
    },


});