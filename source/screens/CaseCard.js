import React, { useState, useEffect, useCallback } from "react";
import { Octicons, Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseUrl from "../../assets/baseUrl";

const { width } = Dimensions.get("window");
const defaultImageSource = require("../../assets/images/briefcase.png");

const CaseCard = ({ useCase }) => {
  const navigation = useNavigation();
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle case data safely
  const caseData = useCase && useCase.length > 0 ? useCase[0] : null;

  // Set initial decision state when caseData changes
  useEffect(() => {
    if (caseData?.status) {
      setSelectedDecision(caseData.status);
    }
  }, [caseData]);

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("userDetails");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUserDetails(userData);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  // Handle decision update
  const handleDecision = useCallback(async (decision) => {
    if (!caseData?._id) {
      Alert.alert("Error", "Case ID is missing");
      return;
    }

    setIsLoading(true);
    const previousDecision = selectedDecision;
    
    // Optimistically update UI
    setSelectedDecision(decision);

    try {
      const token = await AsyncStorage.getItem("token");
      
      if (!token) {
        Alert.alert("Error", "Authentication token not found. Please log in again.");
        setSelectedDecision(previousDecision);
        return;
      }

      const response = await axios.put(
        `${baseUrl}cases/${caseData._id}/decision`,
        { case: caseData._id, decision },
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          } 
        }
      );

      console.log("✅ Decision updated successfully:", decision);
      
      // Show success message
      Alert.alert(
        "Success", 
        `Case ${decision === "Accept" ? "accepted" : "declined"} successfully`
      );

    } catch (error) {
      console.error("❌ Error updating case status:", error);
      
      // Revert to previous state on error
      setSelectedDecision(previousDecision);
      
      // Show error message
      const errorMessage = error.response?.data?.message || "Failed to update case status";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [caseData?._id, selectedDecision]);

  const navigateToDetail = () => {
    if (caseData) {
      navigation.navigate("DetailScreen", { caseData });
    }
  };

  // Determine user image source
  const userImage = userDetails?.image ? { uri: userDetails.image } : defaultImageSource;

  // Handle loading or no case data
  if (!caseData) {
    return (
      <SafeAreaView>
        <View style={styles.noPendingCasesContainer}>
          <Text style={styles.noPendingCasesText}>
            No cases available
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Handle accepted cases
  if (selectedDecision === "Accept") {
    return (
      <SafeAreaView>
        <View style={styles.noPendingCasesContainer}>
          <Text style={styles.noPendingCasesText}>
            You do not have any pending cases.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={navigateToDetail} disabled={isLoading} activeOpacity={0.8}>
        <View style={styles.avatarWrapper}>
          <Image 
            resizeMode="cover" 
            source={userImage} 
            style={styles.avatar} 
          />
          
          <View style={styles.contentContainer}>
            <View style={styles.caseInfo}>
              <Text style={styles.cattxt} numberOfLines={1} ellipsizeMode="tail">
                {caseData.caseCategory?.caseNumber || "N/A"}
              </Text>
              <Text style={styles.txt} numberOfLines={1} ellipsizeMode="tail">
                {caseData.caseType || "Unknown Type"}
              </Text>
            </View>

            <View style={styles.dotIndicator}>
              <View
                style={[
                  styles.dot,
                  { 
                    backgroundColor: 
                      selectedDecision === "Decline" ? "red" : 
                      selectedDecision === "Accept" ? "green" : 
                      "yellow" 
                  },
                ]}
              />
              <Text style={styles.statusText}>
                {selectedDecision === "Accept" ? "Accepted" : 
                 selectedDecision === "Decline" ? "Declined" : 
                 "Pending"}
              </Text>
            </View>

            {selectedDecision === "Pending" && (
              <View style={styles.buttonContainer}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#000A83" />
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() => handleDecision("Accept")}
                      disabled={isLoading}
                    >
                      <Octicons name="check" size={16} color="white" />
                      <Text style={styles.buttonText} numberOfLines={1}>Accept</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.declineButton}
                      onPress={() => handleDecision("Decline")}
                      disabled={isLoading}
                    >
                      <Entypo name="cross" size={16} color="white" />
                      <Text style={styles.buttonText} numberOfLines={1}>Decline</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
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
    alignItems: "center",
    width: "92%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000A83",
    alignSelf: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  avatar: {
    width: 85,
    height: 85,
    borderRadius: 10,
    flexShrink: 0,
  },
  contentContainer: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  caseInfo: {
    marginBottom: 6,
  },
  txt: {
    fontSize: 15,
    fontWeight: "normal",
    color: "black",
    marginTop: 2,
  },
  cattxt: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
  },
  dotIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 'normal',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  acceptButton: {
    flex: 1,
    minWidth: 0,
    height: 34,
    backgroundColor: 'green',
    paddingHorizontal: 6,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButton: {
    flex: 1,
    minWidth: 0,
    height: 34,
    backgroundColor: 'red',
    paddingHorizontal: 6,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    marginLeft: 4,
    fontWeight: '600',
    fontSize: 12,
    flexShrink: 1,
  },
  noPendingCasesContainer: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
    alignSelf: 'center',
    padding: 20,
  },
  noPendingCasesText: {
    fontSize: 18,
    color: 'black',
    textAlign: "center",
  }
});

export default CaseCard;


