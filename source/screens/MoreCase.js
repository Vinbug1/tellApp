import React, { useState, useEffect,useCallback } from "react";
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
  ScrollView // Import ScrollView

} from "react-native";
import { useNavigation,useFocusEffect } from "@react-navigation/native";
import Input from "../utils/Input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import StyleBtn from "../utils/StyleBtn";
import { Dropdown } from "react-native-element-dropdown";
import calls from "../utils/Salve";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { AntDesign } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import baseUrl from "../../assets/baseUrl";

const MoreCase = () => {
  const navigation = useNavigation();
  const [caseCategory, setCaseCategory] = useState("");
  const [defendantName, setDefendantName] = useState("");
  const[defendantEmail, setDefendantEmail] = useState("");
  const [defendantPhone, setDefendantPhone] = useState("");
  const [church, setChurch] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [relationship, setRelationship] = useState("");
  const [salvation, setSalvation] = useState("");
  const [call, setCall] = useState("");
  const [images, setImages] = useState([]);
  const [imageNames, setImageNames] = useState([]);
  const [description, setDescription] = useState("");
  const [caseType, setCaseType] = useState("");
  const [user,setUser] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("caseString")
        .then((data) => {
          if (data) {
            const user = JSON.parse(data);
            //console.log("Testing new phase to see what is been sending",user);
            setCaseCategory(user.caseCategory);
            setDefendantName(user.defendantName);
            setDefendantEmail(user.defendantEmail);
            setDefendantPhone(user.defendantPhone);
            setChurch(user.church);
            setPosition(user.position);
            setDepartment(user.department);
            setRelationship(user.relationship);
            setSalvation(user.salvation);
            setCaseType(user.caseType);
            setUser(user.user);
            setToken(user.tkn);
          } else {
            console.log("Object not found in AsyncStorage");
          }
        })
        .catch((error) => {
          console.error("Error retrieving object:", error);
        });

      return () => {
        setCaseCategory();
        setDefendantName();
        setDefendantEmail();
        setDefendantPhone();
        setChurch();
        setPosition();
        setDepartment();
        setRelationship();
        setSalvation();
        setCaseType();
        setUser();
        setToken();
      };
    }, [])
  );
  
  const handleSubmit = async () => {
// const FormData = require('form-data');
//const fs = require('fs');
let data = new FormData();
data.append('caseCategory', caseCategory);
data.append('church', church);
data.append('position', position);
data.append('department', department);
data.append('relationship', relationship);
data.append('salvation', salvation);
data.append('call', call);
data.append('description', description);
data.append('caseType', caseType);
data.append('user', user);
data.append('defendantName', defendantName);
data.append('defendantPhone', defendantPhone);
data.append('defendantEmail', defendantEmail);
images.forEach((image, index) => {
  // Append each property of the image object
  data.append(`images[${index}][fieldname]`, image.fieldname);
  data.append(`images[${index}][originalname]`, image.originalname);
  //data.append(`images[${index}][encoding]`, image.encoding);
  //data.append(`images[${index}][mimetype]`, image.mimetype);
  //data.append(`images[${index}][size]`, image.size);
  data.append(`images[${index}][url]`, image.url);
});

console.log("searcfhing things out:",data);

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `${baseUrl}cases/`,
  headers: { 
    'Authorization': `Bearer ${token}`, 
    //'Content-Type': 'multipart/form-data', // Set Content-Type to multipart/form-data

    // ...data.getHeaders()
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(response.data);
  if (response.status === 201) {
    navigation.navigate("HomePage");
  }
})
.catch((error) => {
  console.log(error);
});
  };

  const renderCalls = (calls) => (
    <View style={styles.dropdownItem}>
      <Text style={styles.textItem}>{calls.name}</Text>
      {/* <Text style={styles.textItem}>{calls.caseNumber}</Text> */}
    </View>
  );

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        if (images.length < 2) {
          const selectedImage = result.assets[0];
          const manipulatedImage = await ImageManipulator.manipulateAsync(
            selectedImage.uri,
            [{ resize: { width: 300, height: 300 } }],
            { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
          );
  
          // Get base64-encoded image data
          const base64ImageData = await FileSystem.readAsStringAsync(
            manipulatedImage.uri,
            { encoding: FileSystem.EncodingType.Base64 }
          );
  
          // Update state with the new image
          setImages((prevImages) => [
            ...prevImages,
            {
              fieldname: `image_${prevImages.length}.jpg`,
              originalname: `image_${prevImages.length}.jpg`,
              encoding: 'base64',
              mimetype: 'image/jpeg',
              size: base64ImageData.length / 1024, // Update this based on your size logic
              url: manipulatedImage.uri,
              data: base64ImageData, // Add base64-encoded data
            },
          ]);
  
          setImageNames((prevImageNames) => [
            ...prevImageNames,
            `${selectedImage.uri.split('/').pop().substring(0, 5)} (${(base64ImageData.length / 1024).toFixed(2)} KB)`,
          ]);
        } else {
          console.log('You can only select up to two images.');
        }
      }
    } catch (error) {
      console.error('Error picking an image', error);
    }
  };
  

  const handleDeleteImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    setImageNames(prevImageNames => prevImageNames.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.container}>
       <View style={{marginTop:Platform.OS === "ios" ? 0 : 45}}>
        <Text style={{textAlign:"center",fontWeight:"900",fontSize:22}}>Case Details Form</Text>
       </View>
       <ScrollView contentContainerStyle={styles.scrollContainer}>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled
      >
        
        
          <View style={{ marginTop: Platform.OS === "ios" ? 10 : 15, padding: 10 }}>
              <Dropdown
                style={styles.dropdown}
                data={calls}
                labelField="name"
                valueField="value"
                value={call}
                search
                placeholder="Select things"
                searchPlaceholder="Search..."
                onChange={(selectedItem) => {
                  console.log('Selected Item:', selectedItem);
                  setCall(selectedItem.value);
                }}
                                renderItem={renderCalls}
              />
            {/* </View> */}
            <View style={{width: '100%', height: 150,position:"absolute",top:38, alignSelf:"center"}}>
              <Text style={{ left:12,top:65 ,color:"black",fontSize:14 }}>Upload Document/Pictures(max. 2)</Text>
              <TouchableOpacity style={styles.imageUploadButton} onPress={handleImagePick}>
                <AntDesign name="plus" size={55} color="black" style={{ alignSelf: "center", padding: 20 }} />
              </TouchableOpacity>
              {images.map((image, index) => (
              <View key={index} style={styles.selectedImageContainer}>
                  <View style={styles.selectedImageRow}>
                  <Image source={{ uri: image.url }} style={styles.selectedImage} />
                  <View style={styles.imageInfoContainer}>
                      <Text style={styles.imageName}>{imageNames[index]}</Text>
                  </View>
                  <TouchableOpacity
                      style={styles.deleteImageButton}
                      onPress={() => handleDeleteImage(index)}
                  >
                      <AntDesign name="delete" size={25} color="black" style={{ width: 35, height: 35, alignSelf: "center" }} />
                  </TouchableOpacity>
                  </View>
              </View>
              ))}
              </View>
            <View style={{  width: '100%',height: 130,position:"absolute",top:345,alignSelf:"center"}}>
              <Text style={{ left:12,top:10 ,color:"black",fontSize:14 }}>Describe the case</Text>
            <TextInput 
                placeholder="Enter the reason"
                placeholderTextColor="black"
                multiline={true}
                style={styles.aptinput} 
                value={description}    
                onChangeText={(text) => setDescription(text)}    
            />
            </View>

            <View style={{top: 560,alignSelf:"center", flexDirection:"column" }}>
              <StyleBtn
                onPress={() => navigation.goBack()}
                buttonText="Previous"
              />
            </View>
            <View style={{top:620,alignSelf:"center" }}>
            <StyleBtn
                onPress={() => handleSubmit()}
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
    imageUploadButton: {
      width: "95%",
      height: 110,
      alignSelf: "center",
      borderColor: "#000A83",
      borderWidth: 1,
      padding: 10,
      borderRadius: 5,
      marginTop: 5,
      top: 65,
    },
    inputContainer: {
        marginTop: 5,
      },
  
        imageUploadButtonText: {
      color: "white",
      textAlign: "center",
    },
    selectedImageContainer: {
      width: "100%",
      //height: 90,
      alignItems: "center",
      top:65,
      left: 9,
      //marginTop: 25,
     // marginLeft: 15,
      //top: 45,
      //backgroundColor: "black",
      paddingTop: -5,
    },
    selectedImageRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    selectedImage: {
      width: 40,
      height: 40,
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
      width: 45,
      padding: 10,
      marginLeft: 10,
    },
    deleteImageButtonText: {
      color: 'white',
      textAlign: 'center',
    },
        deleteImageButton: {
      width: 45,
      padding: 10,
      marginLeft: 10,
    },
    deleteImageButtonText: {
      color: "white",
      textAlign: "center",
    },
    dropdown: {
      width: "95%",
      height: 60,
      margin: 6,
      borderRadius: 5,
      padding: 5,
      alignSelf: "center",
      borderColor: "#000A83",
      borderWidth: 1,
    },
      dropdownItem: {
        paddingHorizontal: 16, // Add left and right padding for spacing
        paddingVertical: 10, // Add top and bottom padding for spacing
      },
      aptinput: {
        width: '95%',
        height: 130,
        margin: 10,
        borderRadius: 5,
        padding: 6,
        alignSelf:'center',
        borderWidth: 0.5,
        borderColor: '#000A83',
    },scrollContainer: {
      height: '100%',
      //flexGrow: 1,
    },
  
});
  

  
export default MoreCase;

