import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  KeyboardAvoidingView,

} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Input from "../utils/Input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import SimpleButton from "../utils/SimpleButton";
import { Dropdown } from "react-native-element-dropdown";
import salves from "../utils/Salve";
import cases from "../utils/Case";
import axios from 'axios';
import baseUrl from '../../assets/baseUrl';

const CreatCase = () => {
  const navigation = useNavigation();
  const [caseCat, setCaseCat] = useState([]);
  const [defendantName, setDefendantName] = useState("");
  const [defendantPhone, setDefendantPhone] = useState("");
  const [defendantEmail, setDefendantEmail] = useState("");
  const [caseCategory, setCaseCategory] = useState('');
  const [church, setChurch] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [relationship, setRelationship] = useState("");
  const [salvation, setSalvation] = useState("");
  const [caseType, setCaseType] = useState("");
  const [user, setUser] = useState("");
  const [tkn, setTkn] = useState("");
  const [error, setError] = useState(null);

  const fetchDataFromDatabase = async () => {
    // const axios = require('axios');
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${baseUrl}caseCategories/`,
      headers: {}
    };
    axios.request(config)
      .then((response) => {
        setCaseCat(response.data);
        //console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

  };

  useEffect(() => {
    fetchDataFromDatabase();
    AsyncStorage.getItem("userString")
      .then((data) => {
        if (data) {
          const user = JSON.parse(data);
          setUser(user.userId);
          setTkn(user.token);
        } else {
          console.log("Object not found in AsyncStorage");
        }
      }).catch((error) => {
        console.error("Error retrieving object:", error);
      });
    return () => {
      setUser();
    }
    //console.log("Updated Case Category:", caseCategory);
  }, []);

  const handleSubmit = async () => {
    try {
      const casedetail = { church, position, department, relationship, salvation, defendantName, defendantEmail, defendantPhone, caseType, user, tkn, caseCategory };
      if (church === "" || position === ""|| department === "" || relationship === "" || salvation === "" || defendantName === "" || defendantPhone === "" || defendantEmail === ""||caseType === "") {
        Toast.show("Please fill in your credentials", Toast.LENGTH_SHORT);
      } else {
        //console.log("checking details...", casedetail);
      AsyncStorage.setItem("caseString", JSON.stringify(casedetail));
      navigation.navigate("MoreCaseScreen");
     };
      // if (response.ok) {
      //   const data = await response.json();
      //}
    } catch (error) {
      Toast.show(error.message, Toast.LENGTH_SHORT);
    }
  };

  const renderSalvation = (salves) => (
    <View style={styles.dropdownItem}>
      <Text style={styles.textItem}>{salves.name}</Text>
    </View>
  );
  const renderCaseType = (cases) => (
    <View style={styles.dropdownItem}>
      <Text style={styles.textItem}>{cases.name}</Text>
    </View>
  );

  // Render case category dropdown
  const renderCaseCat = (item) => (
    <View style={styles.dropdownItem}>
      <Text style={styles.textItem}>{item.name}</Text>
    </View>
  );

  const handleCaseCategorySelection = (selectedCase) => {
    const selectedCategoryId = selectedCase._id;

    if (!selectedCategoryId) {
      console.error("Error: Could not retrieve _id from selected case category.");
      // Handle this error gracefully if needed
      return;
    }

    console.log("Selected Case Category ObjectId:", selectedCategoryId);
    setCaseCategory(selectedCategoryId);
    console.log("Selected Case Category CaseCategory:", caseCategory);
  };



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false} // Set this prop to false to hide the scrollbar
        contentContainerStyle={{ flexGrow: 1, }}
      >
        <View style={{ position: "absolute", top: 25, alignSelf: "center" }}>
          <Text style={styles.headerText}>Case Details Form</Text>
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          enabled
        >

          <View style={{ marginTop: Platform.OS === "ios" ? 70 : 115, padding: 10 }}>
            <View style={styles.inputContainer}>
              <Text style={{ marginLeft: 10 }}>CaseCategory</Text>
              <Dropdown
                style={styles.dropdown}
                data={caseCat}
                labelField="name"
                valueField="_id" // assuming _id is the ObjectId field
                value={caseCategory}
                search
                placeholder="Select case"
                searchPlaceholder="Search..."
                onChange={handleCaseCategorySelection}
                renderItem={renderCaseCat}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={{ marginLeft: 10 }}>Defendant fullname</Text>
              <Input
                placeholder="defenedant Name"
                onChangeText={(text) => setDefendantName(text)}
                value={defendantName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={{ marginLeft: 10 }}>Defendant PhoneNumber</Text>
              <Input
                placeholder="Phone Number"
                onChangeText={(text) => setDefendantPhone(text)}
                value={defendantPhone}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={{ marginLeft: 10 }}>Defendant email</Text>
              <Input
                placeholder="Defendant email"
                onChangeText={(text) => setDefendantEmail(text)}
                value={defendantEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={{ marginLeft: 10 }}>Name of defendant church</Text>
              <Input
                placeholder="Church Name"
                onChangeText={(text) => setChurch(text)}
                value={church}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={{ marginLeft: 10 }}>Position in Church </Text>
              <Input
                placeholder="Position"
                onChangeText={(text) => setPosition(text)}
                value={position}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={{ marginLeft: 10 }}>Department in Church</Text>
              <Input
                placeholder="Department"
                onChangeText={(text) => setDepartment(text)}
                value={department}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={{ marginLeft: 10 }}>Relationship Of defendant</Text>
              <Input
                placeholder="Relationship"
                onChangeText={(text) => setRelationship(text)}
                value={relationship}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={{ marginLeft: 10 }}>Are you bornagain?(Complainant)</Text>
              <Dropdown
                style={styles.dropdown}
                data={salves}
                labelField="name"
                valueField="value"
                value={salvation}
                search
                placeholder="Select salvation"
                searchPlaceholder="Search..."
                onChange={(salvation) => {
                  setSalvation(salvation.value);
                }}
                renderItem={renderSalvation}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={{ marginLeft: 10 }}>CaseType</Text>
              <Dropdown
                style={styles.dropdown}
                data={cases}
                labelField="name"
                valueField="value"
                value={caseType}
                search
                placeholder="Select case"
                searchPlaceholder="Search..."
                onChange={(selectedCase) => {
                  setCaseType(selectedCase.value);
                }}
                renderItem={renderCaseType}
              />
            </View>

            <View style={{ marginTop: 180 }}>
              <SimpleButton
                onPress={() => handleSubmit()}
                buttonText="Next"
              />
            </View>
          </View>

        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CreatCase


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
  txtsmd: {
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 9,
  },
  dropdownItem: {
    paddingHorizontal: 16, // Add left and right padding for spacing
    paddingVertical: 10, // Add top and bottom padding for spacing
  },
});