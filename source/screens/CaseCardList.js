import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Octicons, Entypo } from "@expo/vector-icons";
import {  SafeAreaView,  View,  Text,  Image,  StyleSheet,  TouchableOpacity,  Dimensions, ActivityIndicator } from "react-native";
import baseUrl from "../../assets/baseUrl";
import axios from "axios";

const { width } = Dimensions.get("window");

const defaultImageSource = require("../../assets/images/briefcase.png");

const CaseCardList = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState();
  const [userName,setUserName] = useState();
  const [caseData, setCaseData] = useState([]);
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [tkn, setTkn] = useState("");
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("userString")
        .then((data) => {
          if (data) {
           // console.log(data);
            const userDetails = JSON.parse(data);
            setUserName(userDetails.fullname);
            setUser(userDetails.userId);
            setTkn(userDetails.token);
          } else {
            console.log("Object not found in AsyncStorage");
          }
        })
        .catch((error) => {
          console.error("Error retrieving object:", error);
        });

      getData();
    }, [user])
  );

  const getData = () => {
    setLoading(true);
    let config = {
      method: "get",
      url: `${baseUrl}cases/userId/${user}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tkn}`,
      },
    };
    axios
      .request(config)
      .then((response) => {
       // console.log("Working things out ", response.data);
        setCaseData(response.data);
        setLoading(false);
        setNoData(response.data.length === 0);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setNoData(true);
      });
  };

  // const handleDecision = async (decision) => {
  //   try {
  //     setSelectedDecision(decision);
  //   } catch (error) {
  //     console.error('Error updating case status:', error);
  //   }
  // };

  const userImage = user && user.image ? { uri: user.image } : defaultImageSource;

  // const navigateToDetail = (item) => {
  //   navigation.navigate("DetailListScreen", { item:caseData[index] });
  // };


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


  return (
    <SafeAreaView>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : noData ? (
        <View style={styles.noPendingCasesContainer}>
          <Text style={styles.noPendingCasesText}>No cases found for this user.</Text>
        </View>
      ) : (
        // Array.isArray(caseData) &&
        caseData?.map((item, index) => (
          <TouchableOpacity key={index} onPress={() =>     navigation.navigate("DetailListScreen", { item:caseData[index] })        }>
            <View style={styles.avatarWrapper}>
              <Image
                resizeMode="cover"
                source={item.user && item.user.image ? { uri: item.user.image } : defaultImageSource}
                style={styles.avatar}
              />
              <View style={{ marginTop: 25, flex: 1, marginLeft: 10 }}>
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
        ))
      )}
    </SafeAreaView>
  );
};

export default CaseCardList;

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
    top: 15,
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
    top: 12,
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
