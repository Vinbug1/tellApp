import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import {
  MaterialCommunityIcons,
  Fontisto,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ITEMS = [
  {
    name: "Create case",
    screen: "CaseScreen",
    icon: ({ color }) => (
      <MaterialCommunityIcons
        name="briefcase-plus-outline"
        size={25}
        color={color}
      />
    ),
  },
  {
    name: "Find case",
    screen: "SearchScreen",
    icon: ({ color }) => (
      <MaterialCommunityIcons
        name="briefcase-search-outline"
        size={25}
        color={color}
      />
    ),
  },
  {
    name: "Help/support",
    screen: "BillScreen",
    icon: ({ color }) => (
      <Fontisto
        name="info"
        size={23}
        color={color}
      />
    ),
  },
];

const ITEM_SIZE = 90;

const OtherService = () => {
  const navigation = useNavigation();
  const [activeItem, setActiveItem] = useState("");

  const handlePress = (item) => {
    setActiveItem(item.name);

    if (item.screen) {
      navigation.navigate(item.screen);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={ITEMS}
        keyExtractor={(item) => item.name}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            activeOpacity={0.8}
            onPress={() => handlePress(item)}
          >
            <View
              style={[
                styles.iconContainer,
                activeItem === item.name && styles.activeIcon,
              ]}
            >
              {item.icon({
                color:
                  activeItem === item.name
                    ? "#FFFFFF"
                    : "#000A83",
              })}
            </View>

            <Text style={styles.itemText}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default OtherService;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },

  list: {
    paddingHorizontal: 10,
  },

  item: {
    width: ITEM_SIZE,
    alignItems: "center",
    marginHorizontal: 8,
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#000A83",
    justifyContent: "center",
    alignItems: "center",
  },

  activeIcon: {
    backgroundColor: "#000A83",
  },

  itemText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: "center",
    color: "#000",
  },
});

