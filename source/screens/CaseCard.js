import React, { useState, useEffect, useCallback } from "react";
import { Octicons, Entypo } from "@expo/vector-icons";
import { useNavigation} from "@react-navigation/native";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import baseUrl from "../../assets/baseUrl";
import axios from "axios";

const { width } = Dimensions.get("window");

const defaultImageSource = require("../../assets/images/briefcase.png");

const CaseCard = ({ useCase }) => {
  const navigation = useNavigation();

  const caseData = useCase && useCase.length > 0 ? useCase[0] : {}; // Assuming useCase is an array

  const [userDetails, setUserDetails] = useState();
  const [selectedDecision, setSelectedDecision] = useState(null);

  useEffect(() => {
    // Set the initial selectedDecision based on the case status
    setSelectedDecision(caseData.status);
  }, [caseData.status]);

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

  const userImage = userDetails && userDetails.image ? { uri: userDetails.image } : defaultImageSource;


  const navigateToDetail = () => {
    // Define your navigation logic here
    // For example, you can navigate to a "CaseDetail" screen
    navigation.navigate("DetailScreen", { caseData: caseData});
  };

  return (
    <SafeAreaView>
            <TouchableOpacity onPress={() => navigateToDetail()}>
      <View style={styles.avatarWrapper}>
        <Image resizeMode="cover" source={userImage} style={styles.avatar} />
        <View style={{ marginTop: 5 }}>
          {caseData.status === 'Accept' ? (
            <View style={styles.noPendingCasesContainer}>
              <Text style={styles.noPendingCasesText}>You do not have any pending cases.</Text>
            </View>
          ) : (
            <>
              <View style={{ position: 'absolute', top: 9, left: 21 }}>
                <Text style={styles.cattxt}>{caseData.caseCategory && caseData.caseCategory.caseNumber}</Text>
                <Text style={styles.txt}>{caseData.caseType}</Text>
              </View>
              <View style={styles.dotIndicator}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: caseData.status === 'Accept' ? 'transparent' : caseData.status === 'Decline' ? 'red' : 'yellow' },
                  ]}
                />
                <Text style={styles.statusText}>
                  {caseData.status === 'Accept' ? 'Accepted' : caseData.status === 'Decline' ? 'Declined' : 'Pending'}
                </Text>
              </View>

              {/* Buttons for accept and decline */}
              {(!selectedDecision || selectedDecision === 'Pending') && (
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
            </>
          )}
        </View>
      </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  avatarWrapper: {
    margin: 9,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "90%",
    height: 150,
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
  txt: {
    fontSize: 16,
    fontWeight: "normal",
    textAlign: "center",
    color: "black",
    left: -6,
    padding: -3,
  },
  cattxt: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
   padding: 4,
    color: "black",
    left: 5,
  },
  dotIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: -5,
    position: 'relative',
    top: 55,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'relative',
    top: 62,
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
  noPendingCasesContainer: {
    width: "80%",
    justifyContent: "center",
    marginTop: 40,
    //marginLeft: 40,
    alignSelf: 'center',
    textAlign: "center",
    left: 30,
  },
  noPendingCasesText: {
    fontSize: 18,
    color: 'black',
  }
});

export default CaseCard;
