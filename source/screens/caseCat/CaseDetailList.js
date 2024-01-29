import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  ScrollView,
  View,
  TouchableOpacity
} from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const CaseDetailList = ({ route }) => {
  const navigation = useNavigation();
  const { item } = route.params;
  const [imageLoadError, setImageLoadError] = useState(false);
  const [nameLoadError, setNameLoadError] = useState(false);

  useEffect(() => {
    console.log('caseDetail:', item.images.url);
  }, []);

  const renderImages = () => (
    <View style={{ width: '100%', height: 200, alignSelf: "center" }}>
      <Text style={{textAlign:"center", left: 25, top: 20, color: "black", fontSize: 16,fontWeight:"bold" }}>Evidence:</Text>
      {item?.images.map((image, index) => (
        <View key={index} style={styles.selectedImageContainer}>
          <View style={styles.selectedImageRow}>
            <Image
              source={image.url && !imageLoadError ? { uri: image.url } : require('../../../assets/images/use.png')}
              style={styles.selectedImage}
              onError={(error) => {
                console.error('Image Error:', error);
                // If an error occurs, set the imageLoadError state to true
                setImageLoadError(true);
              }}
            />
            <Text style={{ left: 12, top: -5, color: "black", fontSize: 16 }}>
              {item?.originalname && !nameLoadError ? item?.originalname : "imageName"}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
  

//   const renderImages = () => (
//     <View style={{ width: '100%', height: 200, position: "absolute", top: 470, alignSelf: "center" }}>
//       <Text style={{ left: 25, top: 20, color: "black", fontSize: 16 }}>Evidence/Images</Text>
//       {item?.images.map((image, index) => (
//         <View key={index} style={styles.selectedImageContainer}>
//           <View style={styles.selectedImageRow}>
//             <Image
//               source={image.url && !imageLoadError ? { uri: image.url } : require('../../../assets/images/use.png')}
//               style={styles.selectedImage}
//               onError={() => setImageLoadError(true)}
//             />
//             <Text style={{ left: 12, top: -5, color: "black", fontSize: 16 }}>
//               {item?.originalname && !nameLoadError ? item?.originalname : "imageName"}
//             </Text>
//           </View>
//         </View>
//       ))}
//     </View>
//   );

  const renderComplainantDetails = () => (
    <View>
      <Text style={{ fontSize: 16, fontWeight: "800", padding: 5 }}>Complainant Details:</Text>
      <View style={styles.textContainer}>
        <Text style={styles.textName}>FullName:</Text>
        <Text style={styles.cattxt}>{item?.user?.fullname}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textName}>PhoneNumber:</Text>
        <Text style={styles.cattxt}>{item?.user?.phone}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textName}>Born Again:</Text>
        <Text style={styles.cattxt}>{item?.salvation}</Text>
      </View>
    </View>
  );

  const renderDefendantDetails = () => (
    <View>
      <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "800", padding: 8 }}>Defendant Details</Text>
      <View style={styles.textContainer}>
        <Text style={styles.textName}>FullName:</Text>
        <Text style={styles.cattxt}>{item?.defendantName}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textName}>PhoneNumber:</Text>
        <Text style={styles.cattxt}>{item?.defendantPhone}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textName}>Email:</Text>
        <Text style={styles.cattxt}>{item?.defendantEmail}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textName}>Church:</Text>
        <Text style={styles.cattxt}>{item?.church}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textName}>Department:</Text>
        <Text style={styles.cattxt}>{item?.department}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textName}>Position:</Text>
        <Text style={styles.cattxt}>{item?.position}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textName}>Open to call:</Text>
        <Text style={styles.cattxt}>{item?.call}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} // Add this line to disable bouncing
    >
         <TouchableOpacity onPress={navigation.goBack} style={styles.icon}>
          <AntDesign name="leftcircleo" size={33} color="#000A83" />
        </TouchableOpacity>

      <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "800", top: -25 }}>Case Details </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          //bounces={false} // Add this line to disable bouncing
        >
      <View style={{justifyContent:"center"}} >
          <View style={styles.textContainer}>
            <Text style={styles.textName}>Case Number:</Text>
            <Text style={styles.cattxt}>{item?.caseCategory?.name}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.textName}>Case Category:</Text>
            <Text style={styles.cattxt}>{item?.caseCategory?.caseNumber}</Text>
          </View>
          {renderComplainantDetails()}
          {renderDefendantDetails()}
          {renderImages()}

          <View style={{ height: 95, width: "85%", borderRadius: 5, borderWidth: 1,bottom: 25, alignSelf:"center" }}>
            <Text style={{ paddingLeft: 15 }}>{item?.description}</Text>
          </View>
      </View>
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    buttonText: {
      color: 'white',
    },
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
      alignItems: "center",
      top: 25,
      left: -89,
      paddingTop: -5,
    },
    selectedImageRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
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
      alignSelf: 'center',
      borderWidth: 0.5,
      borderColor: '#000A83',
    },
    cattxt: {
      fontSize: 14,
      fontWeight: "normal",
      textAlign: "center",
      padding: 4,
      color: "black",
      right: -110,
      //left: 7,
    },
    textContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10, // Adjust as needed
    },
    textName: {
      width: 120, // Adjust the width as needed
      fontWeight: 'normal',
      position: 'relative',
      left: 25, // Adjust as needed
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: -30, // Add paddingBottom to avoid the bouncing behavior
      },
    
    icon: {
        backgroundColor: "whitesmoke",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        height: 40,
        width: 40,
        //position: "absolute",
        top: 15,
        left: 12,
      },
  
  });
  
  export default CaseDetailList;

















// import React, { useState, useEffect } from 'react';
// import { StyleSheet, SafeAreaView, Text, TextInput, View, Modal, TouchableOpacity, KeyboardAvoidingView, Image, ScrollView } from 'react-native';
// // import StyleBtn from "../utils/StyleBtn";
// // import * as FileSystem from 'expo-file-system';
// // import * as ImageManipulator from 'expo-image-manipulator';
// // import * as ImagePicker from 'expo-image-picker';
// // import baseUrl from "../../assets/baseUrl";
// // import axios from 'axios';
// // import Input from "../utils/Input";
// // import { Dropdown } from "react-native-element-dropdown";
// // import calls from "../utils/Salve";
// import { AntDesign, MaterialIcons } from '@expo/vector-icons';
// import { useNavigation } from "@react-navigation/native";


// const CaseDetailList = ({route}) => {
//     const navigation = useNavigation();
//     const { item } = route.params;
//     // const [modalVisible, setModalVisible] = useState(false);
//     // const [images, setImages] = useState([]);
//     // const [imageNames, setImageNames] = useState([]);
//     // const [call, setCall] = useState();
//     // const [description, setDescription] = useState();
//     // const [caseId, setCaseId] = useState();
//     const [imageLoadError, setImageLoadError] = useState(false);
//     const [nameLoadError, setNameLoadError] = useState(false);
  
//     useEffect(() => {
//       console.log('caseDetail:', item);
//       setCaseId(item?._id);
//     }, []);
  
  
//     // const openModal = () => {
//     //   setModalVisible(true);
//     // };
  
//     // const closeModal = () => {
//     //   setModalVisible(false);
//     // };
  
//     // const handleImagePick = async () => {
//     //   try {
//     //     const result = await ImagePicker.launchImageLibraryAsync({
//     //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//     //       allowsEditing: true,
//     //       aspect: [4, 3],
//     //       quality: 1,
//     //     });
  
//     //     if (!result.canceled) {
//     //       if (images.length < 2) {
//     //         const selectedImage = result.assets[0];
//     //         const manipulatedImage = await ImageManipulator.manipulateAsync(
//     //           selectedImage.uri,
//     //           [{ resize: { width: 300, height: 300 } }],
//     //           { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
//     //         );
  
//     //         // Get file information using expo-file-system
//     //         const fileInfo = await FileSystem.getInfoAsync(manipulatedImage.uri);
  
//     //         // Calculate image size in kilobytes
//     //         const sizeInKB = fileInfo.size / 1024;
  
//     //         // Set the formatted size and add it to the image name
//     //         const imageSize = `${sizeInKB.toFixed(2)} KB`;
//     //         const limitedName = selectedImage.uri.split('/').pop().substring(0, 5);
  
//     //         // Update state with the new image
//     //         setImages((prevImages) => [
//     //           ...prevImages,
//     //           {
//     //             fieldname: `image_${prevImages.length}.jpg`,
//     //             originalname: `image_${prevImages.length}.jpg`,
//     //             encoding: 'base64', // Update this based on your encoding logic
//     //             mimetype: 'image/jpeg', // Update this based on your mimetype logic
//     //             size: sizeInKB, // Update this based on your size logic
//     //             url: manipulatedImage.uri, // Update this with your actual image URL or generate one
//     //           },
//     //         ]);
//     //         setImageNames((prevImageNames) => [
//     //           ...prevImageNames,
//     //           `${limitedName} (${imageSize})`,
//     //         ]);
//     //       } else {
//     //         console.log('You can only select up to two images.');
//     //       }
//     //     }
//     //   } catch (error) {
//     //     console.error('Error picking an image', error);
//     //   }
//     // };
//     // const handleDeleteImage = (index) => {
//     //   setImages(prevImages => prevImages.filter((_, i) => i !== index));
//     //   setImageNames(prevImageNames => prevImageNames.filter((_, i) => i !== index));
//     // };
//     // const renderCalls = (calls) => (
//     //   <View style={styles.dropdownItem}>
//     //     <Text style={styles.textItem}>{calls.name}</Text>
//     //     {/* <Text style={styles.textItem}>{calls.caseNumber}</Text> */}
//     //   </View>
//     // );

//     // const handleSubmit = async () => {
//     //   let data = new FormData();
//     //   data.append('call', call);
//     //   data.append('description', description);
//     //   data.append('case', caseId);
//     //   images.forEach((image, index) => {
//     //     data.append(`images[${index}][fieldname]`, image.fieldname);
//     //     data.append(`images[${index}][originalname]`, image.originalname);
//     //     data.append(`images[${index}][encoding]`, image.encoding);
//     //     data.append(`images[${index}][mimetype]`, image.mimetype);
//     //     data.append(`images[${index}][size]`, image.size);
//     //     data.append(`images[${index}][url]`, image.url);
//     //   });
  
//     //   console.log("searcfhing things out:", data);
  
//     //   let config = {
//     //     method: 'post',
//     //     maxBodyLength: Infinity,
//     //     url: `${baseUrl}cases/`,
//     //     headers: {
//     //       'Authorization': `Bearer ${token}`,
//     //       // ...data.getHeaders()
//     //     },
//     //     data: data
//     //   };
  
//     //   axios.request(config)
//     //     .then((response) => {
//     //       if (response.status === 201) {
//     //         //console.log(JSON.stringify(response.data));
//     //         navigation.navigate("HomePage");
//     //       }
//     //     })
//     //     .catch((error) => {
//     //       console.log(error);
//     //     });
//     // };
  
//     return (
//       <SafeAreaView style={styles.container}>
//         <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "800", top: 25 }}>Case Details </Text>
//         <View style={{ top: 55}}>
//           <ScrollView
//             showsVerticalScrollIndicator={false} // Set this prop to false to hide the scrollbar
//             contentContainerStyle={{ flexGrow: 1, }}
//           >
//             <View style={styles.textContainer}>
//               <Text style={styles.textName}>Case Number:</Text>
//                 <Text style={styles.cattxt}>{item?.caseCategory?.name}</Text>
//             </View>
//             <View style={styles.textContainer}>
//               <Text style={styles.textName}>Case Category:</Text>
//               <Text style={styles.cattxt}>{item?.caseCategory?.caseNumber}</Text>
//             </View>
//             <View>
//               <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "800", padding: 5 }}>Complainant Details</Text>
//             </View>
//             <View style={styles.textContainer}>
//               <Text style={styles.textName}>FullName:</Text>
//               <Text style={styles.cattxt}>{item?.user?.fullname}</Text>
//             </View>
//             <View style={styles.textContainer}>
//               <Text style={styles.textName}>PhoneNumber:</Text>
//               <Text style={styles.cattxt}>{item?.user?.phone}</Text>
//             </View>
//             <View style={styles.textContainer}>
//               <Text style={styles.textName}>Born Again:</Text>
//               <Text style={styles.cattxt}>{item?.salvation}</Text>
//             </View>
//             <View>
//               <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "800", padding: 8 }}>Defendant Details</Text>
//             </View>
//             <View style={styles.textContainer}>
//               <Text style={styles.textName}>FullName:</Text>
//               <Text style={styles.cattxt}>{item?.defendantName}</Text>
//             </View>
//             <View style={styles.textContainer}>
//               <Text style={styles.textName}>PhoneNumber:</Text>
//               <Text style={styles.cattxt}>{item?.defendantPhone}</Text>
//             </View>
//             <View style={styles.textContainer}>
//               <Text style={styles.textName}>Email:</Text>
//               <Text style={styles.cattxt}>{item?.defendantEmail}</Text>
//             </View>
//             <View style={styles.textContainer}>
//               <Text style={styles.textName}>Church:</Text>
//               <Text style={styles.cattxt}>{item?.church}</Text>
//             </View>
//             <View style={styles.textContainer}>
//               <Text style={styles.textName}>Department:</Text>
//               <Text style={styles.cattxt}>{item?.department}</Text>
//             </View>
//             <View style={styles.textContainer}>
//               <Text style={styles.textName}>Position:</Text>
//               <Text style={styles.cattxt}>{item?.position}</Text>
//             </View>
//             <View style={styles.textContainer}>
//               <Text style={styles.textName}>Open to call:</Text>
//               <Text style={styles.cattxt}>{item?.call}</Text>
//             </View>
//             <View style={{ width: '100%', height: 200, position: "absolute", top: 470, alignSelf: "center" }}>
//         <Text style={{ left: 12, top: 20, color: "black", fontSize: 16 }}>Evidence/Images</Text>
//         {item?.images.map((image, index) => (
//           <View key={index} style={styles.selectedImageContainer}>
//             <View style={styles.selectedImageRow}>
//               <Image
//                 source={image.url && !imageLoadError ? { uri: image.url } : require('../../../assets/images/use.png')}
//                 style={styles.selectedImage}
//                 onError={(error) => {
//                   console.error('Image Error:', error);
//                   // If an error occurs, set the imageLoadError state to true
//                   setImageLoadError(true);
//                 }}
//               />
//   <Text style={{ left: 12, top: -5, color: "black", fontSize: 16 }}>
//     {item?.originalname && !nameLoadError ? item?.originalname : "imageName"}
//   </Text>
//             </View>
//           </View>
//         ))}
//       </View>
  
//             <View style={{ height: 50, width: "95%", borderRadius: 5, borderWidth: 1, position: "absolute", bottom: 30 }}>
//               <Text style={{ paddingLeft: 15 }}>{item?.description}</Text>
//             </View>
//           </ScrollView>
//         </View>
//         {/* <TouchableOpacity style={styles.floatingButton} onPress={openModal}>
//           <Text style={styles.buttonText}>Defend</Text>
//         </TouchableOpacity>
//    */}
  
//         {/* Modal */}
//         {/* <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={closeModal}
//         >
  
//           <View style={styles.modalBackground}
//           >
//             <KeyboardAvoidingView
//               behavior={Platform.OS === "ios" ? "padding" : "height"}
//               enabled
//             >
//               <TouchableOpacity onPress={() => closeModal()} style={{ position: "absolute", top: 45, left: 12 }}>
//                 <MaterialIcons name="cancel" size={30} color="black" />
//               </TouchableOpacity>
  
//               <View style={{ marginTop: 85, padding: 10 }}>
//                 <Dropdown
//                   style={styles.dropdown}
//                   data={calls}
//                   labelField="name"
//                   valueField="value"
//                   value={call}
//                   search
//                   placeholder="Select things"
//                   searchPlaceholder="Search..."
//                   onChange={(selectedItem) => {
//                     console.log('Selected Item:', selectedItem);
//                     setCall(selectedItem.value);
//                   }}
//                   renderItem={renderCalls}
//                 />
//                 {/* </View> 
//                 <View style={{ width: '100%', height: 150, position: "absolute", top: 38, alignSelf: "center" }}>
//                   <Text style={{ left: 12, top: 65, color: "black", fontSize: 14 }}>Upload Document/Pictures(max. 2)</Text>
//                   <TouchableOpacity style={styles.imageUploadButton} onPress={handleImagePick}>
//                     <AntDesign name="plus" size={55} color="black" style={{ alignSelf: "center", padding: 20 }} />
//                   </TouchableOpacity>
//                   {images.map((image, index) => (
//                     <View key={index} style={styles.selectedImageContainer}>
//                       <View style={styles.selectedImageRow}>
//                         <Image source={{ uri: image.url }} style={styles.selectedImage} />
//                         <View style={styles.imageInfoContainer}>
//                           <Text style={styles.imageName}>{imageNames[index]}</Text>
//                         </View>
//                         <TouchableOpacity
//                           style={styles.deleteImageButton}
//                           onPress={() => handleDeleteImage(index)}
//                         >
//                           <AntDesign name="delete" size={25} color="black" style={{ width: 35, height: 35, alignSelf: "center" }} />
//                         </TouchableOpacity>
//                       </View>
//                     </View>
//                   ))}
//                 </View>
//                 <View style={{ width: '100%', height: 130, position: "absolute", top: 345, alignSelf: "center" }}>
//                   <Text style={{ left: 12, top: 10, color: "black", fontSize: 14 }}>Describe the case</Text>
//                   <TextInput
//                     placeholder="Enter the reason"
//                     placeholderTextColor="black"
//                     multiline={true}
//                     style={styles.aptinput}
//                     value={description}
//                     onChangeText={(text) => setDescription(text)}
//                   />
//                 </View>
  
//                 {/* <View style={{top: 560,alignSelf:"center", flexDirection:"column" }}>
//                 <StyleBtn
//                   onPress={() => navigation.goBack()}
//                   buttonText="Previous"
//                 />
//               </View>
//               <View style={{top:620,alignSelf:"center" }}>
//               <StyleBtn
//                   onPress={() => handleSubmit()}
//                   buttonText="Submit"
//                 />
//               </View> 
//               </View>
//             </KeyboardAvoidingView>
//           </View>
//         </Modal> */}
//       </SafeAreaView>
//     );
//   };
  
  
  