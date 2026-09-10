import { StatusBar, StyleSheet, View, ImageBackground, LogBox } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import MainNavigations from './source/navigations/MainNavigation';
import crashlytics from '@react-native-firebase/crashlytics';

LogBox.ignoreAllLogs(true);

// Keep native splash visible until we explicitly hide it
SplashScreen.preventAutoHideAsync();

const MIN_SPLASH_TIME = 2500; // milliseconds — adjust to taste

export default function App() {
  const [isLightBackground, setIsLightBackground] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    crashlytics().setCrashlyticsCollectionEnabled(true);
  }, []);

  useEffect(() => {
    async function prepare() {
      const startTime = Date.now();

      try {
        // any real async setup can go here (auth check, config fetch, etc.)
      } catch (e) {
        console.warn(e);
      }

      const elapsed = Date.now() - startTime;
      const remaining = MIN_SPLASH_TIME - elapsed;
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

      setAppIsReady(true);
    }
    prepare();
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

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // native splash (from app.json) stays on screen during this
  }

  return (
    <NavigationContainer>
      <View style={styles.container} onLayout={onLayoutRootView}>
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
















// import { StatusBar, StyleSheet, View, ImageBackground, LogBox } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import MainNavigations from './source/navigations/MainNavigation';
// import crashlytics from '@react-native-firebase/crashlytics';

// LogBox.ignoreAllLogs(true);

// export default function App() {
//   const [isLightBackground, setIsLightBackground] = useState(true);

//   useEffect(() => {
//     crashlytics().setCrashlyticsCollectionEnabled(true);
//   }, []);

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
//           source={require('./assets/images/newsplash.png')}
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















// // import { StatusBar, StyleSheet, View, ImageBackground,LogBox,  } from 'react-native';
// // import React, { useState, useEffect } from 'react';
// // import { NavigationContainer } from '@react-navigation/native';
// // import MainNavigations from './source/navigations/MainNavigation';
// // import crashlytics from '@react-native-firebase/crashlytics';


// // LogBox.ignoreAllLogs(true);

// // export default function App() {
// //   crashlytics().setCrashlyticsCollectionEnabled(true);

// //   const [isLightBackground, setIsLightBackground] = useState(true);

// //   useEffect(() => {
// //     if (isLightBackground) {
// //       StatusBar.setBarStyle('dark-content', true);
// //     } else {
// //       StatusBar.setBarStyle('light-content', true);
// //     }
// //   }, [isLightBackground]);

// //   const handleBackgroundChange = (isLight) => {
// //     setIsLightBackground(isLight);
// //   };

// //   return (
// //     <NavigationContainer>
// //       <View style={styles.container}>
// //         <ImageBackground
// //           source={isLightBackground ? require('./assets/images/newsplash.png') : require('./assets/images/newsplash.png')}
// //           style={styles.imageBackground}
// //         >
// //           <MainNavigations setBackground={handleBackgroundChange} />
// //           <StatusBar />
// //         </ImageBackground>
// //       </View>
// //     </NavigationContainer>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //   },
// //   imageBackground: {
// //     flex: 1,
// //     width: '100%',
// //     height: '100%',
// //   },
// // });




