// UpdateCourse.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Button } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import LogoutButton from './customcomponent/logoutComponent';
import baseURL from '../../config';

const UpdateCourse = ({ navigation, route }) => {
  const { course } = route.params || {}; // Safely destructure course from route.params

  // Logout icon in header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const [courseCode, setCourseCode] = useState(course?.courseCode || '');
  const [courseName, setCourseName] = useState(course?.courseName || '');
  const [creditHours, setCreditHours] = useState(course?.creditHours || '');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpdateCourse = async () => {
    if (!courseCode.trim() || !courseName.trim() || !creditHours.trim()) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('courseCode', courseCode);
    formData.append('courseName', courseName);
    formData.append('creditHours', creditHours);

    if (selectedFile) { // If a file is selected, append it to the form data
      formData.append('courseContent', {
        uri: selectedFile.uri,
        type: selectedFile.type,
        name: selectedFile.name,
      });
    }

    try {
      const response = await fetch(`${baseURL}/Course/updateCourse`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      if (result.status === 'Success') {
        Alert.alert('Success', 'Course updated successfully');
        navigation.goBack(); // Go back to the previous screen
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating the course');
    }
  };

  const handleSelectFile = async () => {
    try {
      const doc = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.xls, DocumentPicker.types.pdf],
      });
      setSelectedFile(doc); // Set the selected file
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User canceled the upload", err);
      } else {
        console.log(err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Course Code</Text>
      <TextInput
        style={styles.input}
        value={courseCode}
        onChangeText={setCourseCode}
      />
      <Text style={styles.label}>Course Name</Text>
      <TextInput
        style={styles.input}
        value={courseName}
        onChangeText={setCourseName}
      />
      <Text style={styles.label}>Credit Hours</Text>
      <TextInput
        style={styles.input}
        value={creditHours}
        onChangeText={setCreditHours}
      />
      <Button title="Select Course Content" onPress={handleSelectFile} color="#5B5D8B"/>
      {selectedFile && (
        <View>
          <Text style={styles.Text}>Selected File:</Text>
          <Text style={styles.Text}>{selectedFile.name}</Text>
        </View>
      )}
      <Button title="Update Course" onPress={handleUpdateCourse} color="#5B5D8B"/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "black",
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
    color: "black",
  },
  Text:{
    color:'#7E7E7E',
  }
});

export default UpdateCourse;
