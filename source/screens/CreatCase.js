import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  KeyboardAvoidingView, TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Input from "../utils/Input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import SimpleButton from "../utils/SimpleButton";
import { Dropdown } from "react-native-element-dropdown";
import salves from "../utils/Salve";
import cases from "../utils/Case";
import axios from "axios";
import baseUrl from "../../assets/baseUrl";
import { Ionicons } from '@expo/vector-icons';

const CreatCase = () => {
  const navigation = useNavigation();
  const [caseCat, setCaseCat] = useState([]);
  const [formData, setFormData] = useState({
    defendantName: "",
    defendantPhone: "",
    defendantEmail: "",
    caseCategory: "",
    church: "",
    position: "",
    department: "",
    relationship: "",
    salvation: "",
    caseType: "",
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`${baseUrl}caseCategories/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCaseCat(response.data);
      } catch (error) {
        console.error("Error fetching case categories:", error);
      }
    };

    const getUserData = async () => {
      try {
        const data = await AsyncStorage.getItem("userString");
        if (data) {
          const parsedData = JSON.parse(data);
          setUser({ userId: parsedData.userId, token: parsedData.token });
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };

    fetchData();
    getUserData();
  }, []);

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
  };

  const handleSubmit = async () => {
    const {
      church,
      position,
      department,
      relationship,
      salvation,
      defendantName,
      defendantEmail,
      defendantPhone,
      caseType,
      caseCategory,
    } = formData;
  
    if (Object.values(formData).some((field) => field === "")) {
      Toast.show("Please fill in all fields", Toast.LENGTH_SHORT);
      return;
    }
  
    try {
      const caseDetail = { ...formData, user: user?.userId, tkn: user?.token };
      await AsyncStorage.setItem("caseString", JSON.stringify(caseDetail));
      
      // Clear the form after successful submission
      setFormData({
        defendantName: "",
        defendantPhone: "",
        defendantEmail: "",
        caseCategory: "",
        church: "",
        position: "",
        department: "",
        relationship: "",
        salvation: "",
        caseType: "",
      });
      
      navigation.navigate("MoreCaseScreen");
    } catch (error) {
      Toast.show(error.message, Toast.LENGTH_SHORT);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.icon}>
            <Ionicons name="arrow-back-circle-outline" size={33} color="#000A83" />
          </TouchableOpacity>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Case Details Form</Text>
        </View>
          <View style={styles.formContainer}>
            <Dropdown
              style={styles.dropdown}
              data={caseCat}
              labelField="name"
              valueField="_id"
              placeholder="Select case"
              searchPlaceholder="Search..."
              value={formData.caseCategory}
              onChange={(item) => handleInputChange("caseCategory", item._id)}
            />

            {[
              { label: "Defendant Full Name", key: "defendantName" },
              { label: "Defendant Phone Number", key: "defendantPhone" },
              { label: "Defendant Email", key: "defendantEmail" },
              { label: "Church Name", key: "church" },
              { label: "Position in Church", key: "position" },
              { label: "Department in Church", key: "department" },
              { label: "Relationship to Defendant", key: "relationship" },
            ].map((field) => (
              <View style={styles.inputContainer} key={field.key}>
                <Text style={styles.inputLabel}>{field.label}</Text>
                <Input
                  placeholder={field.label}
                  onChangeText={(text) => handleInputChange(field.key, text)}
                  value={formData[field.key]}
                />
              </View>
            ))}

            <Dropdown
              style={styles.dropdown}
              data={salves}
              labelField="name"
              valueField="value"
              placeholder="Select salvation"
              searchPlaceholder="Search..."
              value={formData.salvation}
              onChange={(item) => handleInputChange("salvation", item.value)}
            />

            <Dropdown
              style={styles.dropdown}
              data={cases}
              labelField="name"
              valueField="value"
              placeholder="Select case type"
              searchPlaceholder="Search..."
              value={formData.caseType}
              onChange={(item) => handleInputChange("caseType", item.value)}
            />

            <View style={styles.buttonContainer}>
              <SimpleButton onPress={handleSubmit} buttonText="Next" />
            </View>
          </View>
      </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreatCase;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    position: "absolute",
    top: 25,
    alignSelf: "center",
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  keyboardContainer: {
    flex: 1,
  },
  formContainer: {
    marginTop: Platform.OS === "ios" ? 70 : 115,
    padding: 10,
  },
  inputContainer: {
    marginTop: 5,
  },
  inputLabel: {
    marginLeft: 10,
  },
  dropdown: {
    width: "95%",
    height: 48,
    margin: 6,
    borderRadius: 5,
    padding: 5,
    alignSelf: "center",
    borderColor: "#000A83",
    borderWidth: 1,
  },
  buttonContainer: {
    marginTop: 180,
  },
  scrollContainer: {
    paddingBottom: 35,
  },
  icon: {
    backgroundColor: "whitesmoke",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    height: 40,
    width: 40,
    top: 35,
    left: 12,
},
});



