import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

const UpdateCourseScreen = () => {
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [creditHours, setCreditHours] = useState('');
  const [courseContentUri, setCourseContentUri] = useState('');

  const handleChooseImage = () => {
    ImagePicker.launchImageLibrary({}, response => {
      if (response.uri) {
        setCourseImage(response.uri);
      }
    });
  };

  const handleEmbedURL = () => {
    console.log('Embed URL button pressed');
    // Add logic to handle embedding URL here
  };

  const handleAddCourse = () => {
    // Input validation
    if (!courseCode || !courseName || !creditHours || !courseContentUri) {
      Alert.alert('All fields are required');
      return;
    }

    // Implement logic to add course (e.g., call API)
    console.log('Add course button pressed');
    console.log('Course Code:', courseCode);
    console.log('Course Name:', courseName);
    console.log('Credit Hours:', creditHours);
    console.log('Course Content URI:', courseContentUri);
    // Add your logic to call the API here
    Alert.alert('Course Updated Successfully');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Course Code"
        placeholderTextColor={"#7E7E7E"}
        onChangeText={text => setCourseCode(text)}
        value={courseCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Course Name"
        placeholderTextColor={"#7E7E7E"}
        onChangeText={text => setCourseName(text)}
        value={courseName}
      />
      <TextInput
        style={styles.input}
        placeholder="Credit Hours"
        placeholderTextColor={"#7E7E7E"}
        onChangeText={text => setCreditHours(text)}
        value={creditHours}
      />
      <TextInput
        style={styles.input}
        placeholder="Course Content URI"
        placeholderTextColor={"#7E7E7E"}
        /*onChangeText={text => setCourseContentUri(text)}
        value={courseContentUri}*/
      />
      <TouchableOpacity style={styles.button} /*onPress={handleEmbedURL}*/>
        <Text style={styles.buttonText}>Update URL</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleAddCourse}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#5B5D8B',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UpdateCourseScreen;