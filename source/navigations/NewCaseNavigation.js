import { createNativeStackNavigator } from "@react-navigation/native-stack"; import React from 'react'

import CaseDetailList from "../screens/caseCat/CaseDetailList";


const Stack = createNativeStackNavigator();

const NewCaseNavigation = () => {
  return (
    <Stack.Navigator
      // headerMode="none" // Set the header mode to none
      screenOptions={{ headerStyle: { backgroundColor: "black" } }}
    >
      <Stack.Screen 
            name="DetailListScreen"
            component={CaseDetailList }
            options={{ headerShown: false }}
          /> 
     
    </Stack.Navigator>
  )
}

export default NewCaseNavigation

