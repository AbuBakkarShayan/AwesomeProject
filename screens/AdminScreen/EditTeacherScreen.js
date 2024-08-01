// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import baseURL from '../../config';
// import { Dropdown } from 'react-native-element-dropdown';
// import LogoutButton from './customcomponent/logoutComponent';

// const EditTeacherScreen = () => {
//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => <LogoutButton />,
//     });
//   }, [navigation]);
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { teacher } = route.params;

//   const [name, setName] = useState(teacher.teacherName);
//   const [department, setDepartment] = useState(teacher.departmentName);
//   const [phoneNo, setPhoneNo] = useState(teacher.teacherPhoneNo);
//   const [password, setPassword] = useState('');

//   const handleUpdate = async () => {
//     try {
//       const response = await fetch(`${baseURL}/user/updateuser`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           role: 'Teacher',
//           id: teacher.teacherId,
//           name,
//           department,
//           phoneNo,
//           password,
//         }),
//       });

//       const result = await response.json();

//       if (result.status === 'Success') {
//         Alert.alert('Success', result.message, [{ text: 'OK', onPress: () => navigation.goBack() }]);
//       } else {
//         Alert.alert('Failed', result.message);
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to update teacher');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         placeholder="Name"
//         placeholderTextColor={'#7E7E7E'}
//         value={name}
//         onChangeText={setName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Department"
//         placeholderTextColor={'#7E7E7E'}
//         value={department}
//         onChangeText={setDepartment}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Phone Number"
//         placeholderTextColor={'#7E7E7E'}
//         value={phoneNo}
//         onChangeText={setPhoneNo}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         placeholderTextColor={'#7E7E7E'}
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <Button title="Update" onPress={handleUpdate} color="#5B5D8B" />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 16,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 12,
//     paddingHorizontal: 8,
//     color:'#7E7E7E',
//   },
// });

// export default EditTeacherScreen;
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
import LogoutButton from './customcomponent/logoutComponent';
import baseURL from '../../config';

const EditTeacherScreen = () => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const navigation = useNavigation();
  const route = useRoute();
  const {teacher} = route.params;

  const [name, setName] = useState(teacher.teacherName);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(
    teacher.departmentId,
  ); // Use departmentId here
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [phoneNo, setPhoneNo] = useState(teacher.teacherPhoneNo);
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
      name.trim() === teacher.teacherName &&
      selectedDepartment === teacher.departmentId &&
      phoneNo.trim() === teacher.teacherPhoneNo &&
      !password.trim()
    ) {
      Alert.alert('No Changes', 'No fields have been changed.');
      return;
    }

    try {
      console.log('Sending updated fields:', {
        role: 'Teacher',
        id: teacher.teacherId,
        ...updatedFields,
      });

      const response = await fetch(`${baseURL}/user/updateuser`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'Teacher',
          id: teacher.teacherId,
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
      console.error('Error updating teacher:', error);
      Alert.alert('Error', 'Failed to update teacher');
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

export default EditTeacherScreen;
