import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { useNavigation, useRoute } from '@react-navigation/core';
import baseURL from '../../config';

const EditBookScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookId, onBookUpdated } = route.params || {}; // Destructure onBookUpdated from route params

  console.log('EditBookScreen route params:', route.params); // Log route params for debugging
  console.log('Editing book with ID:', bookId); // Log bookId for debugging

  const [bookDetails, setBookDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [newPdf, setNewPdf] = useState(null);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    if (bookId) {
      fetchBookDetails();
    } else {
      setIsLoading(false);
      Alert.alert('Error', 'Book ID is missing');
      navigation.goBack();
    }
  }, [bookId]);

  const fetchBookDetails = async () => {
    try {
      const response = await fetch(`${baseURL}/book/getSingleBook?bookId=${bookId}`);
      const result = await response.json();
      if (result.status === 'Success') {
        setBookDetails(result.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching book details:', error);
      setIsLoading(false);
    }
  };

  const handleUpdateBook = async () => {
    console.log('Updating book with ID:', bookId); // Log bookId for debugging

    try {
      const formData = new FormData();
      formData.append('bookId', bookId);
      formData.append('uploaderId', bookDetails.uploaderId || 0); // assuming uploaderId is available
      formData.append('bookName', bookDetails.bookName);
      formData.append('bookAuthor', bookDetails.bookAuthorName);
      formData.append('category', bookDetails.category);

      if (newPdf) {
        formData.append('bookPdf', {
          uri: newPdf.uri,
          type: newPdf.type,
          name: newPdf.name,
        });
      }

      if (newImage) {
        formData.append('bookImage', {
          uri: newImage.uri,
          type: newImage.type,
          name: newImage.name,
        });
      }

      const response = await fetch(`${baseURL}/book/updateBook?bookId=${bookId}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      console.log('Response from API:', result); // Log the API response

      if (result.status === 'Success') {
        Alert.alert('Success', 'Book updated successfully');
        if (onBookUpdated) {
          onBookUpdated(); // Call the callback to refresh the book list
        }
        navigation.goBack();
      } else {
        Alert.alert('Failed', result.message);
      }
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const pickPdf = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });
      setNewPdf(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('DocumentPicker Error:', err);
      }
    }
  };

  const pickImage = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      setNewImage(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('DocumentPicker Error:', err);
      }
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Book Name</Text>
      <TextInput
        style={styles.input}
        value={bookDetails.bookName}
        onChangeText={(text) => setBookDetails({ ...bookDetails, bookName: text })}
      />

      <Text style={styles.label}>Author Name</Text>
      <TextInput
        style={styles.input}
        value={bookDetails.bookAuthorName}
        onChangeText={(text) => setBookDetails({ ...bookDetails, bookAuthorName: text })}
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={bookDetails.category}
        onChangeText={(text) => setBookDetails({ ...bookDetails, category: text })}
      />

      <TouchableOpacity style={styles.button} onPress={pickPdf}>
        <Text style={styles.buttonText}>Select PDF</Text>
      </TouchableOpacity>

      {newPdf && <Text>Selected PDF: {newPdf.name}</Text>}

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Select Cover Image</Text>
      </TouchableOpacity>

      {newImage && (
        <Image source={{ uri: newImage.uri }} style={styles.imagePreview} />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleUpdateBook}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    color: 'black',
  },
  button: {
    backgroundColor: '#5B5D8B',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#5B5D8B',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default EditBookScreen;
