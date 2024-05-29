import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import baseURL from '../../config';

const AddSingleStudent = () => {
  const [name, setName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  // Assuming role is fetched from the user's session/context
  const role = 'Student'; // or 'Teacher' or 'Admin' as appropriate

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${baseURL}/department/allDepartment`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log('Data received from API:', result);
      if (result.status === "Success" && Array.isArray(result.data)) {
        setDepartments(result.data.map(department => ({ key: department.departmentId, value: department.departmentName })));
      } else {
        throw new Error('Data format is incorrect');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to load departments: ${error.message}`);
      console.error(error);
    }
  };

  const handleAddDepartment = async () => {
    const newDepartment = prompt('Enter new department name:');
    if (newDepartment) {
      try {
        const response = await fetch(`${baseURL}/department/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newDepartment }),
        });
        if (!response.ok) {
          throw new Error('Failed to add department');
        }
        fetchDepartments(); // Refresh the department list
      } catch (error) {
        Alert.alert('Error', `Failed to add department: ${error.message}`);
        console.error(error);
      }
    }
  };

  const handleSubmit = async () => {
    const student = { name, regNo, phoneNo, department: selectedDepartment, username, password, role };
    console.log('Submitting student:', student);
    try {
      const response = await fetch(`${baseURL}/user/RegisterUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      });

      const result = await response.json();
      console.log('Response received from API:', result);

      if (response.ok && result.status === 'Success') {
        Alert.alert('Success', 'Student added successfully');
      } else {
        throw new Error(result.message || 'Failed to add student');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to add student: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Reg No"
        value={regNo}
        onChangeText={setRegNo}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone No"
        value={phoneNo}
        onChangeText={setPhoneNo}
      />
      <View style={styles.dropdownContainer}>
        <SelectList
          setSelected={setSelectedDepartment}
          data={departments}
          placeholder="Select Department"
          boxStyles={styles.dropdown}
        />
        <TouchableOpacity onPress={handleAddDepartment} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Department</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropdown: {
    flex: 1,
  },
  addButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AddSingleStudent;
