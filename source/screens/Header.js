import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";

import {
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { SimpleLineIcons } from "@expo/vector-icons";

import baseUrl from "../../assets/baseUrl";

const { width } = Dimensions.get("window");

const defaultAvatar = require("../../assets/images/use.png");

const Header = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [image, setImage] = useState(defaultAvatar);

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [selectedCase, setSelectedCase] = useState(null);

  const [detailVisible, setDetailVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadUser();

      return () => {};
    }, [])
  );

  const loadUser = async () => {
    try {
      const data = await AsyncStorage.getItem("userString");

      if (!data) return;

      const userData = JSON.parse(data);

      setUser(userData);

      if (userData.image) {
        setImage({ uri: userData.image });
      }

      fetchCases(userData.token);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCases = async (token) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${baseUrl}cases/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCases(response.data.cases || []);
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const pendingCases = cases.filter(
    (item) => item.status === "pending"
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.left}>
          <Image source={image} style={styles.avatar} />

          <View>
            <Text style={styles.welcome}>
              Welcome Back
            </Text>

            <Text style={styles.name}>
              {user?.fullname}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bell}
          onPress={() => setModalVisible(true)}
        >
          <SimpleLineIcons
            name="bell"
            size={24}
            color="#000A83"
          />

          {pendingCases.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {pendingCases.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Notification Modal */}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>
              Case Notifications
            </Text>

            {loading ? (
              <ActivityIndicator
                size="large"
                color="#000A83"
              />
            ) : pendingCases.length === 0 ? (
              <Text style={styles.empty}>
                No pending cases.
              </Text>
            ) : (
              <ScrollView>
                {pendingCases.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    style={styles.card}
                    onPress={() => {
                      setSelectedCase(item);
                      setDetailVisible(true);
                    }}
                  >
                    <Text style={styles.cardTitle}>
                      {item.title}
                    </Text>

                    <Text
                      numberOfLines={2}
                      style={styles.cardBody}
                    >
                      {item.description}
                    </Text>

                    <Text style={styles.status}>
                      {item.status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.close}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Detail Modal */}

      <Modal
        visible={detailVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>
              Case Details
            </Text>

            {selectedCase && (
              <>
                <Text style={styles.label}>
                  Title
                </Text>

                <Text style={styles.value}>
                  {selectedCase.title}
                </Text>

                <Text style={styles.label}>
                  Description
                </Text>

                <Text style={styles.value}>
                  {selectedCase.description}
                </Text>

                <Text style={styles.label}>
                  Defendant
                </Text>

                <Text style={styles.value}>
                  {selectedCase.defendantName}
                </Text>

                <Text style={styles.label}>
                  Status
                </Text>

                <Text style={styles.value}>
                  {selectedCase.status}
                </Text>
              </>
            )}

            <TouchableOpacity
              style={styles.close}
              onPress={() => {
                setDetailVisible(false);
                setSelectedCase(null);
              }}
            >
              <Text style={styles.closeText}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "ios" ? 10 : 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
    marginRight: 10,
  },

  welcome: {
    color: "#000A83",
    fontSize: 15,
  },

  name: {
    fontWeight: "bold",
    fontSize: 17,
  },

  bell: {
    padding: 10,
  },

  badge: {
    position: "absolute",
    right: 2,
    top: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "92%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },

  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center",
  },

  empty: {
    textAlign: "center",
    color: "#888",
    marginVertical: 30,
  },

  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },

  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  cardBody: {
    marginTop: 5,
    color: "#555",
  },

  status: {
    marginTop: 8,
    color: "#000A83",
    fontWeight: "bold",
  },

  label: {
    fontWeight: "bold",
    marginTop: 10,
  },

  value: {
    marginTop: 3,
    color: "#444",
  },

  close: {
    backgroundColor: "#000A83",
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  closeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});



