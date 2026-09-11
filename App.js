import { StatusBar, StyleSheet, View, ImageBackground } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootSiblingParent } from 'react-native-root-siblings';
import MainNavigations from './source/navigations/MainNavigation';
import crashlytics from '@react-native-firebase/crashlytics';

export default function App() {
  const [isLightBackground, setIsLightBackground] = useState(true);

  useEffect(() => {
    crashlytics().setCrashlyticsCollectionEnabled(true);
  }, []);

  useEffect(() => {
    if (isLightBackground) {
      StatusBar.setBarStyle('dark-content', true);
    } else {
      StatusBar.setBarStyle('light-content', true);
    }
  }, [isLightBackground]);

  const handleBackgroundChange = (isLight) => {
    setIsLightBackground(isLight);
  };

  return (
    <RootSiblingParent>
      <NavigationContainer>
        <View style={styles.container}>
          <ImageBackground
            source={require('./assets/images/newsplash.png')}
            style={styles.imageBackground}
          >
            <MainNavigations setBackground={handleBackgroundChange} />
            <StatusBar />
          </ImageBackground>
        </View>
      </NavigationContainer>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
