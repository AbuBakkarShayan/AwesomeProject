import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import LogoutButton from './customcomponent/logoutComponent';
import Icon from 'react-native-vector-icons/Ionicons';
import baseURL from '../../config';

const BooksManagementScreen = () => {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  // Logout icon in header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${baseURL}/book/getall`); // Replace with your API endpoint
      const result = await response.json();
      console.log('Fetched books data:', result); // Debugging log
      if (result.status === 'Success') {
        // Map data to expected properties
        const formattedBooks = result.data.map(book => ({
          bookId: book.bookId, // Make sure the property matches what you expect
          name: book.bookName,
          author: book.bookAuthorName,
          image: book.bookCoverPagePath
            ? `${baseURL}/path-to-images/${book.bookCoverPagePath}` // Replace with your actual image base URL
            : 'https://via.placeholder.com/150',
          pdfUrl: `${baseURL}/BookPDFFolder/${book.bookPdfPath}`,
          uploaderId: book.uploaderId || 0, // Add appropriate uploaderId if available in your API response
        }));
        setBooks(formattedBooks);
      } else {
        setBooks([]); // Ensure books is set to an empty array if the status is not 'Success'
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const handleAddBook= () => {
    navigation.navigate("AddBookScreen");
  }

  const handleAddCategory = async (bookCategory) => {
    try {
      const response = await fetch(`${baseURL}/book/addBookCategory?bookCategory=${bookCategory}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookCategory: categoryName }), // Send as JSON object
      });
  
      const result = await response.json();
      if (result.status === 'Success') {
        Alert.alert('Success', 'Category added successfully');
        setCategoryName('');
        setIsModalVisible(false);
      } else {
        Alert.alert('Error', result.message || 'Failed to add category');
      }
    } catch (err) {
      console.error('Error adding category:', err);
      Alert.alert('Error', 'Failed to add category');
    }
  };
  
  
  const handleEditBook = (book) => {
    navigation.navigate('EditBookScreen', {
      bookId: book.id,
      onBookUpdated: fetchBooks, // Pass the fetchBooks function as a callback
    });
  };

  const handleDeleteBook = async (bookId, uploaderId) => {
    try {
      const response = await fetch(`${baseURL}/book/deleteBook?bookId=${bookId}&uploaderId=${uploaderId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (response.ok && result.status === 'Success') {
        fetchBooks(); // Refresh the list after deletion
      } else {
        console.error('Failed to delete book:', result.message);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const confirmDeleteBook = (bookId, uploaderId) => {
    Alert.alert(
      'Delete Book',
      'Are you sure you want to delete this book?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => handleDeleteBook(bookId, uploaderId) },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }) => (
    // <TouchableOpacity onPress={() => navigation.navigate('PDFReaderScreen', { pdfUrl: item.pdfUrl })}>
    <TouchableOpacity onPress={() => navigation.navigate('PDFReaderScreen', { bookId: item.bookId })}>
      <View style={styles.bookItem}>
        <Image source={{ uri: item.image }} style={styles.bookImage} />
        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{item.name}</Text>
          <Text style={styles.bookAuthor}>{item.author}</Text>
        </View>
        <View style={styles.bookActions}>
          <TouchableOpacity onPress={() => handleEditBook(item)}>
            <Icon name="create-outline" size={30} color="#5B5D8B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => confirmDeleteBook(item.id, item.uploaderId)}>
            <Icon name="trash-outline" size={30} color="#5B5D8B" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const openAddOptions = () => {
    Alert.alert(
      'Add Options',
      'Choose an option to add:',
      [
        { text: 'Add Category', onPress: () => setIsModalVisible(true) },
        { text: 'Add Book', onPress: handleAddBook },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={item => item.bookId?.toString()} // Safeguard with optional chaining
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text>No books available</Text>}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={openAddOptions}>
        <Icon name="add-circle-outline" size={60} color="#5B5D8B" />
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Category Name"
              value={categoryName}
              onChangeText={setCategoryName}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={handleAddCategory}>
                <Text style={styles.modalButtonText}>Add Category</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  list: {
    paddingBottom: 80,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bookImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  bookDetails: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  bookAuthor: {
    fontSize: 16,
    color: 'black',
  },
  bookActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: 'black',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: 'black',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#5B5D8B',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BooksManagementScreen;
