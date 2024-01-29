import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserNavigation from './UserNavigation';
import BottomNavigation from './BottomNavigation';
import Verify from '../users/Verify';
import Authcode from '../users/Authcode';
import AdminNavigation from './AdminNavigation';
// import BottomNavigation from './BottomNavigation';
// import ProductDetails from '../shop/ProductDetails';

const Stack = createNativeStackNavigator();
const MainNavigations = () => {
  return (
    <Stack.Navigator 
    headerModal="non"
    screenOptions={{ headerStyle: { backgroundColor: "#FFFFFF" } }}
    >
      <Stack.Screen
        name="User"
        component={UserNavigation}
        options={{ headerShown: false }}
      
      />  
       <Stack.Screen 
        name="MainScreen"
        component={BottomNavigation}
        options={{ headerShown: false }}
      />  
             <Stack.Screen 
        name="AdminScreen"
        component={AdminNavigation}
        options={{ headerShown: false }}
      />  

         <Stack.Screen
      name="VerifyScreen"
      component={Verify}
      options={{ headerShown: false }}
    />   
    <Stack.Screen
      name="AuthVerifyScreen"
      component={Authcode}
      options={{ headerShown: false }}
    />   
        
      {/* <Stack.Screen />  
      <Stack.Screen />  
      <Stack.Screen />   */}
    </Stack.Navigator>
  )
}

export default MainNavigations