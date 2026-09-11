import { StyleSheet, View, ActivityIndicator } from 'react-native';
import React, { useState, useCallback } from 'react';
import CaseCatCard from './CaseCatCard';
import baseUrl from '../../../assets/baseUrl';
import axios from 'axios';
import { showToast } from "../../utils/toast";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CaseCategory = () => {
  const [caseCategories, setCaseCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchCaseCategories();
    }, [])
  );

  const fetchCaseCategories = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        showToast("Session expired. Please sign in again.");
        return;
      }

      const response = await axios.get(`${baseUrl}caseCategories`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setCaseCategories(response.data);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to load case categories.";
      showToast(message);
      console.error("Error fetching case categories:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000A83" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CaseCatCard caseCategories={caseCategories} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CaseCategory;


