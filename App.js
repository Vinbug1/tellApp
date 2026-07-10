import { StatusBar, StyleSheet, View, ImageBackground, LogBox } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigations from './source/navigations/MainNavigation';
import crashlytics from '@react-native-firebase/crashlytics';

LogBox.ignoreAllLogs(true);

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















// import { StatusBar, StyleSheet, View, ImageBackground,LogBox,  } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import MainNavigations from './source/navigations/MainNavigation';
// import crashlytics from '@react-native-firebase/crashlytics';


// LogBox.ignoreAllLogs(true);

// export default function App() {
//   crashlytics().setCrashlyticsCollectionEnabled(true);

//   const [isLightBackground, setIsLightBackground] = useState(true);

//   useEffect(() => {
//     if (isLightBackground) {
//       StatusBar.setBarStyle('dark-content', true);
//     } else {
//       StatusBar.setBarStyle('light-content', true);
//     }
//   }, [isLightBackground]);

//   const handleBackgroundChange = (isLight) => {
//     setIsLightBackground(isLight);
//   };

//   return (
//     <NavigationContainer>
//       <View style={styles.container}>
//         <ImageBackground
//           source={isLightBackground ? require('./assets/images/newsplash.png') : require('./assets/images/newsplash.png')}
//           style={styles.imageBackground}
//         >
//           <MainNavigations setBackground={handleBackgroundChange} />
//           <StatusBar />
//         </ImageBackground>
//       </View>
//     </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   imageBackground: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
// });




