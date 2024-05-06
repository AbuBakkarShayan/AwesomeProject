import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import baseURL from '../../config';

const UpdateDepartmentScreen = ({ route }) => {
  const navigation = useNavigation();
  const { departmentId, currentDepartmentName } = route.params;
  const [department, setDepartment] = useState(currentDepartmentName);

  const updateDepartment = async () => {
    try {
      const response = await fetch(`${baseURL}/department/updateDepartment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: departmentId,
          department: department
        })
      });
      const data = await response.json();
      if (data.status === 'Success') {
        // Pass back the updated department name to StudentDepartmentScreen
        navigation.navigate('StudentDepartmentScreen', { updatedDepartmentName: department });
        Alert.alert('Success', 'Department updated successfully');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Department Name"
        onChangeText={text => setDepartment(text)}
        value={department}
      />
      <Button
        title="Update Department"
        onPress={updateDepartment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: 300,
    paddingHorizontal: 10,
    color: "black"
  },
});

export default UpdateDepartmentScreen;
