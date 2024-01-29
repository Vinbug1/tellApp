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
import { Dropdown } from "react-native-element-dropdown";
import usercategories from "../utils/UserCat";

const SignUp = () => {
  const navigation = useNavigation();
  const [fullname, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {

      const user = { fullname,phone, email, password};
  if (password !== confirmPassword) {
    Toast.show("Password does not match", Toast.LENGTH_SHORT);
    
  }else{
    if (fullname === ""||phone === "" ||email === "" || password === "" || role === "" ) {
      Toast.show("Please fill in your credentials", Toast.LENGTH_SHORT);
    } else {
      const response = await fetch(`${baseUrl}users/signup`, {
        method: "POST",
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

  const renderUserCategory = (usercategories) => (
    <View style={styles.dropdownItem}>
      <Text style={styles.textItem}>{usercategories.name}</Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false} // Set this prop to false to hide the scrollbar
        contentContainerStyle={styles.scrollContainer}
      >
      <View style={{ position: "absolute", top: 25, alignSelf: "center" }}>
        <Text style={styles.headerText}>Create New Account</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled
      >
        <View style={{ marginTop: 70, padding: 10 }}>
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
          <View style={styles.inputContainer}>
            <Text style={{ marginLeft: 10 }}>ConfirmPassword</Text>
            <Input
              placeholder="Confirm Password"
              placeholderColor="#CCCEE6"
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
              secureTextEntry={true}
            />
          </View>
          <View style={styles.inputContainer}>
              <Text style={{ marginLeft: 10 }}>User Category</Text>
              <Dropdown
                style={styles.dropdown}
                data={usercategories}
                labelField="name"
                valueField="value"
                value={role}
                search
                placeholder="Select role"
                searchPlaceholder="Search..."
                onChange={(role) => {
                  setRole(role.value);
                }}
                renderItem={renderUserCategory}
              />
            </View>

          <View style={{ left: 10, bottom: -13, alignItems: "center", widht: "85%" }}>
            <Text style={styles.signUpLinkTt}>
              <Text style={styles.normalText}>By signing up, you agree to the </Text>
              <Text style={[styles.boldText, styles.marginRight]}>Terms of services  </Text>
              <Text style={styles.normalText}>and  </Text>
              <Text style={[styles.boldText, styles.marginRight]}>privacy policy, </Text>
              <Text style={styles.normalText}>including </Text>
              <Text style={[styles.boldText, styles.marginRight]}>cookie use</Text>
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 180 }}>
          <SimpleButton
            onPress={() => handleSubmit()}
            buttonText="Sign Up"
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity
          style={styles.signUpLink}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.signUpLinkText}>
            <Text style={styles.normalText}>Already have an account? </Text>
            <Text style={styles.boldText}>SignIn</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp


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
    position: "absolute",
    bottom: 45,
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
    margin: 35,
  },
  boldText: {
    fontSize: 16,
    fontWeight: "bold",
    // Other styles for bold text
  },
  marginRight: {
    margin: 35, // Adjust the spacing as needed
  },
  dropdown: {
    width: "95%",
    height: 48,
    //backgroundColor: "green",
    margin: 6,
    borderRadius: 5,
    padding: 5,
    alignSelf: "center",
    borderColor: "#000A83",
    borderWidth: 1,
  },
  dropdownItem: {
    paddingHorizontal: 16, // Add left and right padding for spacing
    paddingVertical: 10, // Add top and bottom padding for spacing
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: -50, // Add paddingBottom to avoid the bouncing behavior
  }
});