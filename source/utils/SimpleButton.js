import { TouchableOpacity, Text, StyleSheet } from "react-native";
import React from 'react'

const SimpleButton = ({ onPress, buttonText, disabled }) => {
    return (
        <TouchableOpacity
          style={[styles.getStartedButton, disabled && styles.disabledButton]}
          onPress={onPress}
          disabled={disabled}
        >
          <Text style={styles.getStartedButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      );
    };
    
    const styles = StyleSheet.create({
        getStartedButton: {
            width: "95%",
            height:55,
            position: "absolute",
            bottom: 80,
            alignSelf: "center",
            padding: 15,
            borderRadius: 13,
            backgroundColor: "#000A83",
          },
          disabledButton: {
            opacity: 0.6,
          },
          getStartedButtonText: {
            fontSize: 21,
            color: "#FFFFFF",
            fontWeight: "600",
            textAlign:"center",
          },
    });
    

export default SimpleButton

