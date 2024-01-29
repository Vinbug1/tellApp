import React from 'react'
import CaseList from '../screens/CaseList'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CaseDetailList from '../screens/caseCat/CaseDetailList';

const Stack = createNativeStackNavigator();

const AdminCaseNavigation = () => {
    return (
        <Stack.Navigator 
        headerMode="none" // Set the header mode to none
          screenOptions={{ headerStyle: { backgroundColor: "black" } }}
        >
          <Stack.Screen
            name="ListCase"
            component={CaseList}
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

export default AdminCaseNavigation

