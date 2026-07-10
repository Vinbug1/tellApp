import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Octicons, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


const { width } = Dimensions.get("window");
const defaultImageSource = require("../../assets/images/briefcase.png");

const SearchCard = ({ originalCaseData, searchResult, userName }) => {
  const [userDetails, setUserDetails] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    setUserDetails(searchResult?.length ? searchResult : originalCaseData || []);
  }, [originalCaseData, searchResult]);

  const shouldShowButtons = useMemo(() => (item) => {
    if (item.status === 'Pending') {
      if (userName === item.user.fullname || userName !== item.defendantName) return false;
      return userName === item.defendantName;
    }
    return item.status !== 'Accept';
  }, [userName]);

  const handleDecision = async (decision) => {
    try {
      // Update the code accordingly based on your implementation
      // ...
    } catch (error) {
      console.error('Error updating case status:', error);
    }
  };

  return (
    <ScrollView>
      {userDetails.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => navigation.navigate("DetailListScreen", { item })}>
          <View style={styles.avatarWrapper}>
            <Image
              resizeMode="cover"
              source={item.user?.image ? { uri: item.user.image } : defaultImageSource}
              style={styles.avatar}
            />
            <View style={styles.content}>
              <Text style={styles.cattxt}>{item.caseCategory?.caseNumber}</Text>
              <Text style={styles.txt}>{item.caseType}</Text>
              <View style={styles.dotIndicator}>
                <View style={[styles.dot, { backgroundColor: item.status === 'Accept' ? 'green' : item.status === 'Declined' ? 'red' : 'yellow' }]} />
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
    top: 20,
    left: 5,
    padding: 5,
  },
  content: {
    marginTop: 8,
    flex: 1,
    marginLeft: 10,
  },
  txt: {
    fontSize: 16,
    color: "black",
    left: -53,
    padding: 4,
    textAlign: "center",
  },
  cattxt: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    left: -37,
    padding: 4,
    textAlign: "center",
  },
  dotIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 6,
    left: 18,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    marginLeft: 5,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    margin: 7,
  },
  declineButton: {
    height: 38,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 7,
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
  },
});

export default SearchCard;

