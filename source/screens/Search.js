import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Input from "../utils/Input";
import SearchCard from "./SearchCard";
import baseUrl from "../../assets/baseUrl";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

const Search = () => {
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState("");
  const [caseData, setCaseData] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userString = await AsyncStorage.getItem("userString");

      if (!userString) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(userString);

      setUserDetails(user);

      fetchCases(user.token);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const fetchCases = async (token) => {
    try {
      setLoading(true);

      const response = await axios.get(`${baseUrl}cases/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const cases = response.data.cases || [];

      setCaseData(cases);
      setSearchResult(cases);
    } catch (err) {
      console.log("Fetch Cases Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResult(caseData);
      return;
    }

    const keyword = searchQuery.toLowerCase();

    const filtered = caseData.filter((item) => {
      const caseNumber =
        item.caseCategory?.caseNumber?.toLowerCase() || "";

      const title = item.title?.toLowerCase() || "";

      const defendant = item.defendantName?.toLowerCase() || "";

      return (
        caseNumber.includes(keyword) ||
        title.includes(keyword) ||
        defendant.includes(keyword)
      );
    });

    setSearchResult(filtered);
  }, [searchQuery, caseData]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.icon}
      >
        <AntDesign
          name="leftcircleo"
          size={33}
          color="#000A83"
        />
      </TouchableOpacity>

      <View style={{ marginTop: 45 }}>
        <Text style={styles.title}>Find Case</Text>

        <Input
          placeholder="Search by Case Number, Title or Defendant"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#000A83"
          style={{ marginTop: 40 }}
        />
      ) : searchResult.length > 0 ? (
        <SearchCard
          originalCaseData={caseData}
          searchResult={searchResult}
          userName={userDetails?.fullname}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noResult}>Oops!</Text>

          <Text style={styles.noResultText}>
            No matching case found.
          </Text>
        </View>
      )}
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
  },

  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  noResult: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000A83",
  },

  noResultText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#777",
  },

  icon: {
    backgroundColor: "whitesmoke",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    height: 40,
    width: 40,
    marginTop: 35,
  },
});




