import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import Onboarding from './source/screens/Onboading';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigations from './source/navigations/MainNavigation';

export default function App() {
  return (
    // <View style={styles.container}>
    <NavigationContainer>
      <MainNavigations />
      {/* <Onboarding /> */}
      <StatusBar style="auto" />
    </NavigationContainer>

    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
