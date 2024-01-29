import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeNavigation from "./HomeNavigation";
import {  AntDesign,MaterialCommunityIcons } from "@expo/vector-icons";
import AccountNavigation from "./AccountNavigation";
import CaseNavigation from "./CaseNavigation";
import NewCaseNavigation from "./NewCaseNavigation";
import AdminHomeNavigation from "./AdminHomeNavigation";
import AdminCaseNavigation from "./AdminCaseNavigation";

const Tab = createMaterialBottomTabNavigator();

const AdminNavigation = () => {
  return (
    <Tab.Navigator
    initialRouteName="HomeNavigation"
    activeColor="#000A83"
    inactiveColor="gray"
    // barStyle={{ backgroundColor: "#FFFFFF",borderTopColor: "#09BDA2", borderWidth: 0.5 }}
  >
    <Tab.Screen
      name="AdminHomeNav"
      component={AdminHomeNavigation}
      options={{
        tabBarLabel: "Home",
        tabBarIcon: ({ color }) => (
          < AntDesign name="home" color={color} size={26} />
        ),
      }}
    />
     
  
    <Tab.Screen
      name="AdminCaseNav"
      component={AdminCaseNavigation}
      options={{
        tabBarLabel: "Case",
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="briefcase-outline" color={color} size={24} />
        ),
      }}
    />
    <Tab.Screen
      name="AccountNavigation"
      component={AccountNavigation}
      options={{
        tabBarLabel: "Account",
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="account-outline" color={color} size={24} />
        ),
      }}
    /> 
  </Tab.Navigator>
  )
}

export default AdminNavigation

