import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import LogoutButton from './customcomponent/logoutComponent';
import baseURL from '../../config';

const AddBookScreen = ({ navigation }) => {

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [author, setAuthor] = useState('');
  const [keywords, setKeywords] = useState('');

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

  const handleCoverImagePick = async () => {
    try {
      const doc = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      if (doc.size > MAX_FILE_SIZE) {
        Alert.alert('Error', 'Cover image file size exceeds the maximum limit of 50 MB');
        return;
      }
      setCoverImage(doc);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the upload', err);
      } else {
        console.log(err);
      }
    }
  };

  const handlePdfFilePick = async () => {
    try {
      const doc = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });
      if (doc.size > MAX_FILE_SIZE) {
        Alert.alert('Error', 'PDF file size exceeds the maximum limit of 50 MB');
        return;
      }
      setPdfFile(doc);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the upload', err);
      } else {
        console.log(err);
      }
    }
  };

  const handleUpload = async () => {
    try {
      const uploaderId = 0; // Default uploader ID for admin
  
      if (!title || !category || !coverImage || !pdfFile || !author || !keywords) {
        throw new Error('Please fill in all fields');
      }
  
      const formData = new FormData();
      formData.append('bookName', title);
      formData.append('category', category);
      formData.append('bookImage', {
        uri: coverImage.uri,
        type: coverImage.type,
        name: coverImage.name,
      });
      formData.append('bookPdf', {
        uri: pdfFile.uri,
        type: pdfFile.type,
        name: pdfFile.name,
      });
      formData.append('bookAuthor', author);
      formData.append('keywords', keywords);
      formData.append('uploaderId', uploaderId);
  
      const response = await fetch(`${baseURL}/book/uploadBook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to upload book: ${errorMessage}`);
      }
  
      const result = await response.json();
      console.log('Upload result:', result);
  
      if (result.status !== 'Success') {
        throw new Error(result.message);
      }
  
      if (!result.bookId) {
        throw new Error('Book ID not returned from the server');
      }
  
      // Navigate to AddTOC screen with bookId
      navigation.navigate('AddTOC', { bookId: result.bookId });
    } catch (error) {
      console.log('Error uploading book:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="black"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        placeholderTextColor="black"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Cover Image"
        placeholderTextColor="black"
        editable={false}
        value={coverImage ? coverImage.name : ''}
      />
      <TouchableOpacity style={styles.button} onPress={handleCoverImagePick}>
        <Text style={styles.buttonText}>Browse Cover Image</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="PDF File"
        placeholderTextColor="black"
        editable={false}
        value={pdfFile ? pdfFile.name : ''}
      />
      <TouchableOpacity style={styles.button} onPress={handlePdfFilePick}>
        <Text style={styles.buttonText}>Browse PDF File</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Author"
        placeholderTextColor="black"
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        style={styles.input}
        placeholder="Keywords"
        placeholderTextColor="black"
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
