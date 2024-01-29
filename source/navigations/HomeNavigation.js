import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from '../screens/HomeScreen';
// import Scripture from '../screens/Scripture';
import CaseCategory from '../screens/caseCat/CaseCategory';
import OtherService from '../screens/OtherService';
import Search from '../screens/Search';
import CreatCase from '../screens/CreatCase';
import MoreCase from '../screens/MoreCase';
import CaseDetails from '../screens/CaseDetails';
import SearchCard from '../screens/SearchCard';
import CaseDetailList from '../screens/caseCat/CaseDetailList';


const Stack = createNativeStackNavigator();


const HomeNavigation = () => {
  return (
    <Stack.Navigator 
    headerMode="none" // Set the header mode to none
      screenOptions={{ headerStyle: { backgroundColor: "black" } }}
    >
      <Stack.Screen
        name="HomePage"
        component={HomeScreen}
        options={{ headerShown: false }}
      />  
      {/* <Stack.Screen 
        name="ScriptureScreen"
        component={Scripture}
        options={{ headerShown: false }}
      />  */}
     <Stack.Screen 
        name="OtherServ"
        component={OtherService}
        options={{ headerShown: false }}
      /> 
      <Stack.Screen 
        name="CaseCat"
        component={CaseCategory}
        options={{ headerShown: false }}
      /> 
       <Stack.Screen 
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
        component={CreatCase}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MoreCaseScreen"
        component={MoreCase}
        options={{ headerShown: false }}
      />
         <Stack.Screen 
            name="DetailScreen"
            component={CaseDetails }
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

export default HomeNavigation