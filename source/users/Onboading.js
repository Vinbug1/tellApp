import React, { useRef, useState, useEffect } from "react";
import { SafeAreaView, View, Text, Dimensions, StyleSheet, Image, TouchableOpacity } from "react-native";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";
import SimpleButton from "../utils/SimpleButton";

const SCREEN_WIDTH = Dimensions.get("window").width;

const data = [
  {
    id: 1,
    image: require("../../assets/images/successful.png"),
    title: "Resolve Dispute The Christian Way",
    description: "Our app helps you find a fair and just solution for all parties involved.",
  },
  {
    id: 2,
    image: require("../../assets/images/dove.png"),
    title: "Experience Conflict Resolution With Grace",
    description: "Let our team of Christian mediators guide you towards a peaceful resolution.",
  },
  {
    id: 3,
    image: require("../../assets/images/slidetell.png"),
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
      }
    }, 3000);

    return () => {
      clearInterval(autoSwipeInterval);
    };
  }, [currentSlide]);

  const isLastSlide = currentSlide === data.length - 1;

  const renderSkipButton = () => (
    <TouchableOpacity
      style={styles.skipButton}
      onPress={() => navigation.navigate("SignIn")}
    >
      <Text style={styles.skipButtonText}>Skip</Text>
    </TouchableOpacity>
  );

  const renderGetStartedButton = () => (
    <View style={styles.getStartedWrapper}>
      <SimpleButton
        onPress={() => navigation.navigate("SignIn")}
        buttonText="Get Started"
      />
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      {/* Image fills the entire screen, top to bottom */}
      <Image source={item.image} style={styles.image} resizeMode="cover" />

      {/* Semi-transparent white card holding title, description, and dots */}
      <View style={styles.overlayCard}>
        <Text style={styles.itemText}>{item.title}</Text>
        <Text style={styles.itemTextDescrip}>{item.description}</Text>

        <View style={styles.pagination}>
          {data.map((_, index) => (
            <View key={index} style={[styles.dot, index === currentSlide && styles.activeDot]} />
          ))}
        </View>
      </View>
    </View>
  );

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

      {isLastSlide ? renderGetStartedButton() : renderSkipButton()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  slide: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: "100%",
  },
  image: {
    height:"100%",
    width:"100%"
    // ...StyleSheet.absoluteFillObject, // image covers the full slide, edge to edge
  },
  overlayCard: {
    position: "absolute",
    top: "48%",
  bottom: 0,
  left: 0,
  right: 0,
    width: "100%",
    paddingTop: 24,
    paddingHorizontal: 28,
    // paddingBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.75)", // semi-transparent — image shows through slightly
    alignItems: "center",
    
  },
  itemText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000A83",
    textAlign: "center",
  },
  itemTextDescrip: {
    fontSize: 14,
    fontWeight: "normal",
    color: "#555555",
    textAlign: "center",
    marginTop: 10,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D0D0D0",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#000A83",
  },
  skipButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    padding: 10,
    borderRadius: 5,
  },
  skipButtonText: {
    fontSize: 16,
    color: "#000A83",
    fontWeight: "bold",
  },
  getStartedWrapper: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    paddingHorizontal: 24,
  },
});

export default Onboarding;








