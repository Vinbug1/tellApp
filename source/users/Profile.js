import React from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ProfileHeader from "./ProfileHeader";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Profile = () => {
  const navigation = useNavigation();

    const logout = async () => {
      try {
        await AsyncStorage.multiRemove([
          "token",
          "userId",
          "userDetails",
          "userString",
        ]);
    
        navigation.navigate("SignIn");
      } catch (error) {
        console.log("Logout failed:", error);
      }
    };
  

  const MenuOption = ({ title, screen }) => (
    <TouchableOpacity onPress={() => navigation.navigate(screen)} style={styles.menuItem}>
      <Text style={styles.menuText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <ProfileHeader />
      </View>
      <View style={styles.menuContainer}>
        <MenuOption title="Edit Profile" screen="EditProfileScreen" />
        {/* <MenuOption title="About Us" screen="EditProfileScreen" /> */}
        <TouchableOpacity onPress={logout} style={styles.menuItem}>
          <Text style={styles.menuText}>Log Out</Text>
        </TouchableOpacity>     
        </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerWrapper: {
    marginTop: 25,
  },
  menuContainer: {
    padding: 25,
  },
  menuItem: {
    padding: 15,
  },
  menuText: {
    fontWeight: "400",
    color: "#000A83",
  },
});


