import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Onboarding from "../users/Onboading";
import SignIn from "../users/SignIn";
import SignUp from "../users/SignUp";
import Forgot from "../users/Forgot";
import ChangePassword from "../users/ChangePassword";
// import CreatePin from "../users/CreatePin";
// import AuthPin from "../users/AuthPin";


const Stack = createNativeStackNavigator();
const UserNavigation = () => {
  return (
    <Stack.Navigator
      headerModal="non"
      screenOptions={{ headerStyle: { backgroundColor: "#FFFFFFF" } }}
    >
      <Stack.Screen
        name="Onbording"
        component={Onboarding }
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="ForgotPassword"
        component={Forgot}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewPassword"
        component={ChangePassword}
        options={{ headerShown: false }}
      />  
      {/*     <Stack.Screen
        name="BankScreen"
        component={VendorBank}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VendorSignUp"
        component={VendorSignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgetPassword"
        component={ForgetPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Verification"
        component={Verification}
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
};

export default UserNavigation;
