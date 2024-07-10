import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import baseURL from '../../config';

const AddSingleStudent = () => {
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newDepartment, setNewDepartment] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = () => {
    fetch(`${baseURL}/department/allDepartment`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data && Array.isArray(data.data)) {
          const formattedData = data.data.map(department => ({
            label: department.departmentName,
            value: department.departmentName, // Use departmentName as value
          }));
          setDepartments(formattedData);
        } else {
          console.error('Error: Data is not an array', data);
        }
        setLoadingDepartments(false);
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
        setLoadingDepartments(false);
      });
  };

  const handleRegister = async () => {
    if (!regNo || !password || !name || !phoneNo || !selectedDepartment) {
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
          username: regNo,
          password,
          role: 'Student',
          name,
          phoneNo,
          department: selectedDepartment, // Send department name
        }),
      });

      const result = await response.json();

      if (result.status === 'Success') {
        Alert.alert('Success', result.message);
        setRegNo('');
        setPassword('');
        setName('');
        setPhoneNo('');
        setSelectedDepartment(null);
      } else {
        Alert.alert('Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleAddDepartment = () => {
    if (!newDepartment) {
      Alert.alert('Error', 'Department name is required');
      return;
    }

    // Add the new department to the dropdown
    const newDept = {label: newDepartment, value: newDepartment};
    setDepartments([...departments, newDept]);
    setSelectedDepartment(newDepartment); // Select the new department
    setNewDepartment('');
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Registration Number"
        placeholderTextColor="#7E7E7E"
        value={regNo}
        onChangeText={setRegNo}
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
      {loadingDepartments ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.dropdownContainer}>
          <Dropdown
            style={styles.dropdown}
            data={departments}
            labelField="label"
            valueField="value"
            placeholder="Select Department"
            placeholderStyle={styles.placeholder}
            value={selectedDepartment}
            onChange={item => {
              setSelectedDepartment(item.value);
            }}
            selectedTextStyle={styles.selectedText}
          />
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
      <Button title="Register" onPress={handleRegister} color="#5B5D8B" />

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}>
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
            <Button
              title="Add Department"
              onPress={handleAddDepartment}
              color="#5B5D8B"
            />
            <Button
              title="Cancel"
              onPress={() => setIsModalVisible(false)}
              color="#888"
            />
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
    color: '#7E7E7E',
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
  addButton: {
    marginLeft: 8,
    backgroundColor: '#5B5D8B',
    padding: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  placeholder: {
    color: '#7E7E7E',
  },
  selectedText: {
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default AddSingleStudent;
