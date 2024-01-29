// GetStartedButton.js

import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const Button = ({ onPress, buttonText  }) => {
  return (
    <TouchableOpacity style={styles.getStartedButton} onPress={onPress}>
      <Text style={styles.getStartedButtonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    getStartedButton: {
        width: "93%",
        height:85,
        position: "absolute",
        bottom: 80,
        alignSelf: "center",
        padding: 15,
        borderRadius: 13,
        backgroundColor: "#000A83",
      },
      getStartedButtonText: {
        fontSize: 18,
        color: "#FFFFFF",
        fontWeight: "600",
        textAlign:"center",
      },
});

export default Button;
