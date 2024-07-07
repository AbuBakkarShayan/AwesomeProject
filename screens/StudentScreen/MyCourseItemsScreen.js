import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../config';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Assuming you are using react-native-vector-icons
import RNFS from 'react-native-fs';

const MyCourseItemsScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('Bookmarked');
    const [bookmarkedBooks, setBookmarkedBooks] = useState([]);
    const [downloadedBooks, setDownloadedBooks] = useState([]);
    const [noBookmarks, setNoBookmarks] = useState(false);
    const [userId, setUserId] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        const fetchRoleAndId = async () => {
            try {
                const fetchedRole = await AsyncStorage.getItem('userRole');
                if (fetchedRole) {
                    setRole(fetchedRole);
                    const id = await AsyncStorage.getItem(fetchedRole === 'Student' ? 'studentId' : 'teacherId');
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
            fetchDownloadedBooks(); // Fetch downloaded books initially
        }
    }, [userId, role]);

    const fetchBookmarkedBooks = async () => {
        try {
            const response = await fetch(`${baseURL}/bookmark/getBookMark?userId=${userId}&userType=${role}`);
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
            const storedDownloads = await AsyncStorage.getItem(`downloadedBooks_${role}_${userId}`);
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

    const removeBookmark = async (bookId) => {
        try {
            const response = await fetch(`${baseURL}/bookmark/removeBookMark?userId=${userId}&bookId=${bookId}&userType=${role}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to remove bookmark');
            }
            const data = await response.json();
            if (data.status === 'Success') {
                const updatedBookmarkedBooks = bookmarkedBooks.filter(book => book.bookId !== bookId);
                setBookmarkedBooks(updatedBookmarkedBooks);
                await AsyncStorage.setItem(`bookmarkedBooks_${role}_${userId}`, JSON.stringify(updatedBookmarkedBooks));
                Alert.alert('Success', data.message);
            } else {
                Alert.alert('Error', data.message);
            }
        } catch (error) {
            console.error('Error removing bookmark:', error);
            Alert.alert('Error', 'Failed to remove bookmark');
        }
    };

    const removeDownloadedBook = async (bookId) => {
        try {
            const storedDownloads = await AsyncStorage.getItem(`downloadedBooks_${role}_${userId}`);
            if (storedDownloads) {
                let downloadedBooks = JSON.parse(storedDownloads);
                downloadedBooks = downloadedBooks.filter(book => book.bookId !== bookId);
                await AsyncStorage.setItem(`downloadedBooks_${role}_${userId}`, JSON.stringify(downloadedBooks));
                setDownloadedBooks(downloadedBooks); // Update state with filtered books
            }
        } catch (error) {
            console.error('Error removing book from AsyncStorage:', error);
        }
    };

    const renderBookItem = ({ item }) => (
        <View style={styles.bookContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('PDFReaderScreen', { bookId: item.bookId })}>
                <View style={styles.bookDetailsContainer}>
                    <Image source={{ uri: `${baseURL}/book/cover/${item.bookId}` }} style={styles.bookCover} />
                    <View style={styles.bookDetails}>
                        <Text style={styles.bookTitle}>{item.bookName}</Text>
                        <Text style={styles.bookAuthor}>{item.bookAuthorName}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            {activeTab === 'Bookmarked' ? (
                <TouchableOpacity onPress={() => removeBookmark(item.bookId)}>
                    <Icon name="delete" size={24} color="red" />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={() => removeDownloadedBook(item.bookId)}>
                    <Icon name="delete" size={24} color="red" />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <TouchableOpacity style={[styles.tabButton, activeTab === 'Bookmarked' && styles.activeTabButton]} onPress={() => setActiveTab('Bookmarked')}>
                    <Text style={[styles.tabButtonText, activeTab === 'Bookmarked' && styles.activeTabButtonText]}>Bookmarked Books</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tabButton, activeTab === 'Downloaded' && styles.activeTabButton]} onPress={() => setActiveTab('Downloaded')}>
                    <Text style={[styles.tabButtonText, activeTab === 'Downloaded' && styles.activeTabButtonText]}>Downloaded Books</Text>
                </TouchableOpacity>
            </View>
            {activeTab === 'Bookmarked' ? (
                noBookmarks ? (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>No bookmarked books by the user.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={bookmarkedBooks}
                        renderItem={renderBookItem}
                        keyExtractor={item => item.bookId.toString()}
                        contentContainerStyle={{ paddingHorizontal: 10 }}
                        showsVerticalScrollIndicator={false}
                    />
                )
            ) : (
                downloadedBooks.length === 0 ? (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>No downloaded books.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={downloadedBooks}
                        renderItem={renderBookItem}
                        keyExtractor={(item, index) => `${item.bookId}_${index}`} // Assuming bookId is unique
                        contentContainerStyle={{ paddingHorizontal: 10 }}
                        showsVerticalScrollIndicator={false}
                    />
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
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
        backgroundColor: "white",
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
        color: 'black', // Updated color to black
    },
    bookAuthor: {
        color: 'black', // Updated color to black
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
});

export default MyCourseItemsScreen;
