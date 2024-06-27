import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import baseURL from '../../../config';

const AddSingleUser = ({ userType, onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverDown, setServerDown] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newDepartment, setNewDepartment] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setServerDown(true);
    }, 10000);

    fetchDepartments().then(() => clearTimeout(timeoutId));
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${baseURL}/department/alldepartment`);
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      const data = await response.json();
      const formattedData = data.data.map(department => ({
        label: department.departmentName,
        value: department.departmentId,
      }));
      setDepartments(formattedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setLoading(false);
      setServerDown(true);
    }
  };

  const handleRegister = async () => {
    if (!username || !password || !name || !phoneNo || !selectedDepartment) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      const response = await fetch(`${baseURL}/user/registeruser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          role: userType,
          name,
          phoneNo,
          departmentId: selectedDepartment,
        }),
      });

      const result = await response.json();

      if (result.status === 'Success') {
        Alert.alert('Success', result.message);
        setUsername('');
        setPassword('');
        setName('');
        setPhoneNo('');
        setSelectedDepartment(null);
        onSubmit(result);
      } else {
        Alert.alert('Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleAddDepartment = async () => {
    if (!newDepartment) {
      Alert.alert('Error', 'Department name is required');
      return;
    }

    try {
      const response = await fetch(`${baseURL}/department/adddepartment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          departmentName: newDepartment,
        }),
      });

      const result = await response.json();

      if (result.status === 'Success') {
        setNewDepartment('');
        setModalVisible(false);
        fetchDepartments();
      } else {
        Alert.alert('Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (serverDown) {
    return (
      <View style={styles.serverDownContainer}>
        <Text style={styles.serverDownText}>Server Down</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register as {userType}</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#7E7E7E"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#7E7E7E"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#7E7E7E"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#7E7E7E"
        value={phoneNo}
        onChangeText={setPhoneNo}
      />
      <View style={styles.dropdownContainer}>
        <Dropdown
          style={styles.dropdown}
          data={departments}
          labelField="label"
          valueField="value"
          placeholder="Select Department"
          placeholderStyle={styles.placeholder}
          value={selectedDepartment}
          onChange={item => setSelectedDepartment(item.value)}
          selectedTextStyle={styles.selectedText}
        />
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Button title="Register" onPress={handleRegister} color="#5B5D8B" />

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Department</Text>
            <TextInput
              style={styles.input}
              placeholder="Department Name"
              placeholderTextColor="#7E7E7E"
              value={newDepartment}
              onChangeText={setNewDepartment}
            />
            <Button title="Add" onPress={handleAddDepartment} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    color: "#7E7E7E",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dropdown: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  placeholder: {
    color: "#7E7E7E",
  },
  selectedText: {
    color: '#000',
  },
  addButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#5B5D8B',
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  serverDownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serverDownText: {
    fontSize: 20,
    color: 'red',
  },
});

export default AddSingleUser;
