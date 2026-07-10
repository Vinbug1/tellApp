import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Onboarding from "../users/Onboading";
import SignIn from "../users/SignIn";
import SignUp from "../users/SignUp";
import Forgot from "../users/Forgot";
import ChangePassword from "../users/ChangePassword";

const Stack = createNativeStackNavigator();

const UserNavigation = () => {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("Onbording");

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem("onboardingSeen");

      if (seen === "true") {
        setInitialRoute("SignIn");
      } else {
        setInitialRoute("Onbording");
      }

      setLoading(false);
    };

    checkOnboarding();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Onbording"
        component={Onboarding}
      />

      <Stack.Screen
        name="SignIn"
        component={SignIn}
      />

      <Stack.Screen
        name="SignUp"
        component={SignUp}
      />

      <Stack.Screen
        name="ForgotPassword"
        component={Forgot}
      />

      <Stack.Screen
        name="NewPassword"
        component={ChangePassword}
      />
    </Stack.Navigator>
  );
};

export default UserNavigation;





