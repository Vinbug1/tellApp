import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  ScrollView
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StyleBtn from "../utils/StyleBtn";
import { Dropdown } from "react-native-element-dropdown";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { AntDesign } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import axios from 'axios';
import baseUrl from "../../assets/baseUrl";
import { Ionicons } from '@expo/vector-icons';

const MoreCase = () => {
  const navigation = useNavigation();
  const [caseCategory, setCaseCategory] = useState('');
  const [church, setChurch] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [relationship, setRelationship] = useState('');
  const [salvation, setSalvation] = useState('');
  const [call, setCall] = useState('');
  const [description, setDescription] = useState('');
  const [caseType, setCaseType] = useState('');
  const [user, setUser] = useState('');
  const [defendantName, setDefendantName] = useState('');
  const [defendantPhone, setDefendantPhone] = useState('');
  const [defendantEmail, setDefendantEmail] = useState('');
  const [image, setImage] = useState('');
  const [token, setToken] = useState("");
  const [resolutionMethod, setResolutionMethod] = useState('');

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("caseString")
        .then((data) => {
          if (data) {
            const userData = JSON.parse(data);
            setCaseCategory(userData.caseCategory);
            setDefendantName(userData.defendantName);
            setDefendantEmail(userData.defendantEmail);
            setDefendantPhone(userData.defendantPhone);
            setChurch(userData.church);
            setPosition(userData.position);
            setDepartment(userData.department);
            setRelationship(userData.relationship);
            setSalvation(userData.salvation);
            setCaseType(userData.caseType);
            setUser(userData.user);
            setToken(userData.tkn);
            setResolutionMethod(userData.resolutionMethod || '');
          }
        })
        .catch((error) => {
          console.error("Error retrieving object:", error);
        });

      return () => {
        setCaseCategory('');
        setDefendantName('');
        setDefendantEmail('');
        setDefendantPhone('');
        setChurch('');
        setPosition('');
        setDepartment('');
        setRelationship('');
        setSalvation('');
        setCaseType('');
        setUser('');
        setToken('');
        setResolutionMethod('');
      };
    }, [])
  );

  const pickAndHandleImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        if (selectedAsset) {
          setImage(selectedAsset.uri);
        }
      }
    } catch (error) {
      console.error('Error picking an image', error);
    }
  };

  const handleSubmit = async () => {
    try {
      let formData = new FormData();

      formData.append('caseCategory', caseCategory);
      formData.append('church', church);
      formData.append('position', position);
      formData.append('department', department);
      formData.append('relationship', relationship);
      formData.append('salvation', salvation);
      formData.append('call', call);
      formData.append('description', description);
      formData.append('caseType', caseType);
      formData.append('user', user);
      formData.append('defendantName', defendantName);
      formData.append('defendantPhone', defendantPhone);
      formData.append('defendantEmail', defendantEmail);
      formData.append('resolutionMethod', resolutionMethod);

      if (image) {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          image,
          [{ resize: { width: 300, height: 300 } }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );

        const base64ImageData = await FileSystem.readAsStringAsync(
          manipulatedImage.uri,
          { encoding: FileSystem.EncodingType.Base64 }
        );

        formData.append("image", {
          uri: manipulatedImage.uri,
          type: "image/jpeg",
          name: "image.jpg",
          data: base64ImageData,
        });
      }

      let config = {
        method: 'post',
        url: `${baseUrl}cases/`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      };

      const response = await axios.request(config);

      if (response.status === 201) {
        navigation.navigate("HomePage");
      }
    } catch (error) {
      console.error('Error during form submission:', error.response?.data || error.message || error);
    }
  };

  const handleDeleteImage = () => {
    setImage('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back-circle-outline" size={33} color="#000A83" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerText}>Case Details Form</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          enabled
        >
          <View style={styles.formContainer}>
            {/* Image Upload Section */}
            <View style={styles.section}>
              <Text style={styles.label}>Upload Document/Pictures (max. 2)</Text>
              <TouchableOpacity style={styles.imageUploadButton} onPress={pickAndHandleImage}>
                <AntDesign name="plus" size={55} color="black" />
              </TouchableOpacity>

              {image && (
                <View style={styles.selectedImageContainer}>
                  <View style={styles.selectedImageRow}>
                    <Image source={{ uri: image }} style={styles.selectedImage} />
                    <View style={styles.imageInfoContainer}>
                      <Text style={styles.imageName}>Selected Image</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteImageButton}
                      onPress={handleDeleteImage}
                    >
                      <AntDesign name="delete" size={25} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Description Section */}
            <View style={styles.section}>
              <Text style={styles.label}>Describe the case</Text>
              <TextInput
                placeholder="Enter the reason"
                placeholderTextColor="gray"
                multiline={true}
                style={styles.descriptionInput}
                value={description}
                onChangeText={(text) => setDescription(text)}
              />
            </View>

            {/* Resolution Method Section */}
            <View style={styles.section}>
              <Text style={styles.label}>Resolution Method *</Text>
              <Dropdown
                style={styles.dropdown}
                data={[
                  { label: 'Mediation', value: 'Mediation' },
                  { label: 'Counseling', value: 'Counseling' },
                  { label: 'Arbitration', value: 'Arbitration' },
                  { label: 'Prayer/Spiritual Intervention', value: 'Prayer' },
                  { label: 'Disciplinary Action', value: 'Disciplinary' },
                  { label: 'Legal Action', value: 'Legal' },
                  { label: 'Other', value: 'Other' }
                ]}
                labelField="label"
                valueField="value"
                placeholder="Select resolution method"
                placeholderStyle={{ color: 'gray' }}
                value={resolutionMethod}
                onChange={(item) => setResolutionMethod(item.value)}
              />
            </View>

            {/* Submit Button */}
            <View style={styles.buttonContainer}>
              <StyleBtn
                onPress={handleSubmit}
                buttonText="Submit"
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === "ios" ? 50 : 50,
    left: 15,
    zIndex: 10,
  },
  header: {
    marginTop: Platform.OS === "ios" ? 0 : 45,
    paddingVertical: 15,
  },
  headerText: {
    textAlign: "center",
    fontWeight: "900",
    fontSize: 22,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  keyboardView: {
    flex: 1,
  },
  formContainer: {
    padding: 15,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    color: "black",
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 5,
  },
  imageUploadButton: {
    width: "100%",
    height: 110,
    borderColor: "#000A83",
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedImageContainer: {
    width: "100%",
    marginTop: 15,
  },
  selectedImageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
  },
  selectedImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  imageInfoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  imageName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  deleteImageButton: {
    padding: 10,
  },
  descriptionInput: {
    width: '100%',
    height: 130,
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000A83',
    textAlignVertical: 'top',
  },
  dropdown: {
    width: '100%',
    height: 60,
    borderRadius: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000A83',
  },
  buttonContainer: {
    width: "100%",
    marginTop: 140,
  },
});

export default MoreCase;