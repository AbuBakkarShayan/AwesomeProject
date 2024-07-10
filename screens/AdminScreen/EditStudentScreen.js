import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
import baseURL from '../../config';

const EditStudentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {student} = route.params;

  const [name, setName] = useState(student.studentName);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(
    student.departmentId,
  ); // Use departmentId here
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [phoneNo, setPhoneNo] = useState(student.studentPhoneNo);
  const [password, setPassword] = useState('');

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
            value: department.departmentId, // Use departmentId as value
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

  const handleUpdate = async () => {
    const updatedFields = {
      name: name.trim(),
      departmentId: selectedDepartment, // Use departmentId here
      phoneNo: phoneNo.trim(),
      password: password.trim(),
    };

    // Check if no fields are changed
    if (
      name.trim() === student.studentName &&
      selectedDepartment === student.departmentId &&
      phoneNo.trim() === student.studentPhoneNo &&
      !password.trim()
    ) {
      Alert.alert('No Changes', 'No fields have been changed.');
      return;
    }

    try {
      console.log('Sending updated fields:', {
        role: 'Student',
        id: student.studentId,
        ...updatedFields,
      });

      const response = await fetch(`${baseURL}/user/updateuser`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'Student',
          id: student.studentId,
          ...updatedFields,
        }),
      });

      const result = await response.json();
      console.log('Server response:', result);

      if (result.status === 'Success') {
        Alert.alert('Success', result.message, [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      } else {
        console.error('Failed to update:', result);
        Alert.alert(
          'Failed',
          result.message || 'Validation failed for one or more entities.',
        );
      }
    } catch (error) {
      console.error('Error updating student:', error);
      Alert.alert('Error', 'Failed to update student');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#7E7E7E"
        value={name}
        onChangeText={setName}
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
        </View>
      )}
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#7E7E7E"
        value={phoneNo}
        onChangeText={setPhoneNo}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#7E7E7E"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Update" onPress={handleUpdate} color="#5B5D8B" />
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
    backgroundColor: '#f0f0f0',
  },
  placeholder: {
    color: '#7E7E7E',
  },
  selectedText: {
    color: '#000',
  },
});

export default EditStudentScreen;
