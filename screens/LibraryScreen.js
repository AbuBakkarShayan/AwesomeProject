import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import PDFReaderScreen from './PDFReaderScreen';
import baseURL from '../config';

const LibraryScreen = ({ navigation }) => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch(`${baseURL}/book/getall`);
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            const data = await response.json();
            if (data.status === 'Success') {
                setBooks(data.data);
            } else {
                throw new Error('Failed to fetch books - API error');
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const handleDownload = async (bookId) => {
        try {
            const url = `${baseURL}/book/DownloadBook?bookId=${bookId}`;
            const downloadDest = `${RNFS.DocumentDirectoryPath}/${bookId}.pdf`;

            const options = {
                fromUrl: url,
                toFile: downloadDest,
            };

            const result = await RNFS.downloadFile(options).promise;

            if (result.statusCode === 200) {
                console.log('Book downloaded successfully to', downloadDest);
            } else {
                throw new Error('Failed to download book');
            }
        } catch (error) {
            console.error('Error downloading book:', error);
        }
    };

    const handleBookmark = async (bookId) => {
        try {
            const response = await fetch(`${baseURL}/book/bookmark/${bookId}`, { method: 'POST' });
            if (!response.ok) {
                throw new Error('Failed to bookmark book');
            }
            console.log('Book bookmarked successfully');
        } catch (error) {
            console.error('Error bookmarking book:', error);
        }
    };

    const handleTableOfContents = (bookId) => {
        navigation.navigate('PdfReaderScreen', { bookId, view: 'contents' });
    };

    const handleHighlight = (bookId, bookName) => {
        navigation.navigate('HighlightScreen', { bookId, bookName });
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
                    <TouchableOpacity onPress={() => handleDownload(item.bookId)} style={styles.iconButton}>
                        <Icon name="download" size={25} color="#5B5D8B" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleBookmark(item.bookId)} style={styles.iconButton}>
                        <Icon name="bookmark" size={25} color="#5B5D8B" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleTableOfContents(item.bookId)} style={styles.iconButton}>
                        <Icon name="list" size={25} color="#5B5D8B" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleHighlight(item.bookId, item.bookName)} style={styles.iconButton}>
                        <Icon name="star" size={25} color="gold" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor={"black"} />
            <View style={styles.tabContainer}>
                <TouchableOpacity style={styles.tabButton}>
                    <Text style={styles.tabButtonText}>Downloaded Books</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton}>
                    <Text style={styles.tabButtonText}>My Books List</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={books}
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
        height: 100,
    },
    iconButton: {
        padding: 5,
    },
});

export default LibraryScreen;
