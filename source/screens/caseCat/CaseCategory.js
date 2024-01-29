import { StyleSheet, View } from 'react-native';
import React, { useEffect,useState } from 'react';
import CaseCatCard from './CaseCatCard';
import baseUrl from '../../../assets/baseUrl';
import axios from 'axios';
import Toast from "react-native-root-toast";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";


const CaseCategory = () => {
   const [caseCategories, setCaseCategories] = useState([]);
  useEffect(() => {
    fetchCaseCategories();
  }, []);

  const fetchCaseCategories = async () => {
   
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `${baseUrl}caseCategories/`,
  headers: { 
    'Content-Type': 'application/json', 
  },
  //data : data
};

axios.request(config)
.then((response) => {
  if(response.status === 200) {
    setCaseCategories(response.data);
  }else{
    Toast.show(response.message, Toast.LENGTH_SHORT);
  }
})
.catch((error) => {
  console.log(error);
});

  }
  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Case Categories</Text> */}
      <CaseCatCard caseCategories={caseCategories} />
      {/* {caseCategories && caseCategories.map((category) => (
        <CaseCatCard key={category.id} category={category} />
      ))} */}

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default CaseCategory;
