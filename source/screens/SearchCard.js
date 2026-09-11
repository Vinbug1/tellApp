import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Octicons, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseUrl from "../../assets/baseUrl";
import { shouldShowDecisionButtons } from "../utils/identity";
import { showToast } from "../utils/toast";

const defaultImageSource = require("../../assets/images/briefcase.png");

const SearchCard = ({ originalCaseData, searchResult, user }) => {
  const [userDetails, setUserDetails] = useState([]);
  const [decisionLoadingId, setDecisionLoadingId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    setUserDetails(searchResult?.length ? searchResult : originalCaseData || []);
  }, [originalCaseData, searchResult]);

  const handleDecision = async (item, decision) => {
    try {
      const caseId = item?._id;
      if (!caseId) return;

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        showToast("Please login again");
        return;
      }

      setDecisionLoadingId(caseId);
      await axios.put(
        `${baseUrl}cases/${caseId}/decision`,
        { case: caseId, decision },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserDetails((prev) =>
        prev.map((row) => (row._id === caseId ? { ...row, status: decision } : row))
      );
      showToast(`Case ${decision === "Accept" ? "accepted" : "declined"} successfully`);
    } catch (error) {
      console.error('Error updating case status:', error);
      showToast(error.response?.data?.message || "Failed to update case status");
    } finally {
      setDecisionLoadingId(null);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("DetailListScreen", { item })}>
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
          {shouldShowDecisionButtons(user, item) && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleDecision(item, 'Accept')}
                disabled={decisionLoadingId === item._id}
              >
                <Octicons name="check" size={24} color="white" />
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.declineButton}
                onPress={() => handleDecision(item, 'Decline')}
                disabled={decisionLoadingId === item._id}
              >
                <Entypo name="cross" size={24} color="white" />
                <Text style={styles.buttonText}>Decline</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={userDetails}
      keyExtractor={(item, index) => `${item._id || index}`}
      renderItem={renderItem}
    />
  );
};

export default SearchCard;

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
