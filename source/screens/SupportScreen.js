import React from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const SupportScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Ionicons name="arrow-back-circle-outline" size={33} color="#000A83" />
      </TouchableOpacity>
      <Text style={styles.title}>Help / Support</Text>
      <View style={styles.body}>
        <Text style={styles.copy}>
          Need help with a case or your account? Reach the tellApp team and we will get back to you.
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL("mailto:support@tellapp.com")}>
          <Text style={styles.link}>support@tellapp.com</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  back: {
    marginTop: 18,
    marginLeft: 20,
    width: 40,
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#000A83",
    marginTop: 8,
  },
  body: {
    padding: 24,
  },
  copy: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },
  link: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "700",
    color: "#000A83",
  },
});
