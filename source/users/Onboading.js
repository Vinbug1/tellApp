import React, { useRef, useState, useEffect } from "react";
import { SafeAreaView, View, Text, Dimensions, StyleSheet, Image, TouchableOpacity } from "react-native";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";
import SimpleButton from "../utils/SimpleButton";

const SCREEN_WIDTH = Dimensions.get("window").width;

const data = [
  {
    id: 1,
    image: require("../../assets/images/female.png"),
    title: "Resolve Dispute The Christian Way",
    description: "Our app helps you find a fair and just solution for all parties involved.",
  },
  {
    id: 2,
    image: require("../../assets/images/male.png"),
    title: "Experience Conflict Resolution With Grace",
    description: "Let our team of Christian mediators guide you towards a peaceful resolution.",
  },
  {
    id: 3,
    image: require("../../assets/images/female.png"),
    title: "Handle Disputes In A Christlike Manner",
    description: "Join our platform and let us help you find a resolution that aligns with your faith.",
  },
];

const Onboarding = () => {
  const navigation = useNavigation();
  const swiperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const autoSwipeInterval = setInterval(() => {
      if (currentSlide < data.length - 1) {
        swiperRef.current.scrollBy(1);
      } else {
        clearInterval(autoSwipeInterval);
        //console.log("Reached the end of slides");
      }
    }, 3000);

    return () => {
      clearInterval(autoSwipeInterval);
    };
  }, [currentSlide]);

  const renderSkipButton = () => {
    return (
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={styles.skipButtonText}>
          {currentSlide < data.length - 1 ? "Skip" : "Get Started"}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderGetStartedButton = () => {
    return (
        <SimpleButton
          onPress={() => navigation.navigate("SignIn")}
          buttonText="Get Started"
        />
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
        <Text style={styles.itemText}>{item.title}</Text>
        <Text style={styles.itemTextDescrip}>{item.description}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
    <Swiper
      ref={swiperRef}
      loop={false}
      showsButtons={false}
      showsPagination={false}
      index={currentSlide}
      onIndexChanged={(index) => setCurrentSlide(index)}
    >
      {data.map((item) => (
        <View key={item.id} style={styles.slide}>
          {renderItem({ item })}
        </View>
      ))}
    </Swiper>

    <View style={styles.pagination}>
      {data.map((_, index) => (
        <View key={index} style={[styles.dot, index === currentSlide && styles.activeDot]} />
      ))}
    </View>

    {currentSlide === data.length - 1
      ? renderGetStartedButton()
      : renderSkipButton()}
  </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  itemContainer: {
    width: "100%",
    height: "75%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 45,

  },
  image: {
    width: "100%",
    height: "80%",
    borderRadius: 10,
    //marginTop: 85,
    
  },
  itemText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000A83",
    marginTop: 80,
  },
  itemTextDescrip: {
    fontSize: 15,
    fontWeight: "normal",
    //marginTop: 5,
    padding: 20,
  },
  pagination: {
    position: "absolute",
    bottom: 190,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "gray",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#000A83",
  },
  skipButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 10,
    borderRadius: 5,
  },
  skipButtonText: {
    fontSize: 18,
    color: "#000A83",
    fontWeight: "bold",
  }
});

export default Onboarding;
