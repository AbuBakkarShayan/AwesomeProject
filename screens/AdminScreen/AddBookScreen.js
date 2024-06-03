import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutButton from './customcomponent/logoutComponent';
import baseURL from '../../config';

const AddBookScreen = ({ navigation }) => {

  //logout icon in header
  React.useLayoutEffect(()=>{
    navigation.setOptions({
      headerRight:()=><LogoutButton />,
    });
  }, [navigation]);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [author, setAuthor] = useState('');
  const [keywords, setKeywords] = useState('');

  const handleCoverImagePick = async () => {
    try {
      const doc = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      setCoverImage(doc.uri); // Update state with file URI
    } catch (err) {
      if (DocumentPicker.isCancel(err))
        console.log("User cancel the Upload", err)
      else
        console.log(err);
    }
  };

  const handlePdfFilePick = async () => {
    try {
      const doc = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });
      setPdfFile(doc.uri); // Update state with file URI
    } catch (err) {
      if (DocumentPicker.isCancel(err))
        console.log("User cancel the Upload", err)
      else
        console.log(err);
    }
  };

  // When storing uploaderId (e.g., after login)
const storeUploaderId = async (id) => {
  try {
    await AsyncStorage.setItem('uploaderId', id);
    console.log('Uploader ID stored successfully:', id);
  } catch (error) {
    console.error('Error storing uploader ID:', error);
  }
};

// When retrieving uploaderId in handleUpload function
const handleUpload = async () => {
  try {
    // Retrieve uploaderId from AsyncStorage
    const uploaderId = await AsyncStorage.getItem('uploaderId');
    console.log('Retrieved uploader ID:', uploaderId);

    if (!uploaderId) {
      throw new Error('Uploader ID not found. Please login again.');
    }

    // Ensure all required fields are filled
    if (!title || !category || !coverImage || !pdfFile || !author || !keywords) {
      throw new Error('Please fill in all fields');
    }

    // Call your C# API to upload book data
    const response = await fetch(`${baseURL}/Book/uploadBook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        category,
        coverImage,
        pdfFile,
        author,
        keywords,
        uploaderId,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text(); // Extract error message from response
      throw new Error(`Failed to upload book: ${errorMessage}`);
    }

    // Navigate to ADDTOC screen
    navigation.navigate('ADDTOC');

  } catch (error) {
    console.log('Error uploading book:', error);
    Alert.alert('Error', error.message); // Display error message to the user
  }
};

   

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor={'black'}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        placeholderTextColor={'black'}
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Cover Image"
        placeholderTextColor={'black'}
        editable={false}
        value={coverImage ? coverImage.split('/').pop() : ''}
      />
      <TouchableOpacity style={styles.button} onPress={handleCoverImagePick}>
        <Text style={styles.buttonText}>Browse Cover Image</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="PDF File"
        placeholderTextColor={'black'}
        editable={false}
        value={pdfFile ? pdfFile.split('/').pop() : ''}
      />
      <TouchableOpacity style={styles.button} onPress={handlePdfFilePick}>
        <Text style={styles.buttonText}>Browse PDF File</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Author"
        placeholderTextColor={'black'}
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        style={styles.input}
        placeholder="Keywords"
        placeholderTextColor={'black'}
        value={keywords}
        onChangeText={setKeywords}
      />
      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.buttonText}>Upload Book</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default AddBookScreen;
