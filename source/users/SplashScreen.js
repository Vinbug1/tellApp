import React from "react";
import { ImageBackground, StyleSheet } from "react-native";

export default function AppSplashScreen() {
  return (
    <ImageBackground
      source={require("../../assets/images/Wimg.jpeg")}
      resizeMode="cover"
      style={styles.background}
    />
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});






// import React from "react";
// import { ImageBackground, StyleSheet } from "react-native";

// export default function AppSplashScreen() {
//   return (
//     <ImageBackground
//       source={require("../../assets/images/Wimg.jpeg")}
//       resizeMode="cover"
//       style={styles.background}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//   },
// });












// import React from "react";
// import { ImageBackground, StyleSheet } from "react-native";

// export default function SplashScreen() {
//   return (
//     <ImageBackground
//       source={require("../../assets/images/Wimg.jpeg")}
//       style={styles.container}
//       resizeMode="cover"
//     />
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });