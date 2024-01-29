import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import CaseCardList from './CaseCardList'

const CaseList = () => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.heading}>Cases</Text>
        <CaseCardList />
      </View>
    </ScrollView>
  )
}

export default CaseList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 16,
    marginTop: 46,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
});
