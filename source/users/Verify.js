import Icon from "react-native-vector-icons/Ionicons";
import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  
} from "react-native";
import ReactNativePinView from "react-native-pin-view";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-root-toast";
import SimpleButton from "../utils/SimpleButton";
import { AntDesign } from "@expo/vector-icons";
// import { VerificationPin, StatusType } from "react-verification-pin";


const Verify = () => {
  const navigation = useNavigation();
  const pinView = useRef(null);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [enteredPin, setEnteredPin] = useState(""); // Initialize with '0'
  const [showCompletedButton, setShowCompletedButton] = useState(false);

  useEffect(() => {
    // Handle the case when the enteredPin is empty
    if (!enteredPin) {
      setEnteredPin("0");
    }
  }, [enteredPin]);

  const handleSubmitPress = () => {
    let dataToSend = { pin: enteredPin };

    axios({
      method: "POST",
      url: `${baseUrl}loginpin`,
      data: JSON.stringify(dataToSend),
      headers: {
        "Content-Type": "application/json",
        // Authorization: "Bearer " + responseJson.data,
      },
    })
      .then((responseJson) => {
        if (responseJson.status === 200) {
          navigation.navigate("NewPassword");
        }
      })
      .catch((error) => {
        Toast.show(error.message, Toast.SHORT);
      });
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{position:"absolute", top:65,left: 35 }}>
            <AntDesign name="left" size={20} color="black" />
             </TouchableOpacity>
             
             <View style={{  top:15, alignSelf: "center" }}>
                <Text style={styles.headerText}>Verification </Text>
            </View>
      
            <View style={{  marginTop:55, alignItems: "center", width: "85%" }}>
                        <Text style={styles.boldText}>Please enter your verification code.</Text>
                            <Text style={styles.normalText}>We have sent a verification code to your registered email.</Text>
                    </View>
      <ReactNativePinView
        inputSize={56}
        ref={pinView}
        pinLength={4}
        onValueChange={(text) => setEnteredPin(text)}
        showInputText={true} // Set to false to hide default input text
        inputTextStyle={{
          fontSize: 24,
          color: "#00021A",
          position: "absolute",
          top: -30,
          left: "50%",
          textAlign: "center",
          transform: [{ translateX: -12 }], // Center the text
        }}
        // buttonAreaStyle={{
        //   marginTop: 24,
        // }}
        inputAreaStyle={{
          marginTop: 74,
        }}

        inputViewFilledStyle={{
          borderWidth: 1,
          borderColor:  "#00021A",
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
        //buttonViewStyle={{}}
        buttonTextStyle={{
          color: "black",
        }}
       
        // keyboardProps={{
        //   keyboardType: Platform.OS === "ios" ? "number-pad" : "numeric", // Use device keyboard
        // }}
      />

      <View style={{ marginTop: 180 }}>
        <SimpleButton
          onPress={() => handleSubmitPress()}
          buttonText="Verify"
        />
      </View>
    </SafeAreaView>
  );
};

export default Verify;

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText:{
    //paddingTop: -125,
    paddingBottom: 48,
    fontWeight: '900',
    fontSize: 23,
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
});
