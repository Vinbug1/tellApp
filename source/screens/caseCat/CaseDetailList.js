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
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const CaseDetailList = ({ route }) => {
  const navigation = useNavigation();
  const { item } = route.params;
  const [imageLoadError, setImageLoadError] = useState(false);
  const [nameLoadError, setNameLoadError] = useState(false);

  useEffect(() => {
    console.log('caseDetail:', item.image);
  }, []);

  


const renderImages = () => (
  <View style={{ width: '100%', height: 200, position: "absolute", top: 470, alignSelf: "center" }}>
    <Text style={{fontWeight: "600", paddingLeft: 10, top:40, color: "black", fontSize: 16 }}>Evidence/Images</Text>
    {item?.image && (
      <View style={styles.selectedImageContainer}>
        <View style={styles.selectedImageRow}>
          <Image
            source={{ uri: item.image }}
            style={styles.selectedImage}
            onError={(error) => {
              console.error('Image Error:', error);
              // Log the error for debugging
              setImageLoadError(true);
            }}
          />
        </View>
      </View>
    )}
  </View>
);


  const renderComplainantDetails = () => (
    <View style={{ top: 13, padding: 10}}>
      <Text style={{ fontSize: 16, fontWeight: "600", paddingLeft: 10 }}>Complainant Details:</Text>
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
    <View style={{ top: 13, padding: 10}}>
      <Text style={{  fontSize: 16, fontWeight: "600", paddingLeft: 10}}>Defendant Details</Text>
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
          <Ionicons name="arrow-back-circle-outline" size={27} color="#000A83" />
        </TouchableOpacity>

      <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "800", top: -25 }}>Case Details </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          //bounces={false} // Add this line to disable bouncing
        >
      <View style={{justifyContent:"center", top: 13, padding: 10}} >
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

          <View style={{ height: 95, width: "85%", borderRadius: 5, borderWidth: 1,bottom: -65, alignSelf:"center" }}>
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

