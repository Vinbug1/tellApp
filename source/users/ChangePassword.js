import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";

import Input from "../utils/Input";
import SimpleButton from "../utils/SimpleButton";
import baseUrl from "../../assets/baseUrl";

const { width, height } = Dimensions.get("window");

const ChangePassword = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        try {
          const userString = await AsyncStorage.getItem("userString");

          if (userString) {
            const user = JSON.parse(userString);
            setEmail(user.email);
          }
        } catch (err) {
          console.log(err);
        }
      };

      loadUser();
    }, [])
  );

  const handleSubmit = async () => {
    try {
      setError("");

      if (!newPassword || !confirmPassword) {
        Toast.show(
          "Please enter your new password",
          Toast.durations.SHORT
        );
        return;
      }

      if (newPassword.length < 6) {
        Toast.show(
          "Password must be at least 6 characters",
          Toast.durations.SHORT
        );
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      setLoading(true);

      const response = await axios.post(
        `${baseUrl}users/reset-password`,
        {
          email,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      Toast.show(
        response.data.message || "Password reset successful",
        Toast.durations.LONG
      );

      navigation.reset({
        index: 0,
        routes: [{ name: "SignIn" }],
      });
    } catch (err) {
      console.log(err);

      Toast.show(
        err.response?.data?.message || "Unable to reset password",
        Toast.durations.SHORT
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <AntDesign name="left" size={22} color="black" />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>New Password</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.instructionsContainer}>
          <Text style={styles.boldText}>
            Please enter your new password.
          </Text>

          <Text style={styles.normalText}>
            Enter a strong password for your account.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>

          <Input
            placeholder="New Password"
            value={newPassword}
            secureTextEntry
            onChangeText={setNewPassword}
          />

          <Text style={styles.label}>Confirm Password</Text>

          <Input
            placeholder="Confirm Password"
            value={confirmPassword}
            secureTextEntry
            onChangeText={setConfirmPassword}
          />

          {error ? (
            <Text style={styles.errorText}>
              {error}
            </Text>
          ) : null}
        </View>

        <View style={styles.buttonContainer}>
          <SimpleButton
            onPress={handleSubmit}
            buttonText={loading ? "Resetting..." : "Reset Password"}
            disabled={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  backButton: {
    position: "absolute",
    top: height * 0.08,
    left: width * 0.08,
    padding: 10,
    zIndex: 100,
  },

  headerContainer: {
    marginTop: height * 0.12,
    alignItems: "center",
  },

  headerText: {
    fontSize: 28,
    fontWeight: "700",
  },

  instructionsContainer: {
    marginTop: 50,
    alignItems: "center",
    paddingHorizontal: 25,
  },

  boldText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000A83",
    textAlign: "center",
  },

  normalText: {
    marginTop: 10,
    fontSize: 15,
    textAlign: "center",
    color: "#666",
  },

  inputContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },

  label: {
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 15,
    fontSize: 15,
  },

  errorText: {
    color: "red",
    marginLeft: 10,
    marginTop: 10,
    fontSize: 14,
  },

  buttonContainer: {
    marginTop: 70,
    paddingHorizontal: 20,
  },
});













// import React, { useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   TouchableOpacity,
//   Platform,
//   KeyboardAvoidingView,
//   Dimensions
// } from "react-native";
// import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import Input from "../utils/Input";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Toast from "react-native-root-toast";
// import SimpleButton from "../utils/SimpleButton";
// import { AntDesign } from '@expo/vector-icons';
// import baseUrl from "../../assets/baseUrl";
// import axios from "axios";

// const { width, height } = Dimensions.get("window");

// const ChangePassword = () => {
//   const navigation = useNavigation();
//   const [newPassword, setNewPassword] = useState("");
//   const [email, setEmail] = useState("");
//   const [tkn, setTkn] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState(null);

//   // useFocusEffect(
//   //   useCallback(() => {
//   //     AsyncStorage.getItem("userString")
//   //       .then((data) => {
//   //         if (data) {
//   //           const userdetails = JSON.parse(data);
//   //           setTkn(userdetails.token);
//   //           setEmail(userdetails.email);
//   //         } else {
//   //           console.log("Object not found in AsyncStorage");
//   //         }
//   //       })
//   //       .catch((error) => {
//   //         console.error("Error retrieving object:", error);
//   //       });
      
//   //     return () => {
//   //       setTkn();
//   //       setEmail();
//   //     };
//   //   }, [])
//   // );

//   useFocusEffect(
//     useCallback(() => {
//       const loadUser = async () => {
//         try {
//           const userData = await AsyncStorage.getItem("userString");
//           const token = await AsyncStorage.getItem("userToken");
  
//           if (userData) {
//             const user = JSON.parse(userData);
//             setEmail(user.email);
//           }
  
//           if (token) {
//             setTkn(token);
//           }
//         } catch (err) {
//           console.log(err);
//         }
//       };
  
//       loadUser();
//     }, [])
//   );

//   const handleSubmit = async () => {
//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     } else {
//       let data = JSON.stringify({ email, newPassword });
//       let config = {
//         method: "post",
//         maxBodyLength: Infinity,
//         url: `${baseUrl}users/reset-password`,
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${tkn}`,
//         },
//         data: data,
//       };

//       axios
//         .request(config)
//         .then((response) => {
//           if (response.status === 200) {
//             navigation.navigate("SignIn");
//           } else {
//             Toast.show(response.data.message, Toast.LENGTH_SHORT);
//           }
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//         <AntDesign name="left" size={20} color="black" />
//       </TouchableOpacity>
//       <View style={styles.headerContainer}>
//         <Text style={styles.headerText}>New Password</Text>
//       </View>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         enabled
//       >
//         <View style={styles.instructionsContainer}>
//           <Text style={styles.boldText}>Please enter new password.</Text>
//           <Text style={styles.normalText}>We have sent a verification code to your registered email</Text>
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>New Password</Text>
//           <Input
//             placeholder="New Password"
//             placeholderColor="#CCCEE6"
//             onChangeText={(text) => setNewPassword(text)}
//             value={newPassword}
//             secureTextEntry={true}
//           />
//           <Text style={styles.label}>Confirm Password</Text>
//           <Input
//             placeholder="Confirm Password"
//             placeholderColor="#CCCEE6"
//             onChangeText={(text) => setConfirmPassword(text)}
//             value={confirmPassword}
//             secureTextEntry={true}
//           />
//         </View>

//         <View style={styles.buttonContainer}>
//           <SimpleButton onPress={handleSubmit} buttonText="Reset" />
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default ChangePassword;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     justifyContent: "center",
//   },
//   backButton: {
//     position: "absolute",
//     top: height * 0.08, // Dynamic top positioning
//     left: width * 0.08, // Dynamic left positioning
//     padding: 10, // Increased touchable area
//     zIndex: 10,
//   },
//   headerContainer: {
//     marginTop: height * 0.02,
//     alignSelf: "center",
//   },
//   headerText: {
//     fontSize: width * 0.07, // Responsive font size
//     fontWeight: "900",
//     alignSelf: "center",
//   },
//   instructionsContainer: {
//     marginTop: height * 0.1,
//     paddingHorizontal: width * 0.05,
//     alignItems: "center",
//     width: "85%",
//   },
//   inputContainer: {
//     marginTop: height * 0.05,
//     paddingHorizontal: width * 0.05,
//   },
//   label: {
//     marginLeft: 10,
//     fontSize: width * 0.04, // Responsive font size
//   },
//   buttonContainer: {
//     marginTop: height * 0.45,
//     paddingHorizontal: width * 0.05,
//   },
//   boldText: {
//     fontSize: width * 0.045, // Responsive font size
//     fontWeight: "900",
//     color: "#000A83",
//   },
//   normalText: {
//     fontSize: width * 0.04, // Responsive font size
//     textAlign: "center",
//     color: "#555",
//   },
// });

