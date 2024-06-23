import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import LogoutButton from './customcomponent/logoutComponent';
import Icon from 'react-native-vector-icons/Ionicons';
import baseURL from '../../config';

const BooksManagementScreen = () => {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Logout icon in header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

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
          id: book.bookId,
          name: book.bookName,
          author: book.bookAuthorName,
          //image: `your-image-base-url/${book.bookCoverPagePath}`, // Replace with your image base UR
          image: book.booCoverPagePath?`https://via.placeholder.com/150`
          : 'https://via.placeholder.com/150', 
          pdfUrl: `${baseURL}/BookPDFFolder/${book.bookPdfPath}`,
          
          uploaderId: book.uploaderId || 0, // Add appropriate uploaderId if available in your API response
        }));
        setBooks(formattedBooks);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setIsLoading(false);
    }
  };

  const handleAddBook = () => {
    navigation.navigate('AddBookScreen');
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
      if (response.ok && result.status === "Success") {
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
    <TouchableOpacity onPress={() => navigation.navigate('PDFReaderScreen', { pdfUrl: item.pdfUrl })}>
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

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text>No books available</Text>}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
        <Icon name="add-circle-outline" size={60} color="#5B5D8B" />
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
});

export default BooksManagementScreen;
