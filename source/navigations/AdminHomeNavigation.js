import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CaseDetails from '../screens/admin/CaseDetails';
import AdminHome from '../screens/admin/AdminHome';
import CaseCatCard from '../screens/admin/CaseCatCard';
import CaseCategoryList from '../screens/admin/CaseCategoryList';


const Stack = createNativeStackNavigator();

const AdminHomeNavigation = () => {
  return (
    <Stack.Navigator 
    headerMode="none" // Set the header mode to none
      screenOptions={{ headerStyle: { backgroundColor: "black" } }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={AdminHome}
        options={{ headerShown: false }}
      />  
     <Stack.Screen 
        name="CaseCategoryScreen"
        component={CaseCatCard}
        options={{ headerShown: false }}
      /> 
      <Stack.Screen 
        name="CaseCategoryListScreen"
        component={CaseCategoryList}
        options={{ headerShown: false }}
      /> 
       {/* <Stack.Screen 
        name="SearchScreen"
        component={Search}
        options={{ headerShown: false }}
      /> 
      <Stack.Screen 
        name="SearchCardScreen"
        component={SearchCard}
        options={{ headerShown: false }}
      /> 
      <Stack.Screen
        name="CaseScreen"
        component={CaseDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MoreCaseScreen"
        component={MoreCase}
        options={{ headerShown: false }}
      /> */}
         <Stack.Screen 
            name="AdminDetailScreen"
            component={CaseDetails }
            options={{ headerShown: false }}
          /> 
          {/* <Stack.Screen 
            name="DetailListScreen"
            component={CaseDetailList }
            options={{ headerShown: false }}
          />  */}
      
    </Stack.Navigator>
  )
}

export default AdminHomeNavigation

