import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import Icon from 'react-native-vector-icons/Ionicons';

const studentList = [
  {
    name: "Abu Bakkar Shayan",
    regNo: "202-NUN-0002"
  },
  {
    name: "Mehran",
    regNo: "202-NUN-0022"
  },
  {
    name: "Sapna Ahmad",
    regNo: "202-NUN-0036"
  },
];

const AddStudentScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAddOptionPress = (option) => {
    setIsModalVisible(false);
    if (option === 'batch') {
      // Navigate to add batch screen
      navigation.navigate("AddStudentBatch")
    } else if (option === 'single') {
      // Navigate to add single student screen
      navigation.navigate("AddSingleStudent")
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(item) => item.regNo}
        data={studentList}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.textStyle}>{item.name}</Text>
            <Text style={styles.textStyle}>{item.regNo}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
        <Icon name="add-circle-outline" size={60} color="#5B5D8B" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleAddOptionPress('batch')}>
              <Text style={styles.modalOptionText}>Add Batch</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleAddOptionPress('single')}>
              <Text style={styles.modalOptionText}>Add Single Student</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    backgroundColor: '#5B5D8B',
    margin: 5,
    padding: 20,
    borderRadius: 10,
  },
  textStyle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
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
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalOptionText: {
    fontSize: 18,
    textAlign: 'center',
    color:"black",
  },
});

export default AddStudentScreen;