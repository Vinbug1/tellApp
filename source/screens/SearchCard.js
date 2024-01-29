import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Octicons, Entypo } from "@expo/vector-icons";
import {useNavigation } from "@react-navigation/native";
import axios from 'axios';
import baseUrl from '../../assets/baseUrl';
const { width } = Dimensions.get("window");

const defaultImageSource = require("../../assets/images/briefcase.png");

const SearchCard = ({ originalCaseData, searchResult, userName }) => {
  const [userDetails, setUserDetails] = useState();
  const navigation = useNavigation();

  useEffect(() => {
    // Update userDetails based on whether there is a search result or not
    const dataToUse = searchResult.length > 0 ? searchResult : originalCaseData;
    setUserDetails(dataToUse);
  }, [originalCaseData, searchResult]);


  const shouldShowButtons = (item) => {
    // Check if the current user is the case owner and the status is 'Pending'
    if (userName === item.user.fullname && item.status === 'Pending') {
      return false;
    } else if(userName === item.defendantName && item.status === 'Pending') {
      return true;
    } else if(userName === item.defendantName && item.status === 'Accept') {
      return false;
    }
    
    if(userName !== item.defendantName && item.status === 'Pending') {
      return false;
    }



    // Check if the status is 'Accept', then hide the buttons
    return item.status !== 'Accept';
  };

  const handleDecision = async (decision) => {
    try {
      setSelectedDecision(decision);
      // const axios = require('axios');
      let data = JSON.stringify({
        case: caseData._id,
        decision: selectedDecision
      });

      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${baseUrl}cases/${caseData._id}/decision`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      };

      axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });

    } catch (error) {
      console.error('Error updating case status:', error);
    }
  };

  return (
    <ScrollView>
      {userDetails?.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => navigation.navigate("DetailListScreen", { item: caseData[index] })}>
          <View style={styles.avatarWrapper}>
            <Image
              resizeMode="cover"
              source={item.user && item.user.image ? { uri: item.user.image } : defaultImageSource}
              style={styles.avatar}
            />
            <View style={{ marginTop: 8, flex: 1, marginLeft: 10 }}>
              <Text style={styles.cattxt}>{item.caseCategory && item.caseCategory.caseNumber}</Text>
              <Text style={styles.txt}>{item.caseType}</Text>
              <View style={styles.dotIndicator}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: item.status === 'Accept' ? 'green' : item.status === 'Declined' ? 'red' : 'yellow' },
                  ]}
                />
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
              {shouldShowButtons(item) && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.acceptButton} onPress={() => handleDecision('Accept')}>
                    <Octicons name="check" size={24} color="white" />
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.declineButton} onPress={() => handleDecision('Decline')}>
                    <Entypo name="cross" size={24} color="white" />
                    <Text style={styles.buttonText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  avatarWrapper: {
    margin: 9,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "95%",
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
    top: 20,
    left: 5,
    padding:5
  },
  txt: {
    fontSize: 16,
    fontWeight: "normal",
    textAlign: "center",
    color: "black",
    left: -53,
    padding:4
  },
  cattxt: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
   padding: 4,
    color: "black",
    left: -37,
  },
  dotIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    top: 6,
    left: 18
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'normal',
  },
  noPendingCasesContainer: {
    width: "80%",
    justifyContent: "center",
    marginTop: 40,
    alignSelf: 'center',
    textAlign: "center",
    left: 30,
  },
  noPendingCasesText: {
    fontSize: 18,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'relative',
    top: 6,
    paddingHorizontal: 6,
  },
  acceptButton: {
    height: 38,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 7
  },
  declineButton: {
    height: 38,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 7
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
  },
});

export default SearchCard;
