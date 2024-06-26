import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import baseURL from '../../config';

const EditStudentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { student } = route.params;

  const [name, setName] = useState(student.studentName);
  const [department, setDepartment] = useState(student.departmentName);
  const [phoneNo, setPhoneNo] = useState(student.studentPhoneNo);
  const [password, setPassword] = useState('');

  const handleUpdate = async () => {
    const updatedFields = {};

    if (name !== student.studentName) updatedFields.name = name;
    if (department !== student.departmentName) updatedFields.department = department;
    if (phoneNo !== student.studentPhoneNo) updatedFields.phoneNo = phoneNo;
    if (password) updatedFields.password = password;

    if (Object.keys(updatedFields).length === 0) {
      Alert.alert('No Changes', 'No fields have been changed.');
      return;
    }

    try {
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

      if (result.status === 'Success') {
        Alert.alert('Success', result.message, [{ text: 'OK', onPress: () => navigation.goBack() }]);
      } else {
        Alert.alert('Failed', result.message);
      }
    } catch (error) {
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
      <TextInput
        style={styles.input}
        placeholder="Department"
        placeholderTextColor="#7E7E7E"
        value={department}
        onChangeText={setDepartment}
      />
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
      <Button title="Update" onPress={handleUpdate} color='#5B5D8B' />
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
});

export default EditStudentScreen;
 