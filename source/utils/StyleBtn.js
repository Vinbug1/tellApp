import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const StyleBtn = ({ onPress, buttonText }) => {const [isPressed, setIsPressed] = useState(false);

    const buttonBackgroundColor = isPressed ? '#000A83' : '#FFFFFF';
    const buttonTextColor = isPressed ? '#FFFFFF' : '#000A83';
  
    const handlePress = () => {
      setIsPressed(!isPressed);
      onPress && onPress();
    };
  
    return (
      <TouchableOpacity
        style={[styles.getStartedButton, { backgroundColor: buttonBackgroundColor }]}
        onPress={handlePress}
      >
        <Text style={[styles.getStartedButtonText, { color: buttonTextColor }]}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    );
  };
  
  const styles = StyleSheet.create({
    getStartedButton: {
      width: '95%',
      height: 54,
      position: 'absolute',
      bottom: 80,
      alignSelf: 'center',
      padding: 15,
      borderRadius: 13,
      borderWidth: 1,
      borderColor: "#000A83"
    },
    getStartedButtonText: {
      fontSize: 21,
      fontWeight: '600',
      textAlign: 'center',
    },
  });
  

export default StyleBtn

