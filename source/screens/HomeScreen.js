import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';
import Header from './Header';
import Cases from './Cases';
import OtherService from './OtherService';
import CaseCategory from './caseCat/CaseCategory';
import DailyVerse from './DailyVerse';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
        <View style={{ padding: 8 }}>
          <Header />
        </View>
      <ScrollView >
        {/* <Text style={styles.sectionTitle}>Daily Verse</Text> */}
        <View style={{ padding: 5}}>
        <DailyVerse />
        </View>

        <View style={{ padding: 5}}>
        <Text style={styles.sectionTitle}>Case</Text>
        <Cases />
        </View>

        <View style={{ padding: 5}}>
        <Text style={styles.sectionTitle}>Quick Action</Text>
        <OtherService />
        </View>

        <View style={{ padding: 5}}>
        <Text style={styles.sectionTitle}>Case Category</Text>
        <CaseCategory />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'normal',
    margin: 5,
    left: 18,
  },
});

export default HomeScreen;
