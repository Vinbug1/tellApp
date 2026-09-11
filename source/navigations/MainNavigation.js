import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserNavigation from './UserNavigation';
import BottomNavigation from './BottomNavigation';
import Authcode from '../users/Authcode';

const Stack = createNativeStackNavigator();

const MainNavigations = () => {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("User");

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          setInitialRoute("MainScreen");
        }
      } catch (error) {
        console.log("Session restore failed:", error);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000A83" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
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
        name="AuthVerifyScreen"
        component={Authcode}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigations;
