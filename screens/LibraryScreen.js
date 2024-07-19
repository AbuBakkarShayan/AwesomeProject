import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dropdown} from 'react-native-element-dropdown';
import RNFS from 'react-native-fs';
import baseURL, {imageBaseURL} from '../config';
import LogoutButton from './AdminScreen/customcomponent/logoutComponent';
import PDFReaderScreen from './PDFReaderScreen';

const LibraryScreen = ({navigation, route}) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const [selectedBooks, setSelectedBooks] = useState(null);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');
  const [bookmarkedBooks, setBookmarkedBooks] = useState(new Set());
  const [downloadedBooks, setDownloadedBooks] = useState(new Set());

  //assign book to course by modal
  const [isModalVisible, setModalVisible] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    if (isModalVisible) {
      fetchCourses();
    }
  }, [isModalVisible]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${baseURL}/course/getAll`);
      const result = await response.json();
      if (result.status === 'Success') {
        setCourses(result.data);
      } else {
        // Handle the case when there are no courses
        console.log(result.message);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };
  const assignBookCourse = async (bookId, courseCode) => {
    try {
      const response = await fetch(
        `${baseURL}/coursebookassign/assignBookCourse`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({bookId, courseCode}),
        },
      );
      const result = await response.json();
      if (result.status === 'Success') {
        console.log(result.message);
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.error('Error assigning book to course:', error);
    }
  };

  const handleAssignCourse = () => {
    if (selectedCourse && selectedBook) {
      assignBookCourse(selectedBook.bookId, selectedCourse.courseCode);
      setModalVisible(false);
    } else {
      console.log('Please select a course');
    }
  };

  useEffect(() => {
    const fetchRoleAndId = async () => {
      try {
        const fetchedRole = await AsyncStorage.getItem('userRole');
        if (fetchedRole) {
          setRole(fetchedRole);
          const id = await AsyncStorage.getItem(
            fetchedRole === 'Student' ? 'studentId' : 'teacherId',
          );
          if (id) {
            setUserId(id);
          } else {
            console.log('No user ID found');
            throw new Error('User ID is missing');
          }
        } else {
          console.log('No role found');
          throw new Error('Role is missing');
        }
      } catch (error) {
        console.log('Error fetching role or user ID:', error);
      }
    };

    const loadBookmarkedBooks = async () => {
      try {
        const storedBookmarks = await AsyncStorage.getItem(
          `bookmarkedBooks_${role}_${userId}`,
        );
        if (storedBookmarks) {
          const parsedBookmarks = JSON.parse(storedBookmarks);
          setBookmarkedBooks(new Set(parsedBookmarks));
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    };

    const loadDownloadedBooks = async () => {
      try {
        const storedDownloads = await AsyncStorage.getItem(
          `downloadedBooks_${role}_${userId}`,
        );
        if (storedDownloads) {
          const parsedDownloads = JSON.parse(storedDownloads);
          setDownloadedBooks(new Set(parsedDownloads));
        }
      } catch (error) {
        console.error('Error loading downloaded books:', error);
      }
    };

    fetchRoleAndId();
    loadBookmarkedBooks();
    loadDownloadedBooks();
  }, [userId, role]);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredBooks(books);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = books.filter(
        book =>
          book.bookName.toLowerCase().includes(lowercasedQuery) ||
          book.bookAuthorName.toLowerCase().includes(lowercasedQuery) ||
          (book.keywords &&
            book.keywords.toLowerCase().includes(lowercasedQuery)),
      );
      setFilteredBooks(filtered);
    }
  }, [searchQuery, books]);

  useEffect(() => {
    // Update AsyncStorage whenever bookmarkedBooks state changes
    if (userId && role) {
      AsyncStorage.setItem(
        `bookmarkedBooks_${role}_${userId}`,
        JSON.stringify(Array.from(bookmarkedBooks)),
      );
    }
  }, [bookmarkedBooks, userId, role]);

  useEffect(() => {
    // Update AsyncStorage whenever downloadedBooks state changes
    if (userId && role) {
      AsyncStorage.setItem(
        `downloadedBooks_${role}_${userId}`,
        JSON.stringify(Array.from(downloadedBooks)),
      );
    }
  }, [downloadedBooks, userId, role]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${baseURL}/book/getall`);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      if (data.status === 'Success') {
        setBooks(data.data);
        setFilteredBooks(data.data);
      } else {
        throw new Error('Failed to fetch books - API error');
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleDownload = async (
    bookId,
    bookName,
    //  bookCoverPath,
    bookPdfPath,
  ) => {
    const isDownloaded = downloadedBooks.has(bookId);
    // const bookCoverLocalPath = `${RNFS.DownloadDirectoryPath}/${bookName}_cover.jpg`;
    const bookPdfLocalPath = `${RNFS.DownloadDirectoryPath}/${bookName}.pdf`;

    if (isDownloaded) {
      try {
        await RNFS.unlink(bookPdfLocalPath);
        //await RNFS.unlink(bookCoverLocalPath);

        const updatedDownloadedBooks = new Set(downloadedBooks);
        updatedDownloadedBooks.delete(bookId);
        setDownloadedBooks(updatedDownloadedBooks);
        Alert.alert('Success', 'Book deleted successfully');
      } catch (error) {
        console.error('Error deleting book:', error);
        Alert.alert('Error', 'Failed to delete the book');
      }
    } else {
      try {
        // Download and save book cover image
        // const bookCoverResponse = await fetch(
        //   `${baseURL}/book/downloadBookCover?bookId=${bookId}&userId=${userId}&userType=${role}`,
        // );
        // if (bookCoverResponse.ok) {
        //   const bookCoverBlob = await bookCoverResponse.blob();
        //   const bookCoverBase64 = await convertBlobToBase64(bookCoverBlob);
        //   await RNFS.writeFile(bookCoverLocalPath, bookCoverBase64, 'base64');
        // } else {
        //   throw new Error('Failed to download book cover');
        // }

        // Download and save book PDF
        const bookPdfResponse = await fetch(
          `${baseURL}/book/downloadBook?bookId=${bookId}&userId=${userId}&userType=${role}`,
        );
        if (bookPdfResponse.ok) {
          const bookPdfBlob = await bookPdfResponse.blob();
          const bookPdfBase64 = await convertBlobToBase64(bookPdfBlob);
          await RNFS.writeFile(bookPdfLocalPath, bookPdfBase64, 'base64');
        } else {
          throw new Error('Failed to download book PDF');
        }

        const updatedDownloadedBooks = new Set(downloadedBooks);
        updatedDownloadedBooks.add(bookId);
        setDownloadedBooks(updatedDownloadedBooks);
        Alert.alert('Success', 'Book downloaded successfully');
      } catch (error) {
        console.error('Error downloading book:', error);
        Alert.alert('Error', 'Failed to download the book');
      }
    }
  };

  const convertBlobToBase64 = blob => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(blob);
    });
  };

  const handleBookmark = async (bookId, bookName, bookAuthorName) => {
    const isBookmarked = bookmarkedBooks.has(bookId);
    const url = isBookmarked
      ? `${baseURL}/bookmark/removeBookMark?userId=${userId}&bookId=${bookId}&userType=${role}`
      : `${baseURL}/bookmark/addBookMark?userId=${userId}&bookId=${bookId}&userType=${role}`;
    const method = isBookmarked ? 'DELETE' : 'POST';
    const body = isBookmarked
      ? null
      : JSON.stringify({
          bookId,
          bookName,
          bookAuthorName,
          bookmarkOwnerId: userId,
          bookmarkOwnerType: role,
        });

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
        if (data.status === 'Success') {
          const updatedBookmarkedBooks = new Set(bookmarkedBooks);
          if (isBookmarked) {
            updatedBookmarkedBooks.delete(bookId);
          } else {
            updatedBookmarkedBooks.add(bookId);
          }
          setBookmarkedBooks(updatedBookmarkedBooks);
          Alert.alert('Success', data.message);
        } else {
          throw new Error(data.message);
        }
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
      Alert.alert('Error', error.message);
    }
  };
  const handleHighlights = bookId => {
    navigation.navigate('StudentHighlights', bookId);
  };

  const renderBookItem = ({item}) => {
    const isBookmarked = bookmarkedBooks.has(item.bookId);
    const isDownloaded = downloadedBooks.has(item.bookId);

    return (
      // <TouchableOpacity
      //   onPress={() =>
      //     navigation.navigate('PDFReaderScreen', {bookName: item.bookName})
      //   }>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('PDFReaderScreen', {
            name: item.bookName,
            path: `${imageBaseURL}/BookPDFFolder/${item.bookPdfPath}`,
          })
        }>
        <View style={styles.bookContainer}>
          {/* <Image
            source={{uri: item.bookCoverPagePath}}
            style={styles.bookCover}
          /> */}
          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle}>{item.bookName}</Text>
            <Text style={styles.bookAuthor}>{item.bookAuthorName}</Text>
          </View>
          <View style={styles.bookActions}>
            <TouchableOpacity
              onPress={() =>
                handleDownload(
                  item.bookId,
                  item.bookName,
                  // item.bookCoverPagePath,
                  item.bookPdfPath,
                )
              }>
              <Icon
                name="download"
                size={25}
                color={isDownloaded ? '#5B5D8B' : '#7E7E7E'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                handleBookmark(item.bookId, item.bookName, item.bookAuthorName)
              }>
              <Icon
                name="bookmark"
                size={25}
                color={isBookmarked ? '#5B5D8B' : '#7E7E7E'}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="list" size={25} color="#5B5D8B" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleHighlights(item.bookId);
              }}>
              <Icon name="eyedrop-sharp" size={25} color="#5B5D8B" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedBook(item);
                setModalVisible(true);
              }}>
              <Icon name="document-outline" size={24} color="#5B5D8D" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* <Text style={{color: 'black'}}>
        {userId ? `ID: ${userId}` : 'ID not found'}
      </Text>
      <Text style={{color: 'black'}}>
        {role ? `Role: ${role}` : 'Role not found'}
      </Text> */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search books..."
        placeholderTextColor={'#7E7E7E'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredBooks}
        renderItem={renderBookItem}
        keyExtractor={item => item.bookId.toString()}
      />

      <Modal
        visible={isModalVisible}
        //</View>animationType="slide">
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Assign Book to Course</Text>
            <Dropdown
              style={styles.dropdown}
              data={courses}
              labelField="courseName"
              valueField="courseCode"
              placeholder="Select Course"
              value={selectedCourse?.courseCode}
              onChange={item => setSelectedCourse(item)}
            />
            <TouchableOpacity
              onPress={handleAssignCourse}
              style={styles.assignButton}>
              <Text style={styles.assignButtonText}>Assign</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* <View style={{flex: 1}}>
        {selectedBooks ? (
          <PDFReaderScreen fileName={selectedBooks.bookPdfPath} />
        ) : (
          <FlatList
            data={books}
            keyExtractor={item => item.bookId.toString()}
            renderItem={({item}) => (
              <Button
                title={item.bookName}
                onPress={() => setSelectedBooks(item)}
              />
            )}
          />
        )}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'black',
  },
  bookContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 5,
  },
  bookCover: {
    width: 60,
    height: 90,
    marginRight: 10,
  },
  bookDetails: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  bookAuthor: {
    fontSize: 14,
    color: 'gray',
  },
  bookActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#5B5D8B',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  dropdown: {
    width: '100%',
    marginBottom: 20,
  },
  dropdownPlaceholder: {
    color: 'black',
  },
  dropdownSelectedText: {
    color: 'black',
  },
  assignButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  assignButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LibraryScreen;
