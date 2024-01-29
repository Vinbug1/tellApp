import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Dimensions
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Input from "../utils/Input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import SimpleButton from "../utils/SimpleButton";
import baseUrl from "../../assets/baseUrl";
import * as ImagePicker from "expo-image-picker";
import {AntDesign,Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");


const EditProfile = () => {
  const navigation = useNavigation();
  const [fullname, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  //const [userDetails, setUserDetails] = useState()

  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Toast.show("Sorry, we need camera roll permissions to make this work!", Toast.LENGTH_SHORT);
        }
      }
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("userString")
        .then((data) => {
          if (data) {
            const user = JSON.parse(data);
            setFullName(user.fullname);
            setPhone(user.phone);
            setEmail(user.email);
            setPassWord(user.password);
            // You might want to handle password and confirmPassword differently
          } else {
            console.log("Object not found in AsyncStorage");
          }
        })
        .catch((error) => {
          console.error("Error retrieving object:", error);
        });

      return () => {
        // Cleanup, if needed
      };
    }, [])
  );


  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      //console.log("ImagePicker Result:", result);

      if (!result.canceled) {
        // Use the first asset from the assets array
        const selectedAsset = result.assets && result.assets.length > 0 ? result.assets[0] : null;

        if (selectedAsset) {
          //console.log("Selected Image URI:", selectedAsset.uri);
          setImage(selectedAsset.uri);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };



  const handleSubmit = async () => {
    try {

      const user = { fullname, phone, email, password };
      if (password !== confirmPassword) {
        Toast.show("Password does not match", Toast.LENGTH_SHORT);

      } else {
        if (fullname === "" || phone === "" || email === "") {
          Toast.show("Please fill in your credentials", Toast.LENGTH_SHORT);
        } else {
          const response = await fetch(`${baseUrl}users/signup`, {
            method: "PUT",
            body: JSON.stringify(user),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            //console.log("checking out my details",data);
            AsyncStorage.setItem("userString", JSON.stringify(data));
            navigation.navigate("AuthVerifyScreen");
          } else {
            Toast.show("Please provide correct credentials", Toast.LENGTH_SHORT);
          }
        }

      }
    } catch (error) {
      Toast.show(error.message, Toast.LENGTH_SHORT);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.icon}>
      <AntDesign name="leftcircleo" size={33} color="#000A83" />
           </TouchableOpacity>

      <View style={{ position: "absolute", top: 95, alignSelf: "center" }}>
        <Text style={styles.headerText}>Edit Account</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled
      >

        <View style={{ marginTop: 70, padding: 10 }}>
          <View style={{ flexDirection: "row", }}>
            <View>
              {image ? (
                <Image source={{ uri: image }} style={styles.avatar} />
              ) : (
                <Image source={require('../../assets/images/use.png')} style={styles.avatar} />
              )}
            </View>

            <TouchableOpacity onPress={pickImage} style={{ left: -17, bottom: -45 }}>
              {/* <Text style={{ marginLeft: 10 }}>Image</Text> */}
              <Ionicons name="camera" size={30} color="#000A83" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={{ marginLeft: 10 }}>FullName</Text>
            <Input
              placeholder="Enter Full Name"
              onChangeText={(text) => setFullName(text)}
              value={fullname}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={{ marginLeft: 10 }}>PhoneNumber</Text>
            <Input
              placeholder="Enter Phone Number"
              onChangeText={(text) => setPhone(text)}
              value={phone}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={{ marginLeft: 10 }}>Email</Text>
            <Input
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
          </View>

          {/* <View style={styles.inputContainer}>
          <Text style={{ marginLeft: 10 }}>Password</Text>
          <Input
            placeholder="Password"
            placeholderColor="#CCCEE6"
            onChangeText={(text) => setPassWord(text)}
            value={password}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={{ marginLeft: 10 }}>ConfirmPassword</Text>
          <Input
            placeholder="Confirm Password"
            placeholderColor="#CCCEE6"
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            secureTextEntry={true}
          />
        </View> */}

        </View>



        <View style={{ bottom: -240 }}>
          <SimpleButton
            onPress={() => handleSubmit()}
            buttonText="Update Account"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default EditProfile


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "500",
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
    fontSize: 16, // Other styles for normal text
    margin: 35,
  },
  boldText: {
    fontSize: 16,
    fontWeight: "bold", // Other styles for bold text
  },
  marginRight: {
    margin: 35, // Adjust the spacing as needed
  },
  avatar: {
    width: width * 0.20,
    height: width * 0.20,
    borderRadius: (width * 0.8) / 2,
    alignSelf: "center",
    marginTop: 7,
    borderColor: "whitesmoke",
    borderWidth: 1,
    top: -15,

  },
  imageContainer: {
    marginTop: 10,
    position: "relative",
  },
  image: {
    width: 50,
    height: 50,
    alignSelf: "center",
  },
  editButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    padding: 5,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 5,
  },
  icon: {
    //backgroundColor: "whitesmoke",
    //alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 50,
    height: 40,
    width: 40,
    //position: "absolute",
    top: 18,
    left: 28,
  },

});