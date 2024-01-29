import React, { useState, useContext, useCallback } from "react";
import { MaterialCommunityIcons,  SimpleLineIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import AuthGlobal from "../../Context/store/AuthGlobal";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import ProfileHeader from "./ProfileHeader";
import EditProfile from "./EditProfile";
import { useNavigation} from "@react-navigation/native";

const { width } = Dimensions.get("window");


const Profile = () => {
    const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
        <View style={{marginTop:25}}>
            <ProfileHeader />
        </View>
        <View style={{padding:25}}>
            <TouchableOpacity     onPress={() => navigation.navigate("EditProfileScreen")} style={{padding:15}}> 
            <Text style={{fontWeight:"400",color:"#000A83"}}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity     onPress={() => navigation.navigate("LanguageScreen")} style={{padding:15}}> 
            <Text style={{fontWeight:"400",color:"#000A83"}}>Language</Text>
            </TouchableOpacity>
            <TouchableOpacity     onPress={() => navigation.navigate("EditProfileScreen")} style={{padding:15}}> 
            <Text style={{fontWeight:"400",color:"#000A83"}}>About Us</Text>
            </TouchableOpacity>

        </View>
    </SafeAreaView>
  )
}

export default Profile


const styles = StyleSheet.create({
   container:{
      flex: 1,
      backgroundColor:"#FFFFFF",
   }
})