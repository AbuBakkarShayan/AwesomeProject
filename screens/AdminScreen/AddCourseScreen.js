import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import baseURL from '../../config';

const AddCourseScreen = () => {
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [creditHours, setCreditHours] = useState('');
  const [courseContent, setCourseContent] = useState(null);

  const handleAddCourse = async () => {
    if (!courseCode.trim()) {
      Alert.alert('Error', 'Course Code is required');
      return;
    }




    const formData = new FormData();
    formData.append('courseCode', courseCode);
    formData.append('courseName', courseName);
    formData.append('creditHours', creditHours);

    if (courseContent) {
      formData.append('courseContent', {
        uri: courseContent.uri,
        type: courseContent.type,
        name: courseContent.name,
      });
    }

    try {
      const response = await fetch(`${baseURL}/Course/addCourse`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      if (result.status === 'Success') {
        Alert.alert('Success', 'Course added successfully');
        // Optionally clear the form
        setCourseCode('');
        setCourseName('');
        setCreditHours('');
        setCourseContent(null);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while adding the course');
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
      <Button title="Select Course Content" onPress={handleSelectFile} />
      <Button title="Add Course" onPress={handleAddCourse} />
    </View>
  );
};

// const handleSelectFile = async () => {
//   // Use a library like react-native-document-picker to select files
//   // Example: const res = await DocumentPicker.pick({...});
//   // setCourseContent(res);
// };
const handleSelectFile = async () => {
  try {
    const doc = await DocumentPicker.pickSingle({
      type: [DocumentPicker.types.xls, DocumentPicker.types.pdf],
    });
    setSelectedFile(doc.name);
    processFile(doc);
  } catch (err) {
    if (DocumentPicker.isCancel(err))
      console.log("User canceled the upload", err);
    else
      console.log(err);
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color:"black"
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
    color:"black"
  },
});

export default AddCourseScreen;
