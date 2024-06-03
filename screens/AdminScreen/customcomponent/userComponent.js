import React, { useState } from 'react';
import { View, Modal, Text, FlatList, TouchableOpacity, Alert, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import baseURL from '../../../config';

const UserListComponent = ({ users, onDeleteUser, addButtonLabel, onAddOptionPress, onAddBatchPress }) => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const authToken = "your-auth-token"; // Replace with the actual auth token

  const confirmDelete = (userId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteUser(userId) },
      ]
    );
  };

  const deleteUser = (userId) => {
    fetch(`${baseURL}/user/deleteUser`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`, // Assuming you have an authToken
      },
      body: JSON.stringify({ id: userId }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.status === "Success") {
          Alert.alert('Success', 'User deleted successfully');
          onDeleteUser(userId); // Call the onDeleteUser function passed from the parent
        } else {
          Alert.alert('Error', responseJson.message || 'Failed to delete user');
        }
      })
      .catch(error => {
        console.error('Error deleting user:', error);
        Alert.alert('Error', 'Failed to delete user');
      });
  };

  const renderAddOptions = () => (
    <View style={styles.modalContent}>
      <TouchableOpacity style={styles.modalOption} onPress={handleAddOptionPress}>
        <Text style={styles.modalOptionText}>Add Single</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modalOption} onPress={handleAddBatchPress}>
        <Text style={styles.modalOptionText}>Add Batch</Text>
      </TouchableOpacity>
    </View>
  );

  const handleAddOptionPress = (option) => {
    setIsModalVisible(false);
    onAddOptionPress(option);
  };

  const handleAddBatchPress = () => {
    setIsModalVisible(false);
    onAddBatchPress();
  };

  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer]}>
      <Text style={styles.userName}>{item.teacherName}</Text>
      <Text style={styles.userName}>{item.studentName}</Text>
      <View style={styles.iconContainer}>
        <Icon name="create-outline" style={styles.icon} onPress={() => navigation.navigate('EditStudentScreen', { userId: item.id })} />
        <Icon name="trash" style={styles.icon} onPress={() => confirmDelete(item.id)} />
      </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
      <View style={styles.container}>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        />

        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.addButton}>
          <Text style={styles.addButtonLabel}>{addButtonLabel}</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {renderAddOptions()}
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  userName: {
    fontSize: 16,
    color: '#7E7E7E',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
    fontSize: 20,
    color: '#7E7E7E',
  },
  addButton: {
    alignSelf: 'flex-end',
    marginTop: 20,
    paddingVertical: 10,
  },
  addButtonLabel: {
    color: '#5B5D8B',
    fontSize: 16,
    fontWeight: 'bold',
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
    color: 'black',
  },
});

export default UserListComponent;
