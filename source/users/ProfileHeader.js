import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";

const { width } = Dimensions.get("window");

const ProfileHeader = () => {
  const [user, setUser] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        try {
          const data = await AsyncStorage.getItem("userString");
          if (data) {
            const parsed = JSON.parse(data);
            console.log("👤 Loaded user:", parsed);
            setUser(parsed);  // <-- parsed object includes `image`
            setImageError(false);
            setImageLoading(true);
          } else {
            console.log("Object not found in AsyncStorage");
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      };
      fetchUser();
    }, [])
  );
  
  return (
    <View style={styles.avatarContainer}>
      <View style={styles.avatarWrapper}>
        <View style={styles.imageWrapper}>
          {imageLoading && !imageError && (
            <ActivityIndicator size="small" style={StyleSheet.absoluteFill} />
          )}

<Image
  source={
      !imageError && user?.image
        ? { uri: user.image }
        : require("../../assets/images/use.png")
  }
  style={styles.avatar}
  resizeMode="cover"
  onLoadStart={() => setImageLoading(true)}
  onLoadEnd={() => setImageLoading(false)}
  onError={() => {
    console.log("❌ Failed to load image:", user.image);
    setImageError(true);
    setImageLoading(false);
  }}
/>


        </View>

        <View style={{ marginTop: 5 }}>
            <Text style={styles.txt}> {`${user?.firstname || ""} ${user?.lastname || ""}`}</Text>
            <Text style={styles.txt}>{user?.email || "No Email"}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  avatarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Platform.OS === "ios" ? 15 : 45,
    marginLeft: width * 0.04,
    marginRight: width * 0.04,
  },
  avatarWrapper: {
    flexDirection: "row",
    alignSelf: "center",
  },
  imageWrapper: {
    width: width * 0.16,
    height: width * 0.16,
    borderRadius: (width * 0.16) / 2,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    top: -15,
    backgroundColor: "#f2f2f2",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: (width * 0.16) / 2,
  },
  txt: {
    paddingLeft: 12,
    fontSize: 16,
    fontWeight: "500",
  },
});

