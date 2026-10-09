import React from "react";
import { Alert, SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ProfileHeader from "./ProfileHeader";
import { CommonActions, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "../utils/toast";
import { deleteMyAccount } from "../utils/moderation";


const Profile = () => {
  const navigation = useNavigation();

    const logout = async () => {
      try {
        await AsyncStorage.multiRemove([
          "token",
          "userId",
          "userDetails",
          "userString",
          "caseString",
          "resetEmail",
          "blockedUserIds",
        ]);

        let root = navigation;
        while (root.getParent()) {
          root = root.getParent();
        }

        root.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "User", params: { screen: "SignIn" } }],
          })
        );
      } catch (error) {
        console.log("Logout failed:", error);
      }
    };

    const deleteAccount = () => {
      Alert.alert(
        "Delete account",
        "This permanently deletes your Tell account and cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteMyAccount();
                await logout();
              } catch (error) {
                showToast(error.message || "Could not delete account");
              }
            },
          },
        ]
      );
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
        <TouchableOpacity onPress={deleteAccount} style={styles.menuItem}>
          <Text style={styles.deleteText}>Delete Account</Text>
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
  deleteText: {
    fontWeight: "600",
    color: "#B00020",
  },
});


