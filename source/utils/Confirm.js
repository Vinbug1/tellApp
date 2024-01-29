import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react';
import StyleBtn from "../utils/StyleBtn";


const Confirm = () => {
  return (
    <View>
        <View>
            <Image  source={require("../../assets/images/success.png")} style={{height:50, width:50,alignSelf:"center"}} resizeMode="contain" />
        </View>
      <Text>Congratulation</Text>
      <Text>Thank you for your submission! We’ll review and send a link to the defendant.Check back your case to see if defendant has accepted it.</Text>

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
  )
}

export default Confirm

const styles = StyleSheet.create({})