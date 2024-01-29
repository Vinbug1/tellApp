import React, { useState, useCallback } from "react";
import {  SimpleLineIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import AuthGlobal from "../../Context/store/AuthGlobal";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
const { width } = Dimensions.get("window");

const ProfileHeader = () => {
    const [userName, setUserName] = useState();
    const [userImage, setUserImage] = useState(require("../../assets/images/use.png")); // Provide the path to your default image
  
    useFocusEffect(
      useCallback(() => {
        AsyncStorage.getItem("userString")
          .then((data) => {
            if (data) {
              const user = JSON.parse(data);
              //console.log(user);
              setUserName(user);
              // Assuming user.image contains the path to the user's image
              setUserImage({ uri: user.image || "../../assets/images/use.png"});
            } else {
              console.log("Object not found in AsyncStorage");
            }
          })
          .catch((error) => {
            console.error("Error retrieving object:", error);
          });
  
        return () => {
          //setUserDetails();
        };
      }, [])
    );
  
    return (
      <View style={styles.avatarContainer}>
        <View style={styles.avatarWrapper}>
        <Image 
     source={userImage.url ? { uri: userImage.url } : require('../../assets/images/use.png')}
     style={styles.avatar}  resizeMode='contain'/>
          <View style={{ marginTop: 5 }}>
            <Text style={styles.txt}>{userName?.fullname}</Text>
            <Text style={styles.txt}>{userName?.email}</Text>
          </View>
        </View>
      </View>
    );
  };

export default ProfileHeader

const styles = StyleSheet.create({
    avatarContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: Platform.OS === "ios" ? 15 : 45,
      marginLeft: width * 0.04,
      marginRight: width * 0.04,
    },
    avatarWrapper: {
      flexDirection: "row",
      alignSelf: "center",
    },
    avatar: {
      width: width * 0.16,
      height: width * 0.16,
      borderRadius: (width * 0.8) / 2,
      borderColor: "whitesmoke",
      //borderWidth: 1,
      top: -15
    },
    hdtxt: {
      paddingLeft: 12,
      fontSize: 16,
      fontWeight: "400",
      color: "#000A83",
    },
    txt: {
      paddingLeft: 12,
      fontSize: 16,
      fontWeight: "500",
    },
    bellIconWrapper: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
      marginRight: width * 0.02,
      marginTop: 5,
    },
    icon: {
      padding: 5,
    },
  });