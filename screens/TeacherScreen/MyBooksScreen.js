import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../config';
//import Icon from 'react-native-vector-icons/MaterialIcons'; // Assuming you are using react-native-vector-icons
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import RNFS from 'react-native-fs';
import LogoutButton from '../AdminScreen/customcomponent/logoutComponent';
const MyBooksScreen = ({navigation}) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  const [activeTab, setActiveTab] = useState('Bookmarked');
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]);
  const [downloadedBooks, setDownloadedBooks] = useState([]);
  const [uploadedBooks, setUploadedBooks] = useState([]);
  const [noBookmarks, setNoBookmarks] = useState(false);
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');

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
          }
        } else {
          console.log('No role found');
        }
      } catch (error) {
        console.log('Error fetching role or user ID:', error);
      }
    };

    fetchRoleAndId();
  }, []);

  useEffect(() => {
    if (userId && role) {
      fetchBookmarkedBooks();
      fetchDownloadedBooks();
      fetchUploadedBooks();
    }
  }, [userId, role]);

  const fetchBookmarkedBooks = async () => {
    try {
      const response = await fetch(
        `${baseURL}/bookmark/getBookMark?userId=${userId}&userType=${role}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks');
      }
      const data = await response.json();
      if (data.status === 'Success') {
        if (data.data.length === 0) {
          setNoBookmarks(true);
          setBookmarkedBooks([]);
        } else {
          setNoBookmarks(false);
          setBookmarkedBooks(data.data);
        }
      } else {
        setNoBookmarks(true);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setNoBookmarks(true);
    }
  };

  const fetchDownloadedBooks = async () => {
    try {
      const storedDownloads = await AsyncStorage.getItem(
        `downloadedBooks_${role}_${userId}`,
      );
      if (storedDownloads) {
        setDownloadedBooks(JSON.parse(storedDownloads));
      } else {
        setDownloadedBooks([]);
      }
    } catch (error) {
      console.error('Error fetching downloaded books:', error);
      setDownloadedBooks([]);
    }
  };

  const fetchUploadedBooks = async () => {
    try {
      const teacherId = await AsyncStorage.getItem('teacherId');
      if (!teacherId) {
        throw new Error('Teacher ID not found in AsyncStorage');
      }

      const response = await fetch(
        `${baseURL}/book/getMyBooks?uploaderId=${teacherId}`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch uploaded books');
      }

      const data = await response.json();
      console.log('teacher uploaded books data: ', data);
      if (data.status === 'Success') {
        setUploadedBooks(data.data);
      } else {
        setUploadedBooks([]);
      }
    } catch (error) {
      console.error('Error fetching uploaded books:', error);
      setUploadedBooks([]);
    }
  };

  const removeBookmark = async bookId => {
    try {
      const response = await fetch(
        `${baseURL}/bookmark/removeBookMark?userId=${userId}&bookId=${bookId}&userType=${role}`,
        {
          method: 'DELETE',
        },
      );
      if (!response.ok) {
        throw new Error('Failed to remove bookmark');
      }
      const data = await response.json();
      if (data.status === 'Success') {
        const updatedBookmarkedBooks = bookmarkedBooks.filter(
          book => book.bookId !== bookId,
        );
        setBookmarkedBooks(updatedBookmarkedBooks);
        await AsyncStorage.setItem(
          `bookmarkedBooks_${role}_${userId}`,
          JSON.stringify(updatedBookmarkedBooks),
        );
        Alert.alert('Success', data.message);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
      Alert.alert('Error', 'Failed to remove bookmark');
    }
  };

  const removeDownloadedBook = async bookId => {
    try {
      const storedDownloads = await AsyncStorage.getItem(
        `downloadedBooks_${role}_${userId}`,
      );
      if (storedDownloads) {
        let downloadedBooks = JSON.parse(storedDownloads);
        downloadedBooks = downloadedBooks.filter(
          book => book.bookId !== bookId,
        );
        await AsyncStorage.setItem(
          `downloadedBooks_${role}_${userId}`,
          JSON.stringify(downloadedBooks),
        );
        setDownloadedBooks(downloadedBooks);
      }
    } catch (error) {
      console.error('Error removing book from AsyncStorage:', error);
    }
  };

  const renderBookItem = ({item}) => (
    <View style={styles.bookContainer}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('PDFReaderScreen', {bookId: item.bookId})
        }
        style={styles.bookTouchable}>
        <View style={styles.bookDetailsContainer}>
          {/* <Image
            source={{uri: `${baseURL}/book/cover/${item.bookId}`}}
            style={styles.bookCover}
          /> */}
          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle}>{item.bookName}</Text>
            <Text style={styles.bookAuthor}>{item.bookAuthorName}</Text>
          </View>
        </View>
      </TouchableOpacity>
      {activeTab === 'Bookmarked' ? (
        <TouchableOpacity
          style={styles.trashIconContainer}
          onPress={() => removeBookmark(item.bookId)}>
          <IonIcon name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.trashIconContainer}
          onPress={() => removeDownloadedBook(item.bookId)}>
          <IonIcon name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );

  const togglePrivate = async bookId => {
    try {
      const response = await fetch(
        `${baseURL}/book/togglePublicPrivate?bookId=${bookId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const result = await response.json();
      if (result.status !== 'Success') {
        throw new Error(result.message);
      }

      Alert.alert('Success', 'Book visibility toggled successfully');

      // Optionally, you can refresh the list of books here if needed
      //fetchBooks();
    } catch (error) {
      console.log('Error toggling book visibility:', error);
      Alert.alert('Error', error.message);
    }
  };
  // const assignBookCourse = bookId => {
  //   navigation.navigate('AssignBook', bookId);
  // };
  const editUploadedBook = bookId => {
    navigation.navigate('EditTBookScreen', {bookId});
  };

  const handleDeleteBook = async (bookId, uploaderId) => {
    try {
      const response = await fetch(
        `${baseURL}/book/deleteBook?bookId=${bookId}&uploaderId=${uploaderId}`,
        {
          method: 'DELETE',
        },
      );
      const result = await response.json();
      if (response.ok && result.status === 'Success') {
        fetchBooks();
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
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: () => handleDeleteBook(bookId, uploaderId)},
      ],
      {cancelable: false},
    );
  };

  const renderUploadItem = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('PDFReaderScreen', {bookId: item.bookId})
      }>
      <View style={styles.bookContainer}>
        {/* <Image
          source={{uri: item.image}}
          style={{width: 100, height: 100}}
          onError={e =>
            console.error(`Failed to load image:`, e.nativeEvent.error)
          }
        /> */}
        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{item.bookName}</Text>
          <Text style={styles.bookAuthor}>{item.bookAuthorName}</Text>
        </View>
        <View style={styles.iconContainer}>
          {/* <TouchableOpacity onPress={() => deleteUploadedBook(item.bookId)}>
            <IonIcon name="trash-outline" size={24} color="#5B5D8D" />
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => confirmDeleteBook(item.bookId, item.uploaderId)}>
            <IonIcon name="trash-outline" size={30} color="#5B5D8B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => editUploadedBook(item.bookId)}>
            <IonIcon name="pencil-outline" size={24} color="#5B5D8D" />
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => bookmarkUploadedBook(item.bookId)}>
            <IonIcon name="bookmark-outline" size={24} color="#5B5D8D" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => downloadUploadedBook(item.bookId, item.bookName)}>
            <IonIcon name="download-outline" size={24} color="#5B5D8D" />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => togglePrivate(item.bookId)}>
            <IonIcon name="bag" size={24} color="#5B5D8D" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedBook(item);
              setModalVisible(true);
            }}>
            <IonIcon name="document-outline" size={24} color="#5B5D8D" />
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => {
              setSelectedBook(item);
              setModalVisible(true);
            }}
            style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>Assign to Course</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Bookmarked' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('Bookmarked')}>
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'Bookmarked' && styles.activeTabButtonText,
            ]}>
            Bookmarked Books
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Downloaded' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('Downloaded')}>
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'Downloaded' && styles.activeTabButtonText,
            ]}>
            Downloaded Books
          </Text>
        </TouchableOpacity>
        {role === 'Teacher' && (
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'Uploaded' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('Uploaded')}>
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'Uploaded' && styles.activeTabButtonText,
              ]}>
              My Uploads
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {activeTab === 'Bookmarked' ? (
        noBookmarks ? (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              No bookmarked books by the user.
            </Text>
          </View>
        ) : (
          <FlatList
            data={bookmarkedBooks}
            renderItem={renderBookItem}
            keyExtractor={item => item.bookId.toString()}
            contentContainerStyle={{paddingHorizontal: 10}}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : activeTab === 'Downloaded' ? (
        downloadedBooks.length === 0 ? (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>No downloaded books.</Text>
          </View>
        ) : (
          <FlatList
            data={downloadedBooks}
            renderItem={renderBookItem}
            keyExtractor={(item, index) => `${item.bookId}_${index}`}
            contentContainerStyle={{paddingHorizontal: 10}}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : uploadedBooks.length === 0 ? (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>No uploaded books.</Text>
        </View>
      ) : (
        <FlatList
          data={uploadedBooks}
          renderItem={renderUploadItem}
          keyExtractor={(item, index) => `${item.bookId}_${index}`}
          contentContainerStyle={{paddingHorizontal: 10}}
          showsVerticalScrollIndicator={false}
        />
      )}
      {role === 'Teacher' && activeTab === 'Uploaded' && (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() =>
            navigation.navigate('AddTBookScreen', {teacherId: userId})
          }>
          <IonIcon name="add" size={30} color="white" />
        </TouchableOpacity>
      )}

      {/* <Modal
        visible={isModalVisible}
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
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              onChange={item => {
                setSelectedCourse(item);
              }}
            />
            <TouchableOpacity
              style={styles.assignButton}
              onPress={handleAssignCourse}>
              <Text style={styles.assignButtonText}>Assign</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 150,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabButton: {
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: 'black',
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: '#5B5D8B',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5B5D8B',
  },
  activeTabButtonText: {
    color: 'white',
  },
  trashIconContainer: {
    //flex: 1, // Take up all available space horizontally
    alignItems: 'flex-end', // Align items to the end (right side)
    paddingLeft: 100, // Add some right padding for spacing
  },
  bookContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  bookDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bookCover: {
    width: 50,
    height: 70,
    marginRight: 15,
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
    color: 'black',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#7E7E7E',
  },
  uploadButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#5B5D8B',
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
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

export default MyBooksScreen;
