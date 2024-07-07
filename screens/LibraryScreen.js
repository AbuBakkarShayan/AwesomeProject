import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import baseURL from '../config';

const LibraryScreen = ({ navigation, route }) => {
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [userId, setUserId] = useState('');
    const [role, setRole] = useState('');
    const [bookmarkedBooks, setBookmarkedBooks] = useState(new Set());
    const [downloadedBooks, setDownloadedBooks] = useState(new Set());

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
                const storedBookmarks = await AsyncStorage.getItem(`bookmarkedBooks_${role}_${userId}`);
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
                const storedDownloads = await AsyncStorage.getItem(`downloadedBooks_${role}_${userId}`);
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
            const filtered = books.filter(book =>
                book.bookName.toLowerCase().includes(lowercasedQuery) ||
                book.bookAuthorName.toLowerCase().includes(lowercasedQuery) ||
                (book.keywords && book.keywords.toLowerCase().includes(lowercasedQuery))
            );
            setFilteredBooks(filtered);
        }
    }, [searchQuery, books]);

    useEffect(() => {
        // Update AsyncStorage whenever bookmarkedBooks state changes
        if (userId && role) {
            AsyncStorage.setItem(`bookmarkedBooks_${role}_${userId}`, JSON.stringify(Array.from(bookmarkedBooks)));
        }
    }, [bookmarkedBooks, userId, role]);

    useEffect(() => {
        // Update AsyncStorage whenever downloadedBooks state changes
        if (userId && role) {
            AsyncStorage.setItem(`downloadedBooks_${role}_${userId}`, JSON.stringify(Array.from(downloadedBooks)));
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

const handleDownload = async (bookId, bookName, bookCoverPath, bookPdfPath) => {
    const isDownloaded = downloadedBooks.has(bookId);
    const bookCoverLocalPath = `${RNFS.DocumentDirectoryPath}/${bookName}_cover.jpg`;
    const bookPdfLocalPath = `${RNFS.DocumentDirectoryPath}/${bookName}.pdf`;

    if (isDownloaded) {
        try {
            await RNFS.unlink(bookPdfLocalPath);
            await RNFS.unlink(bookCoverLocalPath);

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
            const bookCoverResponse = await fetch(`${baseURL}/book/downloadBookCover?bookId=${bookId}&userId=${userId}&userType=${role}`);
            if (bookCoverResponse.ok) {
                const bookCoverBlob = await bookCoverResponse.blob();
                const bookCoverBase64 = await convertBlobToBase64(bookCoverBlob);
                await RNFS.writeFile(bookCoverLocalPath, bookCoverBase64, 'base64');
            } else {
                throw new Error('Failed to download book cover');
            }

            // Download and save book PDF
            const bookPdfResponse = await fetch(`${baseURL}/book/downloadBook?bookId=${bookId}&userId=${userId}&userType=${role}`);
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

const convertBlobToBase64 = (blob) => {
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
        const url = isBookmarked ? `${baseURL}/bookmark/removeBookMark?userId=${userId}&bookId=${bookId}&userType=${role}` : `${baseURL}/bookmark/addBookMark?userId=${userId}&bookId=${bookId}&userType=${role}`;
        const method = isBookmarked ? 'DELETE' : 'POST';
        const body = isBookmarked ? null : JSON.stringify({
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
    const handleHighlights= (bookId)=>{
        navigation.navigate("StudentHighlights", bookId)
    }

    const renderBookItem = ({ item }) => {
        const isBookmarked = bookmarkedBooks.has(item.bookId);
        const isDownloaded = downloadedBooks.has(item.bookId);

        return (
            <TouchableOpacity onPress={() => navigation.navigate('PDFReaderScreen', { bookId: item.bookId })}>
                <View style={styles.bookContainer}>
                    <Image source={{ uri: item.bookCoverPagePath }} style={styles.bookCover} />
                    <View style={styles.bookDetails}>
                        <Text style={styles.bookTitle}>{item.bookName}</Text>
                        <Text style={styles.bookAuthor}>{item.bookAuthorName}</Text>
                    </View>
                    <View style={styles.bookActions}>
                        <TouchableOpacity onPress={() => handleDownload(item.bookId, item.bookName, item.bookCoverPagePath, item.bookPdfPath)}>
                            <Icon name="download" size={25} color={isDownloaded ? '#5B5D8B' : '#7E7E7E'} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleBookmark(item.bookId, item.bookName, item.bookAuthorName)}>
                            <Icon name="bookmark" size={25} color={isBookmarked ? '#5B5D8B' : '#7E7E7E'} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Icon name="list" size={25} color="#5B5D8B" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{handleHighlights(item.bookId)}}>
                            <Icon name="eye" size={25} color="#5B5D8B" />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={{ color: "black" }}>{userId ? `ID: ${userId}` : 'ID not found'}</Text>
            <Text style={{ color: "black" }}>{role ? `Role: ${role}` : 'Role not found'}</Text>
            <TextInput
                style={styles.searchBar}
                placeholder="Search books..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FlatList
                data={filteredBooks}
                renderItem={renderBookItem}
                keyExtractor={(item) => item.bookId.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    searchBar: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
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
        color:'black'
    },
    bookAuthor: {
        fontSize: 14,
        color: 'gray',
    },
    bookActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default LibraryScreen;
