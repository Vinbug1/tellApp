import { StyleSheet, TextInput, View } from 'react-native'
import React from 'react'

const Input = (props) => {
  return (
    <TextInput
  style={[styles.aptinput, props.style]}
  placeholder={props.placeholder}
  placeholderTextColor={props.placeholderTextColor}
  value={props.value}
  onChangeText={props.onChangeText}
  secureTextEntry={props.secureTextEntry}
  keyboardType={props.keyboardType}
  autoCapitalize={props.autoCapitalize}
  autoCorrect={props.autoCorrect}
  editable={props.editable}
  onFocus={props.onFocus}
/>
  )
}

export default Input

const styles = StyleSheet.create({
  aptinput: {
    width: '95%',
    height: 52,
    margin: 10,
    borderRadius: 5,
    padding: 6,
    alignSelf: 'center',
    borderWidth: 0.5,
    borderColor: '#000A83',
    backgroundColor: '#FFFFFF', // Default background color
  },
});
