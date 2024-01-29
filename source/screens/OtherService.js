import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, SectionList } from "react-native";
import { MaterialCommunityIcons,AntDesign,Fontisto } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const OtherService = () => {
  const navigation = useNavigation();
  const [activeItem, setActiveItem] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAddMoneyModalVisible, setAddMoneyModalVisible] = useState(false);

  const offtoggleModal = () => {
    setModalVisible(false);
  };

  const backofftoggleModal = () => {
    setAddMoneyModalVisible(false);
  };

  const Submitpay = () => {
    // Handle the submit action
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    console.log(item);
    if (item === "Create case") {
      navigation.navigate('CaseScreen');
    } else if (item === "Find case") {
      navigation.navigate('SearchScreen')
    } else if (item === "Help/support") {
      navigation.navigate('BillScreen')
    }
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={[
          { data: ITEMS },
        ]}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleItemClick(item.name)}
            style={styles.item}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: activeItem === item.name ? "#000A83" : "transparent",
                },
              ]}
            >
              {item.icon({ color: activeItem === item.name ? "#FFFFFF" : "#000A83" })}
            </View>
            <Text style={[styles.itemText, { color: "black" }]}>{item.name}</Text>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />

    </View>
  );
};

// const ITEMS = [
//   { name: "Earn Reward", icon: ({ color }) => <Octicons name="gift" size={25} color={color} /> },
//   { name: "Utility Bills", icon: ({ color }) => <Entypo name="text-document" size={25} color={color} /> },
// ];
const ITEMS = [
   { name: "Create case", icon: ({ color }) => <MaterialCommunityIcons name="briefcase-plus-outline" size={25} color={color} /> },
  { name: "Find case", icon: ({ color }) => <MaterialCommunityIcons name="briefcase-search-outline" size={25} color={color} /> },
  // { name: "About Us", icon: ({ color }) => <AntDesign name="search1" size={25} color={color} /> },
 { name: "Help/support", icon: ({ color }) => <Fontisto name="info" size={25} color={color} /> },
];

const ITEM_SIZE = 90;
const ITEM_MARGIN = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  item: {
    justifyContent: "space-evenly",
    alignItems: "center",
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    backgroundColor: "transparent", // Set the background color to transparent for the entire item
    marginHorizontal: ITEM_MARGIN / 2,
    //margin:0, 25, 0, 25
    //gap:45
  },
  iconContainer: {
    width: ITEM_SIZE - 30,
    height: ITEM_SIZE - 30,
    borderRadius: (ITEM_SIZE - 30) / 2,
    borderWidth: 1,
    borderColor: "#000A83",
    justifyContent: "center",
    alignItems: "center",
    

  },
  itemText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: ITEM_MARGIN,
  },
});

export default OtherService;





