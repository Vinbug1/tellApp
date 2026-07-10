import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
} from "react-native";

import Header from "./Header";
import DailyVerse from "./DailyVerse";
import Cases from "./Cases";
import OtherService from "./OtherService";
import CaseCategory from "./caseCat/CaseCategory";

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Daily Verse */}
        <View style={styles.section}>
          <DailyVerse />
        </View>

        {/* Cases */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Cases</Text>
          <Cases />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <OtherService />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Case Categories</Text>
          <CaseCategory />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 30,
  },

  section: {
    marginTop: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000A83",
    marginBottom: 10,
    marginLeft: 5,
  },
});


