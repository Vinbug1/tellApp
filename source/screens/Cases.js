import { StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native';
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
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState('');

  useFocusEffect(
    useCallback(() => {
      // ✅ Fixed: Get token from the correct AsyncStorage key
      const loadToken = async () => {
        try {
          // Try to get token directly first (this is where your login stores it)
          let token = await AsyncStorage.getItem("token");
          
          // If not found, try userString as fallback
          if (!token) {
            const userString = await AsyncStorage.getItem("userString");
            if (userString) {
              const userData = JSON.parse(userString);
              token = userData.token || userData.authToken || '';
            }
          }
          
          if (token) {
            console.log('✅ Token loaded from AsyncStorage');
            setAuthToken(token);
          } else {
            console.log('❌ No token found in AsyncStorage');
            Toast.show('Please login again', {
              duration: Toast.durations.SHORT,
            });
          }
        } catch (error) {
          console.error('❌ Error retrieving token:', error);
          Toast.show('Error loading authentication', {
            duration: Toast.durations.SHORT,
          });
        } finally {
          setIsLoading(false);
        }
      };

      loadToken();

      return () => {
        // Clean up if needed
      };
    }, [])
  );

  useEffect(() => {
    if (authToken) {
      fetchCaseCategories();
    }
  }, [authToken]);

  const fetchCaseCategories = async () => {
    try {
      setIsLoading(true);
      
      const fullUrl = `${baseUrl}cases/my`;
      console.log('🔍 Fetching from:', fullUrl);
      console.log('🔑 Token present:', authToken ? 'Yes' : 'No');
      
      const response = await axios.get(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        timeout: 10000,
      });

      if (response.status === 200) {
        console.log('✅ Cases fetched successfully:', response.data.cases?.length || 0);
        setUseCase(response.data.cases || []);
      } 
    } catch (error) {
      console.error("❌ Error fetching cases:", error.message);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        
        if (error.response.status === 401) {
          Toast.show('Authentication failed. Please login again.', {
            duration: Toast.durations.LONG,
          });
        } else if (error.response.status === 403) {
          Toast.show('Access denied. Insufficient permissions.', {
            duration: Toast.durations.LONG,
          });
        } else if (error.response.status === 404) {
          Toast.show('Endpoint not found. Please check server.', {
            duration: Toast.durations.LONG,
          });
        } else {
          Toast.show(`Server Error: ${error.response.status}`, {
            duration: Toast.durations.SHORT,
          });
        }
      } else if (error.request) {
        console.error('❌ No response received from server');
        console.error('❌ Request details:', error.request);
        Toast.show('Cannot connect to server. Check your connection.', {
          duration: Toast.durations.LONG,
        });
      } else {
        console.error('❌ Request setup error:', error.message);
        Toast.show('Error: ' + error.message, {
          duration: Toast.durations.SHORT,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000A83" />
          <Text style={styles.loadingText}>Loading cases...</Text>
        </View>
      )}
      
      {!isLoading && useCase.length === 0 && (
        <View style={styles.noCasesContainer}>
          <Image 
            source={defaultImageSource} 
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.noCasesText}>
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
  container: {
    flex: 1,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  noCasesContainer: {
    margin: 9,
    width: "90%",
    minHeight: 140,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000A83",
    alignSelf: "center",
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
    opacity: 0.5,
  },
  noCasesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  avatar: {
    width: 105,
    height: 105,
    borderRadius: 12,
    position: "relative",
    top: 23,
  },
});

