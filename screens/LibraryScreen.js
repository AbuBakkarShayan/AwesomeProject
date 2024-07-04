import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import baseURL from '../config';

const LibraryScreen = ({ navigation }) => {
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [downloadedBooks, setDownloadedBooks] = useState([]); // State for downloaded books
    const [studentId, setStudentId] = useState('');  // State to store studentId
    const [teacherId, setTeacherId] = useState(''); // State to store teacherId
    const [role, setRole] = useState(''); // State to store role

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const fetchedRole = await AsyncStorage.getItem('userRole');
                if (fetchedRole) {
                    setRole(fetchedRole);
                    if (fetchedRole === 'Student') {
                        const id = await AsyncStorage.getItem('studentId');
                        if (id !== null) {
                            setStudentId(id);
                        } else {
                            console.log('No studentId found');
                            throw new Error('Student ID is missing');
                        }
                    } else if (fetchedRole === 'Teacher') {
                        const id = await AsyncStorage.getItem('teacherId');
                        if (id !== null) {
                            setTeacherId(id);
                        } else {
                            console.log('No teacherId found');
                            throw new Error('Teacher ID is missing');
                        }
                    }
                } else {
                    console.log('No role found');
                    throw new Error('Role is missing');
                }
            } catch (error) {
                console.log('Error fetching role:', error);
                // Handle error if necessary
            }
        };

        fetchRole();
    }, []);

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

    const handleBookmark = async (bookId) => {
        try {
            const bookmarkData = {
                bookId,
                bookmarkOwnerId: 1, // Replace with the actual owner ID
                bookmarkOwnerType: 'User', // Replace with the actual owner type
            };

            const response = await fetch(`${baseURL}/bookmark/addBookMark`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookmarkData),
            });

            const data = await response.json();
            if (data.status === 'Success') {
                Alert.alert('Success', 'Book bookmarked successfully');
            } else {
                throw new Error('Failed to bookmark the book');
            }
        } catch (error) {
            console.error('Error bookmarking book:', error);
            Alert.alert('Error', 'Failed to bookmark the book');
        }
    };

    const handleViewTOC = async (bookId) => {
        try {
            const response = await fetch(`${baseURL}/getBookTOC?BookId=${bookId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch table of contents');
            }
            const data = await response.json();
            if (data.status === 'Success') {
                // Navigate to the TOC screen or display the TOC data
                navigation.navigate('TOCScreen', { tocData: data.data });
            } else {
                throw new Error('No table of contents found');
            }
        } catch (error) {
            console.error('Error fetching table of contents:', error);
            Alert.alert('Error', 'Failed to fetch table of contents');
        }
    };

    const handleDownload = async (bookId, bookName) => {
        try {
            const coverImageResponse = await fetch(`${baseURL}/book/DownloadBookCover?bookId=${bookId}`);
            if (!coverImageResponse.ok) {
                throw new Error('Failed to download cover image');
            }
            const coverImageData = await coverImageResponse.blob();
            const coverImagePath = `${RNFS.DocumentDirectoryPath}/${bookName}_cover.jpg`;

            await RNFS.writeFile(coverImagePath, coverImageData, 'base64');

            const pdfResponse = await fetch(`${baseURL}/book/DownloadBook?bookId=${bookId}`);
            if (!pdfResponse.ok) {
                throw new Error('Failed to download PDF');
            }
            const pdfData = await pdfResponse.blob();
            const pdfPath = `${RNFS.DocumentDirectoryPath}/${bookName}.pdf`;

            await RNFS.writeFile(pdfPath, pdfData, 'base64');

            setDownloadedBooks([...downloadedBooks, { bookId, bookName, coverImagePath, pdfPath }]);

            Alert.alert('Success', 'Book downloaded successfully');
        } catch (error) {
            console.error('Error downloading book:', error);
            Alert.alert('Error', 'Failed to download book');
        }
    };

    const renderBookItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('PDFReaderScreen', { bookId: item.bookId })}>
            <View style={styles.bookContainer}>
                <Image source={{ uri: item.bookCoverPagePath }} style={styles.bookCover} />
                <View style={styles.bookDetails}>
                    <Text style={styles.bookTitle}>{item.bookName}</Text>
                    <Text style={styles.bookAuthor}>{item.bookAuthorName}</Text>
                </View>
                <View style={styles.bookActions}>
                    <TouchableOpacity onPress={() => handleDownload(item.bookId, item.bookName)}>
                        <Icon name="download" size={25} color="#5B5D8B" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleBookmark(item.bookId)}>
                        <Icon name="bookmark" size={25} color="#5B5D8B" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleViewTOC(item.bookId)}>
                        <Icon name="list" size={25} color="#5B5D8B" />
                    </TouchableOpacity>
                    {/* Render star icon only if the book is downloaded */}
                    {downloadedBooks.some(book => book.bookId === item.bookId) && (
                        <TouchableOpacity>
                            <Icon name="star" size={25} color="gold" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={{ color: "black" }}>{studentId ? `Student ID: ${studentId}` : teacherId ? `Teacher ID: ${teacherId}` : 'ID not found'}</Text>
            <Text style={{ color: "black" }}>{role ? `Role: ${role}` : 'Role not found'}</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="black"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <View style={styles.tabContainer}>
                <TouchableOpacity style={styles.tabButton}>
                    <Text style={styles.tabButtonText}>Downloaded Books</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton}>
                    <Text style={styles.tabButtonText}>My Books List</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={filteredBooks}
                renderItem={renderBookItem}
                keyExtractor={item => item.bookId.toString()}
                contentContainerStyle={{ paddingHorizontal: 10 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    searchInput: {
        backgroundColor: '#fff',
        padding: 15,
        margin: 20,
        borderRadius: 10,
        borderColor: '#e2e8f0',
        borderWidth: 1,
        color: 'black',
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
        backgroundColor: "white"
    },
    tabButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#5B5D8B',
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
        color: 'black'
    },
    bookAuthor: {
        color: '#7E7E7E',
    },
    bookActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: 100,
    },
});

export default LibraryScreen;
