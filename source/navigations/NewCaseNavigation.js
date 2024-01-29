import { createNativeStackNavigator } from "@react-navigation/native-stack"; import React from 'react'
import CreatCase from '../screens/CreatCase'
import MoreCase from "../screens/MoreCase";
import CaseDetails from "../screens/CaseDetails";
import CaseDetailList from "../screens/caseCat/CaseDetailList";


const Stack = createNativeStackNavigator();

const NewCaseNavigation = () => {
  return (
    <Stack.Navigator
      headerMode="none" // Set the header mode to none
      screenOptions={{ headerStyle: { backgroundColor: "black" } }}
    >
      <Stack.Screen
        name="CaseScreen"
        component={CreatCase}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MoreCaseScreen"
        component={MoreCase}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
            name="DetailListScreen"
            component={CaseDetailList }
            options={{ headerShown: false }}
          /> 
     
    </Stack.Navigator>
  )
}

export default NewCaseNavigation

