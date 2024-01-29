import React, { useState } from 'react';
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CaseCategoryModal = ({ isVisible, category, onClose }) => {
  if (!category) {
    return null; // Handle the case where category is null or undefined
  }

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text>{category.name}</Text>
          <Text>{category.description}</Text>
          <Image source={{ uri: category.image }} style={styles.categoryImage} />
          <TouchableOpacity onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const CaseCatCard = ({ caseCategories }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {/* Render case categories */}
        <>
          {caseCategories.map((category) => (
            <View key={category.id} style={styles.itemContainer}>
                <View style={styles.iconContainer}>
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryContainer}
                  onPress={() => handleCategoryPress(category)}
                >
                  <MaterialCommunityIcons name="briefcase-outline" size={98} color="#000A83"  style={{ padding:5,alignSelf:"center"}}/>
            </TouchableOpacity>
                </View>
              <Text style={styles.txt}>{category.name}</Text>
              </View>
          ))}

        </>
      </View>

      {/* Render the modal */}
      <CaseCategoryModal
        isVisible={isModalVisible}
        category={selectedCategory}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryContainer: {
    width: 150,
    height: 110,
    alignItems: 'center',
    margin: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000A83',
  },
  itemContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  categoryImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  txt: {
    paddingLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    padding: 10,
    marginTop: -10, // Adjust this value to control the distance of the name from the border
  },
});

export default CaseCatCard;
























