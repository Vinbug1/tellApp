import React, { useState, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Octicons, Entypo, AntDesign } from "@expo/vector-icons";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import baseUrl from "../../assets/baseUrl";
import Input from "../utils/Input";
import SimpleButton from "../utils/SimpleButton";
import StyleBtn from "../utils/StyleBtn";
import { Dropdown } from "react-native-element-dropdown";
import salves from "../utils/Salve";
import cases from "../utils/Case";
import Toast from "react-native-root-toast";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system/legacy";

const { width, height } = Dimensions.get("window");
const defaultImageSource = require("../../assets/images/briefcase.png");

const emptyForm = {
  defendantName: "",
  defendantPhone: "",
  defendantEmail: "",
  caseCategory: "",
  church: "",
  position: "",
  department: "",
  relationship: "",
  salvation: "",
  caseType: "",
};

const CaseCardList = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [caseData, setCaseData] = useState([]);
  const [tkn, setTkn] = useState("");
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [decisionLoadingId, setDecisionLoadingId] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);

  const [caseCat, setCaseCat] = useState([]);
  const [formData, setFormData] = useState(emptyForm);

  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [resolutionMethod, setResolutionMethod] = useState("");

  const fetchUserData = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem("userString");
      if (data) {
        const userDetails = JSON.parse(data);
        setUserName(userDetails.firstname);
        setUser(userDetails.userId);
        setTkn(userDetails.token);
      }
    } catch (error) {
      console.error("Error retrieving user:", error);
    }
  }, []);

  const getData = useCallback(async () => {
    if (!user || !tkn) return;
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}cases/my`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tkn}`,
        },
      });
      if (response.status === 200) {
        setCaseData(response.data.cases);
        setNoData(response.data.cases.length === 0);
      } else {
        setNoData(true);
      }
    } catch (error) {
      console.error("Error fetching cases:", error);
      setNoData(true);
    } finally {
      setLoading(false);
    }
  }, [user, tkn]);

  const fetchCaseCategories = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${baseUrl}caseCategories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCaseCat(response.data);
    } catch (error) {
      console.error("Error fetching case categories:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserData().then(getData);
      fetchCaseCategories();
    }, [fetchUserData, getData, fetchCaseCategories])
  );

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const resetModal = () => {
    setFormData(emptyForm);
    setImage("");
    setDescription("");
    setResolutionMethod("");
    setStep(1);
    setModalVisible(false);
  };

  const handleStep1Next = async () => {
    if (Object.values(formData).some((field) => field === "")) {
      Toast.show("Please fill in all fields", Toast.LENGTH_SHORT);
      return;
    }
    await AsyncStorage.setItem(
      "caseString",
      JSON.stringify({ ...formData, user, tkn })
    );
    setStep(2);
  };

  const handleStep2Submit = async () => {
    if (!description) {
      Toast.show("Please describe the case", Toast.LENGTH_SHORT);
      return;
    }
    if (!resolutionMethod) {
      Toast.show("Please select a resolution method", Toast.LENGTH_SHORT);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("caseCategory", formData.caseCategory);
      fd.append("church", formData.church);
      fd.append("position", formData.position);
      fd.append("department", formData.department);
      fd.append("relationship", formData.relationship);
      fd.append("salvation", formData.salvation);
      fd.append("description", description);
      fd.append("caseType", formData.caseType);
      fd.append("user", user);
      fd.append("defendantName", formData.defendantName);
      fd.append("defendantPhone", formData.defendantPhone);
      fd.append("defendantEmail", formData.defendantEmail);
      fd.append("resolutionMethod", resolutionMethod);

      if (image) {
        const manipulated = await ImageManipulator.manipulateAsync(
          image,
          [{ resize: { width: 300, height: 300 } }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );
        const base64 = await FileSystem.readAsStringAsync(manipulated.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        fd.append("image", {
          uri: manipulated.uri,
          type: "image/jpeg",
          name: "image.jpg",
          data: base64,
        });
      }

      const response = await axios.post(`${baseUrl}cases/`, fd, {
        headers: {
          Authorization: `Bearer ${tkn}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        Toast.show("Case submitted successfully!", Toast.LENGTH_SHORT);
        resetModal();
        getData();
      }
    } catch (error) {
      console.error("Error submitting case:", error.response?.data || error.message);
      Toast.show(
        error.response?.data?.message || "Submission failed. Please try again.",
        Toast.LENGTH_SHORT
      );
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const shouldShowButtons = useCallback(
    (item) => {
      if (userName === item.user?.firstname && item.status === "Pending") return false;
      if (userName === item.defendantName && item.status === "Pending") return true;
      if (userName === item.defendantName && item.status === "Accept") return false;
      if (userName !== item.defendantName && item.status === "Pending") return false;
      return item.status !== "Accept";
    },
    [userName]
  );

  // ── Was missing entirely — buttons called this but it didn't exist ──
  const handleDecision = useCallback(
    async (caseId, decision) => {
      if (!caseId) {
        Alert.alert("Error", "Case ID is missing");
        return;
      }

      setDecisionLoadingId(caseId);
      try {
        if (!tkn) {
          Alert.alert("Error", "Authentication token not found. Please log in again.");
          return;
        }

        await axios.put(
          `${baseUrl}cases/${caseId}/decision`,
          { case: caseId, decision },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tkn}`,
            },
          }
        );

        Toast.show(
          `Case ${decision === "Accept" ? "accepted" : "declined"} successfully`,
          Toast.LENGTH_SHORT
        );
        getData();
      } catch (error) {
        console.error("Error updating case status:", error.response?.data || error.message);
        Alert.alert(
          "Error",
          error.response?.data?.message || "Failed to update case status"
        );
      } finally {
        setDecisionLoadingId(null);
      }
    },
    [tkn, getData]
  );

  const renderCaseItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("DetailListScreen", { item })} activeOpacity={0.8}>
      <View style={styles.avatarWrapper}>
        <Image resizeMode="cover" source={defaultImageSource} style={styles.avatar} />
        <View style={styles.contentContainer}>
          <Text style={styles.cattxt} numberOfLines={1} ellipsizeMode="tail">
            {item.caseCategory?.caseNumber || "N/A"}
          </Text>
          <Text style={styles.txt} numberOfLines={1} ellipsizeMode="tail">
            {item.caseType || "Unknown Type"}
          </Text>
          <View style={styles.dotIndicator}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor:
                    item.status === "Accept"
                      ? "green"
                      : item.status === "Declined"
                      ? "red"
                      : "yellow",
                },
              ]}
            />
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          {shouldShowButtons(item) && (
            <View style={styles.buttonContainer}>
              {decisionLoadingId === item._id ? (
                <ActivityIndicator size="small" color="#000A83" />
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleDecision(item._id, "Accept")}
                  >
                    <Octicons name="check" size={16} color="white" />
                    <Text style={styles.buttonText} numberOfLines={1}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.declineButton}
                    onPress={() => handleDecision(item._id, "Decline")}
                  >
                    <Entypo name="cross" size={16} color="white" />
                    <Text style={styles.buttonText} numberOfLines={1}>Decline</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#000A83" style={{ marginTop: 20 }} />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {noData ? (
        <View style={styles.noPendingCasesContainer}>
          <Text style={styles.noPendingCasesText}>No cases found for this user.</Text>
        </View>
      ) : (
        <FlatList
          data={caseData}
          renderItem={renderCaseItem}
          keyExtractor={(item, index) => `${item._id}_${index}`}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* ── Floating Action Button ────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <AntDesign name="plus" size={28} color="white" />
      </TouchableOpacity>

      {/* ── Modal ────────────────────────────────────────────────────────── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={resetModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

            {/* Modal header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => (step === 2 ? setStep(1) : resetModal())}
              >
                <AntDesign
                  name={step === 2 ? "arrowleft" : "closecircleo"}
                  size={28}
                  color="#000A83"
                />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {step === 1 ? "Case Details (1/2)" : "More Details (2/2)"}
              </Text>
              <TouchableOpacity onPress={resetModal}>
                <AntDesign name="closecircleo" size={28} color="#000A83" />
              </TouchableOpacity>
            </View>

            {/* ── ScrollView OUTSIDE KeyboardAvoidingView ── */}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={{ flex: 1 }}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScroll}
                keyboardShouldPersistTaps="handled"
              >
                {/* ── STEP 1 ──────────────────────────────────────────── */}
                {step === 1 && (
                  <>
                    <Dropdown
                      style={styles.dropdown}
                      data={caseCat}
                      labelField="name"
                      valueField="_id"
                      placeholder="Select case category"
                      searchPlaceholder="Search..."
                      value={formData.caseCategory}
                      onChange={(item) => handleInputChange("caseCategory", item._id)}
                    />

                    {[
                      { label: "Defendant Full Name", key: "defendantName" },
                      { label: "Defendant Phone Number", key: "defendantPhone" },
                      { label: "Defendant Email", key: "defendantEmail" },
                      { label: "Church Name", key: "church" },
                      { label: "Position in Church", key: "position" },
                      { label: "Department in Church", key: "department" },
                      { label: "Relationship to Defendant", key: "relationship" },
                    ].map((field) => (
                      <View style={styles.inputContainer} key={field.key}>
                        <Text style={styles.inputLabel}>{field.label}</Text>
                        <Input
                          placeholder={field.label}
                          onChangeText={(text) => handleInputChange(field.key, text)}
                          value={formData[field.key]}
                        />
                      </View>
                    ))}

                    <Dropdown
                      style={styles.dropdown}
                      data={salves}
                      labelField="name"
                      valueField="value"
                      placeholder="Select salvation"
                      value={formData.salvation}
                      onChange={(item) => handleInputChange("salvation", item.value)}
                    />

                    <Dropdown
                      style={styles.dropdown}
                      data={cases}
                      labelField="name"
                      valueField="value"
                      placeholder="Select case type"
                      value={formData.caseType}
                      onChange={(item) => handleInputChange("caseType", item.value)}
                    />

                    {/* Button sits naturally after the last field */}
                    <View style={styles.submitButtonContainer}>
                      <SimpleButton onPress={handleStep1Next} buttonText="Next" />
                    </View>
                  </>
                )}

                {/* ── STEP 2 ──────────────────────────────────────────── */}
                {step === 2 && (
                  <>
                    <View style={styles.section}>
                      <Text style={styles.inputLabel}>
                        Upload Document/Pictures (max. 2)
                      </Text>
                      <TouchableOpacity
                        style={styles.imageUploadButton}
                        onPress={pickImage}
                      >
                        <AntDesign name="plus" size={55} color="black" />
                      </TouchableOpacity>

                      {image && (
                        <View style={styles.selectedImageRow}>
                          <Image
                            source={{ uri: image }}
                            style={styles.selectedImage}
                          />
                          <Text style={styles.imageName}>Selected Image</Text>
                          <TouchableOpacity onPress={() => setImage("")}>
                            <AntDesign name="delete" size={25} color="red" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>

                    <View style={styles.section}>
                      <Text style={styles.inputLabel}>Describe the case</Text>
                      <TextInput
                        placeholder="Enter the reason"
                        placeholderTextColor="gray"
                        multiline={true}
                        style={styles.descriptionInput}
                        value={description}
                        onChangeText={setDescription}
                      />
                    </View>

                    <View style={styles.section}>
                      <Text style={styles.inputLabel}>Resolution Method *</Text>
                      <Dropdown
                        style={styles.dropdown}
                        data={[
                          { label: "Mediation", value: "Mediation" },
                          { label: "Counseling", value: "Counseling" },
                          { label: "Arbitration", value: "Arbitration" },
                          { label: "Prayer/Spiritual Intervention", value: "Prayer" },
                          { label: "Disciplinary Action", value: "Disciplinary" },
                          { label: "Legal Action", value: "Legal" },
                          { label: "Other", value: "Other" },
                        ]}
                        labelField="label"
                        valueField="value"
                        placeholder="Select resolution method"
                        placeholderStyle={{ color: "gray" }}
                        value={resolutionMethod}
                        onChange={(item) => setResolutionMethod(item.value)}
                      />
                    </View>

                    {/* Button sits naturally after the last field */}
                    <View style={styles.submitButtonContainer}>
                      <StyleBtn onPress={handleStep2Submit} buttonText="Submit" />
                    </View>
                  </>
                )}
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CaseCardList;

const styles = StyleSheet.create({
  avatarWrapper: {
    margin: 9,
    flexDirection: "row",
    alignItems: "center",
    width: "92%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000A83",
    alignSelf: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  avatar: {
    width: 85,
    height: 85,
    borderRadius: 10,
    flexShrink: 0,
  },
  contentContainer: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
  },
  txt: {
    fontSize: 15,
    fontWeight: "normal",
    color: "black",
    marginTop: 2,
  },
  cattxt: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
  },
  dotIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    marginLeft: 5,
    fontSize: 14,
  },
  noPendingCasesContainer: {
    width: "80%",
    justifyContent: "center",
    marginTop: 40,
    alignSelf: "center",
  },
  noPendingCasesText: {
    fontSize: 18,
    color: "black",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  acceptButton: {
    flex: 1,
    minWidth: 0,
    height: 34,
    backgroundColor: "green",
    paddingHorizontal: 6,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  declineButton: {
    flex: 1,
    minWidth: 0,
    height: 34,
    backgroundColor: "red",
    paddingHorizontal: 6,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    marginLeft: 4,
    fontWeight: "600",
    fontSize: 12,
    flexShrink: 1,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#000A83",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.9,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000A83",
  },
  modalScroll: {
    paddingBottom: 40,
  },
  dropdown: {
    width: "95%",
    height: 48,
    margin: 6,
    borderRadius: 5,
    padding: 5,
    alignSelf: "center",
    borderColor: "#000A83",
    borderWidth: 1,
  },
  inputContainer: {
    marginTop: 5,
  },
  inputLabel: {
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 14,
    color: "black",
  },
  submitButtonContainer: {
    marginTop: 160,
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  imageUploadButton: {
    width: "100%",
    height: 110,
    borderColor: "#000A83",
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedImageRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  selectedImage: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    borderRadius: 5,
  },
  imageName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  descriptionInput: {
    width: "100%",
    height: 130,
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#000A83",
    textAlignVertical: "top",
  },
});



