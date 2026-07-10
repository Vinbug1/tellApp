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
  ScrollView,
  Dimensions
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Input from "../utils/Input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import SimpleButton from "../utils/SimpleButton";
import baseUrl from "../../assets/baseUrl";
import * as ImagePicker from "expo-image-picker";
import {Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");


const EditProfile = () => {
  const navigation = useNavigation();
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading,setLoading]=useState(false);

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

            // 🔍 Debug: confirm what's actually in storage.
            // Once SignIn.js saves lastname correctly, this should
            // show a populated lastname field. Remove after confirming.
            console.log("Loaded user from storage:", user);

            setFirstName(user.firstname || "");
            setLastName(user.lastname || "");
            setPhone(user.phone || "");
            setEmail(user.email || "");
            setProfileImage(user.image || "");
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

      if (!result.canceled) {
        const selectedAsset = result.assets && result.assets.length > 0 ? result.assets[0] : null;

        if (selectedAsset) {
          setImage(selectedAsset.uri);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };



  
  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Validate inputs
      if (!firstname || !lastname || !phone || !email) {
        Toast.show("Please fill in all fields", Toast.LENGTH_SHORT);
        return;
      }

      // ✅ Fixed: userId + token are stored together in "userString" at login,
      // not under separate "userId"/"userToken" keys (which were never set,
      // so this always fell through to "Please login again" before).
      const userString = await AsyncStorage.getItem('userString');
      const userData = userString ? JSON.parse(userString) : null;
      const userId = userData?.userId;
      const token = userData?.token || (await AsyncStorage.getItem('token'));

      if (!userId || !token) {
        Toast.show("Please login again", Toast.LENGTH_SHORT);
        navigation.reset({
          index:0,
          routes:[{name:"SignIn"}]
      });        return;
      }
  
      console.log('📤 Updating profile for user:', userId);
  
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('firstname', firstname);
      formData.append('lastname', lastname);
      formData.append('phone', phone);
      formData.append('email', email);
  
      // Add image if selected
      if (image) {
        const imageUri = Platform.OS === 'ios' ? image.replace('file://', '') : image;
        const filename = image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('profileImage', {
          uri: imageUri,
          name: filename,
          type: type,
        });
        
        console.log('📷 Image attached:', filename);
      }
  
      // Send PUT request with FormData
      const response = await fetch(`${baseUrl}users/${userId}`, {
        method: "PUT",
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          // Note: Do NOT set Content-Type for FormData
          // The browser/fetch will set it automatically with boundary
        },
      });
  
      const data = await response.json();
      console.log('📥 Response:', data);
  
      if (response.ok) {
        console.log('✅ Profile updated successfully');

        // ✅ Fixed: keep "userString" and "token" (both used elsewhere in the
        // app) in sync after a successful edit, so other screens (e.g. Cases,
        // CaseCard) don't show stale name/image/token data.
        if (data.userDetails) {
          const mergedUser = { ...userData, ...data.userDetails };
          await AsyncStorage.setItem('userString', JSON.stringify(mergedUser));
        }

        if (data.token) {
          await AsyncStorage.setItem('token', data.token);
        }
        
        Toast.show("Profile updated successfully!", Toast.LENGTH_LONG);
        
        // Go back or navigate to profile screen
        navigation.goBack();
      } else {
        console.log('❌ Update failed:', data);
        Toast.show(data.message || "Failed to update profile", Toast.LENGTH_SHORT);
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      Toast.show(error.message || "An error occurred", Toast.LENGTH_SHORT);
    } finally{
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.icon}>
      <Ionicons name="arrow-back-circle-outline" size={33} color="#000A83" />
           </TouchableOpacity>

      <View style={{ position: "absolute", top: 95, alignSelf: "center", zIndex: 1 }}>
        <Text style={styles.headerText}>Edit Account</Text>
      </View>

          <View style={{ marginTop: 70, padding: 10 }}>
            <View style={{ flexDirection: "row", }}>
              <View>
              <Image
                  source={
                    image
                      ? { uri: image }
                      : profileImage
                      ? { uri: profileImage + "?t=" + Date.now() }
                      : require("../../assets/images/use.png")
                  }
                  style={styles.avatar}
                />
              </View>

              <TouchableOpacity onPress={pickImage} style={{ left: -17, bottom: -45 }}>
                <Ionicons name="camera" size={30} color="#000A83" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={{ marginLeft: 10 }}>FirstName</Text>
              <Input
                placeholder="Enter First Name"
                onChangeText={(text) => setFirstName(text)}
                value={firstname}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={{ marginLeft: 10 }}>LastName</Text>
              <Input
                placeholder="Enter Last Name"
                onChangeText={(text) => setLastName(text)}
                value={lastname}
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

          </View>

          <View style={styles.buttonContainer}>
          <SimpleButton
            onPress={handleSubmit}
            disabled={loading}
            buttonText={loading ? "Updating..." : "Update Account"}
        />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default EditProfile


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  buttonContainer:{
    marginTop:150,
    paddingHorizontal:15,
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
  avatar:{
    width: width*0.22,
    height: width*0.22,
    borderRadius:(width*0.22)/2,
    borderWidth:1,
    borderColor:"#ddd",
    alignSelf:"center",
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
    justifyContent: "flex-start",
    borderRadius: 50,
    height: 40,
    width: 40,
    top:Platform.OS === 'ios' ? 18 : 45,
    left: 28,
  },

});

