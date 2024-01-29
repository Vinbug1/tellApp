import { StyleSheet, Text, View, ActivityIndicator,Image } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import CaseCard from './CaseCard';
import baseUrl from '../../assets/baseUrl';
import axios from 'axios';
import Toast from 'react-native-root-toast';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultImageSource = require("../../assets/images/briefcase.png");


const Cases = () => {
  const [useCase, setUseCase] = useState([]);
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('userString')
        .then((data) => {
          if (data) {
            const userDat = JSON.parse(data);
            setUserId(userDat.userId);
            setUserEmail(userDat.email);
          } else {
            console.log('Object not found in AsyncStorage');
          }
        })
        .catch((error) => {
          console.error('Error retrieving object:', error);
        });

      return () => {
        // Clean up if needed
      };
    }, [])
  );

  useEffect(() => {
    fetchCaseCategories();
  }, [userEmail]);

  const fetchCaseCategories = async () => {
    try {
      setIsLoading(true);
  
      const response = await axios.get(`${baseUrl}cases/caseComplain?email=${userEmail}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        console.log(response.data.cases.caseCategory);
        setUseCase(response.data.cases);
      } 
    } catch (error) {
      //console.error("Error fetching cases:", error);
      //Toast.show('Error fetching cases', Toast.SHORT);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View>
      {isLoading && <ActivityIndicator size="large" color="#000A83" />}
      {!isLoading && useCase.length === 0 && (
        <View style={styles.avatarWrapper}>
          <Text style={{ textAlign: 'center', alignSelf: 'center' }}>
            No cases available
          </Text>
        </View>
      )}
      {!isLoading && useCase.length > 0 && <CaseCard useCase={useCase} />}
    </View>
  );

};

export default Cases;

const styles = StyleSheet.create({
  avatarWrapper: {
    margin: 9,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "90%",
    height: 140,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000A83",
    alignSelf: "center",
  },
  avatar: {
    width: 105,
    height: 105,
    borderRadius: 12,
    position: "relative",
    top: 23,
  },
});















// import { StyleSheet, Text, View, ActivityIndicator  } from 'react-native'
// import React, { useEffect,useState,useCallback } from 'react';
// import CaseCard from './CaseCard'
// import baseUrl from '../../assets/baseUrl';
// import axios from 'axios';
// import Toast from "react-native-root-toast";
// import { useFocusEffect } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";


// const Cases = () => {
//   const [useCase, setUseCase] = useState([]);
//   const [userId, setUserId] = useState("");
//   const [userName, setUserName] = useState();
//   const [isLoading, setIsLoading] = useState(true);
  


//   useFocusEffect(
//     useCallback(() => {
//       AsyncStorage.getItem("userString")
//         .then((data) => {
//           if (data) {
//             const userDat = JSON.parse(data);
//             //console.log("case for this user",userData.userId);
//             setUserId(userDat.userId);
//             setUserName(userDat.fullname);
//           } else {
//             console.log("Object not found in AsyncStorage");
//           }
//         })
//         .catch((error) => {
//           console.error("Error retrieving object:", error);
//         });

//       return () => {
//         //setUserDetails();
//       };
//     }, [])
//   );

//   useEffect(() => {
//     fetchCaseCategories();
//   }, []);

//   const fetchCaseCategories = async () => {
//     // let data = JSON.stringify({
//     //   fullname: userName,
//     // });
// let config = {
//   method: 'get',
//   maxBodyLength: Infinity,
//   url: `${baseUrl}cases/${userName}/complainant`,
//   headers: { 
//     'Content-Type': 'application/json', 
//   },
//   //data : data
// };

// axios.request(config)
// .then((response) => {
//   //console.log("thinking things out",response.data)
//   if(response.status === 200) {
//     setUseCase(response.data);
//     console.log("trying it",useCase);
//   }else{
//     Toast.show(response.message, Toast.LENGTH_SHORT);
//   }
// })
// .catch((error) => {
//   console.log(error);
// });

//   }

//   return (
//     <View>
//    {useCase.length === 0 ? (
//      <CaseCard useCase={useCase} />
//      ) : ( 
//       <Text>Loading...</Text>
//     )}
//   </View>

//   )
// }

// export default Cases

// const styles = StyleSheet.create({})