// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import BibleDisplay from 'react-native-bible-display';
// import { getDailyVerse } from '../utils/getDailyVerse';


// const Scripture = () => {
//     const [verse, setVerse] = useState(null);

//   useEffect(() => {
//     const fetchDailyVerse = async () => {
//       const dailyVerse = await getDailyVerse();
//       setVerse(dailyVerse);
//     };

//     fetchDailyVerse();
//   }, []);

//   return (
//     <View style={styles.container}>
//       {verse ? (
//         <BibleDisplay
//           book={verse.book}
//           chapter={verse.chapter}
//           verse={verse.verse}
//           text={verse.text}
//           style={styles.bibleDisplay}
//         />
//       ) : (
//         <Text style={styles.loadingText}>Loading...</Text>
//       )}
//     </View>

//   )
// }

// export default Scripture

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     bibleDisplay: {
//       // Add your custom styles for the BibleDisplay component
//     },
//     loadingText: {
//       fontSize: 18,
//       color: 'gray',
//     },
//   });
  