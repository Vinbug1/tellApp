import { createNativeStackNavigator } from "@react-navigation/native-stack"; import React from 'react'
import Profile from "../users/Profile";
import EditProfile from "../users/EditProfile";
import Language from "../users/Language";



const Stack = createNativeStackNavigator();

const AccountNavigation = () => {
  return (
    <Stack.Navigator
    headerMode="none" // Set the header mode to none
    screenOptions={{ headerStyle: { backgroundColor: "black" } }}
  >
    <Stack.Screen
      name="ProfileScreen"
      component={Profile}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="EditProfileScreen"
      component={EditProfile}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="LangaugeScreen"
      component={Language}
      options={{ headerShown: false }}
    />
   
  </Stack.Navigator>
  )
}

export default AccountNavigation

