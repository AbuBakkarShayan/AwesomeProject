import React, { useState } from 'react';
import { View,Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import baseURL from '../../config';

const UpdateDepartmentScreen = ({ route }) => {
  const navigation = useNavigation();
  const { departmentId, currentDepartmentName } = route.params;
  const [department, setDepartment] = useState(currentDepartmentName);

  const updateDepartment = async (departments,fromScreen) => {
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
        if(fromScreen==='teacher')
          {

          }
          else if(fromScreen==='student')
            {
        navigation.navigate('StudentDepartmentScreen', { updatedDepartmentName: department });
            }
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
       <TouchableOpacity style={styles.button} onPress={updateDepartment}>
        <Text style={styles.buttonText}>Update Department</Text>
      </TouchableOpacity>
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    color:"black",
  },
  button: {
    backgroundColor: '#5B5D8B',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    width:"50%",
    height:45,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UpdateDepartmentScreen;
